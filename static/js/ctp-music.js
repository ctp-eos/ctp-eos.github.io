/* CTP Music — laut.fm widget + station toggle.
   The player itself is laut.fm's own widget (iframe); this script only picks
   which station it loads and keeps the station / group / link text in step.
   Stations are grouped by genre; the toggle steps through all 25 in
   group order, so each group plays through before the next one starts. */
(function(){
  var GROUPS = [
    { label: "New Age & Ambient", stations: [
      { id: "7rays", name: "7 Rays", genre: "New Age / Ambient / Deep Space" },
      { id: "new-age", name: "New Age", genre: "New Age" },
      { id: "ambient", name: "Ambient Radio", genre: "Ambient / Chill / Chillout" },
      { id: "chilloutzone", name: "Chill Out Zone", genre: "Ambient / Chillout / Space" },
      { id: "anechoic_chamber_music", name: "Anechoic Chamber Music", genre: "Ambient / Electronica / Drone" }
    ]},
    { label: "Chillout & Lounge", stations: [
      { id: "abstrait", name: "Abstrait", genre: "Chillout / Lounge" },
      { id: "chillstream", name: "Chillstream", genre: "Ambient / Chillout / Yoga" },
      { id: "sine-music", name: "Sine Music", genre: "Chillout / Downtempo" },
      { id: "electrolounge", name: "Electrolounge", genre: "Chillout / Lounge" },
      { id: "schalldeluxe", name: "Schalldeluxe", genre: "Downtempo" },
      { id: "relaxing-piano", name: "Relaxing Piano", genre: "Relax / Piano" },
      { id: "radio_relax", name: "Radio Relax", genre: "Chillout / Easy Listening" },
      { id: "best-lounge", name: "Best Lounge", genre: "Lounge / Ambient" },
      { id: "lounge-radio-ibiza", name: "Lounge Radio Ibiza", genre: "Lounge" },
      { id: "jazzloft", name: "Jazzloft", genre: "Jazz / Lounge" },
      { id: "bdj_electronic_lounge_radio", name: "BDJ Electronic Lounge Radio", genre: "Electronica / Chill / Chillout" }
    ]},
    { label: "Meditation & Relax", stations: [
      { id: "meditation", name: "Meditation", genre: "Ambient / Relax" },
      { id: "ayurveda-lounge", name: "Ayurveda Lounge", genre: "Yoga / Meditation" }
    ]},
    { label: "Psy & Goa", stations: [
      { id: "psytrancelicious", name: "Psytrancelicious", genre: "Psychedelic / Goa" },
      { id: "goa-channel-one", name: "Goa Channel One", genre: "Goa / Psy Trance" },
      { id: "goa-base", name: "Goa Base", genre: "Goa Trance" },
      { id: "goanight", name: "Goanight", genre: "Goa / Psy Trance" },
      { id: "progressive-trance-mix", name: "Progressive Trance Mix", genre: "Progressive Trance" }
    ]},
    { label: "Lofi, Electronica & World", stations: [
      { id: "lofi", name: "Lofi", genre: "Chill / Lofi" },
      { id: "kriola", name: "Kriola", genre: "World Music" }
    ]}
  ];
  /* Flatten in group order so the toggle walks group by group. */
  var STATIONS = [];
  GROUPS.forEach(function(g){
    g.stations.forEach(function(s){
      STATIONS.push({ group: g.label, id: s.id, name: s.name, genre: s.genre });
    });
  });
  /* Widget colours — read from this site theme's own CSS variables, so the
     player matches whatever theme is active (light or dark). Falls back to
     the dark grayscale set if a variable is missing. */
  function encHex(c){ return "%23" + c.slice(1); }
  function toHex(c){
    if(!c) return null;
    c = String(c).trim();
    if(c.charAt(0) === "#"){
      if(c.length === 4) c = "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
      return c.length === 7 ? c.toLowerCase() : null;
    }
    var m = c.match(/rgba?\(\s*([^)]+)\)/);
    if(!m) return null;
    var p = m[1].split(",").map(function(x){ return parseInt(x, 10); });
    if(p.length < 3 || isNaN(p[0]) || isNaN(p[1]) || isNaN(p[2])) return null;
    function h(n){ n = Math.max(0, Math.min(255, n)); return (n < 16 ? "0" : "") + n.toString(16); }
    return "#" + h(p[0]) + h(p[1]) + h(p[2]);
  }
  function cssVar(name){
    try { return toHex(getComputedStyle(document.documentElement).getPropertyValue(name)); }
    catch(e){ return null; }
  }
  function mixHex(a, b, t){
    function parse(c){
      c = c.replace("#", "");
      return [parseInt(c.substr(0, 2), 16), parseInt(c.substr(2, 2), 16), parseInt(c.substr(4, 2), 16)];
    }
    var pa = parse(a), pb = parse(b);
    function h(n){ n = Math.max(0, Math.min(255, Math.round(n))); return (n < 16 ? "0" : "") + n.toString(16); }
    return "#" + h(pa[0] + (pb[0] - pa[0]) * t) + h(pa[1] + (pb[1] - pa[1]) * t) + h(pa[2] + (pb[2] - pa[2]) * t);
  }
  function themeW(){
    var text = cssVar("--text") || "#ffffff";
    var surface = cssVar("--surface") || "#1f2937";
    var wash = cssVar("--blue-wash") || surface;
    /* Player background matches the darker module title strip (the border
       where CTP MUSIC sits), so the whole module reads as one piece. */
    var bg = wash;
    var fg = text;
    var btn = mixHex(bg, fg, 0.25);
    return {
      color: encHex(fg),
      shadow: "false", radius: "6px",
      bgTo: encHex(bg),
      bgFrom: encHex(bg),
      borderColor: encHex(fg), borderWidth: "1px",
      btnBgTo: encHex(btn),
      btnBgFrom: encHex(btn),
      btnBorderColor: encHex(fg), btnBorderWidth: "1px"
    };
  }
  function widgetURL(st){
    var W = themeW();
    return "https://laut.fm/widgets/player_for/" + st + ","
      + "?player%5Bstations%5D=" + st + "%2C"
      + "&player%5Bcolor%5D%5Bcolor%5D=" + W.color
      + "&player%5Bshadow%5D=" + W.shadow
      + "&player%5Bdisplay%5D%5Bborder%5D%5Bradius%5D=" + W.radius
      + "&player%5Bcolor%5D%5Bbackground_to%5D=" + W.bgTo
      + "&player%5Bcolor%5D%5Bbackground_from%5D=" + W.bgFrom
      + "&player%5Bborder%5D%5Bcolor%5D=" + W.borderColor
      + "&player%5Bborder%5D%5Bwidth%5D=" + W.borderWidth
      + "&player%5Bbutton%5D%5Bcolor%5D%5Bbackground_to%5D=" + W.btnBgTo
      + "&player%5Bbutton%5D%5Bcolor%5D%5Bbackground_from%5D=" + W.btnBgFrom
      + "&player%5Bbutton%5D%5Bborder%5D%5Bcolor%5D=" + W.btnBorderColor
      + "&player%5Bbutton%5D%5Bborder%5D%5Bwidth%5D=" + W.btnBorderWidth;
  }
  var frame = document.getElementById("mpWidget");
  if(!frame) return;
  var groupEl = document.getElementById("mpGroup");
  var channelEl = document.getElementById("mpChannel");
  var genreTextEl = document.getElementById("mpGenreText");
  var genreLinkEl = document.getElementById("mpGenreLink");
  var sourceEl = document.getElementById("mpSourceLink");
  var statusEl = document.getElementById("mpStatus");
  var prevBtn = document.getElementById("mpPrev");
  var nextBtn = document.getElementById("mpNext");
  /* Default station: Abstrait, first station of the Chillout & Lounge group. */
  var idx = 5;
  function loadStation(i){
    idx = (i + STATIONS.length) % STATIONS.length;
    var s = STATIONS[idx];
    frame.src = widgetURL(s.id);
    if(groupEl) groupEl.textContent = s.group;
    if(channelEl) channelEl.textContent = s.name;
    if(genreTextEl) genreTextEl.textContent = s.genre;
    var ch = "https://laut.fm/" + s.id;
    if(genreLinkEl) genreLinkEl.href = ch;
    if(sourceEl){ sourceEl.href = ch; sourceEl.textContent = "stream.laut.fm/" + s.id; }
    if(statusEl) statusEl.textContent = "Stream loaded — press play";
  }
  if(prevBtn) prevBtn.addEventListener("click", function(){ loadStation(idx - 1); });
  if(nextBtn) nextBtn.addEventListener("click", function(){ loadStation(idx + 1); });
  loadStation(idx);
  /* Rebuild the player when the theme changes, so it keeps matching. */
  if(window.MutationObserver){
    var lastTheme = document.documentElement.getAttribute("data-theme");
    new MutationObserver(function(){
      var t = document.documentElement.getAttribute("data-theme");
      if(t !== lastTheme){ lastTheme = t; frame.src = widgetURL(STATIONS[idx].id); }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }
})();
