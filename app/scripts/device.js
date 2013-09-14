(function() {
  'use strict';

  var root = this;

  root.Device = {
    isMobile: (function() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    })()
  }

}).call(this);