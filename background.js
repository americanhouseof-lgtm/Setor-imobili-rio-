/**
 * NOBILIS IMÓVEIS — BACKGROUND SYSTEM
 * Plantas baixas, grids de engenharia e wireframes arquitetônicos
 * em micro-opacidade. Três camadas com deriva parallax suavíssima.
 */
(function () {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* ── Architectural symbol drawers ───────────────────────── */
  const SYMBOLS = [

    // Floor plan — room layout
    function (ctx, s) {
      ctx.save(); ctx.scale(s / 80, s / 80);
      ctx.beginPath();
      // outer walls
      ctx.rect(4, 4, 72, 72);
      // interior wall H
      ctx.moveTo(4, 40); ctx.lineTo(52, 40);
      // interior wall V
      ctx.moveTo(36, 4);  ctx.lineTo(36, 40);
      // door arc hint
      ctx.moveTo(36, 40); ctx.arc(36, 52, 12, -Math.PI/2, 0);
      // window lines
      ctx.moveTo(4, 18);  ctx.lineTo(4, 26);
      ctx.moveTo(0, 18);  ctx.lineTo(0, 26);
      ctx.moveTo(60, 4);  ctx.lineTo(68, 4);
      ctx.stroke();
      ctx.restore();
    },

    // Grid / engineering graph
    function (ctx, s) {
      ctx.save(); ctx.scale(s / 80, s / 80);
      ctx.beginPath();
      for (let i = 0; i <= 80; i += 16) {
        ctx.moveTo(i, 0);  ctx.lineTo(i, 80);
        ctx.moveTo(0, i);  ctx.lineTo(80, i);
      }
      // diagonals
      ctx.moveTo(0, 0);  ctx.lineTo(80, 80);
      ctx.moveTo(80, 0); ctx.lineTo(0, 80);
      ctx.stroke();
      ctx.restore();
    },

    // Building elevation wireframe
    function (ctx, s) {
      ctx.save(); ctx.scale(s / 80, s / 80);
      ctx.beginPath();
      // base building
      ctx.rect(10, 20, 60, 56);
      // roof line
      ctx.moveTo(10, 20); ctx.lineTo(40, 4); ctx.lineTo(70, 20);
      // windows grid 3x4
      for (let col = 0; col < 3; col++) {
        for (let row = 0; row < 4; row++) {
          ctx.rect(16 + col * 18, 26 + row * 12, 10, 8);
        }
      }
      // door
      ctx.rect(32, 60, 16, 16);
      ctx.stroke();
      ctx.restore();
    },

    // Coordinate cross with circles
    function (ctx, s) {
      ctx.save(); ctx.scale(s / 80, s / 80);
      ctx.beginPath();
      ctx.moveTo(40, 0); ctx.lineTo(40, 80);
      ctx.moveTo(0, 40); ctx.lineTo(80, 40);
      ctx.arc(40, 40, 16, 0, Math.PI * 2);
      ctx.arc(40, 40, 32, 0, Math.PI * 2);
      // tick marks
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        const r1 = 34, r2 = 38;
        ctx.moveTo(40 + r1 * Math.cos(a), 40 + r1 * Math.sin(a));
        ctx.lineTo(40 + r2 * Math.cos(a), 40 + r2 * Math.sin(a));
      }
      ctx.stroke();
      ctx.restore();
    },

    // Site plan / urban map fragment
    function (ctx, s) {
      ctx.save(); ctx.scale(s / 80, s / 80);
      ctx.beginPath();
      // roads
      ctx.moveTo(0, 30);  ctx.lineTo(80, 30);
      ctx.moveTo(0, 50);  ctx.lineTo(80, 50);
      ctx.moveTo(30, 0);  ctx.lineTo(30, 80);
      ctx.moveTo(55, 0);  ctx.lineTo(55, 80);
      // building footprints
      ctx.rect(4,  4,  20, 20);
      ctx.rect(34, 4,  16, 20);
      ctx.rect(60, 4,  16, 20);
      ctx.rect(4,  54, 20, 22);
      ctx.rect(34, 54, 16, 22);
      ctx.rect(60, 54, 16, 22);
      ctx.stroke();
      ctx.restore();
    },

    // Structural section — column beam
    function (ctx, s) {
      ctx.save(); ctx.scale(s / 80, s / 80);
      ctx.beginPath();
      // columns
      ctx.rect(8,  20, 8, 56);
      ctx.rect(64, 20, 8, 56);
      ctx.rect(36, 20, 8, 56);
      // beams
      ctx.rect(4,  12, 72, 8);
      ctx.rect(4,  44, 72, 6);
      // foundation
      ctx.rect(0,  76, 80, 4);
      // cross-bracing
      ctx.moveTo(16, 20); ctx.lineTo(36, 44);
      ctx.moveTo(44, 20); ctx.lineTo(64, 44);
      ctx.stroke();
      ctx.restore();
    },

    // Compass rose
    function (ctx, s) {
      ctx.save(); ctx.scale(s / 80, s / 80);
      ctx.beginPath();
      ctx.arc(40, 40, 36, 0, Math.PI * 2);
      ctx.arc(40, 40,  4, 0, Math.PI * 2);
      // cardinal lines
      ctx.moveTo(40,  4); ctx.lineTo(40, 76);
      ctx.moveTo(4,  40); ctx.lineTo(76, 40);
      // ordinal lines (dashed feel)
      for (let a = Math.PI/4; a < Math.PI*2; a += Math.PI/2) {
        ctx.moveTo(40, 40);
        ctx.lineTo(40 + 30 * Math.cos(a), 40 + 30 * Math.sin(a));
      }
      ctx.stroke();
      ctx.restore();
    },

    // Staircase plan view
    function (ctx, s) {
      ctx.save(); ctx.scale(s / 80, s / 80);
      ctx.beginPath();
      ctx.rect(4, 4, 72, 72);
      for (let i = 0; i < 7; i++) {
        ctx.moveTo(4,  14 + i * 9);
        ctx.lineTo(76, 14 + i * 9);
      }
      ctx.moveTo(4, 4); ctx.lineTo(76, 76);
      ctx.stroke();
      ctx.restore();
    },

  ];

  /* ── Layer config ───────────────────────────────────────── */
  const LAYERS = [
    { count: 16, minSize: 40,  maxSize: 80,  opacity: 0.022, speed: 0.12 },
    { count: 18, minSize: 65,  maxSize: 120, opacity: 0.052, speed: 0.2  },
    { count: 10, minSize: 110, maxSize: 180, opacity: 0.10,  speed: 0.3  },
  ];

  let particles = [];
  let W = 0, H = 0;
  let scrollY = 0, scrollTarget = 0;
  let animId;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function randInt(a, b) { return Math.floor(rand(a, b)); }

  function createParticle(layerCfg, layerIdx) {
    return {
      x:      rand(0, W || window.innerWidth),
      y:      rand(0, H || window.innerHeight),
      size:   rand(layerCfg.minSize, layerCfg.maxSize),
      alpha:  rand(layerCfg.opacity * 0.55, layerCfg.opacity),
      sym:    randInt(0, SYMBOLS.length),
      rot:    rand(0, Math.PI * 2),
      rotV:   rand(-0.0002, 0.0002),
      dx:     rand(-layerCfg.speed, layerCfg.speed),
      dy:     rand(-layerCfg.speed * 0.5, layerCfg.speed * 0.5),
      pFactor: 0.018 + layerIdx * 0.014,
    };
  }

  function init() {
    particles = [];
    LAYERS.forEach((cfg, i) => {
      for (let n = 0; n < cfg.count; n++) particles.push(createParticle(cfg, i));
    });
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
    init();
  }

  function draw(p) {
    ctx.save();
    ctx.translate(p.x, p.y - scrollY * p.pFactor);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = '#c9a470';
    ctx.lineWidth   = 0.6;
    SYMBOLS[p.sym](ctx, p.size);
    ctx.restore();
  }

  function update() {
    particles.forEach(p => {
      p.x   += p.dx;
      p.y   += p.dy;
      p.rot += p.rotV;
      const pad = p.size * 1.5;
      if (p.x < -pad)  p.x = W + pad;
      if (p.x > W+pad) p.x = -pad;
      if (p.y < -pad)  p.y = H + pad;
      if (p.y > H+pad) p.y = -pad;
    });
  }

  // Smooth scroll lerp
  let scrollSmooth = 0;
  function lerpScroll() {
    scrollSmooth += (scrollTarget - scrollSmooth) * 0.055;
    scrollY = scrollSmooth;
    requestAnimationFrame(lerpScroll);
  }
  window.addEventListener('scroll', () => { scrollTarget = window.scrollY; }, { passive: true });

  function tick() {
    ctx.clearRect(0, 0, W, H);
    update();
    particles.forEach(draw);
    animId = requestAnimationFrame(tick);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else animId = requestAnimationFrame(tick);
  });

  window.addEventListener('resize', resize, { passive: true });
  resize();
  lerpScroll();
  animId = requestAnimationFrame(tick);

})();
