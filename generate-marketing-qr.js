import QRCode from 'qrcode';
import fs from 'fs';

async function generateMarketingQRCode() {
  const url = 'https://opictuary.replit.app';
  const outputPath = 'opictuary-sticker-qr.png';

  try {
    // Generate high-quality QR code for printing
    await QRCode.toFile(outputPath, url, {
      width: 1000,           // Large size for print quality
      margin: 4,             // White border around QR code
      color: {
        dark: '#1a0f29',     // Rich purple background color
        light: '#FFFFFF'     // White
      },
      errorCorrectionLevel: 'H'  // High error correction for damaged stickers
    });

    console.log('✅ QR Code generated successfully!');
    console.log(`📍 Location: ${outputPath}`);
    console.log(`🔗 Links to: ${url}`);
    console.log(`📐 Size: 1000x1000 pixels (high quality for printing)`);
    console.log(`🎨 Colors: Purple (#1a0f29) on White background`);
    console.log('\n💡 This QR code is optimized for printing on stickers!');
  } catch (error) {
    console.error('❌ Error generating QR code:', error);
  }
}

generateMarketingQRCode();
