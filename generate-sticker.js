import { createCanvas, loadImage, registerFont } from 'canvas';
import QRCode from 'qrcode';
import fs from 'fs';

async function generateSticker() {
  const WIDTH = 3300;
  const HEIGHT = 3300;
  const S = WIDTH / 1650;
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const CORNER_RADIUS = 50 * S;

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

  const topGrad = ctx.createLinearGradient(0, 0, 0, HEIGHT * 0.55);
  topGrad.addColorStop(0, '#6B3FA0');
  topGrad.addColorStop(0.4, '#5A2D90');
  topGrad.addColorStop(0.7, '#9B7DC4');
  topGrad.addColorStop(1, '#C4B0DB');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT * 0.55);

  const bottomGrad = ctx.createLinearGradient(0, HEIGHT * 0.48, 0, HEIGHT);
  bottomGrad.addColorStop(0, '#E8DFF0');
  bottomGrad.addColorStop(0.15, '#F5F0FA');
  bottomGrad.addColorStop(0.4, '#FFFFFF');
  bottomGrad.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, HEIGHT * 0.48, WIDTH, HEIGHT * 0.52);

  const whiteStripeY = HEIGHT * 0.50;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, whiteStripeY, WIDTH, 4 * S);

  const ICON_SIZE = 300 * S;
  const iconY = 40 * S;
  try {
    const icon = await loadImage('client/public/icon-512.png');
    const iconX = (WIDTH - ICON_SIZE) / 2;
    const iconR = 40 * S;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 20 * S;
    ctx.shadowOffsetY = 8 * S;
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

  const gpBadgeY = iconY + ICON_SIZE + 30 * S;
  const gpBadgeW = 340 * S;
  const gpBadgeH = 85 * S;
  const gpBadgeX = (WIDTH - gpBadgeW) / 2;

  ctx.save();
  roundedRect(ctx, gpBadgeX, gpBadgeY, gpBadgeW, gpBadgeH, 10 * S);
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.restore();

  roundedRect(ctx, 0, 0, WIDTH, HEIGHT, CORNER_RADIUS);
  ctx.clip();

  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2 * S;
  roundedRect(ctx, gpBadgeX, gpBadgeY, gpBadgeW, gpBadgeH, 10 * S);
  ctx.stroke();

  const triX = gpBadgeX + 28 * S;
  const triCenterY = gpBadgeY + gpBadgeH / 2;
  ctx.beginPath();
  ctx.moveTo(triX, triCenterY - 18 * S);
  ctx.lineTo(triX, triCenterY + 18 * S);
  ctx.lineTo(triX + 30 * S, triCenterY);
  ctx.closePath();
  const triGrad = ctx.createLinearGradient(triX, triCenterY - 18 * S, triX + 30 * S, triCenterY + 18 * S);
  triGrad.addColorStop(0, '#4285F4');
  triGrad.addColorStop(0.33, '#34A853');
  triGrad.addColorStop(0.66, '#FBBC04');
  triGrad.addColorStop(1, '#EA4335');
  ctx.fillStyle = triGrad;
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.font = `${18 * S}px sans-serif`;
  ctx.fillStyle = '#CCCCCC';
  ctx.fillText('DOWNLOAD ON', gpBadgeX + 72 * S, gpBadgeY + 30 * S);

  ctx.font = `bold ${36 * S}px sans-serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Google Play', gpBadgeX + 72 * S, gpBadgeY + 65 * S);

  ctx.textAlign = 'center';

  const QR_SIZE = 280 * S;
  const qrY = gpBadgeY + gpBadgeH + 25 * S;
  try {
    const qrDataUrl = await QRCode.toDataURL('https://opictuary.replit.app', {
      width: 1200,
      margin: 3,
      color: { dark: '#1a0f29', light: '#FFFFFF' },
      errorCorrectionLevel: 'H',
    });
    const qrImage = await loadImage(qrDataUrl);
    const qrX = (WIDTH - QR_SIZE) / 2;
    const qrPad = 15 * S;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 15 * S;
    ctx.shadowOffsetY = 4 * S;
    roundedRect(ctx, qrX - qrPad, qrY - qrPad, QR_SIZE + qrPad * 2, QR_SIZE + qrPad * 2, 18 * S);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    roundedRect(ctx, 0, 0, WIDTH, HEIGHT, CORNER_RADIUS);
    ctx.clip();

    ctx.drawImage(qrImage, qrX, qrY, QR_SIZE, QR_SIZE);
  } catch (e) {
    console.error('QR generation failed:', e);
  }

  const nameY = whiteStripeY + 90 * S;
  ctx.font = `bold ${110 * S}px serif`;
  ctx.fillStyle = '#3B1066';
  ctx.textAlign = 'center';
  ctx.fillText('Opictuary', WIDTH / 2, nameY);

  ctx.font = `${36 * S}px sans-serif`;
  ctx.fillStyle = '#6B4F8A';
  ctx.fillText('A Celebration Memorial Legacy Platform', WIDTH / 2, nameY + 55 * S);

  const dividerY = nameY + 85 * S;
  const lineGrad = ctx.createLinearGradient(100 * S, dividerY, WIDTH - 100 * S, dividerY);
  lineGrad.addColorStop(0, 'rgba(107, 63, 160, 0)');
  lineGrad.addColorStop(0.3, 'rgba(107, 63, 160, 0.3)');
  lineGrad.addColorStop(0.7, 'rgba(107, 63, 160, 0.3)');
  lineGrad.addColorStop(1, 'rgba(107, 63, 160, 0)');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2 * S;
  ctx.beginPath();
  ctx.moveTo(100 * S, dividerY);
  ctx.lineTo(WIDTH - 100 * S, dividerY);
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

  const FEAT_START_Y = dividerY + 55 * S;
  const FEAT_SPACING = 100 * S;

  ctx.textAlign = 'left';
  leftFeatures.forEach((feat, i) => {
    const lines = feat.split('\n');
    const yBase = FEAT_START_Y + i * FEAT_SPACING;
    ctx.font = `bold ${40 * S}px sans-serif`;
    ctx.fillStyle = '#3B1066';
    lines.forEach((line, li) => {
      ctx.fillText(line, 60 * S, yBase + li * 46 * S);
    });
  });

  ctx.textAlign = 'right';
  rightFeatures.forEach((feat, i) => {
    const lines = feat.split('\n');
    const yBase = FEAT_START_Y + i * FEAT_SPACING;
    ctx.font = `bold ${40 * S}px sans-serif`;
    ctx.fillStyle = '#3B1066';
    lines.forEach((line, li) => {
      ctx.fillText(line, WIDTH - 60 * S, yBase + li * 46 * S);
    });
  });

  ctx.font = `italic bold ${34 * S}px serif`;
  ctx.fillStyle = '#6B3FA0';
  ctx.textAlign = 'center';
  ctx.fillText('Honor every life, in every dimension.', WIDTH / 2, HEIGHT - 40 * S);

  const buffer = canvas.toBuffer('image/png', {
    resolution: 600,
  });
  fs.writeFileSync('attached_assets/generated_images/OpictuarySticker600.png', buffer);
  console.log('Sticker generated successfully!');
  console.log('Pixels: 3300 x 3300');
  console.log('DPI: 600');
  console.log('Print size: 5.50 x 5.50 inches');
  console.log('Saved to: attached_assets/generated_images/OpictuarySticker600.png');
}

generateSticker().catch(console.error);
