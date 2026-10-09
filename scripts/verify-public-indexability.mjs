import assert from 'node:assert/strict';

// Read-only check of the deployed site's sitemap and indexable pages.
// This does not test Google's index or impersonate Googlebot.
const origin='https://mothersmonster.com';
async function get(url){
  const response=await fetch(url,{signal:AbortSignal.timeout(20000),headers:{'User-Agent':'MothersMonster-IndexabilityCheck/1.0'}});
  return {response,text:await response.text()};
}
const robots=await get(`${origin}/robots.txt`);
assert.equal(robots.response.status,200,'robots.txt must be accessible');
assert(!/^Disallow:\s*\/\s*$/mi.test(robots.text),'Site-wide robots block');
assert(robots.text.includes(`${origin}/sitemap-index.xml`),'Missing sitemap in robots');
const index=await get(`${origin}/sitemap-index.xml`);
assert.equal(index.response.status,200,'Sitemap index must be accessible');
const locations=text=>[...text.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1].replaceAll('&amp;','&'));
const maps=locations(index.text);
assert(maps.length>0,'Empty sitemap index');
const pages=[];
for(const map of maps){
  assert.equal(new URL(map).origin,origin,'Unexpected sitemap host');
  const sitemap=await get(map);
  assert.equal(sitemap.response.status,200,'Sitemap must be accessible');
  pages.push(...locations(sitemap.text));
}
assert(pages.length>0,'Empty sitemap');
assert.equal(new Set(pages).size,pages.length,'Duplicate sitemap URLs');
const results=[];
let cursor=0;
async function worker(){
  while(cursor<pages.length){
    const url=pages[cursor++];
    assert.equal(new URL(url).origin,origin,'Unexpected page host');
    try{
      const {response,text}=await get(url);
      const canonical=text.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
      const metaRobots=[...text.matchAll(/<meta\b[^>]*name="robots"[^>]*content="([^"]+)"/gi)].map(match=>match[1]).join(',');
      const headerRobots=response.headers.get('x-robots-tag')||'';
      const problems=[];
      if(response.status!==200)problems.push(`HTTP ${response.status}`);
      if(response.url!==url)problems.push(`Redirect to ${response.url}`);
      if(canonical!==url)problems.push(`Canonical ${canonical||'missing'}`);
      if(/\b(noindex|none)\b/i.test(`${metaRobots},${headerRobots}`))problems.push('Indexing forbidden');
      if((text.match(/<h1(?:\s|>)/gi)||[]).length!==1)problems.push('Expected one H1');
      results.push({url,status:response.status,canonical,problems});
    }catch(error){results.push({url,problems:[error.message]});}
  }
}
await Promise.all([worker(),worker(),worker()]);
results.sort((a,b)=>a.url.localeCompare(b.url));
console.log(JSON.stringify({checkedAt:new Date().toISOString(),scope:'Public HTTP accessibility and indexability, not Google indexing',pages:results.length,failures:results.filter(result=>result.problems.length),results},null,2));
if(results.some(result=>result.problems.length))process.exitCode=1;
