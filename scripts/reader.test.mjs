import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parsePlace,initBookReader} from '../src/lib/book-reader.ts';
import {verifyReaderSeo} from './lib/reader-seo.mjs';
const now=1_000_000;
test('reading place accepts a valid chapter and rejects expired, malformed or forged destinations',()=>{
 const place={language:'tr',chapter:26,expires:now+86400000};
 assert.deepEqual(parsePlace(JSON.stringify(place),now),place);
 for(const value of ['{',null,JSON.stringify({...place,chapter:27}),JSON.stringify({...place,chapter:0}),JSON.stringify({...place,chapter:'1/../../'}),JSON.stringify({...place,language:'javascript:'}),JSON.stringify({...place,expires:now}),JSON.stringify({...place,expires:now+181*86400000})])assert.equal(parsePlace(value,now),null);
});

// Independent HTML fixture: tests run before the build in CI and need no dist.
const seoBook={language:'fr',title:'A Monster’s Mother',author:'YH',chapters:[{number:7,title:'The Dragon & the Mother'}]};
const chapterSchema={
 '@context':'https://schema.org','@type':'Chapter',name:'The Dragon & the Mother',inLanguage:'fr',
 author:{'@type':'Person',name:'YH'},isAccessibleForFree:true,position:7,
 isPartOf:{'@type':'Book',name:'A Monster’s Mother'}
};
const seoHtml=`<!doctype html><html lang="fr"><head>
 <link rel="canonical" href="https://mothersmonster.com/fr/read/book/7/">
 <meta name="robots" content="index, follow">
 <link rel="alternate" hreflang="en" href="https://mothersmonster.com/read/book/7/">
 <link rel="alternate" hreflang="tr" href="https://mothersmonster.com/tr/read/book/7/">
 <link rel="alternate" hreflang="fr" href="https://mothersmonster.com/fr/read/book/7/">
 <link rel="alternate" hreflang="ar" href="https://mothersmonster.com/ar/read/book/7/">
 <link rel="alternate" hreflang="x-default" href="https://mothersmonster.com/read/book/7/">
 <link rel="alternate" type="application/rss+xml" href="/rss.xml">
 <script type="application/ld+json">${JSON.stringify(chapterSchema)}</script>
 </head><body></body></html>`;
const withSchema=schema=>seoHtml.replace(JSON.stringify(chapterSchema),JSON.stringify(schema));
const contentsSchema={...chapterSchema,'@type':'Book',name:'A Monster’s Mother'};
delete contentsSchema.position;delete contentsSchema.isPartOf;
const contentsHtml=withSchema(contentsSchema).replaceAll('/book/7/','/book/');

test('reader SEO accepts chapter and contents metadata with equivalent HTML formatting',()=>{
 assert.doesNotThrow(()=>verifyReaderSeo(seoHtml,seoBook,7));
 assert.doesNotThrow(()=>verifyReaderSeo(contentsHtml,seoBook));
 const formatted=seoHtml
  .replace('<link rel="canonical" href="https://mothersmonster.com/fr/read/book/7/">',"<LINK\n href = 'https:&#47;&#47;mothersmonster.com/fr/read/book/7/' REL = 'CANONICAL' />")
  .replace('<meta name="robots" content="index, follow">',"<META CONTENT = ' INDEX , FOLLOW , max-image-preview:large ' NAME = 'ROBOTS' />")
  .replace('rel="alternate" hreflang="tr" href="https://mothersmonster.com/tr/read/book/7/"',"href='https://mothersmonster.com/tr/read/book/7/'\n hreflang='tr' rel='alternate'")
  .replace('<script type="application/ld+json">',"<script data-test='a > b' type = 'application/ld+json'>");
 assert.doesNotThrow(()=>verifyReaderSeo(formatted,seoBook,7));
});

test('reader SEO rejects missing, duplicate and incorrect canonical destinations',()=>{
 const canonical='<link rel="canonical" href="https://mothersmonster.com/fr/read/book/7/">';
 for(const html of [
  seoHtml.replace(canonical,''),seoHtml.replace(canonical,canonical+canonical),
  seoHtml.replace(canonical,canonical.replace('/fr/read/','/read/')),
  seoHtml.replace(canonical,canonical.replace('/7/','/17/')),
  seoHtml.replace(canonical,canonical.replace('.com/','.com.evil.test/')),
  seoHtml.replace(canonical,canonical.replace('/7/','/7/?preview=1'))
 ])assert.throws(()=>verifyReaderSeo(html,seoBook,7),/canonical/);
 assert.throws(()=>verifyReaderSeo(contentsHtml.replace('rel="canonical"','rel="not-canonical"'),seoBook),/canonical/);
});

test('reader SEO rejects restrictive or missing robots even when an index token remains',()=>{
 for(const content of ['noindex, follow','index, follow, noindex','index, nofollow','all','none']) {
  assert.throws(()=>verifyReaderSeo(seoHtml.replace('index, follow',content),seoBook,7),/robots/);
 }
 const robots='<meta name="robots" content="index, follow">';
 for(const replacement of ['',robots+robots,robots+'<meta content="noindex" name="googlebot">']) {
  assert.throws(()=>verifyReaderSeo(seoHtml.replace(robots,replacement),seoBook,7),/robots/);
 }
});

test('reader SEO requires exactly the same chapter in all five alternates, including contents',()=>{
 const turkish='<link rel="alternate" hreflang="tr" href="https://mothersmonster.com/tr/read/book/7/">';
 for(const html of [
  seoHtml.replace(turkish,''),seoHtml.replace(turkish,turkish+turkish),
  seoHtml.replace(turkish,turkish.replace('/7/','/8/')),
  seoHtml.replace(turkish,turkish.replace('hreflang="tr"','hreflang="fr"')),
  seoHtml.replace(turkish,turkish.replace('hreflang="tr"','hreflang="de"')),
  seoHtml.replace('hreflang="x-default" href="https://mothersmonster.com/read/','hreflang="x-default" href="https://mothersmonster.com/fr/read/')
 ])assert.throws(()=>verifyReaderSeo(html,seoBook,7),/alternate/);
 assert.throws(()=>verifyReaderSeo(contentsHtml.replace(turkish.replace('/7/','/'),''),seoBook),/alternate/);
 assert.throws(()=>verifyReaderSeo(contentsHtml.replace('/tr/read/book/','/tr/read/book/1/'),seoBook),/alternate/);
});

test('reader SEO binds structured data to the edition and chapter source',()=>{
 for(const changed of [
  {'@context':'http://wrong.test'},{'@type':'Book'},{name:'Wrong title'},{inLanguage:'en'},
  {author:{'@type':'Organization',name:'YH'}},{author:{'@type':'Person',name:'Other author'}},
  {isAccessibleForFree:false},{isAccessibleForFree:'true'},{position:8},{position:'7'},
  {isPartOf:{'@type':'Chapter',name:'A Monster’s Mother'}},
  {isPartOf:{'@type':'Book',name:'Another book'}}
 ])assert.throws(()=>verifyReaderSeo(withSchema({...chapterSchema,...changed}),seoBook,7),/schema/);
 const schemaTag=`<script type="application/ld+json">${JSON.stringify(chapterSchema)}</script>`;
 for(const html of [seoHtml.replace(schemaTag,''),seoHtml.replace(schemaTag,schemaTag+schemaTag)]) {
  assert.throws(()=>verifyReaderSeo(html,seoBook,7),/JSON-LD/);
 }
 assert.throws(()=>verifyReaderSeo(withSchema({...chapterSchema,position:undefined}),seoBook,7),/schema chapter number/);
 assert.throws(()=>verifyReaderSeo(seoHtml.replace(JSON.stringify(chapterSchema),'{broken'),seoBook,7),SyntaxError);
 assert.throws(()=>verifyReaderSeo(contentsHtml.replace('"name":"A Monster’s Mother"','"name":"Wrong book"'),seoBook),/schema title/);
 assert.throws(()=>verifyReaderSeo(contentsHtml.replace('"@type":"Book"','"@type":"Chapter"'),seoBook),/schema type/);
});

test('reader SEO does not count metadata spoofed in comments, scripts or the body',()=>{
 const alternate='<link rel="alternate" hreflang="tr" href="https://mothersmonster.com/tr/read/book/7/">';
 for(const hidden of [`<!-- ${alternate} -->`,`<script>const example=${JSON.stringify(alternate)};</script>`]) {
  assert.throws(()=>verifyReaderSeo(seoHtml.replace(alternate,hidden),seoBook,7),/alternate/);
 }
 assert.throws(()=>verifyReaderSeo(seoHtml.replace(alternate,'').replace('</body>',alternate+'</body>'),seoBook,7),/alternate/);
 assert.doesNotThrow(()=>verifyReaderSeo(seoHtml.replace('</head>','<!-- <meta name="robots" content="noindex"> --></head>'),seoBook,7));
});
test('remembering a chapter is opt-in, can be revoked and discards expired storage',()=>{
 const original=globalThis.localStorage;
 const saved=new Map();
 globalThis.localStorage={getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,value),removeItem:key=>saved.delete(key)};
 const fixture=()=>{
  const remember={checked:false,listeners:{},addEventListener(name,fn){this.listeners[name]=fn;}};
  const resume={hidden:true,href:''};
  const root={dataset:{language:'tr',chapter:'19',readingBase:'/tr/read/book/'},querySelector(selector){return selector==='[data-remember-reading]'?remember:selector==='[data-resume-reading]'?resume:null;}};
  initBookReader(root);return {remember,resume};
 };
 try{
  const a=fixture();assert.equal(saved.size,0);assert.equal(a.resume.hidden,true);
  a.remember.checked=true;a.remember.listeners.change();
  assert.equal(JSON.parse(saved.get('mm.reading-place.v1')).chapter,19);assert.equal(a.resume.href,'/tr/read/book/19/');
  a.remember.checked=false;a.remember.listeners.change();assert.equal(saved.size,0);assert.equal(a.resume.hidden,true);
  saved.set('mm.reading-place.v1',JSON.stringify({language:'tr',chapter:19,expires:Date.now()-1}));
  assert.equal(fixture().remember.checked,false);assert.equal(saved.size,0);
 }finally{if(original===undefined)delete globalThis.localStorage;else globalThis.localStorage=original;}
});
