(function() {
  'use strict';

  var root = this;

  // ColumnLayout.js (interface)
  var ColumnLayout = {
    relayout: function(columns) {
      throw new Error('This is not a implementation of a ColumnLayout interface.');
    },
    reset: function(columns) {}
  }

  // ThreeColumnLayout.js (implementation)
  var ThreeColumnLayout = function() {
    this._cacheElements();
  }

  ThreeColumnLayout.prototype = Object.create(ColumnLayout);

  ThreeColumnLayout.prototype._createColumns = function() {
    this.$firstColumn = $('<div class="columns first project-list-column"></div>');
    this.$secondColumn = $('<div class="columns second project-list-column"></div>');
    this.$thirdColumn = $('<div class="columns third project-list-column"></div>');
  }

  ThreeColumnLayout.prototype._cacheElements = function() {
    this.$el = $('.projects-list');
    this.$items = $('.project-list-item');

    if (this._noColumns()) this._createColumns();
  }

  ThreeColumnLayout.prototype._noColumns = function() {
    return !this.$firstColumn;
  }

  ThreeColumnLayout.prototype._oneColumn = function() {
    for (var i = 0; i < this.$items.length; i += 1) {
      this.$firstColumn.append(this.$items.filter('.project-list-item-' + i));
    };
    this.$firstColumn.appendTo(this.$el);
  }

  ThreeColumnLayout.prototype._twoColumns = function() {
    for (var i = 0; i < this.$items.length; i += 2) {
      this.$firstColumn.append(this.$items.filter('.project-list-item-' + i));
      this.$secondColumn.append(this.$items.filter('.project-list-item-' + (i + 1)));
    };
    this.$firstColumn.appendTo(this.$el);
    this.$secondColumn.appendTo(this.$el);
  }

  ThreeColumnLayout.prototype._threeColumns = function() {
    for (var i = 0; i < this.$items.length; i += 3) {
      this.$firstColumn.append(this.$items.filter('.project-list-item-' + i));
      this.$secondColumn.append(this.$items.filter('.project-list-item-' + (i + 1)));
      this.$thirdColumn.append(this.$items.filter('.project-list-item-' + (i + 2)));
    };
    this.$firstColumn.appendTo(this.$el);
    this.$secondColumn.appendTo(this.$el);
    this.$thirdColumn.appendTo(this.$el);
  }

  ThreeColumnLayout.prototype.reset = function(columns) {
    $('.projects-list').html('');
  }

  ThreeColumnLayout.prototype.relayout = function(columns) {
    this.reset();
    switch(columns) {
      case 1:
        this._oneColumn();
        break;
      case 2:
        this._twoColumns();
        break;
      case 3:
        this._threeColumns();
        break;
      default:
        throw new Error('This is a three columns layout implementation and there is no ' + columns + ' columns implementation.');
        break;
    }
  }

  root.ThreeColumnLayout = ThreeColumnLayout;

}).call(this);