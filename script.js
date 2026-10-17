(() => {
  const intro = document.getElementById('intro');
  const site = document.getElementById('site');
  const video = document.getElementById('burnVideo');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.topnav');
  let finished = false;
  let fallbackTimer;

  function revealSite() {
    if (finished) return;
    finished = true;
    window.clearTimeout(fallbackTimer);
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
  video.addEventListener('error', () => {
    // If the file cannot be played, move on instead of leaving a black screen forever.
    fallbackTimer = window.setTimeout(revealSite, 1200);
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    video.pause();
    revealSite();
  } else {
    const playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === 'function') {
      playAttempt.catch(() => {
        // Muted autoplay is normally allowed; this is a fallback for restrictive browsers.
        video.controls = true;
      });
    }
    // Failsafe: if the video cannot start or never ends, the page remains accessible.
    fallbackTimer = window.setTimeout(revealSite, 20000);
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