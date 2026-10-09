import fs from 'node:fs';
import assert from 'node:assert/strict';

const route='blog/dark-fantasy-gothic-fantasy/';
const html=fs.readFileSync(`dist/${route}index.html`,'utf8');
const nodes=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(match=>{
  const value=JSON.parse(match[1]);
  return value['@graph'] || [value];
});
const article=nodes.find(node=>node['@type']==='BlogPosting');
assert(article,'Guide must have article metadata');
assert.equal(article.mainEntityOfPage,`https://mothersmonster.com/${route}`);
assert.equal(article.datePublished,'2026-09-26T00:00:00.000Z','Keep the original publication date');
assert.equal(article.dateModified,'2026-10-09T00:00:00.000Z');
assert(html.includes('Updated <time'),'Show the real update date to readers');
assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);
for(const heading of ['What is dark fantasy?','What is gothic fantasy?','Does gothic fantasy always include romance?','Can a book be dark fantasy without a castle?']) {
  assert(html.includes(heading),`Missing reader question: ${heading}`);
}
for(const link of ['/story/','/read/','/characters/ember/','/blog/monstrous-motherhood/','/blog/she-gave-birth-to-a-dragon/']) {
  assert(html.includes(`href="${link}"`),`Missing useful reading link: ${link}`);
}
assert(html.includes('not a scene from our novel'),'Keep invented examples separate from book scenes');
assert(html.includes('https://www.britishlibrary.cn/en/articles/gothic-motifs/'),'Keep the literary source');
console.log('Verified genre guide, original date, visible update, literary source and book discovery links.');
