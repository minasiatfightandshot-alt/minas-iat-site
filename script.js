(() => {
  const toggle = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.drawer');
  const back = document.querySelector('.drawer-backdrop');
  const close = document.querySelector('.menu-close');
  const setOpen = (open) => {
    drawer?.classList.toggle('open', open);
    back?.classList.toggle('open', open);
    toggle?.setAttribute('aria-expanded', String(open));
    drawer?.setAttribute('aria-hidden', String(!open));
  };
  toggle?.addEventListener('click', () => setOpen(true));
  close?.addEventListener('click', () => setOpen(false));
  back?.addEventListener('click', () => setOpen(false));
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
})();

(() => {
  const form = document.getElementById('lead-form');
  if (!form) return;
  const phone = '5531997915642';
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('lead-name').value.trim();
    const leadPhone = document.getElementById('lead-phone').value.trim();
    const interest = document.getElementById('lead-interest').value;
    const message = document.getElementById('lead-message').value.trim() || 'Gostaria de receber mais informações.';
    const text = 'Olá, Fernando! Vim pelo site Minas IAT Fight & Shot.\n\n' +
      'Nome: ' + name + '\nMeu WhatsApp: ' + leadPhone +
      '\nInteresse: ' + interest + '\nMensagem: ' + message;
    window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });
})();

(() => {
  const panels = [
    {key:'linade', file:'assets/Linade_2026_Guia_Tecnico_do_Instrutor.pdf'},
    {key:'w2c', file:'assets/W2C_Games_Guia_de_Aplicacao_para_Instrutores.pdf'}
  ];
  panels.forEach(({key,file}) => {
    const panel = document.querySelector('.doc-panel[data-doc="'+key+'"]');
    if (!panel) return;
    const viewer = panel.querySelector('.doc-viewer');
    const native = document.createElement('iframe');
    native.className='pdf-fallback';
    native.src=file+'#toolbar=1&navpanes=0&view=FitH';
    native.title=key==='linade'?'Guia Técnico do Instrutor LINADE 2026':'Guia de Aplicação para Instrutores W2C GAMES 2026';
    viewer.innerHTML='';
    viewer.appendChild(native);
  });
  document.querySelectorAll('.doc-switch').forEach(btn => btn.addEventListener('click', () => {
    const target = btn.dataset.doc;
    document.querySelectorAll('.doc-panel').forEach(p => p.style.display = p.dataset.doc===target ? 'block' : 'none');
    document.querySelectorAll('.doc-switch').forEach(b => b.classList.toggle('is-active', b===btn));
  }));
  const first = document.querySelector('.doc-panel[data-doc="linade"]');
  if (first) document.querySelectorAll('.doc-panel').forEach(p => p.style.display = p===first ? 'block' : 'none');
})();
