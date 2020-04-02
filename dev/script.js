const isMobile = window.matchMedia('only screen and (max-width: 1279px)')
  .matches;

if (!isMobile) {
  require('tsparticles');

  tsParticles.load('particles', {
    preset: 'basic',
  });
}
