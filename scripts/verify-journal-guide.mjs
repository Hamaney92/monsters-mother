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
const introduction=fs.readFileSync('dist/blog/she-gave-birth-to-a-dragon/index.html','utf8');
const introductionBody=introduction.match(/<div class="prose"[^>]*>([\s\S]*?)<nav class="reading-path"/);
assert(introductionBody,'Find the article body before the existing navigation');
for(const link of ['/movie/','/story/','/characters/elara/','/characters/ember/','/characters/nessa/','/read/']) {
  assert(introductionBody[1].includes(`href="${link}"`),`Introduction must link its in-text reference: ${link}`);
}
const introductionArticle=[...introduction.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
  .map(match=>JSON.parse(match[1])).find(node=>node['@type']==='BlogPosting');
assert.equal(introductionArticle?.datePublished,'2026-09-27T12:00:00.000Z');
assert.equal(introductionArticle?.dateModified,'2026-10-09T00:00:00.000Z');
assert(introduction.includes('Updated <time'),'Introduction must disclose its update');
assert(introductionBody[1].includes('free in English'),'Introduction must state the chapter language');
console.log('Verified genre guide and book introduction, original dates, visible updates, sources and contextual reading links.');
