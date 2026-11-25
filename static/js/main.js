(function () {
  var select = document.getElementById('themeSelect');
  var THEME_KEY = 'ctp-eos-theme';
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', select.value);
    try { localStorage.setItem(THEME_KEY, select.value); } catch (e) {}
  }
  var currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme) {
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].value === currentTheme) { select.value = currentTheme; break; }
    }
  }
  select.addEventListener('change', applyTheme);
  select.addEventListener('input', applyTheme);
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
