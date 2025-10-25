import { jsPDF } from 'jspdf';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

// Get the production URL from environment or use default
const PRODUCTION_URL = process.env.REPLIT_DOMAINS 
  ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
  : 'https://opictuary.replit.app';

// Key pages to screenshot for Google Play Store
const PAGES_TO_SCREENSHOT = [
  { path: '/', name: 'Home - Landing Page' },
  { path: '/memorials', name: 'Browse Memorials' },
  { path: '/celebrity-memorials', name: 'Celebrity Memorials' },
  { path: '/grief-support', name: 'Grief Support Resources' },
  { path: '/create-memorial', name: 'Create Memorial' },
  { path: '/fundraisers', name: 'Fundraisers' },
  { path: '/profile', name: 'User Profile' },
  { path: '/about', name: 'About Opictuary' },
];

// Using ApiFlash free tier (100 screenshots/month)
// Alternative: Thum.io for 1000/month
const SCREENSHOT_API = 'https://api.apiflash.com/v1/urltoimage';
const API_KEY = process.env.APIFLASH_KEY || '';

interface ScreenshotResult {
  name: string;
  data: Buffer;
}

async function captureScreenshot(url: string, name: string): Promise<ScreenshotResult> {
  console.log(`📸 Capturing: ${name} (${url})`);
  
  // Using free Thum.io service (no API key required for basic use)
  const screenshotUrl = `https://image.thum.io/get/width/1080/crop/1920/${encodeURIComponent(url)}`;
  
  try {
    const response = await fetch(screenshotUrl);
    if (!response.ok) {
      throw new Error(`Screenshot failed: ${response.statusText}`);
    }
    
    const buffer = await response.buffer();
    console.log(`✅ Captured: ${name}`);
    return { name, data: buffer };
  } catch (error) {
    console.error(`❌ Failed to capture ${name}:`, error);
    throw error;
  }
}

async function generatePDF(screenshots: ScreenshotResult[], outputPath: string) {
  console.log('\n📄 Generating PDF...');
  
  // Create PDF in portrait orientation for mobile screenshots
  // Google Play Store accepts: 320dp - 3840dp (we'll use 1080 x 1920)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [1080, 1920],
  });

  for (let i = 0; i < screenshots.length; i++) {
    const screenshot = screenshots[i];
    
    if (i > 0) {
      doc.addPage();
    }

    // Add title at the top
    doc.setFontSize(24);
    doc.setTextColor(138, 43, 226); // Purple color
    doc.text(screenshot.name, 540, 60, { align: 'center' });

    // Add screenshot image
    try {
      const imgData = `data:image/png;base64,${screenshot.data.toString('base64')}`;
      doc.addImage(imgData, 'PNG', 0, 100, 1080, 1820);
    } catch (error) {
      console.error(`Failed to add image for ${screenshot.name}:`, error);
    }

    console.log(`✅ Added page ${i + 1}/${screenshots.length}: ${screenshot.name}`);
  }

  // Save PDF
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  await fs.writeFile(outputPath, pdfBuffer);
  
  console.log(`\n🎉 PDF generated successfully: ${outputPath}`);
  return pdfBuffer;
}

async function main() {
  console.log('🚀 Opictuary Play Store Screenshot Generator\n');
  console.log(`📍 Production URL: ${PRODUCTION_URL}\n`);

  // Create output directory
  const outputDir = path.join(process.cwd(), 'play-store-screenshots');
  await fs.mkdir(outputDir, { recursive: true });

  // Capture all screenshots
  const screenshots: ScreenshotResult[] = [];
  
  for (const page of PAGES_TO_SCREENSHOT) {
    const url = `${PRODUCTION_URL}${page.path}`;
    try {
      const screenshot = await captureScreenshot(url, page.name);
      screenshots.push(screenshot);
      
      // Save individual screenshot
      const filename = `${page.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
      await fs.writeFile(
        path.join(outputDir, filename),
        screenshot.data
      );
      
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to capture ${page.name}, continuing...`);
    }
  }

  if (screenshots.length === 0) {
    console.error('❌ No screenshots were captured successfully');
    process.exit(1);
  }

  // Generate PDF
  const pdfPath = path.join(outputDir, 'opictuary-play-store-screenshots.pdf');
  await generatePDF(screenshots, pdfPath);

  console.log('\n📦 All files saved to:', outputDir);
  console.log(`\n📧 PDF ready for email: ${pdfPath}`);
  
  return pdfPath;
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { main as generateScreenshots };
