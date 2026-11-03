/* ==========================================================================
   SITE: shared behavior for the public portfolio pages
   Header state, mobile menu, scroll reveals, hero parallax, contact form,
   footer year. Everything degrades to fully visible, static content.
   ========================================================================== */
(() => {
  window.__site = true; // tells the <head> failsafe that reveals are handled
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('.menu-toggle');

  // Header: solid after leaving the top, hides on scroll down, returns on scroll up.
  if (header) {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 24);
      const menuOpen = header.classList.contains('menu-open');
      header.classList.toggle('is-hidden', !menuOpen && y > 480 && y > lastY + 4);
      if (y < lastY - 4 || y < 480) header.classList.remove('is-hidden');
      lastY = y;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
    // Keep the header visible while keyboard users move through it.
    header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  }

  // Mobile menu
  if (header && toggle) {
    const setOpen = (open) => {
      header.classList.toggle('menu-open', open);
      document.body.classList.toggle('menu-locked', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', () => setOpen(!header.classList.contains('menu-open')));
    header.querySelectorAll('.nav-list a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('menu-open')) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }

  // Scroll reveals
  const targets = document.querySelectorAll('[data-reveal], .process');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add('is-in'));
  }

  // Stagger siblings that share a [data-stagger] parent.
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    [...group.querySelectorAll(':scope > [data-reveal]')].forEach((el, i) => {
      el.style.setProperty('--d', `${Math.min(i, 6) * 0.09}s`);
    });
  });

  // Hero parallax: a gentle drift of the photograph, desktop pointers only.
  const heroMedia = document.querySelector('.hero-media');
  if (heroMedia && !reduceMotion.matches && window.matchMedia('(pointer: fine)').matches) {
    const hero = heroMedia.parentElement;
    let raf = 0;
    const drift = () => {
      const y = window.scrollY;
      if (y < hero.offsetHeight) heroMedia.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
      raf = 0;
    };
    window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(drift); }, { passive: true });
  }

  // Contact form → Formspree, without leaving the page.
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-form-status');
  if (form && status) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const label = button.innerHTML;
      button.disabled = true;
      button.textContent = 'Sending…';
      status.textContent = '';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('Message was not accepted');
        status.textContent = "Thank you. Your message has been sent. I'll reply shortly.";
        form.reset();
      } catch {
        status.textContent = 'Your message could not be sent. Please try again or email me directly.';
      } finally {
        button.disabled = false;
        button.innerHTML = label;
      }
    });
  }

  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();
})();
