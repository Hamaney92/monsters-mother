// Reproducible delivery variants. The original illustrations remain untouched.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

const root = path.resolve('public');
const output = path.join(root, 'optimized');
await fs.mkdir(output, {recursive:true});
const manifest = {};
for (const file of (await fs.readdir(root)).filter(f => f.endsWith('.webp') || f === 'brand-dragon.png').sort()) {
  const input = await fs.readFile(path.join(root,file));
  const {width,height} = await sharp(input).metadata();
  const widths = file === 'brand-dragon.png' ? [128,256] : [...new Set([480,768,width].filter(w=>w<=width))];
  const variants = [];
  for (const w of widths) {
    const entry = {width:w};
    for (const format of ['avif','webp']) {
      const buffer = await sharp(input).resize({width:w,withoutEnlargement:true})[format]({quality:format==='avif'?58:80,effort:4}).toBuffer();
      const hash = createHash('sha256').update(buffer).digest('hex').slice(0,10);
      const name = `${path.parse(file).name}-${w}-${hash}.${format}`;
      await fs.writeFile(path.join(output,name),buffer);
      entry[format] = `optimized/${name}`;
      entry[`${format}Bytes`] = buffer.length;
    }
    variants.push(entry);
  }
  manifest[file] = {width,height,originalBytes:input.length,variants};
  console.log(`${file}: ${input.length} bytes -> ${variants[0].avifBytes} bytes (small AVIF)`);
}
await fs.writeFile('src/data/images.json',JSON.stringify(manifest,null,2)+'\n');
