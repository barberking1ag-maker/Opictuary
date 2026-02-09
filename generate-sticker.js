import { createCanvas, loadImage, registerFont } from 'canvas';
import QRCode from 'qrcode';
import fs from 'fs';

async function generateSticker() {
  const WIDTH = 1200;
  const HEIGHT = 1800;
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const CORNER_RADIUS = 40;

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

  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#5B2D8E');
  gradient.addColorStop(0.5, '#4A1D7A');
  gradient.addColorStop(1, '#3B1066');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const radGrad = ctx.createRadialGradient(WIDTH / 2, HEIGHT * 0.28, 100, WIDTH / 2, HEIGHT * 0.28, 700);
  radGrad.addColorStop(0, 'rgba(130, 80, 200, 0.3)');
  radGrad.addColorStop(1, 'rgba(130, 80, 200, 0)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(WIDTH / 2, HEIGHT * 0.28, 200 + i * 130, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 - i * 0.005})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const leftFeatures = [
    "Immersive\nMemorial Hubs",
    "AI Holiday\nCards",
    "Multi-Faith\nCelebrations",
    "Future Messages\n& Time Capsules",
  ];
  const rightFeatures = [
    "QR-Connected\nKeepsakes",
    "Family Trees &\nCollaboration",
    "Live Streaming",
    "Wedding & Baby\nRegistries",
    "Memorial Products",
  ];

  const FEATURE_START_Y = 85;
  const FEATURE_SPACING = 105;

  ctx.textAlign = 'left';
  leftFeatures.forEach((feat, i) => {
    const lines = feat.split('\n');
    const yBase = FEATURE_START_Y + i * FEATURE_SPACING;
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    lines.forEach((line, li) => {
      ctx.fillText(line, 50, yBase + li * 30);
    });
  });

  ctx.textAlign = 'right';
  rightFeatures.forEach((feat, i) => {
    const lines = feat.split('\n');
    const yBase = FEATURE_START_Y + i * FEATURE_SPACING;
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    lines.forEach((line, li) => {
      ctx.fillText(line, WIDTH - 50, yBase + li * 30);
    });
  });

  const ICON_SIZE = 300;
  const iconY = 150;
  try {
    const icon = await loadImage('client/public/icon-512.png');
    const iconX = (WIDTH - ICON_SIZE) / 2;
    const iconR = 36;
    ctx.save();
    roundedRect(ctx, iconX, iconY, ICON_SIZE, ICON_SIZE, iconR);
    ctx.clip();
    ctx.drawImage(icon, iconX, iconY, ICON_SIZE, ICON_SIZE);
    ctx.restore();

    roundedRect(ctx, 0, 0, WIDTH, HEIGHT, CORNER_RADIUS);
    ctx.clip();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 3;
    roundedRect(ctx, iconX, iconY, ICON_SIZE, ICON_SIZE, iconR);
    ctx.stroke();
  } catch (e) {
    console.log('Could not load icon, drawing placeholder');
  }

  ctx.textAlign = 'center';

  const featuresEndY = FEATURE_START_Y + 4 * FEATURE_SPACING + 30;
  const divider1Y = featuresEndY;
  const lineGrad1 = ctx.createLinearGradient(150, divider1Y, WIDTH - 150, divider1Y);
  lineGrad1.addColorStop(0, 'rgba(255,255,255,0)');
  lineGrad1.addColorStop(0.3, 'rgba(255,255,255,0.3)');
  lineGrad1.addColorStop(0.7, 'rgba(255,255,255,0.3)');
  lineGrad1.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.strokeStyle = lineGrad1;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(150, divider1Y);
  ctx.lineTo(WIDTH - 150, divider1Y);
  ctx.stroke();

  const nameY = divider1Y + 80;
  ctx.font = 'bold 92px serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Opictuary', WIDTH / 2, nameY);

  ctx.font = '28px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText('A Celebration Memorial Legacy Platform', WIDTH / 2, nameY + 48);

  const dlTextY = nameY + 115;
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText('DOWNLOAD ON', WIDTH / 2, dlTextY);

  ctx.font = 'bold 40px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Google Play', WIDTH / 2, dlTextY + 42);

  const QR_SIZE = 300;
  const taglineY = HEIGHT - 60;
  const availableSpace = taglineY - 60 - (dlTextY + 42);
  const qrY = dlTextY + 42 + (availableSpace - QR_SIZE - 30) / 2 + 30;
  try {
    const qrDataUrl = await QRCode.toDataURL('https://opictuary.replit.app', {
      width: 800,
      margin: 3,
      color: { dark: '#1a0f29', light: '#FFFFFF' },
      errorCorrectionLevel: 'H',
    });
    const qrImage = await loadImage(qrDataUrl);
    const qrX = (WIDTH - QR_SIZE) / 2;
    const qrPad = 15;

    ctx.fillStyle = '#FFFFFF';
    roundedRect(ctx, qrX - qrPad, qrY - qrPad, QR_SIZE + qrPad * 2, QR_SIZE + qrPad * 2, 18);
    ctx.fill();

    ctx.drawImage(qrImage, qrX, qrY, QR_SIZE, QR_SIZE);
  } catch (e) {
    console.error('QR generation failed:', e);
  }

  ctx.font = 'italic bold 32px serif';
  ctx.fillStyle = '#FFD700';
  ctx.textAlign = 'center';
  ctx.fillText('Honor every life, in every dimension.', WIDTH / 2, taglineY);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('attached_assets/generated_images/opictuary-sticker-print.png', buffer);
  console.log('Sticker generated successfully!');
  console.log('Saved to: attached_assets/generated_images/opictuary-sticker-print.png');
}

generateSticker().catch(console.error);
