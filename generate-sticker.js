import { createCanvas, loadImage, registerFont } from 'canvas';
import QRCode from 'qrcode';
import fs from 'fs';

async function generateSticker() {
  const DPI = 300;
  const WIDTH = 1680;
  const HEIGHT = 1680;
  const BLEED = 15;
  const SAFE = 37;

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

  const topGrad = ctx.createLinearGradient(0, 0, 0, HEIGHT * 0.52);
  topGrad.addColorStop(0, '#6B3FA0');
  topGrad.addColorStop(0.4, '#5A2D90');
  topGrad.addColorStop(0.7, '#9B7DC4');
  topGrad.addColorStop(1, '#C4B0DB');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT * 0.52);

  const bottomGrad = ctx.createLinearGradient(0, HEIGHT * 0.46, 0, HEIGHT);
  bottomGrad.addColorStop(0, '#E8DFF0');
  bottomGrad.addColorStop(0.15, '#F5F0FA');
  bottomGrad.addColorStop(0.4, '#FFFFFF');
  bottomGrad.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, HEIGHT * 0.46, WIDTH, HEIGHT * 0.54);

  const whiteStripeY = HEIGHT * 0.48;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, whiteStripeY, WIDTH, 3);

  const M = BLEED + SAFE;

  const ICON_SIZE = 260;
  const iconY = M;
  try {
    const icon = await loadImage('client/public/icon-512.png');
    const iconX = (WIDTH - ICON_SIZE) / 2;
    const iconR = 32;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
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

  ctx.textAlign = 'center';

  const gpBadgeY = iconY + ICON_SIZE + 22;
  const gpBadgeW = 280;
  const gpBadgeH = 72;
  const gpBadgeX = (WIDTH - gpBadgeW) / 2;

  roundedRect(ctx, gpBadgeX, gpBadgeY, gpBadgeW, gpBadgeH, 8);
  ctx.fillStyle = '#000000';
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1.5;
  roundedRect(ctx, gpBadgeX, gpBadgeY, gpBadgeW, gpBadgeH, 8);
  ctx.stroke();

  const triX = gpBadgeX + 20;
  const triCenterY = gpBadgeY + gpBadgeH / 2;
  ctx.beginPath();
  ctx.moveTo(triX, triCenterY - 14);
  ctx.lineTo(triX, triCenterY + 14);
  ctx.lineTo(triX + 24, triCenterY);
  ctx.closePath();
  const triGrad = ctx.createLinearGradient(triX, triCenterY - 14, triX + 24, triCenterY + 14);
  triGrad.addColorStop(0, '#4285F4');
  triGrad.addColorStop(0.33, '#34A853');
  triGrad.addColorStop(0.66, '#FBBC04');
  triGrad.addColorStop(1, '#EA4335');
  ctx.fillStyle = triGrad;
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.font = '15px sans-serif';
  ctx.fillStyle = '#CCCCCC';
  ctx.fillText('DOWNLOAD ON', gpBadgeX + 56, gpBadgeY + 26);

  ctx.font = 'bold 30px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Google Play', gpBadgeX + 56, gpBadgeY + 56);

  ctx.textAlign = 'center';

  const QR_SIZE = 230;
  const qrY = gpBadgeY + gpBadgeH + 18;
  try {
    const qrDataUrl = await QRCode.toDataURL('https://opictuary.replit.app', {
      width: 800,
      margin: 3,
      color: { dark: '#1a0f29', light: '#FFFFFF' },
      errorCorrectionLevel: 'H',
    });
    const qrImage = await loadImage(qrDataUrl);
    const qrX = (WIDTH - QR_SIZE) / 2;
    const qrPad = 12;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 3;
    roundedRect(ctx, qrX - qrPad, qrY - qrPad, QR_SIZE + qrPad * 2, QR_SIZE + qrPad * 2, 14);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    ctx.drawImage(qrImage, qrX, qrY, QR_SIZE, QR_SIZE);
  } catch (e) {
    console.error('QR generation failed:', e);
  }

  const nameY = whiteStripeY + 72;
  ctx.font = 'bold 90px serif';
  ctx.fillStyle = '#3B1066';
  ctx.textAlign = 'center';
  ctx.fillText('Opictuary', WIDTH / 2, nameY);

  ctx.font = '28px sans-serif';
  ctx.fillStyle = '#6B4F8A';
  ctx.fillText('A Celebration Memorial Legacy Platform', WIDTH / 2, nameY + 42);

  const dividerY = nameY + 62;
  const lineGrad = ctx.createLinearGradient(M, dividerY, WIDTH - M, dividerY);
  lineGrad.addColorStop(0, 'rgba(107, 63, 160, 0)');
  lineGrad.addColorStop(0.3, 'rgba(107, 63, 160, 0.3)');
  lineGrad.addColorStop(0.7, 'rgba(107, 63, 160, 0.3)');
  lineGrad.addColorStop(1, 'rgba(107, 63, 160, 0)');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(M, dividerY);
  ctx.lineTo(WIDTH - M, dividerY);
  ctx.stroke();

  const leftFeatures = [
    "Immersive\nMemorial Hubs",
    "AI Holiday\nCards",
    "Multi Faith\nCelebrations",
    "Future Messages\nTime Capsules",
  ];
  const rightFeatures = [
    "QR Connected\nKeepsakes",
    "Family Trees\nCollaboration",
    "Live Streaming",
    "Wedding Baby\nRegistries",
  ];

  const FEAT_START_Y = dividerY + 40;
  const FEAT_SPACING = 80;

  ctx.textAlign = 'left';
  leftFeatures.forEach((feat, i) => {
    const lines = feat.split('\n');
    const yBase = FEAT_START_Y + i * FEAT_SPACING;
    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = '#3B1066';
    lines.forEach((line, li) => {
      ctx.fillText(line, M, yBase + li * 36);
    });
  });

  ctx.textAlign = 'right';
  rightFeatures.forEach((feat, i) => {
    const lines = feat.split('\n');
    const yBase = FEAT_START_Y + i * FEAT_SPACING;
    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = '#3B1066';
    lines.forEach((line, li) => {
      ctx.fillText(line, WIDTH - M, yBase + li * 36);
    });
  });

  ctx.font = 'italic bold 26px serif';
  ctx.fillStyle = '#6B3FA0';
  ctx.textAlign = 'center';
  ctx.fillText('Honor every life, in every dimension.', WIDTH / 2, HEIGHT - M);

  const buffer = canvas.toBuffer('image/png', {
    resolution: DPI,
  });
  fs.writeFileSync('attached_assets/generated_images/OpictuaryGotPrint.png', buffer);
  console.log('Sticker generated successfully!');
  console.log(`Pixels: ${WIDTH} x ${HEIGHT}`);
  console.log(`DPI: ${DPI}`);
  console.log(`Print size with bleed: ${(WIDTH/DPI).toFixed(2)} x ${(HEIGHT/DPI).toFixed(2)} inches`);
  console.log(`Trim size: 5.50 x 5.50 inches`);
  console.log('Includes 0.1" bleed on all sides');
}

generateSticker().catch(console.error);
