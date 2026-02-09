import { createCanvas, loadImage, registerFont } from 'canvas';
import QRCode from 'qrcode';
import fs from 'fs';

async function generateSticker() {
  const WIDTH = 1800;
  const HEIGHT = 2800;
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const CORNER_RADIUS = 60;

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

  roundedRect(ctx, 0, 0, WIDTH, HEIGHT, CORNER_RADIUS);
  ctx.clip();

  const topGrad = ctx.createLinearGradient(0, 0, 0, HEIGHT * 0.65);
  topGrad.addColorStop(0, '#6B3FA0');
  topGrad.addColorStop(0.4, '#5A2D90');
  topGrad.addColorStop(0.7, '#9B7DC4');
  topGrad.addColorStop(1, '#C4B0DB');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT * 0.65);

  const bottomGrad = ctx.createLinearGradient(0, HEIGHT * 0.58, 0, HEIGHT);
  bottomGrad.addColorStop(0, '#E8DFF0');
  bottomGrad.addColorStop(0.15, '#F5F0FA');
  bottomGrad.addColorStop(0.4, '#FFFFFF');
  bottomGrad.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, HEIGHT * 0.58, WIDTH, HEIGHT * 0.42);

  const whiteStripeY = HEIGHT * 0.60;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, whiteStripeY, WIDTH, 6);

  const ICON_SIZE = 420;
  const iconY = 120;
  try {
    const icon = await loadImage('client/public/icon-512.png');
    const iconX = (WIDTH - ICON_SIZE) / 2;
    const iconR = 50;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    roundedRect(ctx, iconX, iconY, ICON_SIZE, ICON_SIZE, iconR);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    roundedRect(ctx, 0, 0, WIDTH, HEIGHT, CORNER_RADIUS);
    ctx.clip();

    ctx.save();
    roundedRect(ctx, iconX, iconY, ICON_SIZE, ICON_SIZE, iconR);
    ctx.clip();
    ctx.drawImage(icon, iconX, iconY, ICON_SIZE, ICON_SIZE);
    ctx.restore();

    roundedRect(ctx, 0, 0, WIDTH, HEIGHT, CORNER_RADIUS);
    ctx.clip();
  } catch (e) {
    console.log('Could not load icon');
  }

  ctx.textAlign = 'center';

  const gpBadgeY = iconY + ICON_SIZE + 60;
  const gpBadgeW = 340;
  const gpBadgeH = 90;
  const gpBadgeX = (WIDTH - gpBadgeW) / 2;

  ctx.save();
  roundedRect(ctx, gpBadgeX, gpBadgeY, gpBadgeW, gpBadgeH, 12);
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.restore();

  roundedRect(ctx, 0, 0, WIDTH, HEIGHT, CORNER_RADIUS);
  ctx.clip();

  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2;
  roundedRect(ctx, gpBadgeX, gpBadgeY, gpBadgeW, gpBadgeH, 12);
  ctx.stroke();

  const triX = gpBadgeX + 28;
  const triCenterY = gpBadgeY + gpBadgeH / 2;
  ctx.beginPath();
  ctx.moveTo(triX, triCenterY - 18);
  ctx.lineTo(triX, triCenterY + 18);
  ctx.lineTo(triX + 30, triCenterY);
  ctx.closePath();
  const triGrad = ctx.createLinearGradient(triX, triCenterY - 18, triX + 30, triCenterY + 18);
  triGrad.addColorStop(0, '#4285F4');
  triGrad.addColorStop(0.33, '#34A853');
  triGrad.addColorStop(0.66, '#FBBC04');
  triGrad.addColorStop(1, '#EA4335');
  ctx.fillStyle = triGrad;
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.font = '18px sans-serif';
  ctx.fillStyle = '#CCCCCC';
  ctx.fillText('DOWNLOAD ON', gpBadgeX + 75, gpBadgeY + 32);

  ctx.font = 'bold 36px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Google Play', gpBadgeX + 75, gpBadgeY + 68);

  ctx.textAlign = 'center';

  const QR_SIZE = 380;
  const qrY = gpBadgeY + gpBadgeH + 50;
  try {
    const qrDataUrl = await QRCode.toDataURL('https://opictuary.replit.app', {
      width: 800,
      margin: 3,
      color: { dark: '#1a0f29', light: '#FFFFFF' },
      errorCorrectionLevel: 'H',
    });
    const qrImage = await loadImage(qrDataUrl);
    const qrX = (WIDTH - QR_SIZE) / 2;
    const qrPad = 20;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    roundedRect(ctx, qrX - qrPad, qrY - qrPad, QR_SIZE + qrPad * 2, QR_SIZE + qrPad * 2, 22);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    roundedRect(ctx, 0, 0, WIDTH, HEIGHT, CORNER_RADIUS);
    ctx.clip();

    ctx.drawImage(qrImage, qrX, qrY, QR_SIZE, QR_SIZE);
  } catch (e) {
    console.error('QR generation failed:', e);
  }

  const nameY = whiteStripeY + 120;
  ctx.font = 'bold 130px serif';
  ctx.fillStyle = '#3B1066';
  ctx.textAlign = 'center';
  ctx.fillText('Opictuary', WIDTH / 2, nameY);

  ctx.font = '38px sans-serif';
  ctx.fillStyle = '#6B4F8A';
  ctx.fillText('A Celebration Memorial Legacy Platform', WIDTH / 2, nameY + 65);

  const dividerY = nameY + 110;
  const lineGrad = ctx.createLinearGradient(120, dividerY, WIDTH - 120, dividerY);
  lineGrad.addColorStop(0, 'rgba(107, 63, 160, 0)');
  lineGrad.addColorStop(0.3, 'rgba(107, 63, 160, 0.3)');
  lineGrad.addColorStop(0.7, 'rgba(107, 63, 160, 0.3)');
  lineGrad.addColorStop(1, 'rgba(107, 63, 160, 0)');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(120, dividerY);
  ctx.lineTo(WIDTH - 120, dividerY);
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

  const FEAT_START_Y = dividerY + 70;
  const FEAT_SPACING = 115;

  ctx.textAlign = 'left';
  leftFeatures.forEach((feat, i) => {
    const lines = feat.split('\n');
    const yBase = FEAT_START_Y + i * FEAT_SPACING;
    ctx.font = 'bold 40px sans-serif';
    ctx.fillStyle = '#3B1066';
    lines.forEach((line, li) => {
      ctx.fillText(line, 80, yBase + li * 48);
    });
  });

  ctx.textAlign = 'right';
  rightFeatures.forEach((feat, i) => {
    const lines = feat.split('\n');
    const yBase = FEAT_START_Y + i * FEAT_SPACING;
    ctx.font = 'bold 40px sans-serif';
    ctx.fillStyle = '#3B1066';
    lines.forEach((line, li) => {
      ctx.fillText(line, WIDTH - 80, yBase + li * 48);
    });
  });

  ctx.font = 'italic bold 36px serif';
  ctx.fillStyle = '#6B3FA0';
  ctx.textAlign = 'center';
  ctx.fillText('Honor every life, in every dimension.', WIDTH / 2, HEIGHT - 60);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('attached_assets/generated_images/OpictuaryStickerPrint.png', buffer);
  console.log('Sticker generated successfully!');
  console.log('Saved to: attached_assets/generated_images/OpictuaryStickerPrint.png');
}

generateSticker().catch(console.error);
