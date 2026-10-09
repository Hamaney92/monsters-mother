import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const images=JSON.parse(fs.readFileSync('src/data/images.json','utf8'));
for(const [name,image] of Object.entries(images)) {
  for(const v of image.variants) for(const format of ['avif','webp']) {
    const file=path.join('dist',v[format]);
    assert(fs.existsSync(file),`Missing delivery variant: ${file}`);
    const meta=await sharp(file).metadata();
    assert.equal(meta.width,v.width,`Incorrect srcset width: ${file}`);
    assert(Math.abs(meta.width/meta.height-image.width/image.height)<0.005,`Aspect ratio changed: ${file}`);
    if(name==='brand-dragon.png') assert(meta.hasAlpha,'Logo transparency must survive');
  }
}
assert(images['brand-dragon.png'].variants.every(v=>v.avifBytes<25000 && v.webpBytes<35000),'Logo budget exceeded');
assert(images['cover-art.webp'].variants[1].avifBytes<140000,'Hero mobile budget exceeded');
const htmlFiles=fs.readdirSync('dist',{recursive:true}).filter(f=>f.endsWith('.html'));
for(const file of htmlFiles) {
  const html=fs.readFileSync(path.join('dist',file),'utf8');
  assert(!/fonts\.(googleapis|gstatic)\.com/.test(html),`${file}: external font dependency`);
  assert(!/<img[^>]*src="[^\"]*brand-dragon\.png"/.test(html),`${file}: oversized logo`);
  for(const match of html.matchAll(/(?:srcset)="([^"]+)"/g)) for(const item of match[1].split(',')) {
    const src=item.trim().split(' ')[0];
    assert(fs.existsSync(path.join('dist',decodeURI(src).replace(/^\//,''))),`${file}: broken srcset ${src}`);
  }
  if(/<img[^>]*class="hero-art"/.test(html)) assert(/<img[^>]*class="hero-art"[^>]*fetchpriority="high"/.test(html),`${file}: hero must load early`);
  const heroPreloads = [...html.matchAll(/<link[^>]*rel="preload"[^>]*as="image"[^>]*>/g)];
  if (/<img[^>]*class="hero-art"/.test(html)) {
    assert.equal(heroPreloads.length, 1, `${file}: preload the hero once`);
    const preload = heroPreloads[0][0];
    const source = html.match(/<source[^>]*type="image\/avif"[^>]*srcset="([^"]*cover-art[^"]*)"[^>]*sizes="([^"]+)"/);
    assert(source, `${file}: responsive hero source missing`);
    assert(preload.includes(`imagesrcset="${source[1]}"`), `${file}: preload must select the same hero variant`);
    assert(preload.includes(`imagesizes="${source[2]}"`), `${file}: preload sizes must match the hero`);
    assert(preload.includes('fetchpriority="high"'), `${file}: hero preload needs high priority`);
    assert(html.indexOf('name="viewport"') < html.indexOf(preload), `${file}: establish viewport before responsive preload`);
    const fontPreloads = [...html.matchAll(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/g)].map(match => match[0]);
    assert.equal(fontPreloads.length, html.includes('<html lang="ar"') ? 2 : 3, `${file}: preload only relevant fonts`);
    assert(fontPreloads.every(font => font.includes('fetchpriority="low"')), `${file}: fonts must not compete with the homepage image`);
  } else assert.equal(heroPreloads.length, 0, `${file}: do not fetch an unused homepage image`);
}
const sitemap=fs.readFileSync('dist/sitemap-0.xml','utf8');
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(urls.length,60);
for(const url of urls) {
  const u=new URL(url);
  assert.equal(u.origin,'https://mothersmonster.com');
  const html=fs.readFileSync(path.join('dist',decodeURI(u.pathname),'index.html'),'utf8');
  assert(html.includes(`rel="canonical" href="${url}"`),`${url}: wrong canonical`);
  assert(!html.includes('content="noindex'),`${url}: indexable sitemap URL blocked`);
}
const tr=fs.readFileSync('dist/tr/film/index.html','utf8');
for(const q of ['konusu nedir?','ne demek?','Türkçe dublaj']) assert(tr.includes(q),`Missing answer: ${q}`);
console.log(`Verified delivery budgets, ${htmlFiles.length} pages, responsive variants and 60 indexable canonical sitemap URLs.`);
