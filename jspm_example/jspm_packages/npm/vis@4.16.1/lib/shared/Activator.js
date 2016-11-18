/* */ 
var keycharm = require('keycharm');
var Emitter = require('emitter-component');
var Hammer = require('../module/hammer');
var util = require('../util');
function Activator(container) {
  this.active = false;
  this.dom = {container: container};
  this.dom.overlay = document.createElement('div');
  this.dom.overlay.className = 'vis-overlay';
  this.dom.container.appendChild(this.dom.overlay);
  this.hammer = Hammer(this.dom.overlay);
  this.hammer.on('tap', this._onTapOverlay.bind(this));
  var me = this;
  var events = ['tap', 'doubletap', 'press', 'pinch', 'pan', 'panstart', 'panmove', 'panend'];
  events.forEach(function(event) {
    me.hammer.on(event, function(event) {
      event.stopPropagation();
    });
  });
  if (document && document.body) {
    this.onClick = function(event) {
      if (!_hasParent(event.target, container)) {
        me.deactivate();
      }
    };
    document.body.addEventListener('click', this.onClick);
  }
  if (this.keycharm !== undefined) {
    this.keycharm.destroy();
  }
  this.keycharm = keycharm();
  this.escListener = this.deactivate.bind(this);
}
Emitter(Activator.prototype);
Activator.current = null;
Activator.prototype.destroy = function() {
  this.deactivate();
  this.dom.overlay.parentNode.removeChild(this.dom.overlay);
  if (this.onClick) {
    document.body.removeEventListener('click', this.onClick);
  }
  this.hammer.destroy();
  this.hammer = null;
};
Activator.prototype.activate = function() {
  if (Activator.current) {
    Activator.current.deactivate();
  }
  Activator.current = this;
  this.active = true;
  this.dom.overlay.style.display = 'none';
  util.addClassName(this.dom.container, 'vis-active');
  this.emit('change');
  this.emit('activate');
  this.keycharm.bind('esc', this.escListener);
};
Activator.prototype.deactivate = function() {
  this.active = false;
  this.dom.overlay.style.display = '';
  util.removeClassName(this.dom.container, 'vis-active');
  this.keycharm.unbind('esc', this.escListener);
  this.emit('change');
  this.emit('deactivate');
};
Activator.prototype._onTapOverlay = function(event) {
  this.activate();
  event.stopPropagation();
};
function _hasParent(element, parent) {
  while (element) {
    if (element === parent) {
      return true;
    }
    element = element.parentNode;
  }
  return false;
}
module.exports = Activator;
