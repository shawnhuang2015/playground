/* */ 
var util = require('../util');
var hammerUtil = require('../hammerUtil');
var moment = require('../module/moment');
var Component = require('./component/Component');
var DateUtil = require('./DateUtil');
function Range(body, options) {
  var now = moment().hours(0).minutes(0).seconds(0).milliseconds(0);
  this.start = now.clone().add(-3, 'days').valueOf();
  this.end = now.clone().add(4, 'days').valueOf();
  this.body = body;
  this.deltaDifference = 0;
  this.scaleOffset = 0;
  this.startToFront = false;
  this.endToFront = true;
  this.defaultOptions = {
    rtl: false,
    start: null,
    end: null,
    moment: moment,
    direction: 'horizontal',
    moveable: true,
    zoomable: true,
    min: null,
    max: null,
    zoomMin: 10,
    zoomMax: 1000 * 60 * 60 * 24 * 365 * 10000
  };
  this.options = util.extend({}, this.defaultOptions);
  this.props = {touch: {}};
  this.animationTimer = null;
  this.body.emitter.on('panstart', this._onDragStart.bind(this));
  this.body.emitter.on('panmove', this._onDrag.bind(this));
  this.body.emitter.on('panend', this._onDragEnd.bind(this));
  this.body.emitter.on('mousewheel', this._onMouseWheel.bind(this));
  this.body.emitter.on('touch', this._onTouch.bind(this));
  this.body.emitter.on('pinch', this._onPinch.bind(this));
  this.setOptions(options);
}
Range.prototype = new Component();
Range.prototype.setOptions = function(options) {
  if (options) {
    var fields = ['direction', 'min', 'max', 'zoomMin', 'zoomMax', 'moveable', 'zoomable', 'moment', 'activate', 'hiddenDates', 'zoomKey', 'rtl'];
    util.selectiveExtend(fields, this.options, options);
    if ('start' in options || 'end' in options) {
      this.setRange(options.start, options.end);
    }
  }
};
function validateDirection(direction) {
  if (direction != 'horizontal' && direction != 'vertical') {
    throw new TypeError('Unknown direction "' + direction + '". ' + 'Choose "horizontal" or "vertical".');
  }
}
Range.prototype.setRange = function(start, end, animation, byUser) {
  if (byUser !== true) {
    byUser = false;
  }
  var finalStart = start != undefined ? util.convert(start, 'Date').valueOf() : null;
  var finalEnd = end != undefined ? util.convert(end, 'Date').valueOf() : null;
  this._cancelAnimation();
  if (animation) {
    var me = this;
    var initStart = this.start;
    var initEnd = this.end;
    var duration = (typeof animation === 'object' && 'duration' in animation) ? animation.duration : 500;
    var easingName = (typeof animation === 'object' && 'easingFunction' in animation) ? animation.easingFunction : 'easeInOutQuad';
    var easingFunction = util.easingFunctions[easingName];
    if (!easingFunction) {
      throw new Error('Unknown easing function ' + JSON.stringify(easingName) + '. ' + 'Choose from: ' + Object.keys(util.easingFunctions).join(', '));
    }
    var initTime = new Date().valueOf();
    var anyChanged = false;
    var next = function() {
      if (!me.props.touch.dragging) {
        var now = new Date().valueOf();
        var time = now - initTime;
        var ease = easingFunction(time / duration);
        var done = time > duration;
        var s = (done || finalStart === null) ? finalStart : initStart + (finalStart - initStart) * ease;
        var e = (done || finalEnd === null) ? finalEnd : initEnd + (finalEnd - initEnd) * ease;
        changed = me._applyRange(s, e);
        DateUtil.updateHiddenDates(me.options.moment, me.body, me.options.hiddenDates);
        anyChanged = anyChanged || changed;
        if (changed) {
          me.body.emitter.emit('rangechange', {
            start: new Date(me.start),
            end: new Date(me.end),
            byUser: byUser
          });
        }
        if (done) {
          if (anyChanged) {
            me.body.emitter.emit('rangechanged', {
              start: new Date(me.start),
              end: new Date(me.end),
              byUser: byUser
            });
          }
        } else {
          me.animationTimer = setTimeout(next, 20);
        }
      }
    };
    return next();
  } else {
    var changed = this._applyRange(finalStart, finalEnd);
    DateUtil.updateHiddenDates(this.options.moment, this.body, this.options.hiddenDates);
    if (changed) {
      var params = {
        start: new Date(this.start),
        end: new Date(this.end),
        byUser: byUser
      };
      this.body.emitter.emit('rangechange', params);
      this.body.emitter.emit('rangechanged', params);
    }
  }
};
Range.prototype._cancelAnimation = function() {
  if (this.animationTimer) {
    clearTimeout(this.animationTimer);
    this.animationTimer = null;
  }
};
Range.prototype._applyRange = function(start, end) {
  var newStart = (start != null) ? util.convert(start, 'Date').valueOf() : this.start,
      newEnd = (end != null) ? util.convert(end, 'Date').valueOf() : this.end,
      max = (this.options.max != null) ? util.convert(this.options.max, 'Date').valueOf() : null,
      min = (this.options.min != null) ? util.convert(this.options.min, 'Date').valueOf() : null,
      diff;
  if (isNaN(newStart) || newStart === null) {
    throw new Error('Invalid start "' + start + '"');
  }
  if (isNaN(newEnd) || newEnd === null) {
    throw new Error('Invalid end "' + end + '"');
  }
  if (newEnd < newStart) {
    newEnd = newStart;
  }
  if (min !== null) {
    if (newStart < min) {
      diff = (min - newStart);
      newStart += diff;
      newEnd += diff;
      if (max != null) {
        if (newEnd > max) {
          newEnd = max;
        }
      }
    }
  }
  if (max !== null) {
    if (newEnd > max) {
      diff = (newEnd - max);
      newStart -= diff;
      newEnd -= diff;
      if (min != null) {
        if (newStart < min) {
          newStart = min;
        }
      }
    }
  }
  if (this.options.zoomMin !== null) {
    var zoomMin = parseFloat(this.options.zoomMin);
    if (zoomMin < 0) {
      zoomMin = 0;
    }
    if ((newEnd - newStart) < zoomMin) {
      if ((this.end - this.start) === zoomMin && newStart > this.start && newEnd < this.end) {
        newStart = this.start;
        newEnd = this.end;
      } else {
        diff = (zoomMin - (newEnd - newStart));
        newStart -= diff / 2;
        newEnd += diff / 2;
      }
    }
  }
  if (this.options.zoomMax !== null) {
    var zoomMax = parseFloat(this.options.zoomMax);
    if (zoomMax < 0) {
      zoomMax = 0;
    }
    if ((newEnd - newStart) > zoomMax) {
      if ((this.end - this.start) === zoomMax && newStart < this.start && newEnd > this.end) {
        newStart = this.start;
        newEnd = this.end;
      } else {
        diff = ((newEnd - newStart) - zoomMax);
        newStart += diff / 2;
        newEnd -= diff / 2;
      }
    }
  }
  var changed = (this.start != newStart || this.end != newEnd);
  if (!((newStart >= this.start && newStart <= this.end) || (newEnd >= this.start && newEnd <= this.end)) && !((this.start >= newStart && this.start <= newEnd) || (this.end >= newStart && this.end <= newEnd))) {
    this.body.emitter.emit('checkRangedItems');
  }
  this.start = newStart;
  this.end = newEnd;
  return changed;
};
Range.prototype.getRange = function() {
  return {
    start: this.start,
    end: this.end
  };
};
Range.prototype.conversion = function(width, totalHidden) {
  return Range.conversion(this.start, this.end, width, totalHidden);
};
Range.conversion = function(start, end, width, totalHidden) {
  if (totalHidden === undefined) {
    totalHidden = 0;
  }
  if (width != 0 && (end - start != 0)) {
    return {
      offset: start,
      scale: width / (end - start - totalHidden)
    };
  } else {
    return {
      offset: 0,
      scale: 1
    };
  }
};
Range.prototype._onDragStart = function(event) {
  this.deltaDifference = 0;
  this.previousDelta = 0;
  if (!this.options.moveable)
    return;
  if (!this._isInsideRange(event))
    return;
  if (!this.props.touch.allowDragging)
    return;
  this.props.touch.start = this.start;
  this.props.touch.end = this.end;
  this.props.touch.dragging = true;
  if (this.body.dom.root) {
    this.body.dom.root.style.cursor = 'move';
  }
};
Range.prototype._onDrag = function(event) {
  if (!this.props.touch.dragging)
    return;
  if (!this.options.moveable)
    return;
  if (!this.props.touch.allowDragging)
    return;
  var direction = this.options.direction;
  validateDirection(direction);
  var delta = (direction == 'horizontal') ? event.deltaX : event.deltaY;
  delta -= this.deltaDifference;
  var interval = (this.props.touch.end - this.props.touch.start);
  var duration = DateUtil.getHiddenDurationBetween(this.body.hiddenDates, this.start, this.end);
  interval -= duration;
  var width = (direction == 'horizontal') ? this.body.domProps.center.width : this.body.domProps.center.height;
  if (this.options.rtl) {
    var diffRange = delta / width * interval;
  } else {
    var diffRange = -delta / width * interval;
  }
  var newStart = this.props.touch.start + diffRange;
  var newEnd = this.props.touch.end + diffRange;
  var safeStart = DateUtil.snapAwayFromHidden(this.body.hiddenDates, newStart, this.previousDelta - delta, true);
  var safeEnd = DateUtil.snapAwayFromHidden(this.body.hiddenDates, newEnd, this.previousDelta - delta, true);
  if (safeStart != newStart || safeEnd != newEnd) {
    this.deltaDifference += delta;
    this.props.touch.start = safeStart;
    this.props.touch.end = safeEnd;
    this._onDrag(event);
    return;
  }
  this.previousDelta = delta;
  this._applyRange(newStart, newEnd);
  var startDate = new Date(this.start);
  var endDate = new Date(this.end);
  this.body.emitter.emit('rangechange', {
    start: startDate,
    end: endDate,
    byUser: true
  });
};
Range.prototype._onDragEnd = function(event) {
  if (!this.props.touch.dragging)
    return;
  if (!this.options.moveable)
    return;
  if (!this.props.touch.allowDragging)
    return;
  this.props.touch.dragging = false;
  if (this.body.dom.root) {
    this.body.dom.root.style.cursor = 'auto';
  }
  this.body.emitter.emit('rangechanged', {
    start: new Date(this.start),
    end: new Date(this.end),
    byUser: true
  });
};
Range.prototype._onMouseWheel = function(event) {
  if (!(this.options.zoomable && this.options.moveable))
    return;
  if (!this._isInsideRange(event))
    return;
  if (this.options.zoomKey && !event[this.options.zoomKey])
    return;
  var delta = 0;
  if (event.wheelDelta) {
    delta = event.wheelDelta / 120;
  } else if (event.detail) {
    delta = -event.detail / 3;
  }
  if (delta) {
    var scale;
    if (delta < 0) {
      scale = 1 - (delta / 5);
    } else {
      scale = 1 / (1 + (delta / 5));
    }
    var pointer = this.getPointer({
      x: event.clientX,
      y: event.clientY
    }, this.body.dom.center);
    var pointerDate = this._pointerToDate(pointer);
    this.zoom(scale, pointerDate, delta);
  }
  event.preventDefault();
};
Range.prototype._onTouch = function(event) {
  this.props.touch.start = this.start;
  this.props.touch.end = this.end;
  this.props.touch.allowDragging = true;
  this.props.touch.center = null;
  this.scaleOffset = 0;
  this.deltaDifference = 0;
};
Range.prototype._onPinch = function(event) {
  if (!(this.options.zoomable && this.options.moveable))
    return;
  this.props.touch.allowDragging = false;
  if (!this.props.touch.center) {
    this.props.touch.center = this.getPointer(event.center, this.body.dom.center);
  }
  var scale = 1 / (event.scale + this.scaleOffset);
  var centerDate = this._pointerToDate(this.props.touch.center);
  var hiddenDuration = DateUtil.getHiddenDurationBetween(this.body.hiddenDates, this.start, this.end);
  var hiddenDurationBefore = DateUtil.getHiddenDurationBefore(this.options.moment, this.body.hiddenDates, this, centerDate);
  var hiddenDurationAfter = hiddenDuration - hiddenDurationBefore;
  var newStart = (centerDate - hiddenDurationBefore) + (this.props.touch.start - (centerDate - hiddenDurationBefore)) * scale;
  var newEnd = (centerDate + hiddenDurationAfter) + (this.props.touch.end - (centerDate + hiddenDurationAfter)) * scale;
  this.startToFront = 1 - scale <= 0;
  this.endToFront = scale - 1 <= 0;
  var safeStart = DateUtil.snapAwayFromHidden(this.body.hiddenDates, newStart, 1 - scale, true);
  var safeEnd = DateUtil.snapAwayFromHidden(this.body.hiddenDates, newEnd, scale - 1, true);
  if (safeStart != newStart || safeEnd != newEnd) {
    this.props.touch.start = safeStart;
    this.props.touch.end = safeEnd;
    this.scaleOffset = 1 - event.scale;
    newStart = safeStart;
    newEnd = safeEnd;
  }
  this.setRange(newStart, newEnd, false, true);
  this.startToFront = false;
  this.endToFront = true;
};
Range.prototype._isInsideRange = function(event) {
  var clientX = event.center ? event.center.x : event.clientX;
  if (this.options.rtl) {
    var x = clientX - util.getAbsoluteLeft(this.body.dom.centerContainer);
  } else {
    var x = util.getAbsoluteRight(this.body.dom.centerContainer) - clientX;
  }
  var time = this.body.util.toTime(x);
  return time >= this.start && time <= this.end;
};
Range.prototype._pointerToDate = function(pointer) {
  var conversion;
  var direction = this.options.direction;
  validateDirection(direction);
  if (direction == 'horizontal') {
    return this.body.util.toTime(pointer.x).valueOf();
  } else {
    var height = this.body.domProps.center.height;
    conversion = this.conversion(height);
    return pointer.y / conversion.scale + conversion.offset;
  }
};
Range.prototype.getPointer = function(touch, element) {
  if (this.options.rtl) {
    return {
      x: util.getAbsoluteRight(element) - touch.x,
      y: touch.y - util.getAbsoluteTop(element)
    };
  } else {
    return {
      x: touch.x - util.getAbsoluteLeft(element),
      y: touch.y - util.getAbsoluteTop(element)
    };
  }
};
Range.prototype.zoom = function(scale, center, delta) {
  if (center == null) {
    center = (this.start + this.end) / 2;
  }
  var hiddenDuration = DateUtil.getHiddenDurationBetween(this.body.hiddenDates, this.start, this.end);
  var hiddenDurationBefore = DateUtil.getHiddenDurationBefore(this.options.moment, this.body.hiddenDates, this, center);
  var hiddenDurationAfter = hiddenDuration - hiddenDurationBefore;
  var newStart = (center - hiddenDurationBefore) + (this.start - (center - hiddenDurationBefore)) * scale;
  var newEnd = (center + hiddenDurationAfter) + (this.end - (center + hiddenDurationAfter)) * scale;
  this.startToFront = delta > 0 ? false : true;
  this.endToFront = -delta > 0 ? false : true;
  var safeStart = DateUtil.snapAwayFromHidden(this.body.hiddenDates, newStart, delta, true);
  var safeEnd = DateUtil.snapAwayFromHidden(this.body.hiddenDates, newEnd, -delta, true);
  if (safeStart != newStart || safeEnd != newEnd) {
    newStart = safeStart;
    newEnd = safeEnd;
  }
  this.setRange(newStart, newEnd, false, true);
  this.startToFront = false;
  this.endToFront = true;
};
Range.prototype.move = function(delta) {
  var diff = (this.end - this.start);
  var newStart = this.start + diff * delta;
  var newEnd = this.end + diff * delta;
  this.start = newStart;
  this.end = newEnd;
};
Range.prototype.moveTo = function(moveTo) {
  var center = (this.start + this.end) / 2;
  var diff = center - moveTo;
  var newStart = this.start - diff;
  var newEnd = this.end - diff;
  this.setRange(newStart, newEnd);
};
module.exports = Range;
