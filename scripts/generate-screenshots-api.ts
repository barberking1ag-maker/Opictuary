import fetch from 'node-fetch';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Get the production URL - must be publicly accessible for screenshot API
function getPublicUrl(): string {
  // Check for explicit PUBLIC_BASE_URL first
  if (process.env.PUBLIC_BASE_URL) {
    return process.env.PUBLIC_BASE_URL;
  }
  
  // Check for Replit domains
  if (process.env.REPLIT_DOMAINS) {
    const domain = process.env.REPLIT_DOMAINS.split(',')[0];
    return `https://${domain}`;
  }
  
  // Check for any other public URL environment variables
  if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
    return `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
  }
  
  throw new Error(
    'No public URL found! Please set PUBLIC_BASE_URL environment variable. ' +
    'Screenshot API (Thum.io) needs a publicly accessible URL to capture screenshots. ' +
    'Localhost URLs will not work.'
  );
}

const PRODUCTION_URL = getPublicUrl();

// Key pages to screenshot for Google Play Store (8 screenshots required)
const PAGES_TO_SCREENSHOT = [
  { path: '/', name: '1. Home - Opictuary Memorial Platform', description: 'Compassionate digital memorial platform' },
  { path: '/memorials', name: '2. Browse Memorials', description: 'Discover and honor loved ones' },
  { path: '/celebrity-memorials', name: '3. Celebrity Memorials', description: 'Pay tribute to public figures' },
  { path: '/grief-support', name: '4. Grief Support Resources', description: 'Professional grief counseling and support' },
  { path: '/fundraisers', name: '5. Memorial Fundraisers', description: 'Support families in need' },
  { path: '/create-memorial', name: '6. Create Memorial', description: 'Easy memorial creation' },
  { path: '/profile', name: '7. User Profile', description: 'Manage your memorials and memories' },
  { path: '/essential-workers', name: '8. Essential Workers Memorial', description: 'Honoring frontline heroes' },
];

interface ScreenshotResult {
  name: string;
  data: Buffer;
}

async function captureScreenshot(url: string, name: string): Promise<ScreenshotResult> {
  console.log(`📸 Capturing: ${name} (${url})`);
  
  // Using free Thum.io service (1000 screenshots/month, no API key required)
  // Width: 1080, Height: 1920 (Google Play Store standard)
  const screenshotUrl = `https://image.thum.io/get/width/1080/crop/1920/noanimate/maxAge/1/${encodeURIComponent(url)}`;
  
  try {
    const response = await fetch(screenshotUrl);
    if (!response.ok) {
      throw new Error(`Screenshot failed: ${response.statusText}`);
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    console.log(`   ✅ Captured: ${name}`);
    return { name, data: buffer };
  } catch (error) {
    console.error(`   ❌ Failed: ${name}`, error);
    throw error;
  }
}

async function generateScreenshots(): Promise<string> {
  console.log('🚀 Generating Play Store screenshots for Opictuary...\n');
  console.log(`📍 URL: ${PRODUCTION_URL}\n`);

  const outputDir = path.join(process.cwd(), 'play-store-screenshots');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const screenshotPaths: string[] = [];
  const screenshots: ScreenshotResult[] = [];

  // Capture each screenshot
  for (const pageInfo of PAGES_TO_SCREENSHOT) {
    const url = `${PRODUCTION_URL}${pageInfo.path}`;
    
    try {
      const screenshot = await captureScreenshot(url, pageInfo.name);
      screenshots.push(screenshot);

      // Save individual screenshot
      const filename = `screenshot-${pageInfo.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
      const filepath = path.join(outputDir, filename);
      
      fs.writeFileSync(filepath, screenshot.data);
      screenshotPaths.push(filepath);
      console.log(`   💾 Saved: ${filename}`);

      // Add delay to respect API rate limits (2 seconds between requests)
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`   ⚠️  Skipping ${pageInfo.name}, continuing...`);
    }
  }

  if (screenshots.length === 0) {
    throw new Error('No screenshots were captured successfully');
  }

  console.log(`\n✅ Captured ${screenshots.length} screenshots\n`);

  // Create PDF
  console.log('📄 Generating PDF...');
  const pdfPath = path.join(outputDir, 'opictuary-play-store-screenshots.pdf');
  
  const doc = new PDFDocument({
    size: [1080 / 2, 1920 / 2], // Half size for reasonable PDF dimensions
    margins: { top: 30, bottom: 30, left: 30, right: 30 }
  });

  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // Add title page
  doc.fontSize(32)
     .fillColor('#8B2BE2') // Purple
     .text('Opictuary', 50, 100, { align: 'center' });
  
  doc.fontSize(20)
     .fillColor('#DAA520') // Gold
     .text('Google Play Store Screenshots', 50, 150, { align: 'center' });
  
  doc.fontSize(12)
     .fillColor('#000000')
     .text(`Generated: ${new Date().toLocaleDateString()}`, 50, 200, { align: 'center' });

  // Add each screenshot to PDF
  for (let i = 0; i < screenshots.length && i < 8; i++) {
    const screenshot = screenshots[i];
    const pageInfo = PAGES_TO_SCREENSHOT[i];
    
    doc.addPage({
      size: [1080 / 2, 1920 / 2],
      margins: { top: 30, bottom: 30, left: 30, right: 30 }
    });

    // Add page title
    doc.fontSize(14)
       .fillColor('#8B2BE2')
       .text(pageInfo.name, 50, 30);
    
    doc.fontSize(10)
       .fillColor('#666666')
       .text(pageInfo.description, 50, 50);

    // Add screenshot image
    try {
      doc.image(screenshot.data, 30, 80, {
        width: (1080 / 2) - 60,
        fit: [(1080 / 2) - 60, (1920 / 2) - 120]
      });
      console.log(`   ✅ Added to PDF: ${pageInfo.name}`);
    } catch (error) {
      console.error(`   ❌ Failed to add image: ${pageInfo.name}`, error);
    }
  }

  doc.end();

  await new Promise((resolve) => writeStream.on('finish', resolve));
  
  console.log(`\n🎉 PDF generated: ${pdfPath}\n`);
  console.log(`📦 All files saved to: ${outputDir}\n`);
  console.log(`📊 Total screenshots: ${screenshots.length}/8\n`);

  return pdfPath;
}

export { generateScreenshots };

// Run if executed directly
if (require.main === module) {
  generateScreenshots()
    .then(pdfPath => {
      console.log('✅ Success! PDF ready at:', pdfPath);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}
