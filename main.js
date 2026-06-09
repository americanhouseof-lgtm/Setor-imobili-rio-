/**
 * NOBILIS IMÓVEIS — MAIN JS
 * Header scroll, mobile nav, popup de contato, smooth scroll.
 */
(function () {
  'use strict';

  /* ── Header hide / show on scroll ──────────────────────── */
  const header   = document.getElementById('site-header');
  let lastY      = 0;
  let ticking    = false;

  function updateHeader() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 50);
    if (y > 160) {
      header.style.transform = y > lastY + 6
        ? 'translateY(-100%)'
        : 'translateY(0)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastY   = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; }
  }, { passive: true });

  /* ── Mobile nav ─────────────────────────────────────────── */
  const toggle  = document.getElementById('nav-toggle');
  const nav     = document.getElementById('main-nav');

  function setNav(open) {
    nav.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (toggle) toggle.addEventListener('click', () => setNav(!nav.classList.contains('open')));

  document.querySelectorAll('.nav-link').forEach(l =>
    l.addEventListener('click', () => setNav(false))
  );

  document.addEventListener('click', e => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
      setNav(false);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { setNav(false); closePopup(); }
  });

  /* ── Smooth scroll ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id  = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - hh, behavior: 'smooth' });
    });
  });

  /* ── Popup ──────────────────────────────────────────────── */
  const popup     = document.getElementById('popup');
  const popClose  = document.getElementById('popup-close');
  const popSubmit = document.getElementById('popup-submit');

  function openPopup() {
    if (!popup) return;
    popup.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => popup.querySelector('input,select')?.focus(), 80);
  }

  function closePopup() {
    if (!popup) return;
    popup.hidden = true;
    document.body.style.overflow = '';
  }

  if (popClose) popClose.addEventListener('click', closePopup);
  if (popup)    popup.addEventListener('click', e => { if (e.target === popup) closePopup(); });

  // Open popup from "Fale com um Especialista" header CTA
  const headerCta = document.querySelector('.header-cta');
  if (headerCta) {
    headerCta.addEventListener('click', e => {
      e.preventDefault();
      openPopup();
    });
  }

  // Form submit
  if (popSubmit) {
    popSubmit.addEventListener('click', () => {
      const fields = [
        document.getElementById('p-nome'),
        document.getElementById('p-tel'),
        document.getElementById('p-interesse'),
        document.getElementById('p-orcamento'),
      ];
      let valid = true;
      fields.forEach(f => {
        if (!f) return;
        if (!f.value.trim()) { f.style.borderColor = '#8b3030'; valid = false; }
        else                  { f.style.borderColor = ''; }
      });
      if (!valid) return;

      popSubmit.textContent = 'Solicitação enviada ✓';
      popSubmit.style.background = '#2a6e3f';
      popSubmit.style.borderColor = '#2a6e3f';
      popSubmit.disabled = true;

      setTimeout(() => {
        closePopup();
        fields.forEach(f => { if (f) f.value = ''; });
        popSubmit.textContent = 'Solicitar Atendimento';
        popSubmit.style.background = '';
        popSubmit.style.borderColor = '';
        popSubmit.disabled = false;
      }, 2200);
    });
  }

  /* ── Tilt on team cards ─────────────────────────────────── */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) {
    document.querySelectorAll('.membro-card').forEach(card => {
      card.style.transition = 'transform 0.15s ease, border-color 0.3s';
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width  - 0.5) * 10;
        const dy = ((e.clientY - r.top)  / r.height - 0.5) * 10;
        card.style.transform = `perspective(500px) rotateX(${-dy}deg) rotateY(${dx}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.3s';
        card.style.transform = '';
      });
    });
  }

  /* ── Console signature ──────────────────────────────────── */
  console.log(
    '%cNobilis Imóveis%c\nExclusividade que transforma patrimônio em legado.\nSyntra Digital · Premium Real Estate Demo',
    'color:#c9a470;font-size:16px;font-weight:bold;font-family:Georgia,serif',
    'color:#8a7f6e;font-size:11px'
  );

})();
