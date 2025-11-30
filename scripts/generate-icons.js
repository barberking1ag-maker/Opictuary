import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createSVGIcon(size, color) {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${color}"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="white" opacity="0.9"/>
  <path d="M ${size/2 - size/8} ${size/2 - size/12} Q ${size/2} ${size/2 - size/6}, ${size/2 + size/8} ${size/2 - size/12} L ${size/2 + size/10} ${size/2 + size/6} Q ${size/2} ${size/2 + size/8}, ${size/2 - size/10} ${size/2 + size/6} Z" fill="${color}"/>
  <text x="${size/2}" y="${size/2 + size/2.5}" font-family="serif" font-size="${size/8}" fill="white" text-anchor="middle" font-weight="bold">O</text>
</svg>`;
}

const publicDir = path.join(__dirname, '../client/public');

const icon192 = createSVGIcon(192, '#2C1810');
const icon512 = createSVGIcon(512, '#2C1810');

fs.writeFileSync(path.join(publicDir, 'icon-192.svg'), icon192);
fs.writeFileSync(path.join(publicDir, 'icon-512.svg'), icon512);

console.log('SVG icons generated successfully');
