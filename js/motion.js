/* Animate once as content enters view; never hide content while waiting. */
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const played = new WeakSet();
  const running = new Set();
  const selector = '.section-title, .section-kicker, .work-heading, .reveal, .work-card, .skill-card, .insight-card';
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      observer.unobserve(element);
      if (played.has(element) || preference.matches) continue;
      played.add(element);
      // Do not animate both a card and its parent grid.
      if (element.parentElement.closest('[data-motion-target]')) continue;
      const siblings = [...element.parentElement.children].filter(el => el.matches(selector));
      const delay = Math.min(siblings.indexOf(element), 3) * 55;
      const animation = element.animate([
        { opacity: .35, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 560, delay: Math.max(0, delay), easing: 'cubic-bezier(.2,.7,.2,1)' });
      running.add(animation);
      animation.finished.catch(() => {}).finally(() => running.delete(animation));
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll(selector).forEach(element => {
    element.dataset.motionTarget = '';
    observer.observe(element);
  });
  preference.addEventListener('change', () => {
    if (preference.matches) running.forEach(animation => animation.cancel());
  });
})();
