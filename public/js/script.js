(function(undefined) {
  'use strict';

  var window    = this;
      $         = this.jQuery,
      Modernizr = this.Modernizr;  


  window.addEventListener('popstate', function(e) {
    if (e.state) {
      mediator.trigger('popstate', e.state.page);
    }
  });

  //////////////
  // Mediator //
  //////////////
  var mediator = {
    _listeners: {},

    // callback is the default context if undefined
    on: function(event, callback, context) {
        var list;
        
        // event and callback are required 
        if (!event || !callback) return this; 
        
        list = this._listeners[event] || (this._listeners[event] = []); 
        list.push([event, callback, (context || callback)]);

        return this;
    },
    
    // event and callback are required and _listeners cannot be empty 
    off: function(event, callback) {
        var listeners, i;
        
        if (!event || !callback || !(listeners = this._listeners[event])) return this; 
        
        for (i = listeners.length; i >= 0; i--) {
            listener = listeners[i];
            if (callback === listener[1]) callback.slice(i, 1)
        }

        return this;
    },

    trigger: function(event) {
        var listeners, listener, callback, args, length, i;

        // _listeners cannot be empty
        if (!event || !(listeners = this._listeners[event])) return this;

        args = [];

        for (i = 1, length = arguments.length; i < length; i++) {
          args.push(arguments[i]);
        }

        for (i = listeners.length-1; i >= 0; i--) {
            listener = listeners[i];
            callback = listener[1];
            callback.apply(listener[2] || callback, args);
        }

        return this;
    },

  };

  //////////
  // Menu //
  //////////
  var menu = {
    
    on: function(event, el, callback) {
      this.$el.on(event, el, callback);
    },

    initialize: function() {
      this.$el = $('#main-menu');
      this.attachEvents();
    },

    select: function(page, href) {
      if (this.$el.find('.selected').hasClass(page)) return false;
      if (href) mediator.trigger('menuSelected', href, page);

      this.currentPage = page;
      this.$el.find('.selected').removeClass('selected');
      this.$el.find('.' + page).addClass('selected');
    },

    attachEvents: function() {
      mediator.on('popstate', this.select, this);
      
      this.$el.on('click', 'a', function(e) {
        var page = $(this).data('page');
        
        e.preventDefault();
        menu.select.apply(menu, [page, this.href]);
        
      });
    }

  };

  //////////
  // Main //
  //////////
  var main = {

    initialize: function() {
      this.$body = $('body');
      this.$main = $('#main');

      this.attachEvents();
    },


    attachEvents: function() {
      var that = this;

      mediator.on('menuSelected', this.load, this);
      mediator.on('contentLoaded', this._loaded, this);
      mediator.on('popstate', this._pop, this);

      this.$main.on('click', '.post a, .articles a', function(e) { // always blog
        e.preventDefault();
        
        that.load(this.href);
      });
    },

    load: function(href, page) {
      this.$main.fadeOut('fast', function() {
        spinner.show();
        navigation.push(href, page);
      });
    },
    
    _pop: function(page) {
      this.$main.fadeOut('fast', function() {
        spinner.show();
        navigation.pop(page);
      });
    },

    _loaded: function(content) {
      var $html    = $(content),
          $content = $html.find('#main'),
          title    = $html.filter('title').text();

      spinner.hide();
      this.$main.html($content.children())
                .fadeIn('fast');
      this.$body.removeClass()
                .addClass($content.data('type'));
      mediator.trigger('contentAppended');
    },

  };

  /////////////
  // Spinner //
  /////////////
  var spinner = {

    $el: $('#spin'),

    show: function() {
      this.$el.spin();
    },

    hide: function() {
      this.$el.spin(false);
    }

  }

  ////////////////
  // Navigation //
  ////////////////
  var navigation = {

    initialize: function(options) {
      this.attachEvents();
      window.history.replaceState({page: $('.selected').find('a').data('page'), title: document.title }, document.title, document.location.href);
    },

    push: function(href, page) {
      var that = this;
          page = (page || menu.currentPage);
      
      this._getContent(href, function(content) {
        var title;

        if (content) {
          mediator.trigger('contentLoaded', content);

          title = that._extractTitle(content);
          that._pushHistory(page, title, href);
        } else { // fallback
          window.location.href = href;
        }
      });
    },

    pop: function(page) {
      var that = this;

      this._getContent(document.location.pathname, function(content) {
        if (content) {
          mediator.trigger('contentLoaded', content);
        } else { // fallback
          window.location.href = href;
        }
      });
    },

    updateTitle: function(title) {
      document.title = title;
    },

    attachEvents: function() {
      mediator.on('popstate', this.pop, this);
      mediator.on('titleChanged', this.updateTitle, this);
    },

    // private

    _extractTitle: function(content) {
      return $(content).filter('title').text();
    },

    _getContent: function(href, callback) {
      $.ajax({url: href, dataType: 'html'})
      .done(callback)
      .fail(function() {
        callback(null);
      });
    },

    _pushHistory: function(page, title, href) {
      window.history.pushState({page: page, title: title}, title, href);
    },

  }; // navigation

  /////////////
  // Plugins //
  /////////////
  var plugins = {

    initialize: function() {
      mediator.on('contentAppended', this.refresh);
      this.refresh();
    },

    refresh: function() {
      $('.fancybox').fancybox();
      prettyPrint();  
    },

    iOSSupport: function() {
      var agent = window.navigator.userAgent,
          start = agent.indexOf('OS ');

      if ((agent.indexOf( 'iPhone' ) > -1 || agent.indexOf( 'iPad' ) > -1 ) && start > -1) {
        return parseFloat(agent.substr( start + 3, 3 ).replace( '_', '.' )) >= 5.0;
      }
      return true;
    }

  };

  ///////////////
  // DOM Ready //
  ///////////////
  $(function() {

    if ( Modernizr.history && plugins.iOSSupport()) {
      menu.initialize();
      main.initialize();
      navigation.initialize();
      plugins.initialize();
    }

  });

}).call(this);