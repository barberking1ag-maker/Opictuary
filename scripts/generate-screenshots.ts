import puppeteer from 'puppeteer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Get the production URL
const PRODUCTION_URL = process.env.REPLIT_DOMAINS 
  ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
  : 'http://localhost:5000';

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

async function generateScreenshots(): Promise<string> {
  console.log('🚀 Generating Play Store screenshots for Opictuary...\n');
  console.log(`📍 URL: ${PRODUCTION_URL}\n`);

  const outputDir = path.join(process.cwd(), 'play-store-screenshots');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Launch browser
  console.log('🌐 Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  
  // Set viewport to Google Play Store screenshot dimensions (1080 x 1920)
  await page.setViewport({
    width: 1080,
    height: 1920,
    deviceScaleFactor: 2, // High DPI for crisp screenshots
  });

  const screenshotPaths: string[] = [];

  // Capture each screenshot
  for (const pageInfo of PAGES_TO_SCREENSHOT) {
    const url = `${PRODUCTION_URL}${pageInfo.path}`;
    console.log(`📸 Capturing: ${pageInfo.name}`);
    
    try {
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Wait a bit for animations to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      const filename = `screenshot-${pageInfo.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
      const filepath = path.join(outputDir, filename);
      
      const screenshot = await page.screenshot({
        fullPage: false, // Just the viewport, not full page
      });
      
      fs.writeFileSync(filepath, screenshot);

      screenshotPaths.push(filepath);
      console.log(`   ✅ Saved: ${filename}`);
    } catch (error) {
      console.error(`   ❌ Failed: ${pageInfo.name}`, error);
    }
  }

  await browser.close();
  console.log(`\n✅ Captured ${screenshotPaths.length} screenshots\n`);

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
  for (let i = 0; i < screenshotPaths.length && i < 8; i++) {
    const screenshotPath = screenshotPaths[i];
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
      doc.image(screenshotPath, 30, 80, {
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
