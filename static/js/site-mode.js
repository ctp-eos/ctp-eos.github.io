/* CTP-EOS corporate page — Site Mode + theme selects.
   Loaded ONLY on the corporate page (layouts/_default/corporate.html,
   end of <body>), AFTER the head.html bootstrap scripts in <head> have
   already applied the stored theme / width before first paint.
   The portal's theme logic lives in static/js/main.js, which this page
   does NOT load — so this file carries its own copy of the same setTheme
   logic (same VALID_THEMES, THEME_LABELS, toast behaviour and
   'ctp-eos-theme' key), so a theme picked here is the same one the Nuke
   portal reads, and vice versa.

   Keys:
     Theme: 'ctp-eos-theme' — the EOS key. NOTE: this is DIFFERENT from the
       Magazine's 'ctp-magazine-theme'. The EOS key is used so a theme picked
       on the corporate page is the same one the Nuke portal reads.
     Width: the task specifies 'ctp-eos-width'; the EOS source's bootstrap
       and width toggle use 'ctp-width'. Both keys are written with the same
       value so the width applies whichever bootstrap the parent ships.

   Behaviour:
     - Site Mode select shows "corporate" on this page (selected in the
       markup; re-asserted here on load).
     - Choosing "wide"  -> stores width 'full', navigates to / (Nuke portal).
     - Choosing "nuke"  -> stores width 'nuke', navigates to / (Nuke portal).
     - Choosing "corporate" -> navigates to /corporate/ (width untouched).
     - Theme select: on load it syncs to the data-theme the head bootstrap
       applied; on change/input it sets data-theme live and stores it, exactly
       like the portal. The theme applies to the corporate page immediately
       because corporate.css uses the same theme variables. */
(function () {
  var THEME_KEY = 'ctp-eos-theme';
  var WIDTH_KEY = 'ctp-eos-width';
  var WIDTH_KEY_PORTAL = 'ctp-width';

  function storeWidth(value) {
    try { localStorage.setItem(WIDTH_KEY, value); } catch (e) {}
    try { localStorage.setItem(WIDTH_KEY_PORTAL, value); } catch (e) {}
  }

  /* ---------- Site Mode ---------- */
  var mode = document.getElementById('siteModeSelect');
  if (mode) {
    mode.value = 'corporate';
    mode.addEventListener('change', function () {
      if (mode.value === 'wide') {
        storeWidth('full');
        window.location.href = '/';
      } else if (mode.value === 'nuke') {
        storeWidth('nuke');
        window.location.href = '/';
      } else {
        window.location.href = '/corporate/';
      }
    });
  }

  /* ---------- Theme (same setTheme as static/js/main.js) ---------- */
  var VALID_THEMES = ['calamares','eos','eos-light','eos-medium','eos-medium-dark','eos-dark','space-cadet-light','space-cadet-medium','space-cadet-medium-dark','space-cadet-dark','founder','founder-light','founder-medium','founder-medium-dark','founder-dark','midnight-blue','midnight','tecknotronic-psy','tecknotronic-matrix','ctpix','cdomain-light','cdomain-medium','cdomain-medium-dark','cdomain-dark','frey-light','frey-medium','frey-medium-dark','frey-dark','light','medium','dark','nuke-dark','matrix','amber','catppuccin','cerulean','synthwave','dracula','nord','cyberpunk','tokyonight','solarized','void-signal','plasma-field','cathode-green','deep-current','convergence','convergence-light','convergence-medium','convergence-medium-dark','convergence-dark','corporate'];
  var LIGHT_THEMES = {light:true,medium:true,corporate:true,'eos-light':true,'eos-medium':true,'cdomain-light':true,'frey-light':true,'frey-medium':true,'founder-light':true,'founder-medium':true,'convergence-light':true,'convergence-medium':true};
  var THEME_LABELS = {calamares:'CTP Calamares',eos:'CTP-EOS Cynamic','eos-light':'CTP-EOS Light','eos-medium':'CTP-EOS Medium','eos-medium-dark':'CTP-EOS Medium Dark','eos-dark':'CTP-EOS Dark','space-cadet-light':'CTP Space Cadet Light','space-cadet-medium':'CTP Space Cadet Medium','space-cadet-medium-dark':'CTP Space Cadet Medium Dark','space-cadet-dark':'CTP Space Cadet Dark',founder:'CTP Founder','founder-light':'CTP Founder Light','founder-medium':'CTP Founder Medium','founder-medium-dark':'CTP Founder Medium Dark','founder-dark':'CTP Founder Dark','midnight-blue':'CTP Midnight Blue','midnight':'CTP Midnight','tecknotronic-psy':'CTP Tecknotronic Psy','tecknotronic-matrix':'CTP Tecknotronic Matrix',ctpix:'CTPIX','cdomain-light':'C-domain Light','cdomain-medium':'C-domain Medium','cdomain-medium-dark':'C-domain Medium Dark','cdomain-dark':'C-domain Dark','frey-light':'Frey Light','frey-medium':'Frey Medium','frey-medium-dark':'Frey Medium Dark','frey-dark':'Frey Dark',light:'CTP Light',medium:'CTP Medium',dark:'CTP Dark','nuke-dark':'CTP Nuke Dark',matrix:'CTP Matrix',amber:'CTP Amber',catppuccin:'CTP Catppuccin',cerulean:'CTP Cerulean',synthwave:'CTP Synthwave',dracula:'CTP Dracula',nord:'CTP Nord',cyberpunk:'CTP Cyberpunk',tokyonight:'CTP Tokyo Night',solarized:'CTP Solarized','void-signal':'CTP Void Signal','plasma-field':'CTP Plasma Field','cathode-green':'CTP Cathode Green','deep-current':'CTP Deep Current',convergence:'CTP Convergence','convergence-light':'CTP Convergence Light','convergence-medium':'CTP Convergence Medium','convergence-medium-dark':'CTP Convergence Medium Dark','convergence-dark':'CTP Convergence Dark',corporate:'CTP Corporate'};
  var toast = document.getElementById('toast');
  function show(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }
  function setTheme(name, silent, persist) {
    if (VALID_THEMES.indexOf(name) === -1) name = 'eos';
    document.documentElement.setAttribute('data-theme', name);
    var theme = document.getElementById('themeSelect');
    if (theme) theme.value = name;
    var cs = document.querySelector('meta[name="color-scheme"]');
    if (cs) cs.setAttribute('content', LIGHT_THEMES[name] ? 'light' : 'dark');
    if (persist) { try { localStorage.setItem(THEME_KEY, name); } catch (e) {} }
    if (!silent) show('Theme: ' + (THEME_LABELS[name] || name));
  }
  var theme = document.getElementById('themeSelect');
  if (theme) {
    var applyTheme = function () { setTheme(theme.value, false, true); };
    /* 'change' is the standard event; 'input' is added because some phone
       browsers / in-app webviews fire only 'input' for <select> picks. */
    theme.addEventListener('change', applyTheme);
    theme.addEventListener('input', applyTheme);
  }
  setTheme(document.documentElement.getAttribute('data-theme') || 'eos', true, false);
})();
