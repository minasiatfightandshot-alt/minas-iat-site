document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'});}}));

(() => {
  const docs = {
    linade: { count: 20, file: 'assets/Linade_2026_Guia_Tecnico_do_Instrutor.pdf' },
    w2c: { count: 10, file: 'assets/W2C_Games_Guia_de_Aplicacao_para_Instrutores.pdf' }
  };
  const state = { linade:{page:1,pdf:null}, w2c:{page:1,pdf:null} };
  let activeDoc='linade';

  async function setup(key){
    const track=document.getElementById(key+'-track');
    const counter=document.getElementById(key+'-counter');
    if(!track||!counter) return;
    track.innerHTML='<div class="pdf-canvas-wrap"><canvas class="pdf-page-canvas"></canvas></div>';
    try{
      if(!window.pdfjsLib){ throw new Error('PDF.js não carregado'); }
      window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      state[key].pdf=await window.pdfjsLib.getDocument(docs[key].file).promise;
      docs[key].count=state[key].pdf.numPages;
      await render(key);
    }catch(err){
      track.innerHTML='<div style="padding:40px;text-align:center;color:#555;background:#fff;width:100%;">Não foi possível carregar este guia. Use “Abrir PDF original”.</div>';
      counter.textContent='PDF';
      console.error(err);
    }
  }

  async function render(key){
    const s=state[key], track=document.getElementById(key+'-track'), counter=document.getElementById(key+'-counter');
    if(!s.pdf) return;
    const page=await s.pdf.getPage(s.page);
    const wrap=track.querySelector('.pdf-canvas-wrap');
    const canvas=wrap.querySelector('canvas');
    const base=page.getViewport({scale:1});
    const scale=Math.max(1, Math.min(2.2, wrap.clientWidth/base.width));
    const viewport=page.getViewport({scale});
    const ratio=window.devicePixelRatio||1;
    canvas.width=Math.floor(viewport.width*ratio);
    canvas.height=Math.floor(viewport.height*ratio);
    canvas.style.width=viewport.width+'px';
    canvas.style.height=viewport.height+'px';
    wrap.style.aspectRatio=base.width+'/'+base.height;
    const ctx=canvas.getContext('2d');
    await page.render({canvasContext:ctx,viewport,transform:ratio!==1?[ratio,0,0,ratio,0,0]:null}).promise;
    counter.textContent=s.page+' / '+s.pdf.numPages;
  }

  async function change(key,delta){
    const s=state[key];
    if(!s.pdf) return;
    s.page=Math.max(1,Math.min(s.pdf.numPages,s.page+delta));
    await render(key);
  }

  document.querySelectorAll('.slide-prev').forEach(b=>b.addEventListener('click',()=>change(b.dataset.target,-1)));
  document.querySelectorAll('.slide-next').forEach(b=>b.addEventListener('click',()=>change(b.dataset.target,1)));

  document.querySelectorAll('.doc-switch').forEach(b=>b.addEventListener('click',()=>{
    activeDoc=b.dataset.doc;
    document.querySelectorAll('.doc-panel').forEach(p=>p.classList.toggle('is-active',p.dataset.doc===activeDoc));
    document.querySelectorAll('.doc-switch').forEach(x=>x.classList.toggle('is-active',x.dataset.doc===activeDoc));
    setTimeout(()=>render(activeDoc),50);
  }));

  document.querySelectorAll('.doc-viewer').forEach(viewer=>{
    let startX=null;
    viewer.addEventListener('touchstart',e=>startX=e.changedTouches[0].clientX,{passive:true});
    viewer.addEventListener('touchend',e=>{
      if(startX===null) return;
      const dx=e.changedTouches[0].clientX-startX;
      if(Math.abs(dx)>45) change(activeDoc,dx<0?1:-1);
      startX=null;
    },{passive:true});
  });

  window.addEventListener('resize',()=>render(activeDoc));
  setup('linade'); setup('w2c');
})();