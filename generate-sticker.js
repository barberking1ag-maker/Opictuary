import { createCanvas, loadImage, registerFont } from 'canvas';
import QRCode from 'qrcode';
import fs from 'fs';

async function generateSticker() {
  const WIDTH = 1800;
  const HEIGHT = 2400;
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const CORNER_RADIUS = 50;

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

  const radGrad = ctx.createRadialGradient(WIDTH / 2, HEIGHT * 0.35, 100, WIDTH / 2, HEIGHT * 0.35, 900);
  radGrad.addColorStop(0, 'rgba(130, 80, 200, 0.25)');
  radGrad.addColorStop(1, 'rgba(130, 80, 200, 0)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(WIDTH / 2, HEIGHT * 0.35, 200 + i * 180, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.025 - i * 0.004})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const ICON_SIZE = 400;
  const iconY = 80;
  try {
    const icon = await loadImage('client/public/icon-512.png');
    const iconX = (WIDTH - ICON_SIZE) / 2;
    const iconR = 48;
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
    console.log('Could not load icon');
  }

  ctx.textAlign = 'center';

  ctx.font = 'bold 28px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText('DOWNLOAD ON', WIDTH / 2, iconY + ICON_SIZE + 65);

  ctx.font = 'bold 52px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Google Play', WIDTH / 2, iconY + ICON_SIZE + 120);

  const QR_SIZE = 350;
  const qrY = iconY + ICON_SIZE + 160;
  try {
    const qrDataUrl = await QRCode.toDataURL('https://opictuary.replit.app', {
      width: 800,
      margin: 3,
      color: { dark: '#1a0f29', light: '#FFFFFF' },
      errorCorrectionLevel: 'H',
    });
    const qrImage = await loadImage(qrDataUrl);
    const qrX = (WIDTH - QR_SIZE) / 2;
    const qrPad = 18;

    ctx.fillStyle = '#FFFFFF';
    roundedRect(ctx, qrX - qrPad, qrY - qrPad, QR_SIZE + qrPad * 2, QR_SIZE + qrPad * 2, 20);
    ctx.fill();

    ctx.drawImage(qrImage, qrX, qrY, QR_SIZE, QR_SIZE);
  } catch (e) {
    console.error('QR generation failed:', e);
  }

  const nameY = qrY + QR_SIZE + 100;
  ctx.font = 'bold 120px serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText('Opictuary', WIDTH / 2, nameY);

  ctx.font = '40px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText('A Celebration Memorial Legacy Platform', WIDTH / 2, nameY + 65);

  const dividerY = nameY + 100;
  const lineGrad = ctx.createLinearGradient(150, dividerY, WIDTH - 150, dividerY);
  lineGrad.addColorStop(0, 'rgba(255,255,255,0)');
  lineGrad.addColorStop(0.3, 'rgba(255,255,255,0.35)');
  lineGrad.addColorStop(0.7, 'rgba(255,255,255,0.35)');
  lineGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(150, dividerY);
  ctx.lineTo(WIDTH - 150, dividerY);
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

  const FEAT_START_Y = dividerY + 65;
  const FEAT_SPACING = 110;

  ctx.textAlign = 'left';
  leftFeatures.forEach((feat, i) => {
    const lines = feat.split('\n');
    const yBase = FEAT_START_Y + i * FEAT_SPACING;
    ctx.font = 'bold 38px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    lines.forEach((line, li) => {
      ctx.fillText(line, 80, yBase + li * 44);
    });
  });

  ctx.textAlign = 'right';
  rightFeatures.forEach((feat, i) => {
    const lines = feat.split('\n');
    const yBase = FEAT_START_Y + i * FEAT_SPACING;
    ctx.font = 'bold 38px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    lines.forEach((line, li) => {
      ctx.fillText(line, WIDTH - 80, yBase + li * 44);
    });
  });

  ctx.font = 'italic bold 38px serif';
  ctx.fillStyle = '#FFD700';
  ctx.textAlign = 'center';
  ctx.fillText('Honor every life, in every dimension.', WIDTH / 2, HEIGHT - 60);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('attached_assets/generated_images/OpictuaryStickerPrint.png', buffer);
  console.log('Sticker generated successfully!');
  console.log('Saved to: attached_assets/generated_images/OpictuaryStickerPrint.png');
}

generateSticker().catch(console.error);
