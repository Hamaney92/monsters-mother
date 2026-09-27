import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('dist');
const files=fs.readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.html'));
const titles=new Set();let links=0;
for(const file of files){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1];assert(title,`${file}: missing title`);assert(!titles.has(title),`${file}: duplicate title`);titles.add(title);
 assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,`${file}: exactly one H1 required`);
 const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1];assert(canonical,`${file}: missing canonical`);
 const canonicalURL=new URL(canonical);const suffix=file==='index.html'?'':file.replace(/index\.html$/,'').replaceAll('\\','/');
 let base=canonicalURL.pathname;if(suffix)base=base.slice(0,-suffix.length);
 if(file==='404.html')base=canonicalURL.pathname.replace(/404\/?$/,'');
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const target=m[1].replaceAll('&amp;','&');if(!target.startsWith('/') || target.startsWith('//'))continue;
  assert(target.startsWith(base),`${file}: link escapes base ${target} (${base})`);
  const relative=decodeURIComponent(target.slice(base.length).split(/[?#]/)[0]);const p=path.join(root,relative);
  assert(fs.existsSync(p)||fs.existsSync(path.join(p,'index.html')),`${file}: broken local URL ${target}`);links++;
 }
 for(const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs))JSON.parse(m[1]);
 for(const field of ['og:title','og:description','og:url','og:image','twitter:card'])assert(html.includes(`="${field}"`),`${file}: missing ${field}`);
 assert(html.includes('name="description"'),`${file}: missing description`);
}
for(const file of ['rss.xml','robots.txt','sitemap-index.xml','sitemap-0.xml'])assert(fs.existsSync(path.join(root,file)),`Missing ${file}`);
const sitemap=fs.readFileSync(path.join(root,'sitemap-0.xml'),'utf8');
assert(!sitemap.includes('/read/'),'Reading placeholder must stay out of sitemap');
assert(!sitemap.includes('/404'),'404 must stay out of sitemap');
console.log(`Verified ${files.length} pages, ${links} local links/assets, unique titles, metadata, JSON-LD and feeds.`);
