(function(){
  var viewer=document.getElementById('artViewer');
  if(!viewer) return;
  var captions=[
    'CE Entity 1 \u2014 Faceted blue chrome bust, three-quarter view',
    'CE Entity 2 \u2014 Faceted blue chrome profile holding a diamond frame',
    'CE Entity 3 \u2014 Blue chrome face in a crystal diamond frame, dark background',
    'CE Entity 4 \u2014 Blue chrome face with a crystal pentagon frame',
    'CE Entity 5 \u2014 Blue chrome face, close-up, in a dark diamond frame',
    'CE Entity 6 \u2014 Blue chrome face, close-up, light background',
    'CE Entity 7 \u2014 Blue chrome face with a crystal shard frame',
    'CE Entity 8 \u2014 Blue chrome face behind a crystal diamond',
    'CE Entity 9 \u2014 Blue chrome profile inside a diamond frame, crystal shards',
    'CE Entity 10 \u2014 Blue chrome face in a crystal diamond frame',
    'CE Entity 12 \u2014 Two blue chrome entities, kissing, diamond frame',
    'CE Entity 13 \u2014 Blue chrome face, diamond frame, dark background',
    'CE Entity 14 \u2014 Blue chrome profile with a crystal shard',
    'CE Entity 15 \u2014 Blue chrome face, crystal diamond frame, dark background',
    'CE Entity 16 \u2014 Blue chrome face, double diamond frame',
    'CE Entity 17 \u2014 Blue chrome face in a glowing rectangular frame',
    'CE Entity 20 \u2014 Blue chrome face, V frame with cyan dots',
    'CE Entity 21 \u2014 Blue chrome face, faceted diamond frame',
    'CE Entity 22 \u2014 Blue chrome face, close-up, light blue frame',
    'CE Entity 23 \u2014 Two blue chrome profiles facing each other, crystal diamond frame',
    'CE Entity 25 \u2014 Blue chrome face in a black diamond frame',
    'CE Entity 26 \u2014 Blue chrome face in a faceted shield frame',
    'CE Entity 27 \u2014 Blue chrome face, close-up, crystal point frame',
    'CE Entity 28 \u2014 Blue chrome face in a crystal diamond frame, dark background',
    'CE Entity 30 \u2014 Blue chrome face, close-up, fine diamond outline',
    'CE Entity 31 \u2014 Blue chrome bust in a faceted crystal diamond frame',
    'CE Entity 32 \u2014 Blue chrome face in a glowing oval frame',
    'CE Entity 33 \u2014 Blue chrome face in a crystal diamond frame, three-quarter view',
    'CE Entity 34 \u2014 Two cracked blue chrome profiles facing each other',
    'CE Entity 35 \u2014 Blue chrome face in a dark blue diamond frame, light background',
    'CE Entity 36 \u2014 Blue chrome face in a chrome oval frame',
    'CE Entity 37 \u2014 Blue chrome face in a translucent shield frame, dark background',
    'CE Entity 38 \u2014 Blue chrome face, close-up, geometric frame',
    'CE Entity 40 \u2014 Two blue chrome entities, kissing, close-up',
    'CE Entity 41 \u2014 Blue chrome face in a double diamond frame, light blue background'
  ];
  var slides=[].slice.call(viewer.querySelectorAll('.art-slide'));
  var captionEl=document.getElementById('artCaption');
  var countEl=document.getElementById('artCount');
  var dotsWrap=document.getElementById('artDots');
  var prevBtn=document.getElementById('artPrev');
  var nextBtn=document.getElementById('artNext');
  if(!slides.length) return;
  var ART_DOT_WINDOW=5;
  var dots=[];
  slides.forEach(function(_,i){
    var d=document.createElement('button');
    d.type='button';
    d.className='art-dot'+(i===0?' is-active':'')+(i>=ART_DOT_WINDOW?' is-outside-window':'');
    d.setAttribute('aria-label','Go to artwork '+(i+1)+' of '+slides.length);
    if(i===0) d.setAttribute('aria-current','true');
    d.addEventListener('click',function(){ showArt(i,true); });
    dotsWrap.appendChild(d);
    dots.push(d);
  });
  function artDotWindowStart(idx){
    if(slides.length<=ART_DOT_WINDOW) return 0;
    var start=idx-Math.floor(ART_DOT_WINDOW/2);
    if(start<0) start=0;
    if(start>slides.length-ART_DOT_WINDOW) start=slides.length-ART_DOT_WINDOW;
    return start;
  }
  function randomArt(){
    if(slides.length<2) return artIdx;
    var n; do{ n=Math.floor(Math.random()*slides.length); }while(n===artIdx);
    return n;
  }
  var artIdx=0, timer=null;
  var reduceMotion=false;
  try{ reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
  function showArt(idx,manual){
    artIdx=(idx+slides.length)%slides.length;
    slides.forEach(function(s,i){
      var on=i===artIdx;
      s.classList.toggle('is-active',on);
      if(on){ s.removeAttribute('aria-hidden'); } else { s.setAttribute('aria-hidden','true'); }
    });
    var winStart=artDotWindowStart(artIdx);
    var winEnd=winStart+ART_DOT_WINDOW;
    dots.forEach(function(d,i){
      var on=i===artIdx;
      d.classList.toggle('is-active',on);
      d.classList.toggle('is-outside-window', i<winStart || i>=winEnd);
      if(on){ d.setAttribute('aria-current','true'); } else { d.removeAttribute('aria-current'); }
    });
    if(captionEl) captionEl.textContent=captions[artIdx]||'';
    if(countEl) countEl.textContent='Artwork '+(artIdx+1)+' of '+slides.length;
    if(manual) restart();
  }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }
  function start(){
    stop();
    if(reduceMotion || slides.length<2) return;
    timer=setInterval(function(){ showArt(randomArt(),false); },6000);
  }
  function restart(){ start(); }
  if(prevBtn) prevBtn.addEventListener('click',function(){ showArt(artIdx-1,true); });
  if(nextBtn) nextBtn.addEventListener('click',function(){ showArt(artIdx+1,true); });
  viewer.addEventListener('mouseenter',stop);
  viewer.addEventListener('mouseleave',start);
  viewer.addEventListener('focusin',stop);
  viewer.addEventListener('focusout',start);
  document.addEventListener('visibilitychange',function(){ if(document.hidden){ stop(); } else { start(); } });
  showArt(Math.floor(Math.random()*slides.length),false);
  start();
})();
