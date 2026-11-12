/* Murthu Desktop Theme FX: floating sparkles, cursor trail, confetti celebrations */
(function () {
  if (window.__mtFx) return;
  window.__mtFx = true;

  const canvas = document.createElement("canvas");
  canvas.id = "mt-fx";
  const ctx = canvas.getContext("2d");
  let W, H;
  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  addEventListener("resize", resize);

  const banner = document.createElement("div");
  banner.id = "mt-welcome";

  function onReady() {
    document.body.appendChild(canvas);
    document.body.appendChild(banner);
    resize();
  }
  if (document.body) onReady(); else addEventListener("DOMContentLoaded", onReady);

  const rnd = (a, b) => a + Math.random() * (b - a);

  /* ===== Welcome only at LOGIN time (once per login session) ===== */
  const WELCOME_KEY = "mt_welcomed";
  const LOAD_TIME = Date.now();
  const WELCOME_WINDOW = 15000; // login tarvata first 15 sec lo desk vachinappudu matrame

  function safeGet() { try { return sessionStorage.getItem(WELCOME_KEY); } catch (e) { return "1"; } }
  function safeSet() { try { sessionStorage.setItem(WELCOME_KEY, "1"); } catch (e) {} }
  function safeClear() { try { sessionStorage.removeItem(WELCOME_KEY); } catch (e) {} }

  // login page lo unte flag clear (next login ki welcome ravali)
  if (/\/login/.test(location.pathname)) safeClear();

  // logout click chesinappudu flag clear
  addEventListener("click", function (e) {
    var t = e.target && e.target.closest && e.target.closest("[onclick*='logout'], a[href*='logout']");
    if (t) safeClear();
  }, true);

  // ee page load lo welcome pending aa? (flag lekapote = fresh login)
  let welcomePending = !safeGet();
  if (welcomePending) safeSet(); // refresh chesthe malli radu

  // floating ambient stars
  const stars = Array.from({ length: 80 }, () => ({
    x: rnd(0, innerWidth), y: rnd(0, innerHeight), r: rnd(.6, 2.4),
    vx: rnd(-.25, .25), vy: rnd(-.5, -.1), a: rnd(0, 6.28), da: rnd(.01, .03),
    h: rnd(180, 300)
  }));

  let parts = [];
  function burst(x, y, n = 70) {
    for (let i = 0; i < n; i++) {
      const ang = rnd(0, 6.28), sp = rnd(2, 9);
      parts.push({
        x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 3, g: .12,
        life: 1, decay: rnd(.008, .018), size: rnd(4, 9),
        hue: rnd(0, 360), rot: rnd(0, 6.28), vr: rnd(-.3, .3),
        kind: Math.random() < .35 ? "star" : "rect"
      });
    }
  }
  function sparkle(x, y) {
    parts.push({
      x, y, vx: rnd(-.8, .8), vy: rnd(-.8, .8), g: .02, life: 1,
      decay: .03, size: rnd(2, 5), hue: rnd(170, 320), rot: 0, vr: 0, kind: "star"
    });
  }
  function drawStar(x, y, r, rot) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const rr = i % 2 ? r * .35 : r;
      const a = rot + i * Math.PI / 4;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath(); ctx.fill();
  }

  function isDesktop() { return window.__mtIsDesk ? window.__mtIsDesk() : false; }

  let wasActive = false, last = 0;
  function loop(t) {
    requestAnimationFrame(loop);
    const active = isDesktop();
    document.body.classList.toggle("mt-desk", active);

    // welcome + confetti: login time lo matrame, okkasari
    if (welcomePending) {
      if (Date.now() - LOAD_TIME > WELCOME_WINDOW) {
        welcomePending = false; // login tarvata desk raledu -> skip
      } else if (active && !wasActive) {
        welcomePending = false;
        celebrate();
      }
    }

    wasActive = active;
    if (!active) { ctx && ctx.clearRect(0, 0, W, H); return; }

    ctx.clearRect(0, 0, W, H);
    // ambient stars
    for (const s of stars) {
      s.x += s.vx; s.y += s.vy; s.a += s.da;
      if (s.y < -10) { s.y = H + 10; s.x = rnd(0, W); }
      const alpha = .35 + .65 * Math.abs(Math.sin(s.a));
      ctx.fillStyle = `hsla(${s.h},100%,75%,${alpha})`;
      ctx.shadowColor = `hsl(${s.h},100%,70%)`; ctx.shadowBlur = 12;
      drawStar(s.x, s.y, s.r * 2.2, s.a);
    }
    // particles
    parts = parts.filter(p => p.life > 0);
    for (const p of parts) {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= .99;
      p.life -= p.decay; p.rot += p.vr;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = `hsl(${p.hue},100%,65%)`;
      ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10;
      if (p.kind === "star") drawStar(p.x, p.y, p.size, p.rot);
      else { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); ctx.restore(); }
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  }
  requestAnimationFrame(loop);

  function celebrate() {
    const name = (window.frappe && frappe.session && (frappe.session.user_fullname || frappe.session.user)) || "";
    banner.textContent = "✨ Welcome back, " + name.split(" ")[0] + "! ✨";
    setTimeout(() => banner.classList.add("show"), 200);
    setTimeout(() => banner.classList.remove("show"), 4200);
    const k = [[.2, .35], [.5, .25], [.8, .35], [.35, .55], [.65, .55]];
    k.forEach((p, i) => setTimeout(() => burst(innerWidth * p[0], innerHeight * p[1], 80), 250 + i * 280));
  }

  // cursor sparkle trail (desktop only)
  addEventListener("mousemove", e => {
    if (!document.body.classList.contains("mt-desk")) return;
    if (Math.random() < .5) sparkle(e.clientX, e.clientY);
  });
  // click on icon = mini celebration
  addEventListener("click", e => {
    if (!document.body.classList.contains("mt-desk")) return;
    if (e.target.closest && e.target.closest(".desktop-icon, [class*='desktop-icon']")) burst(e.clientX, e.clientY, 45);
  }, true);
})();

/* ===== v4: dark aurora only while desktop icons are visible; normal UI on all other pages ===== */
(function () {
  function iconsVisible() { return window.__mtIsDesk ? window.__mtIsDesk() : false; }
  function sync() {
    var b = document.body;
    if (!b) return;
    if (iconsVisible()) {
      if (!b.classList.contains("mt-desk")) b.classList.add("mt-desk");
    } else if (b.classList.contains("mt-desk")) {
      b.classList.remove("mt-desk");
    }
  }
  setInterval(sync, 400);
  window.addEventListener("popstate", sync);
  document.addEventListener("click", function () { setTimeout(sync, 60); });
})();

/* ===== v10: inputs on light backgrounds always get dark text (Ctrl+K dialog, popups) ===== */
(function () {
  function bgOf(el) {
    while (el && el.nodeType === 1) {
      var m = getComputedStyle(el).backgroundColor.match(/rgba?\(([^)]+)\)/);
      if (m) {
        var p = m[1].split(",").map(parseFloat);
        if ((p.length > 3 ? p[3] : 1) > 0.5) return p;
      }
      el = el.parentElement;
    }
    return [255, 255, 255];
  }
  function lum(p) { return (0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]) / 255; }
  function fix() {
    document.querySelectorAll("input, textarea").forEach(function (i) {
      if (["checkbox", "radio", "hidden", "file"].indexOf(i.type) > -1 || !i.offsetParent) return;
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
  setInterval(fix, 400);
})();

/* ===== v13: pro mode (list/form/report/modal) always light; aurora only on real desktop ===== */
(function () {
  function vis(sel) {
    var els = document.querySelectorAll(sel);
    for (var i = 0; i < els.length; i++) { if (els[i].offsetParent !== null) return true; }
    return false;
  }
  function isPro() {
    return vis(".frappe-list, .form-layout, .report-wrapper, .page-form, .list-row-head, .modal.show");
  }
  window.__mtIsDesk = function () {
    if (isPro()) return false;
    var el = document.querySelector(".desktop-icon");
    return !!(el && el.offsetParent !== null);
  };
  function apply() {
    var b = document.body;
    if (!b) return;
    var pro = isPro();
    b.classList.toggle("mt-pro", pro);
    if (pro) b.classList.remove("mt-desk");
  }
  setInterval(apply, 200);
  document.addEventListener("click", function () { setTimeout(apply, 50); });
  window.addEventListener("popstate", function () { setTimeout(apply, 50); });
})();
