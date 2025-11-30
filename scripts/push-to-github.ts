import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
import * as path from 'path';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

const REPO_NAME = 'opictuary';
const REPO_DESCRIPTION = 'Opictuary - The World\'s First Continuum Memorial Platform';

// Files and directories to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  'dist',
  '.git',
  '.cache',
  '.upm',
  '.config',
  '.replit',
  'replit.nix',
  '*.tar.gz',
  '*.aab',
  '*.apk', 
  '*.ipa',
  '*.jks',
  '*.keystore',
  '*.pem',
  'android/app/build',
  'android/.gradle',
  'android/keystores',
  'ios/App/build',
  'ios/DerivedData',
  'attached_assets',
  'android-web-bundle-*',
  'Opictuary-Complete*',
  'opictuary-complete*',
  'opictuary-code*',
  'opictuary-github*',
  'opictuary-essential*',
  'fresh-base64.txt',
  'fresh.jks',
  'opictuary-new.jks',
  'keystores',
  'github-upload',
];

function shouldExclude(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, '/');
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      if (regex.test(normalized)) return true;
    } else {
      if (normalized.includes(pattern)) return true;
    }
  }
  return false;
}

function getAllFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      
      if (shouldExclude(relativePath) || entry.name.startsWith('.')) {
        continue;
      }
      
      if (entry.isDirectory()) {
        files.push(...getAllFiles(fullPath, baseDir));
      } else if (entry.isFile()) {
        // Skip large files (> 50MB) and binary files
        const stats = fs.statSync(fullPath);
        if (stats.size < 50 * 1024 * 1024) {
          files.push(relativePath);
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err);
  }
  
  return files;
}

function isBinaryFile(filePath: string): boolean {
  const binaryExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.svg', '.woff', '.woff2', '.ttf', '.eot', '.mp3', '.mp4', '.wav', '.pdf', '.zip', '.gz', '.tar'];
  const ext = path.extname(filePath).toLowerCase();
  return binaryExtensions.includes(ext);
}

async function main() {
  console.log('🚀 Connecting to GitHub...');
  
  const octokit = await getGitHubClient();
  
  // Get authenticated user
  const { data: user } = await octokit.users.getAuthenticated();
  console.log(`✅ Authenticated as: ${user.login}`);
  
  // Check if repo exists, create if not
  let repo;
  try {
    const { data } = await octokit.repos.get({
      owner: user.login,
      repo: REPO_NAME,
    });
    repo = data;
    console.log(`📁 Repository exists: ${repo.html_url}`);
  } catch (err: any) {
    if (err.status === 404) {
      console.log('📁 Creating new repository...');
      const { data } = await octokit.repos.createForAuthenticatedUser({
        name: REPO_NAME,
        description: REPO_DESCRIPTION,
        private: false,
        auto_init: false,
      });
      repo = data;
      console.log(`✅ Created repository: ${repo.html_url}`);
    } else {
      throw err;
    }
  }
  
  // Get all files to upload
  console.log('📂 Scanning files...');
  const files = getAllFiles('.');
  console.log(`Found ${files.length} files to upload`);
  
  // Get current commit SHA (if repo has commits)
  let baseSha: string | undefined;
  let baseTreeSha: string | undefined;
  
  try {
    const { data: ref } = await octokit.git.getRef({
      owner: user.login,
      repo: REPO_NAME,
      ref: 'heads/main',
    });
    baseSha = ref.object.sha;
    
    const { data: commit } = await octokit.git.getCommit({
      owner: user.login,
      repo: REPO_NAME,
      commit_sha: baseSha,
    });
    baseTreeSha = commit.tree.sha;
    console.log('📌 Found existing main branch');
  } catch (err) {
    console.log('📌 Repository is empty, will create initial commit');
  }
  
  // Create blobs for all files
  console.log('📤 Uploading files...');
  const treeItems: any[] = [];
  let uploadedCount = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file);
      const isBinary = isBinaryFile(file);
      
      const { data: blob } = await octokit.git.createBlob({
        owner: user.login,
        repo: REPO_NAME,
        content: isBinary ? content.toString('base64') : content.toString('utf8'),
        encoding: isBinary ? 'base64' : 'utf-8',
      });
      
      treeItems.push({
        path: file,
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      });
      
      uploadedCount++;
      if (uploadedCount % 50 === 0) {
        console.log(`  Uploaded ${uploadedCount}/${files.length} files...`);
      }
    } catch (err: any) {
      console.error(`  ⚠️ Failed to upload ${file}: ${err.message}`);
    }
  }
  
  console.log(`✅ Uploaded ${uploadedCount} files`);
  
  // Create tree
  console.log('🌳 Creating commit tree...');
  const { data: tree } = await octokit.git.createTree({
    owner: user.login,
    repo: REPO_NAME,
    tree: treeItems,
    base_tree: baseTreeSha,
  });
  
  // Create commit
  console.log('💾 Creating commit...');
  const { data: commit } = await octokit.git.createCommit({
    owner: user.login,
    repo: REPO_NAME,
    message: 'Update Opictuary platform with Celebrations Hub and mobile builds',
    tree: tree.sha,
    parents: baseSha ? [baseSha] : [],
  });
  
  // Update main branch reference
  try {
    await octokit.git.updateRef({
      owner: user.login,
      repo: REPO_NAME,
      ref: 'heads/main',
      sha: commit.sha,
    });
  } catch (err) {
    // Create the ref if it doesn't exist
    await octokit.git.createRef({
      owner: user.login,
      repo: REPO_NAME,
      ref: 'refs/heads/main',
      sha: commit.sha,
    });
  }
  
  console.log('');
  console.log('🎉 SUCCESS! Code pushed to GitHub!');
  console.log('');
  console.log(`📍 Repository: ${repo.html_url}`);
  console.log('');
  console.log('Next steps:');
  console.log('1. Go to your repo → Settings → Secrets and variables → Actions');
  console.log('2. Add the required secrets (see GITHUB_BUILD_SETUP.md)');
  console.log('3. Go to Actions tab and run the build workflows');
}

main().catch(console.error);
