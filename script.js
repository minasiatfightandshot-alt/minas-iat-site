document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'});}}));

(() => {
  const docs = {
    linade: { count: 20, folder: 'linade-slides' },
    w2c: { count: 10, folder: 'w2c-slides' }
  };
  const base = 'assets/';
  const tracks = {};
  let activeDoc = 'linade';
  const indexes = { linade: 0, w2c: 0 };

  for (const [key, meta] of Object.entries(docs)) {
    const track = document.getElementById(key + '-track');
    const counter = document.getElementById(key + '-counter');
    if (!track || !counter) continue;
    tracks[key] = {track, counter, meta};
    for (let i=1;i<=meta.count;i++) {
      const img=document.createElement('img');
      img.className='doc-slide-page';
      img.alt = (key==='linade'?'LINADE 2026':'W2C Games 2026') + ' — página ' + i;
      img.loading = i <= 2 ? 'eager' : 'lazy';
      img.draggable = false;
      img.src = base + meta.folder + '/page-' + String(i).padStart(2,'0') + '.jpg';
      track.appendChild(img);
    }
    render(key);
    let startX=null;
    track.parentElement.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX},{passive:true});
    track.parentElement.addEventListener('touchend',e=>{
      if(startX===null || activeDoc!==key) return;
      const dx=e.changedTouches[0].clientX-startX;
      if(Math.abs(dx)>45) change(key, dx<0?1:-1);
      startX=null;
    },{passive:true});
  }

  function render(key) {
    const t=tracks[key]; if(!t) return;
    const i=indexes[key];
    t.track.style.transform='translateX(-'+(i*100)+'%)';
    t.counter.textContent=(i+1)+' / '+t.meta.count;
  }
  function change(key, delta) {
    indexes[key]=(indexes[key]+delta+tracks[key].meta.count)%tracks[key].meta.count;
    render(key);
  }

  document.querySelectorAll('.slide-prev').forEach(b=>b.addEventListener('click',()=>change(b.dataset.target,-1)));
  document.querySelectorAll('.slide-next').forEach(b=>b.addEventListener('click',()=>change(b.dataset.target,1)));

  function setDoc(key) {
    activeDoc=key;
    document.querySelectorAll('.doc-panel').forEach(p=>p.classList.toggle('is-active',p.dataset.doc===key));
    document.querySelectorAll('.doc-switch').forEach(b=>b.classList.toggle('is-active',b.dataset.doc===key));
  }
  document.querySelectorAll('.doc-switch').forEach(b=>b.addEventListener('click',()=>setDoc(b.dataset.doc)));
  setDoc('linade');
})();
