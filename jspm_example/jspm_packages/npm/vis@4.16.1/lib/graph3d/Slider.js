/* */ 
var util = require('../util');
function Slider(container, options) {
  if (container === undefined) {
    throw 'Error: No container element defined';
  }
  this.container = container;
  this.visible = (options && options.visible != undefined) ? options.visible : true;
  if (this.visible) {
    this.frame = document.createElement('DIV');
    this.frame.style.width = '100%';
    this.frame.style.position = 'relative';
    this.container.appendChild(this.frame);
    this.frame.prev = document.createElement('INPUT');
    this.frame.prev.type = 'BUTTON';
    this.frame.prev.value = 'Prev';
    this.frame.appendChild(this.frame.prev);
    this.frame.play = document.createElement('INPUT');
    this.frame.play.type = 'BUTTON';
    this.frame.play.value = 'Play';
    this.frame.appendChild(this.frame.play);
    this.frame.next = document.createElement('INPUT');
    this.frame.next.type = 'BUTTON';
    this.frame.next.value = 'Next';
    this.frame.appendChild(this.frame.next);
    this.frame.bar = document.createElement('INPUT');
    this.frame.bar.type = 'BUTTON';
    this.frame.bar.style.position = 'absolute';
    this.frame.bar.style.border = '1px solid red';
    this.frame.bar.style.width = '100px';
    this.frame.bar.style.height = '6px';
    this.frame.bar.style.borderRadius = '2px';
    this.frame.bar.style.MozBorderRadius = '2px';
    this.frame.bar.style.border = '1px solid #7F7F7F';
    this.frame.bar.style.backgroundColor = '#E5E5E5';
    this.frame.appendChild(this.frame.bar);
    this.frame.slide = document.createElement('INPUT');
    this.frame.slide.type = 'BUTTON';
    this.frame.slide.style.margin = '0px';
    this.frame.slide.value = ' ';
    this.frame.slide.style.position = 'relative';
    this.frame.slide.style.left = '-100px';
    this.frame.appendChild(this.frame.slide);
    var me = this;
    this.frame.slide.onmousedown = function(event) {
      me._onMouseDown(event);
    };
    this.frame.prev.onclick = function(event) {
      me.prev(event);
    };
    this.frame.play.onclick = function(event) {
      me.togglePlay(event);
    };
    this.frame.next.onclick = function(event) {
      me.next(event);
    };
  }
  this.onChangeCallback = undefined;
  this.values = [];
  this.index = undefined;
  this.playTimeout = undefined;
  this.playInterval = 1000;
  this.playLoop = true;
}
Slider.prototype.prev = function() {
  var index = this.getIndex();
  if (index > 0) {
    index--;
    this.setIndex(index);
  }
};
Slider.prototype.next = function() {
  var index = this.getIndex();
  if (index < this.values.length - 1) {
    index++;
    this.setIndex(index);
  }
};
Slider.prototype.playNext = function() {
  var start = new Date();
  var index = this.getIndex();
  if (index < this.values.length - 1) {
    index++;
    this.setIndex(index);
  } else if (this.playLoop) {
    index = 0;
    this.setIndex(index);
  }
  var end = new Date();
  var diff = (end - start);
  var interval = Math.max(this.playInterval - diff, 0);
  var me = this;
  this.playTimeout = setTimeout(function() {
    me.playNext();
  }, interval);
};
Slider.prototype.togglePlay = function() {
  if (this.playTimeout === undefined) {
    this.play();
  } else {
    this.stop();
  }
};
Slider.prototype.play = function() {
  if (this.playTimeout)
    return;
  this.playNext();
  if (this.frame) {
    this.frame.play.value = 'Stop';
  }
};
Slider.prototype.stop = function() {
  clearInterval(this.playTimeout);
  this.playTimeout = undefined;
  if (this.frame) {
    this.frame.play.value = 'Play';
  }
};
Slider.prototype.setOnChangeCallback = function(callback) {
  this.onChangeCallback = callback;
};
Slider.prototype.setPlayInterval = function(interval) {
  this.playInterval = interval;
};
Slider.prototype.getPlayInterval = function(interval) {
  return this.playInterval;
};
Slider.prototype.setPlayLoop = function(doLoop) {
  this.playLoop = doLoop;
};
Slider.prototype.onChange = function() {
  if (this.onChangeCallback !== undefined) {
    this.onChangeCallback();
  }
};
Slider.prototype.redraw = function() {
  if (this.frame) {
    this.frame.bar.style.top = (this.frame.clientHeight / 2 - this.frame.bar.offsetHeight / 2) + 'px';
    this.frame.bar.style.width = (this.frame.clientWidth - this.frame.prev.clientWidth - this.frame.play.clientWidth - this.frame.next.clientWidth - 30) + 'px';
    var left = this.indexToLeft(this.index);
    this.frame.slide.style.left = (left) + 'px';
  }
};
Slider.prototype.setValues = function(values) {
  this.values = values;
  if (this.values.length > 0)
    this.setIndex(0);
  else
    this.index = undefined;
};
Slider.prototype.setIndex = function(index) {
  if (index < this.values.length) {
    this.index = index;
    this.redraw();
    this.onChange();
  } else {
    throw 'Error: index out of range';
  }
};
Slider.prototype.getIndex = function() {
  return this.index;
};
Slider.prototype.get = function() {
  return this.values[this.index];
};
Slider.prototype._onMouseDown = function(event) {
  var leftButtonDown = event.which ? (event.which === 1) : (event.button === 1);
  if (!leftButtonDown)
    return;
  this.startClientX = event.clientX;
  this.startSlideX = parseFloat(this.frame.slide.style.left);
  this.frame.style.cursor = 'move';
  var me = this;
  this.onmousemove = function(event) {
    me._onMouseMove(event);
  };
  this.onmouseup = function(event) {
    me._onMouseUp(event);
  };
  util.addEventListener(document, 'mousemove', this.onmousemove);
  util.addEventListener(document, 'mouseup', this.onmouseup);
  util.preventDefault(event);
};
Slider.prototype.leftToIndex = function(left) {
  var width = parseFloat(this.frame.bar.style.width) - this.frame.slide.clientWidth - 10;
  var x = left - 3;
  var index = Math.round(x / width * (this.values.length - 1));
  if (index < 0)
    index = 0;
  if (index > this.values.length - 1)
    index = this.values.length - 1;
  return index;
};
Slider.prototype.indexToLeft = function(index) {
  var width = parseFloat(this.frame.bar.style.width) - this.frame.slide.clientWidth - 10;
  var x = index / (this.values.length - 1) * width;
  var left = x + 3;
  return left;
};
Slider.prototype._onMouseMove = function(event) {
  var diff = event.clientX - this.startClientX;
  var x = this.startSlideX + diff;
  var index = this.leftToIndex(x);
  this.setIndex(index);
  util.preventDefault();
};
Slider.prototype._onMouseUp = function(event) {
  this.frame.style.cursor = 'auto';
  util.removeEventListener(document, 'mousemove', this.onmousemove);
  util.removeEventListener(document, 'mouseup', this.onmouseup);
  util.preventDefault();
};
module.exports = Slider;
