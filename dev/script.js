const isMobile = window.matchMedia('only screen and (max-width: 1279px)')
  .matches;

if (!isMobile) {
  require('tsparticles');

  tsParticles.load('particles', {
    preset: 'basic',
  });
}

document.querySelectorAll('[data-track-label]').forEach((el) => {
  el.addEventListener('click', () => {
    const { trackCategory, trackLabel } = el.dataset;

    if (trackLabel) {
      ga('send', 'event', trackCategory || 'Other', 'click', trackLabel);
    }
  });
});
