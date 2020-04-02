//
// Particles
//
const isSmallScreen = window.matchMedia('only screen and (max-width: 1279px)').matches;

if (!isSmallScreen) {
  require('tsparticles');

  tsParticles.load('particles', {
    preset: 'basic',
  });
}

//
//  Analytics
//
document.querySelectorAll('[data-track-label]').forEach((el) => {
  el.addEventListener('click', () => {
    const { trackCategory, trackLabel } = el.dataset;

    if (trackLabel) {
      ga('send', 'event', trackCategory || 'Other', 'click', trackLabel);
    }
  });
});

//
// Favicon
//
const isLightTheme = window.matchMedia('(prefers-color-scheme: light)').matches;
const lightIcon = document.querySelector('[media="(prefers-color-scheme: light)"]');
const darkIcon = document.querySelector('[media="(prefers-color-scheme: dark)"]');

lightIcon.remove();
darkIcon.remove();

if (isLightTheme) {
  document.head.appendChild(lightIcon);
} else {
  document.head.appendChild(darkIcon);
}
