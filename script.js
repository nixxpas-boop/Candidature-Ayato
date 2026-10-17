(() => {
  const intro = document.getElementById('intro');
  const site = document.getElementById('site');
  const video = document.getElementById('burnVideo');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.topnav');
  let finished = false;
  let safetyTimer;

  function revealSite() {
    if (finished) return;
    finished = true;
    window.clearTimeout(safetyTimer);
    intro.classList.add('is-fading');
    window.setTimeout(() => {
      intro.classList.add('is-done');
      site.classList.add('is-visible');
      site.setAttribute('aria-hidden', 'false');
      intro.setAttribute('aria-hidden', 'true');
    }, 850);
    window.setTimeout(() => { intro.hidden = true; }, 2100);
  }

  video.addEventListener('ended', revealSite);
  video.addEventListener('error', revealSite);

  // Do not let a slow or unsupported video hold the whole site on a black screen.
  safetyTimer = window.setTimeout(revealSite, 10000);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    video.pause();
    revealSite();
  } else {
    video.play().catch(() => {
      // If autoplay is blocked, the safety timer still reveals the site.
    });
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
})();