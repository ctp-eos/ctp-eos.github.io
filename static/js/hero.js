    /* Hero dissolve: starts on the blue triangle (hero.jpg), then random-rotates.
       True dissolve (mirrors the CTPVerse Dashboard): the incoming slide is placed
       fully opaque UNDERNEATH the outgoing one, and the outgoing slide melts away
       on top of it over 2.8s. */
    (function(){
      var viewport = document.querySelector('.hero-viewport');
      if(!viewport) return;
      var slides = [].slice.call(viewport.querySelectorAll('.hero-slide'));
      if(slides.length < 2) return;
      var heroIdx = 0, timer = null;
      var reduceMotion = false;
      try{ reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
      function showHero(idx){
        var prevSlide = slides[heroIdx];
        heroIdx = (idx + slides.length) % slides.length;
        var nextSlide = slides[heroIdx];
        slides.forEach(function(s){
          if(s === nextSlide){
            s.classList.remove('is-leaving');
            s.classList.add('is-active');
            s.removeAttribute('aria-hidden');
          } else if(s === prevSlide){
            s.classList.remove('is-active');
            s.classList.add('is-leaving');
            s.setAttribute('aria-hidden','true');
          } else {
            s.classList.remove('is-active');
            s.classList.remove('is-leaving');
            s.setAttribute('aria-hidden','true');
          }
        });
      }
      function randomHero(){
        if(slides.length < 2) return heroIdx;
        var pool = [];
        for(var i=0;i<slides.length;i++){ if(i!==heroIdx) pool.push(i); }
        return pool[Math.floor(Math.random()*pool.length)];
      }
      function nextHero(){
        var target = randomHero();
        var img = slides[target].querySelector('img');
        var done = false;
        function go(){ if(!done){ done=true; showHero(target); } }
        if(img && img.decode){
          var p = null;
          try{ p = img.decode(); }catch(e){}
          if(p && p.then){ p.then(go,go); setTimeout(go,600); } else { go(); }
        } else { go(); }
      }
      function stop(){ if(timer){ clearInterval(timer); timer=null; } }
      function start(){
        stop();
        if(reduceMotion || slides.length < 2) return;
        timer = setInterval(nextHero, 11000);
      }
      document.addEventListener('visibilitychange', function(){ if(document.hidden){ stop(); } else { start(); } });
      start();
    })();
