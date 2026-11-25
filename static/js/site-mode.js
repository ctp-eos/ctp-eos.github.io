/* CTP-EOS corporate page — Site Mode + theme selects.
   Loaded ONLY on the corporate page (layouts/corporate.html, end of <body>),
   AFTER the head.html bootstrap scripts in <head> have already applied the
   stored theme / width before first paint.
   There is NO shared main.js to load: the portal's theme logic lives inline
   in the EOS source (index.html ~line 1729), not in a shared file. This file
   therefore carries the theme-select logic itself, mirroring the portal's
   inline script exactly (same key, same apply-on-change/input pattern).
   If the portal inline script is ever extracted to a shared static/js/main.js,
   load main.js BEFORE this file and delete the theme half below to avoid
   double-binding (double-binding is idempotent, but redundant).

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

  /* ---------- Theme (mirrors the portal's inline theme script) ---------- */
  var theme = document.getElementById('themeSelect');
  if (theme) {
    var currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme) {
      for (var i = 0; i < theme.options.length; i++) {
        if (theme.options[i].value === currentTheme) { theme.value = currentTheme; break; }
      }
    }
    var applyTheme = function () {
      document.documentElement.setAttribute('data-theme', theme.value);
      try { localStorage.setItem(THEME_KEY, theme.value); } catch (e) {}
    };
    theme.addEventListener('change', applyTheme);
    theme.addEventListener('input', applyTheme);
  }
})();
