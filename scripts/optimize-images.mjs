// Reproducible delivery variants. The original illustrations remain untouched.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

const root = path.resolve('public');
const output = path.join(root, 'optimized');
await fs.mkdir(output, {recursive:true});
const selectedFiles = process.argv.slice(2);
const sourceFiles = (await fs.readdir(root)).filter(f => f.endsWith('.webp') || f === 'brand-dragon.png').sort();
for (const name of selectedFiles) if (!sourceFiles.includes(name)) throw new Error(`Unknown source image: ${name}`);
const manifest = selectedFiles.length ? JSON.parse(await fs.readFile('src/data/images.json','utf8')) : {};
for (const file of sourceFiles.filter(name => !selectedFiles.length || selectedFiles.includes(name))) {
  const input = await fs.readFile(path.join(root,file));
  const {width,height} = await sharp(input).metadata();
  const widths = file === 'brand-dragon.png' ? [128,256] : [...new Set([480,768,width].filter(w=>w<=width))];
  const variants = [];
  for (const w of widths) {
    const entry = {width:w};
    for (const format of ['avif','webp']) {
      // The source and desktop master remain unchanged. The small cover
      // variants use visually reviewed compression; preserve other settings.
      const quality = format==='avif' ? (file==='cover-art.webp' && w<=768 ? 50 : 58) : 80;
      const buffer = await sharp(input).resize({width:w,withoutEnlargement:true})[format]({quality,effort:4}).toBuffer();
      const hash = createHash('sha256').update(buffer).digest('hex').slice(0,10);
      const name = `${path.parse(file).name}-${w}-${hash}.${format}`;
      await fs.writeFile(path.join(output,name),buffer);
      entry[format] = `optimized/${name}`;
      entry[`${format}Bytes`] = buffer.length;
      if (file==='cover-art.webp' && format==='avif') entry.avifQuality=quality;
    }
    variants.push(entry);
  }
  manifest[file] = {width,height,originalBytes:input.length,variants};
  console.log(`${file}: ${input.length} bytes -> ${variants[0].avifBytes} bytes (small AVIF)`);
}
await fs.writeFile('src/data/images.json',JSON.stringify(manifest,null,2)+'\n');
