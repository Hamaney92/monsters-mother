import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parsePlace,initBookReader} from '../src/lib/book-reader.ts';
const now=1_000_000;
test('reading place accepts a valid chapter and rejects expired, malformed or forged destinations',()=>{
 const place={language:'tr',chapter:26,expires:now+86400000};
 assert.deepEqual(parsePlace(JSON.stringify(place),now),place);
 for(const value of ['{',null,JSON.stringify({...place,chapter:27}),JSON.stringify({...place,chapter:0}),JSON.stringify({...place,chapter:'1/../../'}),JSON.stringify({...place,language:'javascript:'}),JSON.stringify({...place,expires:now}),JSON.stringify({...place,expires:now+181*86400000})])assert.equal(parsePlace(value,now),null);
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
