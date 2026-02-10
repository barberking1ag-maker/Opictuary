import { createCanvas, loadImage, registerFont } from 'canvas';
import QRCode from 'qrcode';
import fs from 'fs';

async function generateSticker() {
  const DPI = 300;
  const WIDTH = 1680;
  const HEIGHT = 1680;
  const BLEED = 30;
  const SAFE = 50;

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  function roundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const topH = 520;
  const topGrad = ctx.createLinearGradient(0, 0, 0, topH);
  topGrad.addColorStop(0, '#5A2D90');
  topGrad.addColorStop(1, '#7B4DB5');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, WIDTH, topH);

  const M = BLEED + SAFE;

  const ICON_SIZE = 200;
  const iconX = M;
  const iconY = 80;
  try {
    const icon = await loadImage('client/public/icon-512.png');
    const iconR = 28;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    roundedRect(ctx, iconX, iconY, ICON_SIZE, ICON_SIZE, iconR);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    ctx.save();
    roundedRect(ctx, iconX, iconY, ICON_SIZE, ICON_SIZE, iconR);
    ctx.clip();
    ctx.drawImage(icon, iconX, iconY, ICON_SIZE, ICON_SIZE);
    ctx.restore();
  } catch (e) {
    console.log('Could not load icon');
  }

  const textX = iconX + ICON_SIZE + 40;
  ctx.textAlign = 'left';
  ctx.font = 'bold 120px serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Opictuary', textX, iconY + 100);

  ctx.font = 'bold 48px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Celebration Memorial', textX, iconY + 160);
  ctx.fillText('Legacy Platform', textX, iconY + 215);

  const QR_SIZE = 340;
  const qrX = WIDTH - M - QR_SIZE - 20;
  const qrCenterY = topH + 40;
  try {
    const qrDataUrl = await QRCode.toDataURL('https://play.google.com/store/apps/details?id=com.opictuary.app', {
      width: 1000,
      margin: 2,
      color: { dark: '#2D1050', light: '#FFFFFF' },
      errorCorrectionLevel: 'H',
    });
    const qrImage = await loadImage(qrDataUrl);
    const qrPad = 16;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    roundedRect(ctx, qrX - qrPad, qrCenterY - qrPad, QR_SIZE + qrPad * 2, QR_SIZE + qrPad * 2, 16);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#E0D4EE';
    ctx.lineWidth = 2;
    roundedRect(ctx, qrX - qrPad, qrCenterY - qrPad, QR_SIZE + qrPad * 2, QR_SIZE + qrPad * 2, 16);
    ctx.stroke();

    ctx.drawImage(qrImage, qrX, qrCenterY, QR_SIZE, QR_SIZE);
  } catch (e) {
    console.error('QR generation failed:', e);
  }

  ctx.textAlign = 'center';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillStyle = '#5A2D90';
  ctx.fillText('Scan to Download', qrX + QR_SIZE / 2, qrCenterY + QR_SIZE + 50);

  const gpBadgeW = 380;
  const gpBadgeH = 100;
  const gpBadgeX = qrX + (QR_SIZE - gpBadgeW) / 2;
  const gpBadgeY = qrCenterY + QR_SIZE + 70;

  roundedRect(ctx, gpBadgeX, gpBadgeY, gpBadgeW, gpBadgeH, 12);
  ctx.fillStyle = '#000000';
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2;
  roundedRect(ctx, gpBadgeX, gpBadgeY, gpBadgeW, gpBadgeH, 12);
  ctx.stroke();

  const triX = gpBadgeX + 26;
  const triCenterY = gpBadgeY + gpBadgeH / 2;
  ctx.beginPath();
  ctx.moveTo(triX, triCenterY - 20);
  ctx.lineTo(triX, triCenterY + 20);
  ctx.lineTo(triX + 34, triCenterY);
  ctx.closePath();
  const triGrad = ctx.createLinearGradient(triX, triCenterY - 20, triX + 34, triCenterY + 20);
  triGrad.addColorStop(0, '#4285F4');
  triGrad.addColorStop(0.33, '#34A853');
  triGrad.addColorStop(0.66, '#FBBC04');
  triGrad.addColorStop(1, '#EA4335');
  ctx.fillStyle = triGrad;
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.font = '22px sans-serif';
  ctx.fillStyle = '#CCCCCC';
  ctx.fillText('GET IT ON', gpBadgeX + 76, gpBadgeY + 36);

  ctx.font = 'bold 42px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Google Play', gpBadgeX + 76, gpBadgeY + 76);

  const featStartY = topH + 60;
  const featX = M + 20;
  const featMaxW = qrX - featX - 60;

  const features = [
    "Immersive Memorial Hubs",
    "AI Holiday Cards",
    "Multi Faith Celebrations",
    "Future Messages",
    "QR Connected Keepsakes",
    "Family Trees",
    "Live Streaming",
    "Wedding Registries",
  ];

  const bulletSize = 14;
  const featSpacing = 68;

  features.forEach((feat, i) => {
    const y = featStartY + i * featSpacing;

    ctx.fillStyle = '#7B4DB5';
    ctx.beginPath();
    ctx.arc(featX + bulletSize / 2, y + 6, bulletSize / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillStyle = '#2D1050';
    ctx.fillText(feat, featX + bulletSize + 18, y + 18);
  });

  const tagY = HEIGHT - M - 20;
  ctx.textAlign = 'center';
  ctx.font = 'italic bold 38px serif';
  ctx.fillStyle = '#5A2D90';
  ctx.fillText('Honor every life, in every dimension.', WIDTH / 2, tagY);

  const lineY = tagY - 30;
  const lineGrad = ctx.createLinearGradient(M + 100, lineY, WIDTH - M - 100, lineY);
  lineGrad.addColorStop(0, 'rgba(90, 45, 144, 0)');
  lineGrad.addColorStop(0.3, 'rgba(90, 45, 144, 0.3)');
  lineGrad.addColorStop(0.7, 'rgba(90, 45, 144, 0.3)');
  lineGrad.addColorStop(1, 'rgba(90, 45, 144, 0)');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(M + 100, lineY);
  ctx.lineTo(WIDTH - M - 100, lineY);
  ctx.stroke();

  const buffer = canvas.toBuffer('image/png', {
    resolution: DPI,
  });
  fs.writeFileSync('attached_assets/generated_images/OpictuarySticker5x5.png', buffer);
  console.log('Sticker generated successfully!');
  console.log(`Pixels: ${WIDTH} x ${HEIGHT}`);
  console.log(`DPI: ${DPI}`);
  console.log(`Print size with bleed: ${(WIDTH/DPI).toFixed(2)} x ${(HEIGHT/DPI).toFixed(2)} inches`);
  console.log(`Trim size: 5.50 x 5.50 inches`);
}

generateSticker().catch(console.error);
