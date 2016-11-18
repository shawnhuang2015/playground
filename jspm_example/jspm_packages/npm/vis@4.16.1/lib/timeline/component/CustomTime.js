/* */ 
var Hammer = require('../../module/hammer');
var util = require('../../util');
var Component = require('./Component');
var moment = require('../../module/moment');
var locales = require('../locales');
function CustomTime(body, options) {
  this.body = body;
  this.defaultOptions = {
    moment: moment,
    locales: locales,
    locale: 'en',
    id: undefined,
    title: undefined
  };
  this.options = util.extend({}, this.defaultOptions);
  if (options && options.time) {
    this.customTime = options.time;
  } else {
    this.customTime = new Date();
  }
  this.eventParams = {};
  this.setOptions(options);
  this._create();
}
CustomTime.prototype = new Component();
CustomTime.prototype.setOptions = function(options) {
  if (options) {
    util.selectiveExtend(['moment', 'locale', 'locales', 'id'], this.options, options);
  }
};
CustomTime.prototype._create = function() {
  var bar = document.createElement('div');
  bar['custom-time'] = this;
  bar.className = 'vis-custom-time ' + (this.options.id || '');
  bar.style.position = 'absolute';
  bar.style.top = '0px';
  bar.style.height = '100%';
  this.bar = bar;
  var drag = document.createElement('div');
  drag.style.position = 'relative';
  drag.style.top = '0px';
  drag.style.left = '-10px';
  drag.style.height = '100%';
  drag.style.width = '20px';
  bar.appendChild(drag);
  this.hammer = new Hammer(drag);
  this.hammer.on('panstart', this._onDragStart.bind(this));
  this.hammer.on('panmove', this._onDrag.bind(this));
  this.hammer.on('panend', this._onDragEnd.bind(this));
  this.hammer.get('pan').set({
    threshold: 5,
    direction: Hammer.DIRECTION_HORIZONTAL
  });
};
CustomTime.prototype.destroy = function() {
  this.hide();
  this.hammer.destroy();
  this.hammer = null;
  this.body = null;
};
CustomTime.prototype.redraw = function() {
  var parent = this.body.dom.backgroundVertical;
  if (this.bar.parentNode != parent) {
    if (this.bar.parentNode) {
      this.bar.parentNode.removeChild(this.bar);
    }
    parent.appendChild(this.bar);
  }
  var x = this.body.util.toScreen(this.customTime);
  var locale = this.options.locales[this.options.locale];
  if (!locale) {
    if (!this.warned) {
      console.log('WARNING: options.locales[\'' + this.options.locale + '\'] not found. See http://visjs.org/docs/timeline.html#Localization');
      this.warned = true;
    }
    locale = this.options.locales['en'];
  }
  var title = this.options.title;
  if (title === undefined) {
    title = locale.time + ': ' + this.options.moment(this.customTime).format('dddd, MMMM Do YYYY, H:mm:ss');
    title = title.charAt(0).toUpperCase() + title.substring(1);
  }
  this.bar.style.left = x + 'px';
  this.bar.title = title;
  return false;
};
CustomTime.prototype.hide = function() {
  if (this.bar.parentNode) {
    this.bar.parentNode.removeChild(this.bar);
  }
};
CustomTime.prototype.setCustomTime = function(time) {
  this.customTime = util.convert(time, 'Date');
  this.redraw();
};
CustomTime.prototype.getCustomTime = function() {
  return new Date(this.customTime.valueOf());
};
CustomTime.prototype.setCustomTitle = function(title) {
  this.options.title = title;
};
CustomTime.prototype._onDragStart = function(event) {
  this.eventParams.dragging = true;
  this.eventParams.customTime = this.customTime;
  event.stopPropagation();
};
CustomTime.prototype._onDrag = function(event) {
  if (!this.eventParams.dragging)
    return;
  var x = this.body.util.toScreen(this.eventParams.customTime) + event.deltaX;
  var time = this.body.util.toTime(x);
  this.setCustomTime(time);
  this.body.emitter.emit('timechange', {
    id: this.options.id,
    time: new Date(this.customTime.valueOf())
  });
  event.stopPropagation();
};
CustomTime.prototype._onDragEnd = function(event) {
  if (!this.eventParams.dragging)
    return;
  this.body.emitter.emit('timechanged', {
    id: this.options.id,
    time: new Date(this.customTime.valueOf())
  });
  event.stopPropagation();
};
CustomTime.customTimeFromTarget = function(event) {
  var target = event.target;
  while (target) {
    if (target.hasOwnProperty('custom-time')) {
      return target['custom-time'];
    }
    target = target.parentNode;
  }
  return null;
};
module.exports = CustomTime;
