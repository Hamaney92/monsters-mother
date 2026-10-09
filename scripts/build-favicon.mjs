import fs from 'node:fs/promises';
import sharp from 'sharp';

// Rasterize the existing brand artwork; ICO stores standard PNG frames.
const sizes = [32, 48, 96];
const frames = await Promise.all(sizes.map(size => sharp('public/favicon.svg').resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * frames.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
frames.forEach((frame, index) => {
  const entry = 6 + 16 * index;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(frame.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
await fs.writeFile('public/favicon.ico', Buffer.concat([header, ...frames]));
await fs.writeFile('public/favicon-96.png', frames[2]);
console.log('Generated favicon.ico (32/48/96 px) and favicon-96.png from the existing SVG.');
