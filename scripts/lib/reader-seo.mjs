import assert from 'node:assert/strict';

const languages = ['en', 'tr', 'fr', 'ar'];
const route = (language, number) => `${language === 'en' ? '' : `${language}/`}read/book/${number ? `${number}/` : ''}`;
const url = (language, number) => `https://mothersmonster.com/${route(language, number)}`;
const decode = value => value.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (entity, code) => {
  if (code.startsWith('#')) return String.fromCodePoint(code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1)));
  return {amp: '&', quot: '"', apos: "'", lt: '<', gt: '>'}[code.toLowerCase()];
});

function attributes(source) {
  const result = new Map();
  for (const match of source.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    const name = match[1].toLowerCase();
    assert(!result.has(name), `Duplicate metadata attribute: ${name}`);
    result.set(name, decode(match[2] ?? match[3] ?? match[4] ?? ''));
  }
  return result;
}

// These are generated HTML heads, not arbitrary documents. Keep comments and
// raw script contents out of the link/meta scan; quoted > characters are valid.
function metadata(html) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head\s*>/i)?.[1];
  assert(head !== undefined, 'Missing HTML head');
  const links = [], metas = [], schemas = [];
  const tags = /<!--[\s\S]*?-->|<script\b((?:"[^"]*"|'[^']*'|[^'">])*)>([\s\S]*?)<\/script\s*>|<(link|meta)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi;
  for (const match of head.matchAll(tags)) {
    if (match[0].startsWith('<!--')) continue;
    const attrs = attributes(match[1] ?? match[4]);
    if (match[3]?.toLowerCase() === 'link') links.push(attrs);
    else if (match[3]?.toLowerCase() === 'meta') metas.push(attrs);
    else if (attrs.get('type')?.trim().toLowerCase() === 'application/ld+json') schemas.push(JSON.parse(match[2]));
  }
  return {links, metas, schemas};
}

export function verifyReaderSeo(html, book, chapterNumber = 0) {
  const label = `${book.language} ${chapterNumber || 'contents'}`;
  assert(languages.includes(book.language), `${label}: supported language`);
  const chapter = chapterNumber ? book.chapters.find(item => item.number === chapterNumber) : undefined;
  assert(!chapterNumber || chapter, `${label}: chapter exists in source data`);
  const {links, metas, schemas} = metadata(html);
  const hasRel = (link, rel) => (link.get('rel') || '').toLowerCase().split(/\s+/).includes(rel);

  const canonicals = links.filter(link => hasRel(link, 'canonical'));
  assert.equal(canonicals.length, 1, `${label}: exactly one canonical`);
  assert.equal(canonicals[0].get('href'), url(book.language, chapterNumber), `${label}: canonical URL`);

  const robots = metas.filter(meta => meta.get('name')?.trim().toLowerCase() === 'robots');
  assert.equal(robots.length, 1, `${label}: exactly one robots directive`);
  const directives = meta => (meta.get('content') || '').toLowerCase().split(/[\s,]+/).filter(Boolean);
  for (const directive of ['index', 'follow']) assert(directives(robots[0]).includes(directive), `${label}: robots must declare ${directive}`);
  for (const meta of metas.filter(meta => /^(robots|googlebot|googlebot-news|bingbot)$/i.test(meta.get('name')?.trim() || ''))) {
    assert(!directives(meta).some(value => ['noindex', 'nofollow', 'none'].includes(value)), `${label}: restrictive robots directive`);
  }

  const alternates = links.filter(link => hasRel(link, 'alternate') && link.has('hreflang'));
  const expected = new Map([...languages.map(language => [language, url(language, chapterNumber)]), ['x-default', url('en', chapterNumber)]]);
  assert.equal(alternates.length, expected.size, `${label}: exactly five language alternates`);
  const seen = new Set();
  for (const alternate of alternates) {
    const language = alternate.get('hreflang');
    assert(expected.has(language), `${label}: unexpected alternate language ${language}`);
    assert(!seen.has(language), `${label}: duplicate alternate ${language}`);
    seen.add(language);
    assert.equal(alternate.get('href'), expected.get(language), `${label}: ${language} alternate URL`);
  }

  assert.equal(schemas.length, 1, `${label}: exactly one reader JSON-LD block`);
  const schema = schemas[0];
  assert.equal(schema?.['@context'], 'https://schema.org', `${label}: schema context`);
  assert.equal(schema['@type'], chapter ? 'Chapter' : 'Book', `${label}: schema type`);
  assert.equal(schema.name, chapter ? chapter.title : book.title, `${label}: schema title`);
  assert.equal(schema.inLanguage, book.language, `${label}: schema language`);
  assert.equal(schema.author?.['@type'], 'Person', `${label}: schema author type`);
  assert.equal(schema.author?.name, book.author, `${label}: schema author`);
  assert.equal(schema.isAccessibleForFree, true, `${label}: schema free access`);
  if (chapter) {
    assert.equal(schema.position, chapter.number, `${label}: schema chapter number`);
    assert.equal(schema.isPartOf?.['@type'], 'Book', `${label}: schema parent type`);
    assert.equal(schema.isPartOf?.name, book.title, `${label}: schema parent title`);
  } else {
    assert.equal(schema.position, undefined, `${label}: contents has no chapter number`);
  }
}
