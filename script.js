(function(){
  'use strict';

  /* Ano do rodapé */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* Header: sombra ao rolar */
  var header = document.getElementById('header');
  function onScroll(){ header.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* Menu mobile */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function closeMenu(){
    menu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded','false');
  }
  burger.addEventListener('click', function(){
    var open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeMenu(); });

  /* Rolagem suave (reforço para navegadores sem scroll-behavior) */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if(id.length < 2) return;
      var target = document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 76;
      window.scrollTo({top: top, behavior: 'smooth'});
      history.replaceState(null, '', id);
    });
  });

  /* Animações de entrada */
  var items = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, {threshold:.15, rootMargin:'0px 0px -40px 0px'});
    items.forEach(function(el){ io.observe(el); });
  } else {
    items.forEach(function(el){ el.classList.add('in'); });
  }

  /* Imagens: tenta o arquivo em img/; se não existir e houver data-fallback (URL), usa o fallback. */
  document.querySelectorAll('img[data-fallback], [data-img] img').forEach(function(img){
    var box = img.closest('[data-img]');
    var tried = false;
    function ok(){ img.style.display = ''; if(box) box.classList.add('has-img'); }
    function fail(){
      var fb = img.getAttribute('data-fallback');
      if(fb && !tried){ tried = true; img.src = fb; return; }
      img.style.display = 'none';
      if(box) box.classList.remove('has-img');
    }
    img.addEventListener('load', ok);
    img.addEventListener('error', fail);
    if(img.complete){ img.naturalWidth > 0 ? ok() : fail(); }
  });
})();
