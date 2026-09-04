const loader = document.getElementById('loader');
const navDots = [...document.querySelectorAll('.nav-dot')];
const sections = [...document.querySelectorAll('main > section')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('load', () => {
  window.setTimeout(() => {
    loader?.classList.add('done');
  }, reduceMotion ? 0 : 500);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navDots.forEach((dot) => {
          dot.classList.toggle('is-active', dot.dataset.target === entry.target.id);
        });
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => sectionObserver.observe(section));

navDots.forEach((dot) => {
  dot.addEventListener('click', () => {
    const target = document.getElementById(dot.dataset.target);
    if (!target) return;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

const heroVideo = document.querySelector('.hero-film');
const videoToggle = document.querySelector('.video-toggle');

const setVideoButtonState = (video) => {
  if (!videoToggle) return;
  if (video && !video.paused) {
    videoToggle.textContent = '❚❚ PAUSE REEL';
    videoToggle.setAttribute('aria-label', 'Pause hero video');
    return;
  }
  videoToggle.textContent = '▶ PLAY REEL';
  videoToggle.setAttribute('aria-label', 'Play hero video');
};

if (heroVideo) {
  heroVideo.addEventListener('canplay', () => {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
  });

  heroVideo.addEventListener('play', () => setVideoButtonState(heroVideo));
  heroVideo.addEventListener('pause', () => setVideoButtonState(heroVideo));

  heroVideo.play().catch(() => {
    setVideoButtonState(heroVideo);
  });
}

videoToggle?.addEventListener('click', () => {
  if (!heroVideo) return;

  if (heroVideo.paused) {
    heroVideo.play().catch(() => {});
    return;
  }

  heroVideo.pause();
  setVideoButtonState(heroVideo);
});

const showcaseCards = [...document.querySelectorAll('.video-card')];
showcaseCards.forEach((card) => {
  const video = card.querySelector('video');
  if (!video) return;

  card.addEventListener('click', () => {
    showcaseCards.forEach((item) => {
      const itemVideo = item.querySelector('video');
      item.classList.remove('is-active');
      if (itemVideo) {
        itemVideo.pause();
        itemVideo.currentTime = 0;
        itemVideo.muted = true;
      }
    });

    card.classList.add('is-active');
    video.muted = card === showcaseCards[0];
    video.load();
    video.play().catch(() => {});
  });
});

if (showcaseCards[0]) {
  const firstVideo = showcaseCards[0].querySelector('video');
  if (firstVideo) firstVideo.muted = false;
}

if (!reduceMotion) {
  const tiltTargets = document.querySelectorAll('[data-tilt]');
  tiltTargets.forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const box = element.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      element.style.transform = `rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
    });

    element.addEventListener('pointerleave', () => {
      element.style.transform = '';
    });
  });
}
