/* Murthu Theme v4: 10 themes, floating ERP icons, bell fix, module colors, field colors, celebrations */
(function () {
  if (window.__mtFx) return;
  window.__mtFx = true;

  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var isTouch = matchMedia("(hover: none), (pointer: coarse)").matches;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var rnd = function (a, b) { return a + Math.random() * (b - a); };

  var THEMES = {
    aurora:  { label: "Aurora",  sw: ["#0b1026", "#7c5cff", "#22d3ee"], h0: 180, h1: 300, mh: 255 },
    ocean:   { label: "Ocean",   sw: ["#04141f", "#0ea5e9", "#14b8a6"], h0: 160, h1: 220, mh: 200 },
    sunset:  { label: "Sunset",  sw: ["#1f0a14", "#f97316", "#ec4899"], h0: 0,   h1: 50,  mh: 20  },
    emerald: { label: "Emerald", sw: ["#03140e", "#10b981", "#84cc16"], h0: 90,  h1: 170, mh: 155 },
    royal:   { label: "Royal",   sw: ["#0a0a23", "#4f46e5", "#a855f7"], h0: 240, h1: 290, mh: 262 },
    rose:    { label: "Rose",    sw: ["#1c0610", "#e11d48", "#f59e0b"], h0: 330, h1: 380, mh: 345 },
    neon:    { label: "Neon",    sw: ["#0d0221", "#ff2bd6", "#00f0ff"], h0: 180, h1: 330, mh: 300 },
    gold:    { label: "Gold",    sw: ["#0c0a05", "#d4a017", "#f5e6a8"], h0: 35,  h1: 55,  mh: 42  },
    cosmic:  { label: "Cosmic",  sw: ["#0f0524", "#9333ea", "#ec4899"], h0: 270, h1: 340, mh: 290 },
    slate:   { label: "Slate",   sw: ["#0b0f14", "#64748b", "#e2e8f0"], h0: 200, h1: 220, mh: 215 }
  };
  var root = document.documentElement;
  var theme = LS.get("mt_theme", "aurora");
  if (!THEMES[theme]) theme = "aurora";
  var fxOn = LS.get("mt_fx", "on") !== "off" && !reduce;
  var modOn = LS.get("mt_mod", "on") !== "off";
  var floatOn = LS.get("mt_float", "on") !== "off";
  root.setAttribute("data-mt-theme", theme);
  root.setAttribute("data-mt-fx", fxOn ? "on" : "off");
  root.setAttribute("data-mt-modcolor", modOn ? "on" : "off");

  /* ===== Canvas (retina sharp), banner, toast, flash ===== */
  var canvas = document.createElement("canvas");
  canvas.id = "mt-fx";
  var ctx = canvas.getContext("2d");
  var W = 0, H = 0, DPR = 1;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  addEventListener("resize", resize);

  var banner = document.createElement("div"); banner.id = "mt-welcome";
  var toastEl = document.createElement("div"); toastEl.id = "mt-toast";
  var flashEl = document.createElement("div"); flashEl.id = "mt-flash";

  function onReady() {
    document.body.appendChild(canvas);
    document.body.appendChild(banner);
    document.body.appendChild(toastEl);
    document.body.appendChild(flashEl);
    resize();
    buildUI();
  }
  if (document.body) onReady(); else addEventListener("DOMContentLoaded", onReady);

  /* ===== Welcome: only right after login ===== */
  var navType = "navigate";
  try { var nav = performance.getEntriesByType("navigation")[0]; if (nav && nav.type) navType = nav.type; } catch (e) {}
  var cameFromLogin = /\/login/.test(document.referrer || "");
  var welcomePending = cameFromLogin && navType === "navigate";
  var LOAD_TIME = Date.now();
  var WELCOME_WINDOW = 20000;

  /* ===== Stars, floating ERP icons, particles ===== */
  function starHue() { var t = THEMES[theme]; return rnd(t.h0, t.h1) % 360; }
  var stars = Array.from({ length: isTouch ? 24 : 64 }, function () {
    return { x: rnd(0, innerWidth), y: rnd(0, innerHeight), r: rnd(.6, 2.4), vx: rnd(-.25, .25), vy: rnd(-.5, -.1), a: rnd(0, 6.28), da: rnd(.01, .03), h: starHue() };
  });

  var ICON_PATHS = [
    "M3 5c0-1.1 4-2 9-2s9 .9 9 2-4 2-9 2-9-.9-9-2z M3 5v14c0 1.1 4 2 9 2s9-.9 9-2V5 M3 12c0 1.1 4 2 9 2s9-.9 9-2",
    "M16 18l6-6-6-6 M8 6l-6 6 6 6",
    "M3 3v18h18 M7 16v-5 M12 16V7 M17 16v-8",
    "M3 3h2l2.4 12h10.2l2-8H6 M9 19a1 1 0 1 0 2 0 1 1 0 1 0-2 0 M17 19a1 1 0 1 0 2 0 1 1 0 1 0-2 0",
    "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M14 3v6h6 M8 13h8 M8 17h6",
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M5 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    "M21 8l-9-5-9 5v8l9 5 9-5z M3 8l9 5 9-5 M12 13v8",
    "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z",
    "M10 17h4V5H2v12h3 M14 8h4l4 4v5h-3 M5 17.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0 M14.5 17.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0",
    "M12 2 2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
    "M22 7l-8.5 8.5-5-5L2 17 M16 7h6v6",
    "M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z M2 10h20 M6 15h4"
  ];
  var ICONS = [];
  try { ICONS = ICON_PATHS.map(function (d) { return new Path2D(d); }); } catch (e) { ICONS = []; }
  function mkFloater(anywhere) {
    return { p: ICONS[(Math.random() * ICONS.length) | 0], x: rnd(0, innerWidth), y: anywhere ? rnd(0, innerHeight) : innerHeight + 80,
      s: rnd(1.5, 3.3), vy: rnd(-.32, -.1), sw: rnd(.3, 1), ph: rnd(0, 6.28), r: rnd(-.5, .5), vr: rnd(-.004, .004), a: rnd(.12, .26), h: starHue() };
  }
  var floaters = ICONS.length ? Array.from({ length: isTouch ? 8 : 16 }, function () { return mkFloater(true); }) : [];
  function recolor() { stars.forEach(function (s) { s.h = starHue(); }); floaters.forEach(function (f) { f.h = starHue(); }); }

  var parts = [];
  function pickHue() { var t = THEMES[theme]; return Math.random() < .55 ? rnd(t.h0, t.h1) % 360 : rnd(0, 360); }
  function burst(x, y, n) {
    if (!fxOn) return;
    n = isTouch ? Math.round((n || 70) * .55) : (n || 70);
    for (var i = 0; i < n; i++) {
      var ang = rnd(0, 6.28), sp = rnd(2, 9);
      parts.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 3, g: .12, life: 1, decay: rnd(.008, .018), size: rnd(4, 9), hue: pickHue(), rot: rnd(0, 6.28), vr: rnd(-.3, .3), kind: Math.random() < .35 ? "star" : "rect" });
    }
  }
  function sparkle(x, y) {
    var t = THEMES[theme];
    parts.push({ x: x, y: y, vx: rnd(-.8, .8), vy: rnd(-.8, .8), g: .02, life: 1, decay: .03, size: rnd(2, 5), hue: rnd(t.h0, t.h1) % 360, rot: 0, vr: 0, kind: "star" });
  }
  function drawStar(x, y, r, rot) {
    ctx.beginPath();
    for (var i = 0; i < 8; i++) {
      var rr = i % 2 ? r * .35 : r, a = rot + i * Math.PI / 4;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath(); ctx.fill();
  }

  function isDesktop() { return window.__mtIsDesk ? window.__mtIsDesk() : false; }

  var wasActive = false, dirty = false;
  function loop() {
    requestAnimationFrame(loop);
    var b = document.body;
    if (!b) return;
    var active = isDesktop();
    b.classList.toggle("mt-desk", active);

    if (welcomePending) {
      if (Date.now() - LOAD_TIME > WELCOME_WINDOW) welcomePending = false;
      else if (active && !wasActive) { welcomePending = false; celebrateWelcome(); }
    }
    wasActive = active;

    var drawBg = active && fxOn;
    if (!drawBg && parts.length === 0) {
      if (dirty) { ctx.clearRect(0, 0, W, H); dirty = false; }
      return;
    }
    dirty = true;
    ctx.clearRect(0, 0, W, H);

    if (drawBg && floatOn) {
      ctx.shadowBlur = isTouch ? 0 : 10;
      ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.lineWidth = 1.1;
      for (var k = 0; k < floaters.length; k++) {
        var f = floaters[k];
        f.y += f.vy; f.ph += .008; f.r += f.vr;
        if (f.y < -90) floaters[k] = f = mkFloater(false);
        var fx = f.x + Math.sin(f.ph) * 34 * f.sw;
        ctx.save();
        ctx.translate(fx, f.y); ctx.rotate(f.r); ctx.scale(f.s, f.s); ctx.translate(-12, -12);
        ctx.globalAlpha = f.a;
        ctx.strokeStyle = "hsl(" + f.h + ",100%,78%)";
        ctx.shadowColor = "hsl(" + f.h + ",100%,65%)";
        ctx.stroke(f.p);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    ctx.shadowBlur = isTouch ? 0 : 8;
    if (drawBg) {
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.x += s.vx; s.y += s.vy; s.a += s.da;
        if (s.y < -10) { s.y = H + 10; s.x = rnd(0, W); }
        ctx.fillStyle = "hsla(" + s.h + ",100%,75%," + (.35 + .65 * Math.abs(Math.sin(s.a))) + ")";
        ctx.shadowColor = "hsl(" + s.h + ",100%,70%)";
        drawStar(s.x, s.y, s.r * 2.2, s.a);
      }
    }
    parts = parts.filter(function (p) { return p.life > 0 && p.y < H + 40; });
    for (var j = 0; j < parts.length; j++) {
      var p = parts[j];
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.life -= p.decay; p.rot += p.vr;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = "hsl(" + p.hue + ",100%,65%)";
      ctx.shadowColor = ctx.fillStyle;
      if (p.kind === "star") drawStar(p.x, p.y, p.size, p.rot);
      else { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); ctx.restore(); }
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  }
  requestAnimationFrame(loop);

  /* ===== Celebrations ===== */
  function celebrateWelcome() {
    var name = (window.frappe && frappe.session && (frappe.session.user_fullname || frappe.session.user)) || "";
    var first = String(name).split(" ")[0];
    banner.textContent = "✨ Welcome back" + (first ? ", " + first : "") + "! ✨";
    setTimeout(function () { banner.classList.add("show"); }, 200);
    setTimeout(function () { banner.classList.remove("show"); }, 4400);
    [[.2, .35], [.5, .25], [.8, .35], [.35, .55], [.65, .55]].forEach(function (p, i) {
      setTimeout(function () { burst(innerWidth * p[0], innerHeight * p[1], 80); }, 250 + i * 280);
    });
  }

  var toastTimer = null;
  function toast(text, kind) {
    toastEl.textContent = text;
    toastEl.className = (kind === "err" ? "err " : "ok ") + "show";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2300);
  }
  function anchor() {
    var el = document.querySelector(".page-actions .primary-action");
    if (el && el.offsetParent !== null) {
      var r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    return { x: innerWidth - 140, y: 90 };
  }
  var lastOk = 0, lastErr = 0;
  function success(label) {
    if (Date.now() - lastOk < 1500) return;
    lastOk = Date.now();
    var p = anchor();
    burst(p.x, p.y, 60);
    setTimeout(function () { burst(innerWidth * .5, innerHeight * .22, 50); }, 180);
    toast("✓ " + (label || "Saved"), "ok");
  }
  function error(label) {
    if (Date.now() - lastErr < 1200) return;
    lastErr = Date.now();
    flashEl.classList.remove("go"); void flashEl.offsetWidth; flashEl.classList.add("go");
    var t = document.querySelector(".modal.show .modal-dialog") || document.querySelector(".layout-main-section");
    if (t) { t.classList.remove("mt-shake"); void t.offsetWidth; t.classList.add("mt-shake"); setTimeout(function () { t.classList.remove("mt-shake"); }, 700); }
    toast("⚠ " + (label || "Please check"), "err");
  }

  var jqBound = false;
  var hookTimer = setInterval(function () {
    var f = window.frappe;
    if (f && f.show_alert && f.msgprint && !f.__mtp) {
      f.__mtp = true;
      var oa = f.show_alert;
      f.show_alert = function (m) {
        try {
          var ind = (m && m.indicator) || "";
          var txt = typeof m === "string" ? m : ((m && m.message) || "");
          if (/green/.test(ind)) success();
          else if (/red/.test(ind)) error();
          else if (!ind && /saved|submitted|created|success/i.test(String(txt))) success();
        } catch (e) {}
        return oa.apply(this, arguments);
      };
      var om = f.msgprint;
      f.msgprint = function (msg) {
        try { if (msg && typeof msg === "object" && !Array.isArray(msg) && /red/.test(msg.indicator || "")) error(); } catch (e) {}
        return om.apply(this, arguments);
      };
      for (var k in om) { if (Object.prototype.hasOwnProperty.call(om, k)) f.msgprint[k] = om[k]; }
    }
    if (window.jQuery && !jqBound) {
      jqBound = true;
      jQuery(document).on("save", function () { success("Saved"); });
    }
    if (f && f.__mtp && jqBound) clearInterval(hookTimer);
  }, 300);

  var wasDirty = false, lastRoute = "";
  setInterval(function () {
    var route = "";
    try { route = window.frappe && frappe.get_route_str ? frappe.get_route_str() : ""; } catch (e) {}
    if (route !== lastRoute) { lastRoute = route; wasDirty = false; return; }
    var t = "", els = document.querySelectorAll(".page-head .indicator-pill");
    for (var i = 0; i < els.length; i++) { if (els[i].offsetParent !== null) { t = els[i].textContent.trim(); break; } }
    if (/not saved/i.test(t)) wasDirty = true;
    else if (wasDirty && t) { wasDirty = false; success("Saved"); }
  }, 350);

  if (!isTouch) {
    addEventListener("mousemove", function (e) {
      if (!fxOn || !document.body.classList.contains("mt-desk")) return;
      if (Math.random() < .5) sparkle(e.clientX, e.clientY);
    });
  }
  addEventListener("click", function (e) {
    if (!document.body.classList.contains("mt-desk")) return;
    if (e.target.closest && e.target.closest(".desktop-icon, [class*='desktop-icon']")) burst(e.clientX, e.clientY, 45);
  }, true);

  /* ===== Desktop vs Pro mode ===== */
  function vis(sel) {
    var els = document.querySelectorAll(sel);
    for (var i = 0; i < els.length; i++) { if (els[i].offsetParent !== null) return true; }
    return false;
  }
  function isPro() { return vis(".frappe-list, .form-layout, .report-wrapper, .page-form, .list-row-head, .modal.show"); }
  window.__mtIsDesk = function () {
    if (isPro()) return false;
    var el = document.querySelector(".desktop-icon");
    return !!(el && el.offsetParent !== null);
  };
  function applyMode() {
    var b = document.body;
    if (!b) return;
    var pro = isPro();
    b.classList.toggle("mt-pro", pro);
    if (pro) b.classList.remove("mt-desk");
    b.classList.toggle("mt-login", /\/login/.test(location.pathname));
    var icons = document.querySelectorAll(".desktop-icon:not([data-mti])");
    for (var i = 0; i < icons.length; i++) { icons[i].setAttribute("data-mti", "1"); icons[i].style.setProperty("--i", i); }
  }
  setInterval(applyMode, 250);
  document.addEventListener("click", function () { setTimeout(applyMode, 50); });
  addEventListener("popstate", function () { setTimeout(applyMode, 50); });

  /* ===== Navbar icons (bell etc.): white on dark desk, selector-independent ===== */
  function parseBg(el) {
    var m = getComputedStyle(el).backgroundColor.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var p = m[1].split(",").map(parseFloat);
    return { rgb: p, a: p.length > 3 ? p[3] : 1 };
  }
  function lum(p) { return (0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]) / 255; }
  function onLight(el) {
    while (el && el.nodeType === 1) {
      var bg = parseBg(el);
      if (bg && bg.a > 0.5) return lum(bg.rgb) > 0.6;
      el = el.parentElement;
    }
    return false;
  }
  var WH = ["stroke", "color", "--icon-stroke", "--text-color", "--icon-fill"];
  function setWhite(el, on) {
    WH.forEach(function (k) { if (on) el.style.setProperty(k, "#fff", "important"); else el.style.removeProperty(k); });
    if (on) el.setAttribute("data-mtw", "1"); else el.removeAttribute("data-mtw");
  }
  function fixBell() {
    var b = document.body;
    if (!b) return;
    var desk = b.classList.contains("mt-desk");
    var svgs = document.querySelectorAll("header svg, nav svg, .navbar svg, [class*='navbar'] svg, [class*='notification'] svg, [class*='bell'] svg");
    for (var i = 0; i < svgs.length; i++) {
      var s = svgs[i];
      var r = s.getBoundingClientRect();
      var want = desk && r.width > 0 && r.top < 140 && !onLight(s) && !s.closest("input, .awesomplete");
      var has = s.getAttribute("data-mtw") === "1";
      if (want && !has) {
        setWhite(s, true);
        var host = s.closest("button, a, .nav-link, li");
        if (host && host.getBoundingClientRect().width < 90) host.classList.add("mt-bell");
      } else if (!want && has) {
        setWhite(s, false);
        var h2 = s.closest(".mt-bell"); if (h2) h2.classList.remove("mt-bell");
      }
    }
  }
  setInterval(fixBell, 400);

  /* ===== Module / doctype hue ===== */
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h * 47) % 360; }
  var lastKey = "";
  function modSync(force) {
    var b = document.body, f = window.frappe;
    if (!b || !f || !f.get_route) return;
    var r;
    try { r = f.get_route() || []; } catch (e) { return; }
    var dt = null;
    if (["Form", "List", "Report", "Tree", "Calendar", "Kanban", "Dashboard", "query-report"].indexOf(r[0]) > -1) dt = r[1];
    var mod = "";
    if (dt && window.locals && locals.DocType && locals.DocType[dt] && locals.DocType[dt].module) mod = locals.DocType[dt].module;
    else if (dt) mod = dt;
    else if (r[0] === "Workspaces" || r[0] === "desk") mod = r[1] || r[0];
    else mod = r[0] || "";
    var key = mod + "|" + modOn + "|" + theme;
    if (!force && key === lastKey) return;
    lastKey = key;
    var h = modOn && mod ? hash(mod) : THEMES[theme].mh;
    b.style.setProperty("--mt-mod-h", h);
    b.setAttribute("data-mt-module", String(mod).toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  }
  setInterval(function () { modSync(false); }, 300);

  /* ===== Inputs on light backgrounds => dark text ===== */
  function bgOf(el) {
    while (el && el.nodeType === 1) {
      var bg = parseBg(el);
      if (bg && bg.a > 0.5) return bg.rgb;
      el = el.parentElement;
    }
    return [255, 255, 255];
  }
  var SKIP = ["checkbox", "radio", "hidden", "file", "range", "color", "button", "submit", "reset", "image"];
  function fixInputs() {
    document.querySelectorAll("input, textarea").forEach(function (i) {
      if (SKIP.indexOf(i.type) > -1 || !i.offsetParent) return;
      if (lum(bgOf(i)) > 0.6) {
        i.classList.add("mt-on-light");
        i.style.setProperty("color", "#1b1f3b", "important");
        i.style.setProperty("-webkit-text-fill-color", "#1b1f3b", "important");
        i.style.setProperty("caret-color", "#1b1f3b", "important");
      } else if (i.classList.contains("mt-on-light")) {
        i.classList.remove("mt-on-light");
        i.style.removeProperty("color");
        i.style.removeProperty("-webkit-text-fill-color");
        i.style.removeProperty("caret-color");
      }
    });
  }
  setInterval(fixInputs, 600);

  /* ===== Theme picker ===== */
  function setTheme(n) {
    if (!THEMES[n]) n = "aurora";
    theme = n; root.setAttribute("data-mt-theme", n); LS.set("mt_theme", n);
    recolor(); modSync(true); markActive();
  }
  function setFx(v) { fxOn = v; root.setAttribute("data-mt-fx", v ? "on" : "off"); LS.set("mt_fx", v ? "on" : "off"); markActive(); }
  function setMod(v) { modOn = v; root.setAttribute("data-mt-modcolor", v ? "on" : "off"); LS.set("mt_mod", v ? "on" : "off"); modSync(true); markActive(); }
  function setFloat(v) { floatOn = v; LS.set("mt_float", v ? "on" : "off"); markActive(); }
  function markActive() {
    var p = document.getElementById("mt-panel");
    if (!p) return;
    p.querySelectorAll("[data-theme]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-theme") === theme); });
    var st = { fx: fxOn, mod: modOn, fl: floatOn };
    Object.keys(st).forEach(function (k) {
      var el = p.querySelector("[data-k='" + k + "']");
      if (el) { el.classList.toggle("on", st[k]); el.setAttribute("aria-pressed", st[k]); }
    });
  }
  function buildUI() {
    if (document.getElementById("mt-fab")) return;
    var fab = document.createElement("button");
    fab.id = "mt-fab"; fab.type = "button"; fab.title = "Theme"; fab.setAttribute("aria-label", "Theme settings");
    fab.textContent = "🎨";
    var panel = document.createElement("div"); panel.id = "mt-panel";
    var title = document.createElement("div"); title.className = "mt-p-title"; title.textContent = "Theme";
    panel.appendChild(title);
    var grid = document.createElement("div"); grid.className = "mt-p-grid";
    Object.keys(THEMES).forEach(function (k) {
      var t = THEMES[k];
      var b = document.createElement("button");
      b.type = "button"; b.className = "mt-p-sw"; b.setAttribute("data-theme", k);
      var dot = document.createElement("span"); dot.className = "mt-p-dot";
      dot.style.background = "linear-gradient(135deg," + t.sw[0] + "," + t.sw[1] + "," + t.sw[2] + ")";
      var lb = document.createElement("span"); lb.textContent = t.label;
      b.appendChild(dot); b.appendChild(lb);
      b.addEventListener("click", function () { setTheme(k); });
      grid.appendChild(b);
    });
    panel.appendChild(grid);
    function toggle(key, text, fn, get) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "mt-p-toggle"; b.setAttribute("data-k", key); b.textContent = text;
      b.addEventListener("click", function () { fn(!get()); });
      panel.appendChild(b);
    }
    toggle("fx", "✨ Sparkles & celebrations", setFx, function () { return fxOn; });
    toggle("fl", "🧩 Floating icons", setFloat, function () { return floatOn; });
    toggle("mod", "🌈 Module colors", setMod, function () { return modOn; });
    function action(text, fn) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "mt-p-toggle mt-p-act"; b.textContent = text;
      b.addEventListener("click", fn);
      panel.appendChild(b);
    }
    action("🎊 Test celebration", function () { lastOk = 0; success("Looks great!"); });
    action("⚠ Test error", function () { lastErr = 0; error("Please check the form"); });
    fab.addEventListener("click", function (e) { e.stopPropagation(); panel.classList.toggle("open"); });
    document.addEventListener("click", function (e) { if (!panel.contains(e.target) && e.target !== fab) panel.classList.remove("open"); });
    document.body.appendChild(panel);
    document.body.appendChild(fab);
    markActive();
  }
})();
