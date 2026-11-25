    (function(){
      /* CTPVerse Sites rotator — random 1:1 banner, one of the six other CTP sites. */
      var sites = [
        { name: 'CTPVerse Dashboard', img: 'https://ctpverse.github.io/images/branding/ctpverse-org-avatar.jpg', url: 'https://ctpverse.github.io/' },
        { name: 'CTP Magazine', img: 'https://ctp-magazine.github.io/assets/branding/ctp-magazine-1254x1254.png', url: 'https://ctp-magazine.github.io/' },
        { name: 'FIN-DSP', img: 'https://fin-dsp.github.io/assets/branding/findsp-logo-200x200.jpg', url: 'https://fin-dsp.github.io/' },
        { name: 'CTP Music Portal', img: 'https://ctp-music.github.io/assets/branding/ctp-music-org-avatar.jpg', url: 'https://ctp-music.github.io/' },
        { name: 'CTP Space Systems', img: 'https://ctp-space-systems.github.io/assets/branding/ctp-space-systems-org-avatar.jpg', url: 'https://ctp-space-systems.github.io/' },
        { name: 'CTP-PSY', img: 'https://ctp-psy.github.io/assets/branding/ctp-psy-org-avatar.jpg', url: 'https://ctp-psy.github.io/' }
      ];
      var link = document.getElementById('ctpverse-sites-rotator-link');
      var img = document.getElementById('ctpverse-sites-rotator-img');
      if(!link || !img || sites.length < 2) return;
      var idx = 0;
      var timer = null;
      var reduceMotion = false;
      try{ reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
      function show(i){
        idx = i;
        img.src = sites[i].img;
        img.alt = sites[i].name;
        link.href = sites[i].url;
        link.title = sites[i].name + ' — visit the site';
      }
      function randomNext(){
        var n = idx;
        while(n === idx){ n = Math.floor(Math.random() * sites.length); }
        show(n);
      }
      function stop(){ if(timer){ clearInterval(timer); timer = null; } }
      function start(){
        stop();
        if(reduceMotion) return;
        timer = setInterval(randomNext, 5000);
      }
      document.addEventListener('visibilitychange', function(){ if(document.hidden){ stop(); } else { start(); } });
      start();
    })();
