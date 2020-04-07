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
const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
const lightIcon = document.querySelector('[media="(prefers-color-scheme: light)"]');
const darkIcon = document.querySelector('[media="(prefers-color-scheme: dark)"]');

lightIcon.remove();
darkIcon.remove();

// windows apparently doesn't match either light or dark
// default to dark icon if no match
if (isDarkTheme) {
  document.head.appendChild(lightIcon);
} else {
  document.head.appendChild(darkIcon);
}
