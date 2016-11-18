/* */ 
var Emitter = require('emitter-component');
var Hammer = require('../module/hammer');
var hammerUtil = require('../hammerUtil');
var util = require('../util');
var DataSet = require('../DataSet');
var DataView = require('../DataView');
var Range = require('./Range');
var ItemSet = require('./component/ItemSet');
var TimeAxis = require('./component/TimeAxis');
var Activator = require('../shared/Activator');
var DateUtil = require('./DateUtil');
var CustomTime = require('./component/CustomTime');
function Core() {}
Emitter(Core.prototype);
Core.prototype._create = function(container) {
  this.dom = {};
  this.dom.container = container;
  this.dom.root = document.createElement('div');
  this.dom.background = document.createElement('div');
  this.dom.backgroundVertical = document.createElement('div');
  this.dom.backgroundHorizontal = document.createElement('div');
  this.dom.centerContainer = document.createElement('div');
  this.dom.leftContainer = document.createElement('div');
  this.dom.rightContainer = document.createElement('div');
  this.dom.center = document.createElement('div');
  this.dom.left = document.createElement('div');
  this.dom.right = document.createElement('div');
  this.dom.top = document.createElement('div');
  this.dom.bottom = document.createElement('div');
  this.dom.shadowTop = document.createElement('div');
  this.dom.shadowBottom = document.createElement('div');
  this.dom.shadowTopLeft = document.createElement('div');
  this.dom.shadowBottomLeft = document.createElement('div');
  this.dom.shadowTopRight = document.createElement('div');
  this.dom.shadowBottomRight = document.createElement('div');
  this.dom.root.className = 'vis-timeline';
  this.dom.background.className = 'vis-panel vis-background';
  this.dom.backgroundVertical.className = 'vis-panel vis-background vis-vertical';
  this.dom.backgroundHorizontal.className = 'vis-panel vis-background vis-horizontal';
  this.dom.centerContainer.className = 'vis-panel vis-center';
  this.dom.leftContainer.className = 'vis-panel vis-left';
  this.dom.rightContainer.className = 'vis-panel vis-right';
  this.dom.top.className = 'vis-panel vis-top';
  this.dom.bottom.className = 'vis-panel vis-bottom';
  this.dom.left.className = 'vis-content';
  this.dom.center.className = 'vis-content';
  this.dom.right.className = 'vis-content';
  this.dom.shadowTop.className = 'vis-shadow vis-top';
  this.dom.shadowBottom.className = 'vis-shadow vis-bottom';
  this.dom.shadowTopLeft.className = 'vis-shadow vis-top';
  this.dom.shadowBottomLeft.className = 'vis-shadow vis-bottom';
  this.dom.shadowTopRight.className = 'vis-shadow vis-top';
  this.dom.shadowBottomRight.className = 'vis-shadow vis-bottom';
  this.dom.root.appendChild(this.dom.background);
  this.dom.root.appendChild(this.dom.backgroundVertical);
  this.dom.root.appendChild(this.dom.backgroundHorizontal);
  this.dom.root.appendChild(this.dom.centerContainer);
  this.dom.root.appendChild(this.dom.leftContainer);
  this.dom.root.appendChild(this.dom.rightContainer);
  this.dom.root.appendChild(this.dom.top);
  this.dom.root.appendChild(this.dom.bottom);
  this.dom.centerContainer.appendChild(this.dom.center);
  this.dom.leftContainer.appendChild(this.dom.left);
  this.dom.rightContainer.appendChild(this.dom.right);
  this.dom.centerContainer.appendChild(this.dom.shadowTop);
  this.dom.centerContainer.appendChild(this.dom.shadowBottom);
  this.dom.leftContainer.appendChild(this.dom.shadowTopLeft);
  this.dom.leftContainer.appendChild(this.dom.shadowBottomLeft);
  this.dom.rightContainer.appendChild(this.dom.shadowTopRight);
  this.dom.rightContainer.appendChild(this.dom.shadowBottomRight);
  this.on('rangechange', function() {
    if (this.initialDrawDone === true) {
      this._redraw();
    }
  }.bind(this));
  this.on('touch', this._onTouch.bind(this));
  this.on('pan', this._onDrag.bind(this));
  var me = this;
  this.on('_change', function(properties) {
    if (properties && properties.queue == true) {
      if (!me._redrawTimer) {
        me._redrawTimer = setTimeout(function() {
          me._redrawTimer = null;
          me._redraw();
        }, 0);
      }
    } else {
      me._redraw();
    }
  });
  this.hammer = new Hammer(this.dom.root);
  var pinchRecognizer = this.hammer.get('pinch').set({enable: true});
  hammerUtil.disablePreventDefaultVertically(pinchRecognizer);
  this.hammer.get('pan').set({
    threshold: 5,
    direction: Hammer.DIRECTION_HORIZONTAL
  });
  this.listeners = {};
  var events = ['tap', 'doubletap', 'press', 'pinch', 'pan', 'panstart', 'panmove', 'panend'];
  events.forEach(function(type) {
    var listener = function(event) {
      if (me.isActive()) {
        me.emit(type, event);
      }
    };
    me.hammer.on(type, listener);
    me.listeners[type] = listener;
  });
  hammerUtil.onTouch(this.hammer, function(event) {
    me.emit('touch', event);
  }.bind(this));
  hammerUtil.onRelease(this.hammer, function(event) {
    me.emit('release', event);
  }.bind(this));
  function onMouseWheel(event) {
    if (me.isActive()) {
      me.emit('mousewheel', event);
    }
  }
  this.dom.root.addEventListener('mousewheel', onMouseWheel);
  this.dom.root.addEventListener('DOMMouseScroll', onMouseWheel);
  this.props = {
    root: {},
    background: {},
    centerContainer: {},
    leftContainer: {},
    rightContainer: {},
    center: {},
    left: {},
    right: {},
    top: {},
    bottom: {},
    border: {},
    scrollTop: 0,
    scrollTopMin: 0
  };
  this.customTimes = [];
  this.touch = {};
  this.redrawCount = 0;
  this.initialDrawDone = false;
  if (!container)
    throw new Error('No container provided');
  container.appendChild(this.dom.root);
};
Core.prototype.setOptions = function(options) {
  if (options) {
    var fields = ['width', 'height', 'minHeight', 'maxHeight', 'autoResize', 'start', 'end', 'clickToUse', 'dataAttributes', 'hiddenDates', 'locale', 'locales', 'moment', 'rtl', 'throttleRedraw'];
    util.selectiveExtend(fields, this.options, options);
    if (this.options.rtl) {
      var contentContainer = this.dom.leftContainer;
      this.dom.leftContainer = this.dom.rightContainer;
      this.dom.rightContainer = contentContainer;
      this.dom.container.style.direction = "rtl";
      this.dom.backgroundVertical.className = 'vis-panel vis-background vis-vertical-rtl';
    }
    this.options.orientation = {
      item: undefined,
      axis: undefined
    };
    if ('orientation' in options) {
      if (typeof options.orientation === 'string') {
        this.options.orientation = {
          item: options.orientation,
          axis: options.orientation
        };
      } else if (typeof options.orientation === 'object') {
        if ('item' in options.orientation) {
          this.options.orientation.item = options.orientation.item;
        }
        if ('axis' in options.orientation) {
          this.options.orientation.axis = options.orientation.axis;
        }
      }
    }
    if (this.options.orientation.axis === 'both') {
      if (!this.timeAxis2) {
        var timeAxis2 = this.timeAxis2 = new TimeAxis(this.body);
        timeAxis2.setOptions = function(options) {
          var _options = options ? util.extend({}, options) : {};
          _options.orientation = 'top';
          TimeAxis.prototype.setOptions.call(timeAxis2, _options);
        };
        this.components.push(timeAxis2);
      }
    } else {
      if (this.timeAxis2) {
        var index = this.components.indexOf(this.timeAxis2);
        if (index !== -1) {
          this.components.splice(index, 1);
        }
        this.timeAxis2.destroy();
        this.timeAxis2 = null;
      }
    }
    if (typeof options.drawPoints == 'function') {
      options.drawPoints = {onRender: options.drawPoints};
    }
    if ('hiddenDates' in this.options) {
      DateUtil.convertHiddenOptions(this.options.moment, this.body, this.options.hiddenDates);
    }
    if ('clickToUse' in options) {
      if (options.clickToUse) {
        if (!this.activator) {
          this.activator = new Activator(this.dom.root);
        }
      } else {
        if (this.activator) {
          this.activator.destroy();
          delete this.activator;
        }
      }
    }
    if ('showCustomTime' in options) {
      throw new Error('Option `showCustomTime` is deprecated. Create a custom time bar via timeline.addCustomTime(time [, id])');
    }
    this._initAutoResize();
  }
  this.components.forEach((component) => component.setOptions(options));
  if ('configure' in options) {
    if (!this.configurator) {
      this.configurator = this._createConfigurator();
    }
    this.configurator.setOptions(options.configure);
    var appliedOptions = util.deepExtend({}, this.options);
    this.components.forEach(function(component) {
      util.deepExtend(appliedOptions, component.options);
    });
    this.configurator.setModuleOptions({global: appliedOptions});
  }
  if (!this._origRedraw) {
    this._origRedraw = this._redraw.bind(this);
    this._redraw = util.throttle(this._origRedraw, this.options.throttleRedraw);
  } else {
    this._redraw();
  }
};
Core.prototype.isActive = function() {
  return !this.activator || this.activator.active;
};
Core.prototype.destroy = function() {
  this.setItems(null);
  this.setGroups(null);
  this.off();
  this._stopAutoResize();
  if (this.dom.root.parentNode) {
    this.dom.root.parentNode.removeChild(this.dom.root);
  }
  this.dom = null;
  if (this.activator) {
    this.activator.destroy();
    delete this.activator;
  }
  for (var event in this.listeners) {
    if (this.listeners.hasOwnProperty(event)) {
      delete this.listeners[event];
    }
  }
  this.listeners = null;
  this.hammer = null;
  this.components.forEach((component) => component.destroy());
  this.body = null;
};
Core.prototype.setCustomTime = function(time, id) {
  var customTimes = this.customTimes.filter(function(component) {
    return id === component.options.id;
  });
  if (customTimes.length === 0) {
    throw new Error('No custom time bar found with id ' + JSON.stringify(id));
  }
  if (customTimes.length > 0) {
    customTimes[0].setCustomTime(time);
  }
};
Core.prototype.getCustomTime = function(id) {
  var customTimes = this.customTimes.filter(function(component) {
    return component.options.id === id;
  });
  if (customTimes.length === 0) {
    throw new Error('No custom time bar found with id ' + JSON.stringify(id));
  }
  return customTimes[0].getCustomTime();
};
Core.prototype.setCustomTimeTitle = function(title, id) {
  var customTimes = this.customTimes.filter(function(component) {
    return component.options.id === id;
  });
  if (customTimes.length === 0) {
    throw new Error('No custom time bar found with id ' + JSON.stringify(id));
  }
  if (customTimes.length > 0) {
    return customTimes[0].setCustomTitle(title);
  }
};
Core.prototype.getEventProperties = function(event) {
  return {event: event};
};
Core.prototype.addCustomTime = function(time, id) {
  var timestamp = time !== undefined ? util.convert(time, 'Date').valueOf() : new Date();
  var exists = this.customTimes.some(function(customTime) {
    return customTime.options.id === id;
  });
  if (exists) {
    throw new Error('A custom time with id ' + JSON.stringify(id) + ' already exists');
  }
  var customTime = new CustomTime(this.body, util.extend({}, this.options, {
    time: timestamp,
    id: id
  }));
  this.customTimes.push(customTime);
  this.components.push(customTime);
  this._redraw();
  return id;
};
Core.prototype.removeCustomTime = function(id) {
  var customTimes = this.customTimes.filter(function(bar) {
    return (bar.options.id === id);
  });
  if (customTimes.length === 0) {
    throw new Error('No custom time bar found with id ' + JSON.stringify(id));
  }
  customTimes.forEach(function(customTime) {
    this.customTimes.splice(this.customTimes.indexOf(customTime), 1);
    this.components.splice(this.components.indexOf(customTime), 1);
    customTime.destroy();
  }.bind(this));
};
Core.prototype.getVisibleItems = function() {
  return this.itemSet && this.itemSet.getVisibleItems() || [];
};
Core.prototype.fit = function(options) {
  var range = this.getDataRange();
  if (range.min === null && range.max === null) {
    return;
  }
  var interval = range.max - range.min;
  var min = new Date(range.min.valueOf() - interval * 0.01);
  var max = new Date(range.max.valueOf() + interval * 0.01);
  var animation = (options && options.animation !== undefined) ? options.animation : true;
  this.range.setRange(min, max, animation);
};
Core.prototype.getDataRange = function() {
  throw new Error('Cannot invoke abstract method getDataRange');
};
Core.prototype.setWindow = function(start, end, options) {
  var animation;
  if (arguments.length == 1) {
    var range = arguments[0];
    animation = (range.animation !== undefined) ? range.animation : true;
    this.range.setRange(range.start, range.end, animation);
  } else {
    animation = (options && options.animation !== undefined) ? options.animation : true;
    this.range.setRange(start, end, animation);
  }
};
Core.prototype.moveTo = function(time, options) {
  var interval = this.range.end - this.range.start;
  var t = util.convert(time, 'Date').valueOf();
  var start = t - interval / 2;
  var end = t + interval / 2;
  var animation = (options && options.animation !== undefined) ? options.animation : true;
  this.range.setRange(start, end, animation);
};
Core.prototype.getWindow = function() {
  var range = this.range.getRange();
  return {
    start: new Date(range.start),
    end: new Date(range.end)
  };
};
Core.prototype.redraw = function() {
  this._redraw();
};
Core.prototype._redraw = function() {
  this.redrawCount++;
  var resized = false;
  var options = this.options;
  var props = this.props;
  var dom = this.dom;
  if (!dom || !dom.container || dom.root.offsetWidth == 0)
    return;
  DateUtil.updateHiddenDates(this.options.moment, this.body, this.options.hiddenDates);
  if (options.orientation == 'top') {
    util.addClassName(dom.root, 'vis-top');
    util.removeClassName(dom.root, 'vis-bottom');
  } else {
    util.removeClassName(dom.root, 'vis-top');
    util.addClassName(dom.root, 'vis-bottom');
  }
  dom.root.style.maxHeight = util.option.asSize(options.maxHeight, '');
  dom.root.style.minHeight = util.option.asSize(options.minHeight, '');
  dom.root.style.width = util.option.asSize(options.width, '');
  props.border.left = (dom.centerContainer.offsetWidth - dom.centerContainer.clientWidth) / 2;
  props.border.right = props.border.left;
  props.border.top = (dom.centerContainer.offsetHeight - dom.centerContainer.clientHeight) / 2;
  props.border.bottom = props.border.top;
  var borderRootHeight = dom.root.offsetHeight - dom.root.clientHeight;
  var borderRootWidth = dom.root.offsetWidth - dom.root.clientWidth;
  if (dom.centerContainer.clientHeight === 0) {
    props.border.left = props.border.top;
    props.border.right = props.border.left;
  }
  if (dom.root.clientHeight === 0) {
    borderRootWidth = borderRootHeight;
  }
  props.center.height = dom.center.offsetHeight;
  props.left.height = dom.left.offsetHeight;
  props.right.height = dom.right.offsetHeight;
  props.top.height = dom.top.clientHeight || -props.border.top;
  props.bottom.height = dom.bottom.clientHeight || -props.border.bottom;
  var contentHeight = Math.max(props.left.height, props.center.height, props.right.height);
  var autoHeight = props.top.height + contentHeight + props.bottom.height + borderRootHeight + props.border.top + props.border.bottom;
  dom.root.style.height = util.option.asSize(options.height, autoHeight + 'px');
  props.root.height = dom.root.offsetHeight;
  props.background.height = props.root.height - borderRootHeight;
  var containerHeight = props.root.height - props.top.height - props.bottom.height - borderRootHeight;
  props.centerContainer.height = containerHeight;
  props.leftContainer.height = containerHeight;
  props.rightContainer.height = props.leftContainer.height;
  props.root.width = dom.root.offsetWidth;
  props.background.width = props.root.width - borderRootWidth;
  props.left.width = dom.leftContainer.clientWidth || -props.border.left;
  props.leftContainer.width = props.left.width;
  props.right.width = dom.rightContainer.clientWidth || -props.border.right;
  props.rightContainer.width = props.right.width;
  var centerWidth = props.root.width - props.left.width - props.right.width - borderRootWidth;
  props.center.width = centerWidth;
  props.centerContainer.width = centerWidth;
  props.top.width = centerWidth;
  props.bottom.width = centerWidth;
  dom.background.style.height = props.background.height + 'px';
  dom.backgroundVertical.style.height = props.background.height + 'px';
  dom.backgroundHorizontal.style.height = props.centerContainer.height + 'px';
  dom.centerContainer.style.height = props.centerContainer.height + 'px';
  dom.leftContainer.style.height = props.leftContainer.height + 'px';
  dom.rightContainer.style.height = props.rightContainer.height + 'px';
  dom.background.style.width = props.background.width + 'px';
  dom.backgroundVertical.style.width = props.centerContainer.width + 'px';
  dom.backgroundHorizontal.style.width = props.background.width + 'px';
  dom.centerContainer.style.width = props.center.width + 'px';
  dom.top.style.width = props.top.width + 'px';
  dom.bottom.style.width = props.bottom.width + 'px';
  dom.background.style.left = '0';
  dom.background.style.top = '0';
  dom.backgroundVertical.style.left = (props.left.width + props.border.left) + 'px';
  dom.backgroundVertical.style.top = '0';
  dom.backgroundHorizontal.style.left = '0';
  dom.backgroundHorizontal.style.top = props.top.height + 'px';
  dom.centerContainer.style.left = props.left.width + 'px';
  dom.centerContainer.style.top = props.top.height + 'px';
  dom.leftContainer.style.left = '0';
  dom.leftContainer.style.top = props.top.height + 'px';
  dom.rightContainer.style.left = (props.left.width + props.center.width) + 'px';
  dom.rightContainer.style.top = props.top.height + 'px';
  dom.top.style.left = props.left.width + 'px';
  dom.top.style.top = '0';
  dom.bottom.style.left = props.left.width + 'px';
  dom.bottom.style.top = (props.top.height + props.centerContainer.height) + 'px';
  this._updateScrollTop();
  var offset = this.props.scrollTop;
  if (options.orientation.item != 'top') {
    offset += Math.max(this.props.centerContainer.height - this.props.center.height - this.props.border.top - this.props.border.bottom, 0);
  }
  dom.center.style.left = '0';
  dom.center.style.top = offset + 'px';
  dom.left.style.left = '0';
  dom.left.style.top = offset + 'px';
  dom.right.style.left = '0';
  dom.right.style.top = offset + 'px';
  var visibilityTop = this.props.scrollTop == 0 ? 'hidden' : '';
  var visibilityBottom = this.props.scrollTop == this.props.scrollTopMin ? 'hidden' : '';
  dom.shadowTop.style.visibility = visibilityTop;
  dom.shadowBottom.style.visibility = visibilityBottom;
  dom.shadowTopLeft.style.visibility = visibilityTop;
  dom.shadowBottomLeft.style.visibility = visibilityBottom;
  dom.shadowTopRight.style.visibility = visibilityTop;
  dom.shadowBottomRight.style.visibility = visibilityBottom;
  var contentsOverflow = this.props.center.height > this.props.centerContainer.height;
  this.hammer.get('pan').set({direction: contentsOverflow ? Hammer.DIRECTION_ALL : Hammer.DIRECTION_HORIZONTAL});
  this.components.forEach(function(component) {
    resized = component.redraw() || resized;
  });
  var MAX_REDRAW = 5;
  if (resized) {
    if (this.redrawCount < MAX_REDRAW) {
      this.body.emitter.emit('_change');
      return;
    } else {
      console.log('WARNING: infinite loop in redraw?');
    }
  } else {
    this.redrawCount = 0;
  }
  this.initialDrawDone = true;
  this.body.emitter.emit("changed");
};
Core.prototype.repaint = function() {
  throw new Error('Function repaint is deprecated. Use redraw instead.');
};
Core.prototype.setCurrentTime = function(time) {
  if (!this.currentTime) {
    throw new Error('Option showCurrentTime must be true');
  }
  this.currentTime.setCurrentTime(time);
};
Core.prototype.getCurrentTime = function() {
  if (!this.currentTime) {
    throw new Error('Option showCurrentTime must be true');
  }
  return this.currentTime.getCurrentTime();
};
Core.prototype._toTime = function(x) {
  return DateUtil.toTime(this, x, this.props.center.width);
};
Core.prototype._toGlobalTime = function(x) {
  return DateUtil.toTime(this, x, this.props.root.width);
};
Core.prototype._toScreen = function(time) {
  return DateUtil.toScreen(this, time, this.props.center.width);
};
Core.prototype._toGlobalScreen = function(time) {
  return DateUtil.toScreen(this, time, this.props.root.width);
};
Core.prototype._initAutoResize = function() {
  if (this.options.autoResize == true) {
    this._startAutoResize();
  } else {
    this._stopAutoResize();
  }
};
Core.prototype._startAutoResize = function() {
  var me = this;
  this._stopAutoResize();
  this._onResize = function() {
    if (me.options.autoResize != true) {
      me._stopAutoResize();
      return;
    }
    if (me.dom.root) {
      if ((me.dom.root.offsetWidth != me.props.lastWidth) || (me.dom.root.offsetHeight != me.props.lastHeight)) {
        me.props.lastWidth = me.dom.root.offsetWidth;
        me.props.lastHeight = me.dom.root.offsetHeight;
        me.body.emitter.emit('_change');
      }
    }
  };
  util.addEventListener(window, 'resize', this._onResize);
  if (me.dom.root) {
    me.props.lastWidth = me.dom.root.offsetWidth;
    me.props.lastHeight = me.dom.root.offsetHeight;
  }
  this.watchTimer = setInterval(this._onResize, 1000);
};
Core.prototype._stopAutoResize = function() {
  if (this.watchTimer) {
    clearInterval(this.watchTimer);
    this.watchTimer = undefined;
  }
  if (this._onResize) {
    util.removeEventListener(window, 'resize', this._onResize);
    this._onResize = null;
  }
};
Core.prototype._onTouch = function(event) {
  this.touch.allowDragging = true;
  this.touch.initialScrollTop = this.props.scrollTop;
};
Core.prototype._onPinch = function(event) {
  this.touch.allowDragging = false;
};
Core.prototype._onDrag = function(event) {
  if (!this.touch.allowDragging)
    return;
  var delta = event.deltaY;
  var oldScrollTop = this._getScrollTop();
  var newScrollTop = this._setScrollTop(this.touch.initialScrollTop + delta);
  if (newScrollTop != oldScrollTop) {
    this.emit("verticalDrag");
  }
};
Core.prototype._setScrollTop = function(scrollTop) {
  this.props.scrollTop = scrollTop;
  this._updateScrollTop();
  return this.props.scrollTop;
};
Core.prototype._updateScrollTop = function() {
  var scrollTopMin = Math.min(this.props.centerContainer.height - this.props.center.height, 0);
  if (scrollTopMin != this.props.scrollTopMin) {
    if (this.options.orientation.item != 'top') {
      this.props.scrollTop += (scrollTopMin - this.props.scrollTopMin);
    }
    this.props.scrollTopMin = scrollTopMin;
  }
  if (this.props.scrollTop > 0)
    this.props.scrollTop = 0;
  if (this.props.scrollTop < scrollTopMin)
    this.props.scrollTop = scrollTopMin;
  return this.props.scrollTop;
};
Core.prototype._getScrollTop = function() {
  return this.props.scrollTop;
};
Core.prototype._createConfigurator = function() {
  throw new Error('Cannot invoke abstract method _createConfigurator');
};
module.exports = Core;
