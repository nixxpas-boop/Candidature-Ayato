(() => {
  const intro = document.getElementById('intro');
  const site = document.getElementById('site');
  const video = document.getElementById('burnVideo');
  const skip = document.getElementById('skipIntro');
  const progress = document.getElementById('introProgress');
  const fallback = document.getElementById('introFallback');
  const caption = document.getElementById('introCaption');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.topnav');
  let opened = false;
  let progressFrame = 0;

  function revealSite() {
    if (opened) return;
    opened = true;
    cancelAnimationFrame(progressFrame);
    progress.style.width = '100%';
    intro.classList.add('is-done');
    site.classList.add('is-visible');
    site.setAttribute('aria-hidden', 'false');
    document.body.classList.add('intro-finished');
    window.setTimeout(() => { intro.hidden = true; }, 1200);
  }

  function updateProgress() {
    if (opened) return;
    const duration = video.duration;
    const current = video.currentTime || 0;
    const ratio = Number.isFinite(duration) && duration > 0 ? Math.min(current / duration, 1) : 0;
    progress.style.width = (ratio * 100) + '%';
    if (!opened) progressFrame = requestAnimationFrame(updateProgress);
  }

  let safetyTimer = null;
  function setVideoSafetyTimer() {
    if (safetyTimer) window.clearTimeout(safetyTimer);
    // Never leave visitors trapped on a black intro if playback stalls.
    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 9;
    const wait = Math.min(Math.max(duration + 1.5, 6), 22) * 1000;
    safetyTimer = window.setTimeout(() => {
      if (!opened) revealSite();
    }, wait);
  }

  video.addEventListener('loadedmetadata', setVideoSafetyTimer);
  video.addEventListener('ended', revealSite);
  video.addEventListener('timeupdate', () => {
    if (video.duration && Number.isFinite(video.duration)) {
      progress.style.width = (Math.min(video.currentTime / video.duration, 1) * 100) + '%';
    }
  });
  video.addEventListener('error', () => {
    video.hidden = true;
    fallback.hidden = false;
    caption.textContent = "Le dossier est prêt à être consulté.";
    window.setTimeout(revealSite, 1800);
  });
  video.addEventListener('playing', () => { progressFrame = requestAnimationFrame(updateProgress); });
  skip.addEventListener('click', revealSite);

  const showIntro = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (showIntro) {
    video.pause();
    revealSite();
  } else {
    const playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === 'function') {
      playAttempt.catch(() => {
        caption.textContent = "Cliquez sur « Passer l'introduction » pour accéder aux archives.";
      });
    }
    // Fallback if metadata never loads or the browser stalls during playback.
    setVideoSafetyTimer();
    video.addEventListener('stalled', () => {
      if (!opened) window.setTimeout(revealSite, 3500);
    }, { once: true });
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