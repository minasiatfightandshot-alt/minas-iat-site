document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'});}}));

/* ===== Navegação da apresentação de capacitação ===== */
(() => {
  const root = document.querySelector('.doc-carousel');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.doc-slide'));
  const dots = Array.from(document.querySelectorAll('.doc-dot'));
  const prev = root.querySelector('.doc-prev');
  const next = root.querySelector('.doc-next');
  let current = 0;
  let startX = null;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
      dot.setAttribute('aria-selected', String(i === current));
    });
  }

  prev?.addEventListener('click', () => show(current - 1));
  next?.addEventListener('click', () => show(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));

  root.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].clientX;
  }, {passive:true});

  root.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  }, {passive:true});

  show(0);
})();
