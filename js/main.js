/* ==========================================================================
   SHARED SITE BEHAVIOR — Phase 1 Foundation
   ==========================================================================
   Mobile nav toggle, smooth anchor scroll, scroll-reveal, and footer year.
   Used by the new foundation pages (about/methodology/industries/solutions).
   index.html and the blog pages keep their own inline scripts unchanged to
   avoid any regression risk to already-working functionality.
   ========================================================================== */

(function () {
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Smooth scroll for same-page anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      }
    });
  });

  // Scroll reveals are handled by motion.js.

  // Footer copyright year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
