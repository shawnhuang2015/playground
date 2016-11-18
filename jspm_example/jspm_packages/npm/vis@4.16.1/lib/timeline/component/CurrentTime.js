/* */ 
var util = require('../../util');
var Component = require('./Component');
var moment = require('../../module/moment');
var locales = require('../locales');
function CurrentTime(body, options) {
  this.body = body;
  this.defaultOptions = {
    rtl: false,
    showCurrentTime: true,
    moment: moment,
    locales: locales,
    locale: 'en'
  };
  this.options = util.extend({}, this.defaultOptions);
  this.offset = 0;
  this._create();
  this.setOptions(options);
}
CurrentTime.prototype = new Component();
CurrentTime.prototype._create = function() {
  var bar = document.createElement('div');
  bar.className = 'vis-current-time';
  bar.style.position = 'absolute';
  bar.style.top = '0px';
  bar.style.height = '100%';
  this.bar = bar;
};
CurrentTime.prototype.destroy = function() {
  this.options.showCurrentTime = false;
  this.redraw();
  this.body = null;
};
CurrentTime.prototype.setOptions = function(options) {
  if (options) {
    util.selectiveExtend(['rtl', 'showCurrentTime', 'moment', 'locale', 'locales'], this.options, options);
  }
};
CurrentTime.prototype.redraw = function() {
  if (this.options.showCurrentTime) {
    var parent = this.body.dom.backgroundVertical;
    if (this.bar.parentNode != parent) {
      if (this.bar.parentNode) {
        this.bar.parentNode.removeChild(this.bar);
      }
      parent.appendChild(this.bar);
      this.start();
    }
    var now = this.options.moment(new Date().valueOf() + this.offset);
    var x = this.body.util.toScreen(now);
    var locale = this.options.locales[this.options.locale];
    if (!locale) {
      if (!this.warned) {
        console.log('WARNING: options.locales[\'' + this.options.locale + '\'] not found. See http://visjs.org/docs/timeline/#Localization');
        this.warned = true;
      }
      locale = this.options.locales['en'];
    }
    var title = locale.current + ' ' + locale.time + ': ' + now.format('dddd, MMMM Do YYYY, H:mm:ss');
    title = title.charAt(0).toUpperCase() + title.substring(1);
    if (this.options.rtl) {
      this.bar.style.right = x + 'px';
    } else {
      this.bar.style.left = x + 'px';
    }
    this.bar.title = title;
  } else {
    if (this.bar.parentNode) {
      this.bar.parentNode.removeChild(this.bar);
    }
    this.stop();
  }
  return false;
};
CurrentTime.prototype.start = function() {
  var me = this;
  function update() {
    me.stop();
    var scale = me.body.range.conversion(me.body.domProps.center.width).scale;
    var interval = 1 / scale / 10;
    if (interval < 30)
      interval = 30;
    if (interval > 1000)
      interval = 1000;
    me.redraw();
    me.body.emitter.emit('currentTimeTick');
    me.currentTimeTimer = setTimeout(update, interval);
  }
  update();
};
CurrentTime.prototype.stop = function() {
  if (this.currentTimeTimer !== undefined) {
    clearTimeout(this.currentTimeTimer);
    delete this.currentTimeTimer;
  }
};
CurrentTime.prototype.setCurrentTime = function(time) {
  var t = util.convert(time, 'Date').valueOf();
  var now = new Date().valueOf();
  this.offset = t - now;
  this.redraw();
};
CurrentTime.prototype.getCurrentTime = function() {
  return new Date(new Date().valueOf() + this.offset);
};
module.exports = CurrentTime;
