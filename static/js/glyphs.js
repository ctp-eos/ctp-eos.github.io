(function(){
  var viewer=document.getElementById('glyphViewer');
  if(!viewer) return;
  var captions=[
    'CTP Energy Glyph 1',
    'CTP Energy Glyph 2',
    'CTP Energy Glyph 3',
    'CTP Energy Glyph 4',
    'CTP Energy Glyph 5',
    'CTP Energy Glyph 6',
    'CTP Energy Glyph 7',
    'CTP Energy Glyph 8',
    'CTP Energy Glyph 9',
    'CTP Energy Glyph 10',
    'CTP Energy Glyph 11',
    'CTP Energy Glyph 12',
    'CTP Energy Glyph 13',
    'CTP Energy Glyph 14',
    'CTP Energy Glyph 15',
    'CTP Energy Glyph 16',
    'CTP Energy Glyph 17',
    'CTP Energy Glyph 18',
    'CTP Energy Glyph 19',
    'CTP Energy Glyph 20',
    'CTP Energy Glyph 21',
    'CTP Energy Glyph 22',
    'CTP Energy Glyph 23',
    'CTP Energy Glyph 24',
    'CTP Energy Glyph 25',
    'CTP Energy Glyph 26',
    'CTP Energy Glyph 27',
    'CTP Energy Glyph 28',
    'CTP Energy Glyph 29',
    'CTP Energy Glyph 30',
    'CTP Energy Glyph 31',
    'CTP Energy Glyph 32',
    'CTP Energy Glyph 33',
    'CTP Energy Glyph 34',
    'CTP Energy Glyph 35',
    'CTP Energy Glyph 36',
    'CTP Energy Glyph 37',
    'CTP Energy Glyph 38',
    'CTP Energy Glyph 39',
    'CTP Energy Glyph 40',
    'CTP Energy Glyph 41',
    'CTP Energy Glyph 42',
    'CTP Energy Glyph 43',
    'CTP Energy Glyph 44',
    'CTP Energy Glyph 45',
    'CTP Energy Glyph 46',
    'CTP Energy Glyph 47',
    'CTP Energy Glyph 48',
    'CTP Energy Glyph 49',
    'CTP Energy Glyph 50',
    'CTP Energy Glyph 51',
    'CTP Energy Glyph 52',
    'CTP Energy Glyph 53',
    'CTP Energy Glyph 54',
    'CTP Energy Glyph 55',
    'CTP Energy Glyph 56',
    'CTP Energy Glyph 57',
    'CTP Energy Glyph 58',
    'CTP Energy Glyph 59',
    'CTP Energy Glyph 60',
    'CTP Energy Glyph 61',
    'CTP Energy Glyph 62',
    'CTP Energy Glyph 63',
    'CTP Energy Glyph 64',
    'CTP Energy Glyph 65',
    'CTP Energy Glyph 66',
    'CTP Energy Glyph 67',
    'CTP Energy Glyph 68'
  ];
  var slides=[].slice.call(viewer.querySelectorAll('.art-slide'));
  var captionEl=document.getElementById('glyphCaption');
  var countEl=document.getElementById('glyphCount');
  var dotsWrap=document.getElementById('glyphDots');
  var prevBtn=document.getElementById('glyphPrev');
  var nextBtn=document.getElementById('glyphNext');
  if(!slides.length) return;
  var GLYPH_DOT_WINDOW=5;
  var dots=[];
  slides.forEach(function(_,i){
    var d=document.createElement('button');
    d.type='button';
    d.className='art-dot'+(i===0?' is-active':'')+(i>=GLYPH_DOT_WINDOW?' is-outside-window':'');
    d.setAttribute('aria-label','Go to glyph '+(i+1)+' of '+slides.length);
    if(i===0) d.setAttribute('aria-current','true');
    d.addEventListener('click',function(){ showGlyph(i,true); });
    dotsWrap.appendChild(d);
    dots.push(d);
  });
  function glyphDotWindowStart(idx){
    if(slides.length<=GLYPH_DOT_WINDOW) return 0;
    var start=idx-Math.floor(GLYPH_DOT_WINDOW/2);
    if(start<0) start=0;
    if(start>slides.length-GLYPH_DOT_WINDOW) start=slides.length-GLYPH_DOT_WINDOW;
    return start;
  }
  function randomGlyph(){
    if(slides.length<2) return glyphIdx;
    var n; do{ n=Math.floor(Math.random()*slides.length); }while(n===glyphIdx);
    return n;
  }
  var glyphIdx=0, timer=null;
  var reduceMotion=false;
  try{ reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
  function showGlyph(idx,manual){
    glyphIdx=(idx+slides.length)%slides.length;
    slides.forEach(function(sl,i){
      var on=i===glyphIdx;
      sl.classList.toggle('is-active',on);
      if(on){ sl.removeAttribute('aria-hidden'); } else { sl.setAttribute('aria-hidden','true'); }
    });
    var winStart=glyphDotWindowStart(glyphIdx);
    var winEnd=winStart+GLYPH_DOT_WINDOW;
    dots.forEach(function(d,i){
      var on=i===glyphIdx;
      d.classList.toggle('is-active',on);
      d.classList.toggle('is-outside-window', i<winStart || i>=winEnd);
      if(on){ d.setAttribute('aria-current','true'); } else { d.removeAttribute('aria-current'); }
    });
    if(captionEl) captionEl.textContent=captions[glyphIdx]||'';
    if(countEl) countEl.textContent='Glyph '+(glyphIdx+1)+' of '+slides.length;
    if(manual) restart();
  }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }
  function start(){
    stop();
    if(reduceMotion || slides.length<2) return;
    timer=setInterval(function(){ showGlyph(randomGlyph(),false); },6000);
  }
  function restart(){ start(); }
  if(prevBtn) prevBtn.addEventListener('click',function(){ showGlyph(glyphIdx-1,true); });
  if(nextBtn) nextBtn.addEventListener('click',function(){ showGlyph(glyphIdx+1,true); });
  /* Auto-advance runs from page load and is never paused by hover or focus:
     a resting pointer over the viewer used to stop the timer until a manual
     click restarted it. The timer is only paused while the tab is hidden. */
  document.addEventListener('visibilitychange',function(){ if(document.hidden){ stop(); } else { start(); } });
  showGlyph(Math.floor(Math.random()*slides.length),false);
  start();
})();
