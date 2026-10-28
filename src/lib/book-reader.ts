const PLACE_KEY='mm.reading-place.v1';
type Place={language:string;chapter:number;expires:number};
export function parsePlace(raw:string|null,now=Date.now()):Place|null{
  try{const place=JSON.parse(raw||'null');return ['en','fr','ar','tr'].includes(place?.language)&&Number.isInteger(place.chapter)&&place.chapter>=1&&place.chapter<=26&&Number.isFinite(place.expires)&&place.expires>now&&place.expires<=now+180*86400000?place:null;}catch{return null;}
}
export function initBookReader(root:HTMLElement){
  const remember=root.querySelector<HTMLInputElement>('[data-remember-reading]')!;
  const resume=root.querySelector<HTMLAnchorElement>('[data-resume-reading]')!;
  const language=root.dataset.language!,chapter=Number(root.dataset.chapter),base=root.dataset.readingBase!;
  let place:Place|null=null;
  try{const raw=localStorage.getItem(PLACE_KEY);place=parsePlace(raw);if(raw&&!place)localStorage.removeItem(PLACE_KEY);}catch{/* Reading works without storage. */}
  remember.checked=!!place;
  const showResume=()=>{
    // Only use the validated number; never navigate to a stored free-text URL.
    if(place){resume.href=base+place.chapter+'/';resume.hidden=false;}else resume.hidden=true;
  };
  const save=()=>{
    try{
      if(!remember.checked){localStorage.removeItem(PLACE_KEY);place=null;}
      else {place={language,chapter:chapter>=1&&chapter<=26?chapter:place?.chapter||1,expires:Date.now()+180*86400000};localStorage.setItem(PLACE_KEY,JSON.stringify(place));}
    }catch{/* No cookies or network fallback for blocked storage. */}
    showResume();
  };
  remember.addEventListener('change',save);if(remember.checked)save();else showResume();
  const text=root.querySelector<HTMLElement>('[data-chapter-text]');
  if(!text)return;
  const progress=root.querySelector<HTMLProgressElement>('[data-reader-progress]')!;
  const buttons=Array.from(root.querySelectorAll<HTMLButtonElement>('[data-reader-size]'));
  let size=0,pending=false;
  buttons.forEach(button=>button.addEventListener('click',()=>{
    size=Math.max(-1,Math.min(3,size+(button.dataset.readerSize==='larger'?1:-1)));
    text.style.setProperty('--reader-scale',String(1+size*.12));
    buttons.forEach(b=>b.disabled=b.dataset.readerSize==='larger'?size===3:size===-1);
  }));
  const reached=new Set<number>();
  const update=()=>{
    const rect=text.getBoundingClientRect();
    const percent=Math.max(0,Math.min(100,(innerHeight-rect.top)/rect.height*100));
    progress.value=percent;pending=false;
    if(document.visibilityState!=='visible'||scrollY<=0)return;
    for(const milestone of [25,50,75,100])if(percent>=milestone&&!reached.has(milestone)){
      reached.add(milestone);
      document.dispatchEvent(new CustomEvent('mm:chapter-scroll',{detail:{chapter,percent:milestone}}));
    }
  };
  addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});
  addEventListener('resize',update);update();
}
