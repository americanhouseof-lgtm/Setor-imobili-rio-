/**
 * NOBILIS IMÓVEIS — ANIMATIONS
 * Hero entrance, scroll reveals, counters, card micro-interactions.
 */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Instant-reveal if reduced motion ───────────────────── */
  if (reduced) {
    document.querySelectorAll('[data-reveal],[data-anim]').forEach(el => {
      el.classList.add('revealed', 'animated');
    });
    return;
  }

  /* ── Hero entrance — staggered fade-up / fade-left ─────── */
  function heroEntrance() {
    const anims = document.querySelectorAll('[data-anim]');
    anims.forEach(el => {
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('animated'), delay * 1000);
    });
  }

  /* ── Scroll reveal ──────────────────────────────────────── */
  function initReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = Array.from(el.parentElement.querySelectorAll('[data-reveal]'));
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = (idx * 0.08) + 's';
        el.classList.add('revealed');
        obs.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
  }

  /* ── Counter animation ──────────────────────────────────── */
  function animateCount(el, target, duration) {
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('pt-BR');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        if (!isNaN(target)) animateCount(el, target, 1600);
        obs.unobserve(el);
      });
    }, { threshold: 0.8 });

    document.querySelectorAll('.count[data-target]').forEach(el => obs.observe(el));
  }

  /* ── Property card hover glow ───────────────────────────── */
  function initPropCards() {
    document.querySelectorAll('.prop-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
        const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
      });
    });
  }

  /* ── Active nav section tracking ───────────────────────── */
  function initNavTrack() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      });
    }, { rootMargin: '-30% 0px -55% 0px' });
    sections.forEach(s => obs.observe(s));
  }

  /* ── Parallax on hero image ─────────────────────────────── */
  function initHeroParallax() {
    const img = document.querySelector('.hero-img');
    if (!img) return;
    window.addEventListener('scroll', () => {
      const y = window.scrollY * 0.15;
      img.style.transform = `translateY(${y}px)`;
    }, { passive: true });
  }

  /* ── Init ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    heroEntrance();
    initReveal();
    initCounters();
    initPropCards();
    initNavTrack();
    initHeroParallax();
  });

})();
