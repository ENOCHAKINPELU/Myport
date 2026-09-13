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
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Scroll reveal animation
  function revealOnScroll() {
    document.querySelectorAll('.reveal').forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < window.innerHeight - 150) {
        el.classList.add('active');
      }
    });
  }
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);

  // Footer copyright year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
