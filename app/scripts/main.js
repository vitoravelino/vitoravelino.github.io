(function() {

  var root = this;

  // MAIN
  var $mobileElements = $('.is-mobile');

  if (Device.isMobile) {
    root.scrollTo(0,1);
  } else {
    $mobileElements.remove();
  }

  var layout = new ThreeColumnLayout();

  function relayout(viewport) {
    if (viewport > 928) {
      layout.relayout(3);
    } else if (viewport <= 596) {
      layout.relayout(1);
    } else {
      layout.relayout(2);
    }
  }

  relayout($('.projects-list').width());

  root.onresize = function(e) {
    relayout($('.projects-list').width());
  }
}).call(this);