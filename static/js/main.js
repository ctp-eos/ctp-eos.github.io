(function () {
  /* Theme drop-down — 52 themes: CTP-EOS Calamares first, then the CTP-EOS
     themes, then the CTP Space Cadet themes, then the 5 CTP Founder themes,
     then the CTP Midnight themes, then the 2 Tecknotronic themes, then
     CTPIX, then the 4 C-domain themes, then the 4 Frey themes, then
     CTP Light / Medium / Dark, then the remaining CTP themes, then the
     5 CTP Convergence themes, then CTP Corporate. CTP-EOS Calamares is first
     in the list; CTP-EOS Cynamic is the default; the choice is remembered
     on this device. Same VALID_THEMES / THEME_LABELS / setTheme as the
     CTPVerse Dashboard; the storage key stays the CTP-EOS one. */
  var select = document.getElementById('themeSelect');
  var THEME_KEY = 'ctp-eos-theme';
  var VALID_THEMES = ['calamares','eos','eos-light','eos-medium','eos-medium-dark','eos-dark','space-cadet-light','space-cadet-medium','space-cadet-medium-dark','space-cadet-dark','founder','founder-light','founder-medium','founder-medium-dark','founder-dark','midnight-blue','midnight','tecknotronic-psy','tecknotronic-matrix','ctpix','cdomain-light','cdomain-medium','cdomain-medium-dark','cdomain-dark','frey-light','frey-medium','frey-medium-dark','frey-dark','light','medium','dark','nuke-dark','matrix','amber','catppuccin','cerulean','synthwave','dracula','nord','cyberpunk','tokyonight','solarized','void-signal','plasma-field','cathode-green','deep-current','convergence','convergence-light','convergence-medium','convergence-medium-dark','convergence-dark','corporate'];
  var LIGHT_THEMES = {light:true,medium:true,corporate:true,'eos-light':true,'eos-medium':true,'cdomain-light':true,'frey-light':true,'frey-medium':true,'founder-light':true,'founder-medium':true,'convergence-light':true,'convergence-medium':true};
  var THEME_LABELS = {calamares:'CTP-EOS Calamares',eos:'CTP-EOS Cynamic','eos-light':'CTP-EOS Light','eos-medium':'CTP-EOS Medium','eos-medium-dark':'CTP-EOS Medium Dark','eos-dark':'CTP-EOS Dark','space-cadet-light':'CTP Space Cadet Light','space-cadet-medium':'CTP Space Cadet Medium','space-cadet-medium-dark':'CTP Space Cadet Medium Dark','space-cadet-dark':'CTP Space Cadet Dark',founder:'CTP Founder','founder-light':'CTP Founder Light','founder-medium':'CTP Founder Medium','founder-medium-dark':'CTP Founder Medium Dark','founder-dark':'CTP Founder Dark','midnight-blue':'CTP Midnight Blue','midnight':'CTP Midnight','tecknotronic-psy':'CTP Tecknotronic Psy','tecknotronic-matrix':'CTP Tecknotronic Matrix',ctpix:'CTPIX','cdomain-light':'C-domain Light','cdomain-medium':'C-domain Medium','cdomain-medium-dark':'C-domain Medium Dark','cdomain-dark':'C-domain Dark','frey-light':'Frey Light','frey-medium':'Frey Medium','frey-medium-dark':'Frey Medium Dark','frey-dark':'Frey Dark',light:'CTP Light',medium:'CTP Medium',dark:'CTP Dark','nuke-dark':'CTP Nuke Dark',matrix:'CTP Matrix',amber:'CTP Amber',catppuccin:'CTP Catppuccin',cerulean:'CTP Cerulean',synthwave:'CTP Synthwave',dracula:'CTP Dracula',nord:'CTP Nord',cyberpunk:'CTP Cyberpunk',tokyonight:'CTP Tokyo Night',solarized:'CTP Solarized','void-signal':'CTP Void Signal','plasma-field':'CTP Plasma Field','cathode-green':'CTP Cathode Green','deep-current':'CTP Deep Current',convergence:'CTP Convergence','convergence-light':'CTP Convergence Light','convergence-medium':'CTP Convergence Medium','convergence-medium-dark':'CTP Convergence Medium Dark','convergence-dark':'CTP Convergence Dark',corporate:'CTP Corporate'};
  var toast = document.getElementById('toast');
  function show(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }
  function loadTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function saveTheme(name) {
    try { localStorage.setItem(THEME_KEY, name); } catch (e) {}
  }
  function setTheme(name, silent, persist) {
    if (VALID_THEMES.indexOf(name) === -1) name = 'eos';
    document.documentElement.setAttribute('data-theme', name);
    if (select) select.value = name;
    var cs = document.querySelector('meta[name="color-scheme"]');
    if (cs) cs.setAttribute('content', LIGHT_THEMES[name] ? 'light' : 'dark');
    if (persist) saveTheme(name);
    if (!silent) show('Theme: ' + (THEME_LABELS[name] || name));
  }
  if (select) {
    var applyThemeSelect = function () { setTheme(select.value, false, true); };
    /* 'change' is the standard event; 'input' is added because some phone
       browsers / in-app webviews fire only 'input' for <select> picks. Both
       call the same handler, and setTheme is idempotent. */
    select.addEventListener('change', applyThemeSelect);
    select.addEventListener('input', applyThemeSelect);
  }
  setTheme(loadTheme() || document.documentElement.getAttribute('data-theme') || 'eos', true, false);
  /* Site Mode (replaces the old WIDTH toggle button): wide / nuke set the
     portal width; corporate navigates to the corporate layout page. */
  var mode = document.getElementById('siteModeSelect');
  if (mode) {
    var w = document.documentElement.getAttribute('data-width') || 'nuke';
    mode.value = (w === 'full') ? 'wide' : 'nuke';
    mode.addEventListener('change', function () {
      if (mode.value === 'wide') {
        document.documentElement.setAttribute('data-width', 'full');
        try { localStorage.setItem('ctp-width', 'full'); } catch (e) {}
        try { localStorage.setItem('ctp-eos-width', 'full'); } catch (e) {}
      } else if (mode.value === 'nuke') {
        document.documentElement.setAttribute('data-width', 'nuke');
        try { localStorage.setItem('ctp-width', 'nuke'); } catch (e) {}
        try { localStorage.setItem('ctp-eos-width', 'nuke'); } catch (e) {}
      } else {
        window.location.href = '/corporate/';
      }
    });
  }
})();
