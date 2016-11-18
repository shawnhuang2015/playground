/* */ 
var util = require('../../util');
var stack = require('../Stack');
var RangeItem = require('./item/RangeItem');
function Group(groupId, data, itemSet) {
  this.groupId = groupId;
  this.subgroups = {};
  this.subgroupIndex = 0;
  this.subgroupOrderer = data && data.subgroupOrder;
  this.itemSet = itemSet;
  this.dom = {};
  this.props = {label: {
      width: 0,
      height: 0
    }};
  this.className = null;
  this.items = {};
  this.visibleItems = [];
  this.orderedItems = {
    byStart: [],
    byEnd: []
  };
  this.checkRangedItems = false;
  var me = this;
  this.itemSet.body.emitter.on("checkRangedItems", function() {
    me.checkRangedItems = true;
  });
  this._create();
  this.setData(data);
}
Group.prototype._create = function() {
  var label = document.createElement('div');
  if (this.itemSet.options.groupEditable.order) {
    label.className = 'vis-label draggable';
  } else {
    label.className = 'vis-label';
  }
  this.dom.label = label;
  var inner = document.createElement('div');
  inner.className = 'vis-inner';
  label.appendChild(inner);
  this.dom.inner = inner;
  var foreground = document.createElement('div');
  foreground.className = 'vis-group';
  foreground['timeline-group'] = this;
  this.dom.foreground = foreground;
  this.dom.background = document.createElement('div');
  this.dom.background.className = 'vis-group';
  this.dom.axis = document.createElement('div');
  this.dom.axis.className = 'vis-group';
  this.dom.marker = document.createElement('div');
  this.dom.marker.style.visibility = 'hidden';
  this.dom.marker.innerHTML = '?';
  this.dom.background.appendChild(this.dom.marker);
};
Group.prototype.setData = function(data) {
  var content;
  if (this.itemSet.options && this.itemSet.options.groupTemplate) {
    content = this.itemSet.options.groupTemplate(data);
  } else {
    content = data && data.content;
  }
  if (content instanceof Element) {
    this.dom.inner.appendChild(content);
    while (this.dom.inner.firstChild) {
      this.dom.inner.removeChild(this.dom.inner.firstChild);
    }
    this.dom.inner.appendChild(content);
  } else if (content !== undefined && content !== null) {
    this.dom.inner.innerHTML = content;
  } else {
    this.dom.inner.innerHTML = this.groupId || '';
  }
  this.dom.label.title = data && data.title || '';
  if (!this.dom.inner.firstChild) {
    util.addClassName(this.dom.inner, 'vis-hidden');
  } else {
    util.removeClassName(this.dom.inner, 'vis-hidden');
  }
  var className = data && data.className || null;
  if (className != this.className) {
    if (this.className) {
      util.removeClassName(this.dom.label, this.className);
      util.removeClassName(this.dom.foreground, this.className);
      util.removeClassName(this.dom.background, this.className);
      util.removeClassName(this.dom.axis, this.className);
    }
    util.addClassName(this.dom.label, className);
    util.addClassName(this.dom.foreground, className);
    util.addClassName(this.dom.background, className);
    util.addClassName(this.dom.axis, className);
    this.className = className;
  }
  if (this.style) {
    util.removeCssText(this.dom.label, this.style);
    this.style = null;
  }
  if (data && data.style) {
    util.addCssText(this.dom.label, data.style);
    this.style = data.style;
  }
};
Group.prototype.getLabelWidth = function() {
  return this.props.label.width;
};
Group.prototype.redraw = function(range, margin, restack) {
  var resized = false;
  var markerHeight = this.dom.marker.clientHeight;
  if (markerHeight != this.lastMarkerHeight) {
    this.lastMarkerHeight = markerHeight;
    util.forEach(this.items, function(item) {
      item.dirty = true;
      if (item.displayed)
        item.redraw();
    });
    restack = true;
  }
  this._calculateSubGroupHeights();
  if (typeof this.itemSet.options.order === 'function') {
    if (restack) {
      var me = this;
      var limitSize = false;
      util.forEach(this.items, function(item) {
        if (!item.displayed) {
          item.redraw();
          me.visibleItems.push(item);
        }
        item.repositionX(limitSize);
      });
      var customOrderedItems = this.orderedItems.byStart.slice().sort(function(a, b) {
        return me.itemSet.options.order(a.data, b.data);
      });
      stack.stack(customOrderedItems, margin, true);
    }
    this.visibleItems = this._updateVisibleItems(this.orderedItems, this.visibleItems, range);
  } else {
    this.visibleItems = this._updateVisibleItems(this.orderedItems, this.visibleItems, range);
    if (this.itemSet.options.stack) {
      stack.stack(this.visibleItems, margin, restack);
    } else {
      stack.nostack(this.visibleItems, margin, this.subgroups);
    }
  }
  var height = this._calculateHeight(margin);
  var foreground = this.dom.foreground;
  this.top = foreground.offsetTop;
  this.right = foreground.offsetLeft;
  this.width = foreground.offsetWidth;
  resized = util.updateProperty(this, 'height', height) || resized;
  resized = util.updateProperty(this.props.label, 'width', this.dom.inner.clientWidth) || resized;
  resized = util.updateProperty(this.props.label, 'height', this.dom.inner.clientHeight) || resized;
  this.dom.background.style.height = height + 'px';
  this.dom.foreground.style.height = height + 'px';
  this.dom.label.style.height = height + 'px';
  for (var i = 0,
      ii = this.visibleItems.length; i < ii; i++) {
    var item = this.visibleItems[i];
    item.repositionY(margin);
  }
  return resized;
};
Group.prototype._calculateSubGroupHeights = function() {
  if (Object.keys(this.subgroups).length > 0) {
    var me = this;
    this.resetSubgroups();
    util.forEach(this.visibleItems, function(item) {
      if (item.data.subgroup !== undefined) {
        me.subgroups[item.data.subgroup].height = Math.max(me.subgroups[item.data.subgroup].height, item.height);
        me.subgroups[item.data.subgroup].visible = true;
      }
    });
  }
};
Group.prototype._calculateHeight = function(margin) {
  var height;
  var visibleItems = this.visibleItems;
  if (visibleItems.length > 0) {
    var min = visibleItems[0].top;
    var max = visibleItems[0].top + visibleItems[0].height;
    util.forEach(visibleItems, function(item) {
      min = Math.min(min, item.top);
      max = Math.max(max, (item.top + item.height));
    });
    if (min > margin.axis) {
      var offset = min - margin.axis;
      max -= offset;
      util.forEach(visibleItems, function(item) {
        item.top -= offset;
      });
    }
    height = max + margin.item.vertical / 2;
  } else {
    height = 0;
  }
  height = Math.max(height, this.props.label.height);
  return height;
};
Group.prototype.show = function() {
  if (!this.dom.label.parentNode) {
    this.itemSet.dom.labelSet.appendChild(this.dom.label);
  }
  if (!this.dom.foreground.parentNode) {
    this.itemSet.dom.foreground.appendChild(this.dom.foreground);
  }
  if (!this.dom.background.parentNode) {
    this.itemSet.dom.background.appendChild(this.dom.background);
  }
  if (!this.dom.axis.parentNode) {
    this.itemSet.dom.axis.appendChild(this.dom.axis);
  }
};
Group.prototype.hide = function() {
  var label = this.dom.label;
  if (label.parentNode) {
    label.parentNode.removeChild(label);
  }
  var foreground = this.dom.foreground;
  if (foreground.parentNode) {
    foreground.parentNode.removeChild(foreground);
  }
  var background = this.dom.background;
  if (background.parentNode) {
    background.parentNode.removeChild(background);
  }
  var axis = this.dom.axis;
  if (axis.parentNode) {
    axis.parentNode.removeChild(axis);
  }
};
Group.prototype.add = function(item) {
  this.items[item.id] = item;
  item.setParent(this);
  if (item.data.subgroup !== undefined) {
    if (this.subgroups[item.data.subgroup] === undefined) {
      this.subgroups[item.data.subgroup] = {
        height: 0,
        visible: false,
        index: this.subgroupIndex,
        items: []
      };
      this.subgroupIndex++;
    }
    this.subgroups[item.data.subgroup].items.push(item);
  }
  this.orderSubgroups();
  if (this.visibleItems.indexOf(item) == -1) {
    var range = this.itemSet.body.range;
    this._checkIfVisible(item, this.visibleItems, range);
  }
};
Group.prototype.orderSubgroups = function() {
  if (this.subgroupOrderer !== undefined) {
    var sortArray = [];
    if (typeof this.subgroupOrderer == 'string') {
      for (var subgroup in this.subgroups) {
        sortArray.push({
          subgroup: subgroup,
          sortField: this.subgroups[subgroup].items[0].data[this.subgroupOrderer]
        });
      }
      sortArray.sort(function(a, b) {
        return a.sortField - b.sortField;
      });
    } else if (typeof this.subgroupOrderer == 'function') {
      for (var subgroup in this.subgroups) {
        sortArray.push(this.subgroups[subgroup].items[0].data);
      }
      sortArray.sort(this.subgroupOrderer);
    }
    if (sortArray.length > 0) {
      for (var i = 0; i < sortArray.length; i++) {
        this.subgroups[sortArray[i].subgroup].index = i;
      }
    }
  }
};
Group.prototype.resetSubgroups = function() {
  for (var subgroup in this.subgroups) {
    if (this.subgroups.hasOwnProperty(subgroup)) {
      this.subgroups[subgroup].visible = false;
    }
  }
};
Group.prototype.remove = function(item) {
  delete this.items[item.id];
  item.setParent(null);
  var index = this.visibleItems.indexOf(item);
  if (index != -1)
    this.visibleItems.splice(index, 1);
  if (item.data.subgroup !== undefined) {
    var subgroup = this.subgroups[item.data.subgroup];
    if (subgroup) {
      var itemIndex = subgroup.items.indexOf(item);
      subgroup.items.splice(itemIndex, 1);
      if (!subgroup.items.length) {
        delete this.subgroups[item.data.subgroup];
        this.subgroupIndex--;
      }
      this.orderSubgroups();
    }
  }
};
Group.prototype.removeFromDataSet = function(item) {
  this.itemSet.removeItem(item.id);
};
Group.prototype.order = function() {
  var array = util.toArray(this.items);
  var startArray = [];
  var endArray = [];
  for (var i = 0; i < array.length; i++) {
    if (array[i].data.end !== undefined) {
      endArray.push(array[i]);
    }
    startArray.push(array[i]);
  }
  this.orderedItems = {
    byStart: startArray,
    byEnd: endArray
  };
  stack.orderByStart(this.orderedItems.byStart);
  stack.orderByEnd(this.orderedItems.byEnd);
};
Group.prototype._updateVisibleItems = function(orderedItems, oldVisibleItems, range) {
  var visibleItems = [];
  var visibleItemsLookup = {};
  var interval = (range.end - range.start) / 4;
  var lowerBound = range.start - interval;
  var upperBound = range.end + interval;
  var item,
      i;
  var searchFunction = function(value) {
    if (value < lowerBound) {
      return -1;
    } else if (value <= upperBound) {
      return 0;
    } else {
      return 1;
    }
  };
  if (oldVisibleItems.length > 0) {
    for (i = 0; i < oldVisibleItems.length; i++) {
      this._checkIfVisibleWithReference(oldVisibleItems[i], visibleItems, visibleItemsLookup, range);
    }
  }
  var initialPosByStart = util.binarySearchCustom(orderedItems.byStart, searchFunction, 'data', 'start');
  this._traceVisible(initialPosByStart, orderedItems.byStart, visibleItems, visibleItemsLookup, function(item) {
    return (item.data.start < lowerBound || item.data.start > upperBound);
  });
  if (this.checkRangedItems == true) {
    this.checkRangedItems = false;
    for (i = 0; i < orderedItems.byEnd.length; i++) {
      this._checkIfVisibleWithReference(orderedItems.byEnd[i], visibleItems, visibleItemsLookup, range);
    }
  } else {
    var initialPosByEnd = util.binarySearchCustom(orderedItems.byEnd, searchFunction, 'data', 'end');
    this._traceVisible(initialPosByEnd, orderedItems.byEnd, visibleItems, visibleItemsLookup, function(item) {
      return (item.data.end < lowerBound || item.data.end > upperBound);
    });
  }
  for (i = 0; i < visibleItems.length; i++) {
    item = visibleItems[i];
    if (!item.displayed)
      item.show();
    item.repositionX();
  }
  return visibleItems;
};
Group.prototype._traceVisible = function(initialPos, items, visibleItems, visibleItemsLookup, breakCondition) {
  var item;
  var i;
  if (initialPos != -1) {
    for (i = initialPos; i >= 0; i--) {
      item = items[i];
      if (breakCondition(item)) {
        break;
      } else {
        if (visibleItemsLookup[item.id] === undefined) {
          visibleItemsLookup[item.id] = true;
          visibleItems.push(item);
        }
      }
    }
    for (i = initialPos + 1; i < items.length; i++) {
      item = items[i];
      if (breakCondition(item)) {
        break;
      } else {
        if (visibleItemsLookup[item.id] === undefined) {
          visibleItemsLookup[item.id] = true;
          visibleItems.push(item);
        }
      }
    }
  }
};
Group.prototype._checkIfVisible = function(item, visibleItems, range) {
  if (item.isVisible(range)) {
    if (!item.displayed)
      item.show();
    item.repositionX();
    visibleItems.push(item);
  } else {
    if (item.displayed)
      item.hide();
  }
};
Group.prototype._checkIfVisibleWithReference = function(item, visibleItems, visibleItemsLookup, range) {
  if (item.isVisible(range)) {
    if (visibleItemsLookup[item.id] === undefined) {
      visibleItemsLookup[item.id] = true;
      visibleItems.push(item);
    }
  } else {
    if (item.displayed)
      item.hide();
  }
};
module.exports = Group;
