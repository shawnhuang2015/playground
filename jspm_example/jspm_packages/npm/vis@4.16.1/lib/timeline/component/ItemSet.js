/* */ 
var Hammer = require('../../module/hammer');
var util = require('../../util');
var DataSet = require('../../DataSet');
var DataView = require('../../DataView');
var TimeStep = require('../TimeStep');
var Component = require('./Component');
var Group = require('./Group');
var BackgroundGroup = require('./BackgroundGroup');
var BoxItem = require('./item/BoxItem');
var PointItem = require('./item/PointItem');
var RangeItem = require('./item/RangeItem');
var BackgroundItem = require('./item/BackgroundItem');
var UNGROUPED = '__ungrouped__';
var BACKGROUND = '__background__';
function ItemSet(body, options) {
  this.body = body;
  this.defaultOptions = {
    rtl: false,
    type: null,
    orientation: {item: 'bottom'},
    align: 'auto',
    stack: true,
    groupOrderSwap: function(fromGroup, toGroup, groups) {
      var targetOrder = toGroup.order;
      toGroup.order = fromGroup.order;
      fromGroup.order = targetOrder;
    },
    groupOrder: 'order',
    selectable: true,
    multiselect: false,
    itemsAlwaysDraggable: false,
    editable: {
      updateTime: false,
      updateGroup: false,
      add: false,
      remove: false
    },
    groupEditable: {
      order: false,
      add: false,
      remove: false
    },
    snap: TimeStep.snap,
    onAdd: function(item, callback) {
      callback(item);
    },
    onUpdate: function(item, callback) {
      callback(item);
    },
    onMove: function(item, callback) {
      callback(item);
    },
    onRemove: function(item, callback) {
      callback(item);
    },
    onMoving: function(item, callback) {
      callback(item);
    },
    onAddGroup: function(item, callback) {
      callback(item);
    },
    onMoveGroup: function(item, callback) {
      callback(item);
    },
    onRemoveGroup: function(item, callback) {
      callback(item);
    },
    margin: {
      item: {
        horizontal: 10,
        vertical: 10
      },
      axis: 20
    }
  };
  this.options = util.extend({}, this.defaultOptions);
  this.itemOptions = {type: {
      start: 'Date',
      end: 'Date'
    }};
  this.conversion = {
    toScreen: body.util.toScreen,
    toTime: body.util.toTime
  };
  this.dom = {};
  this.props = {};
  this.hammer = null;
  var me = this;
  this.itemsData = null;
  this.groupsData = null;
  this.itemListeners = {
    'add': function(event, params, senderId) {
      me._onAdd(params.items);
    },
    'update': function(event, params, senderId) {
      me._onUpdate(params.items);
    },
    'remove': function(event, params, senderId) {
      me._onRemove(params.items);
    }
  };
  this.groupListeners = {
    'add': function(event, params, senderId) {
      me._onAddGroups(params.items);
    },
    'update': function(event, params, senderId) {
      me._onUpdateGroups(params.items);
    },
    'remove': function(event, params, senderId) {
      me._onRemoveGroups(params.items);
    }
  };
  this.items = {};
  this.groups = {};
  this.groupIds = [];
  this.selection = [];
  this.stackDirty = true;
  this.touchParams = {};
  this.groupTouchParams = {};
  this._create();
  this.setOptions(options);
}
ItemSet.prototype = new Component();
ItemSet.types = {
  background: BackgroundItem,
  box: BoxItem,
  range: RangeItem,
  point: PointItem
};
ItemSet.prototype._create = function() {
  var frame = document.createElement('div');
  frame.className = 'vis-itemset';
  frame['timeline-itemset'] = this;
  this.dom.frame = frame;
  var background = document.createElement('div');
  background.className = 'vis-background';
  frame.appendChild(background);
  this.dom.background = background;
  var foreground = document.createElement('div');
  foreground.className = 'vis-foreground';
  frame.appendChild(foreground);
  this.dom.foreground = foreground;
  var axis = document.createElement('div');
  axis.className = 'vis-axis';
  this.dom.axis = axis;
  var labelSet = document.createElement('div');
  labelSet.className = 'vis-labelset';
  this.dom.labelSet = labelSet;
  this._updateUngrouped();
  var backgroundGroup = new BackgroundGroup(BACKGROUND, null, this);
  backgroundGroup.show();
  this.groups[BACKGROUND] = backgroundGroup;
  this.hammer = new Hammer(this.body.dom.centerContainer);
  this.hammer.on('hammer.input', function(event) {
    if (event.isFirst) {
      this._onTouch(event);
    }
  }.bind(this));
  this.hammer.on('panstart', this._onDragStart.bind(this));
  this.hammer.on('panmove', this._onDrag.bind(this));
  this.hammer.on('panend', this._onDragEnd.bind(this));
  this.hammer.get('pan').set({
    threshold: 5,
    direction: Hammer.DIRECTION_HORIZONTAL
  });
  this.hammer.on('tap', this._onSelectItem.bind(this));
  this.hammer.on('press', this._onMultiSelectItem.bind(this));
  this.hammer.on('doubletap', this._onAddItem.bind(this));
  this.groupHammer = new Hammer(this.body.dom.leftContainer);
  this.groupHammer.on('panstart', this._onGroupDragStart.bind(this));
  this.groupHammer.on('panmove', this._onGroupDrag.bind(this));
  this.groupHammer.on('panend', this._onGroupDragEnd.bind(this));
  this.groupHammer.get('pan').set({
    threshold: 5,
    direction: Hammer.DIRECTION_HORIZONTAL
  });
  this.show();
};
ItemSet.prototype.setOptions = function(options) {
  if (options) {
    var fields = ['type', 'rtl', 'align', 'order', 'stack', 'selectable', 'multiselect', 'itemsAlwaysDraggable', 'multiselectPerGroup', 'groupOrder', 'dataAttributes', 'template', 'groupTemplate', 'hide', 'snap', 'groupOrderSwap'];
    util.selectiveExtend(fields, this.options, options);
    if ('orientation' in options) {
      if (typeof options.orientation === 'string') {
        this.options.orientation.item = options.orientation === 'top' ? 'top' : 'bottom';
      } else if (typeof options.orientation === 'object' && 'item' in options.orientation) {
        this.options.orientation.item = options.orientation.item;
      }
    }
    if ('margin' in options) {
      if (typeof options.margin === 'number') {
        this.options.margin.axis = options.margin;
        this.options.margin.item.horizontal = options.margin;
        this.options.margin.item.vertical = options.margin;
      } else if (typeof options.margin === 'object') {
        util.selectiveExtend(['axis'], this.options.margin, options.margin);
        if ('item' in options.margin) {
          if (typeof options.margin.item === 'number') {
            this.options.margin.item.horizontal = options.margin.item;
            this.options.margin.item.vertical = options.margin.item;
          } else if (typeof options.margin.item === 'object') {
            util.selectiveExtend(['horizontal', 'vertical'], this.options.margin.item, options.margin.item);
          }
        }
      }
    }
    if ('editable' in options) {
      if (typeof options.editable === 'boolean') {
        this.options.editable.updateTime = options.editable;
        this.options.editable.updateGroup = options.editable;
        this.options.editable.add = options.editable;
        this.options.editable.remove = options.editable;
      } else if (typeof options.editable === 'object') {
        util.selectiveExtend(['updateTime', 'updateGroup', 'add', 'remove'], this.options.editable, options.editable);
      }
    }
    if ('groupEditable' in options) {
      if (typeof options.groupEditable === 'boolean') {
        this.options.groupEditable.order = options.groupEditable;
        this.options.groupEditable.add = options.groupEditable;
        this.options.groupEditable.remove = options.groupEditable;
      } else if (typeof options.groupEditable === 'object') {
        util.selectiveExtend(['order', 'add', 'remove'], this.options.groupEditable, options.groupEditable);
      }
    }
    var addCallback = (function(name) {
      var fn = options[name];
      if (fn) {
        if (!(fn instanceof Function)) {
          throw new Error('option ' + name + ' must be a function ' + name + '(item, callback)');
        }
        this.options[name] = fn;
      }
    }).bind(this);
    ['onAdd', 'onUpdate', 'onRemove', 'onMove', 'onMoving', 'onAddGroup', 'onMoveGroup', 'onRemoveGroup'].forEach(addCallback);
    this.markDirty();
  }
};
ItemSet.prototype.markDirty = function(options) {
  this.groupIds = [];
  this.stackDirty = true;
  if (options && options.refreshItems) {
    util.forEach(this.items, function(item) {
      item.dirty = true;
      if (item.displayed)
        item.redraw();
    });
  }
};
ItemSet.prototype.destroy = function() {
  this.hide();
  this.setItems(null);
  this.setGroups(null);
  this.hammer = null;
  this.body = null;
  this.conversion = null;
};
ItemSet.prototype.hide = function() {
  if (this.dom.frame.parentNode) {
    this.dom.frame.parentNode.removeChild(this.dom.frame);
  }
  if (this.dom.axis.parentNode) {
    this.dom.axis.parentNode.removeChild(this.dom.axis);
  }
  if (this.dom.labelSet.parentNode) {
    this.dom.labelSet.parentNode.removeChild(this.dom.labelSet);
  }
};
ItemSet.prototype.show = function() {
  if (!this.dom.frame.parentNode) {
    this.body.dom.center.appendChild(this.dom.frame);
  }
  if (!this.dom.axis.parentNode) {
    this.body.dom.backgroundVertical.appendChild(this.dom.axis);
  }
  if (!this.dom.labelSet.parentNode) {
    this.body.dom.left.appendChild(this.dom.labelSet);
  }
};
ItemSet.prototype.setSelection = function(ids) {
  var i,
      ii,
      id,
      item;
  if (ids == undefined)
    ids = [];
  if (!Array.isArray(ids))
    ids = [ids];
  for (i = 0, ii = this.selection.length; i < ii; i++) {
    id = this.selection[i];
    item = this.items[id];
    if (item)
      item.unselect();
  }
  this.selection = [];
  for (i = 0, ii = ids.length; i < ii; i++) {
    id = ids[i];
    item = this.items[id];
    if (item) {
      this.selection.push(id);
      item.select();
    }
  }
};
ItemSet.prototype.getSelection = function() {
  return this.selection.concat([]);
};
ItemSet.prototype.getVisibleItems = function() {
  var range = this.body.range.getRange();
  if (this.options.rtl) {
    var right = this.body.util.toScreen(range.start);
    var left = this.body.util.toScreen(range.end);
  } else {
    var left = this.body.util.toScreen(range.start);
    var right = this.body.util.toScreen(range.end);
  }
  var ids = [];
  for (var groupId in this.groups) {
    if (this.groups.hasOwnProperty(groupId)) {
      var group = this.groups[groupId];
      var rawVisibleItems = group.visibleItems;
      for (var i = 0; i < rawVisibleItems.length; i++) {
        var item = rawVisibleItems[i];
        if (this.options.rtl) {
          if ((item.right < left) && (item.right + item.width > right)) {
            ids.push(item.id);
          }
        } else {
          if ((item.left < right) && (item.left + item.width > left)) {
            ids.push(item.id);
          }
        }
      }
    }
  }
  return ids;
};
ItemSet.prototype._deselect = function(id) {
  var selection = this.selection;
  for (var i = 0,
      ii = selection.length; i < ii; i++) {
    if (selection[i] == id) {
      selection.splice(i, 1);
      break;
    }
  }
};
ItemSet.prototype.redraw = function() {
  var margin = this.options.margin,
      range = this.body.range,
      asSize = util.option.asSize,
      options = this.options,
      orientation = options.orientation.item,
      resized = false,
      frame = this.dom.frame;
  this.props.top = this.body.domProps.top.height + this.body.domProps.border.top;
  if (this.options.rtl) {
    this.props.right = this.body.domProps.right.width + this.body.domProps.border.right;
  } else {
    this.props.left = this.body.domProps.left.width + this.body.domProps.border.left;
  }
  frame.className = 'vis-itemset';
  resized = this._orderGroups() || resized;
  var visibleInterval = range.end - range.start;
  var zoomed = (visibleInterval != this.lastVisibleInterval) || (this.props.width != this.props.lastWidth);
  if (zoomed)
    this.stackDirty = true;
  this.lastVisibleInterval = visibleInterval;
  this.props.lastWidth = this.props.width;
  var restack = this.stackDirty;
  var firstGroup = this._firstGroup();
  var firstMargin = {
    item: margin.item,
    axis: margin.axis
  };
  var nonFirstMargin = {
    item: margin.item,
    axis: margin.item.vertical / 2
  };
  var height = 0;
  var minHeight = margin.axis + margin.item.vertical;
  this.groups[BACKGROUND].redraw(range, nonFirstMargin, restack);
  util.forEach(this.groups, function(group) {
    var groupMargin = (group == firstGroup) ? firstMargin : nonFirstMargin;
    var groupResized = group.redraw(range, groupMargin, restack);
    resized = groupResized || resized;
    height += group.height;
  });
  height = Math.max(height, minHeight);
  this.stackDirty = false;
  frame.style.height = asSize(height);
  this.props.width = frame.offsetWidth;
  this.props.height = height;
  this.dom.axis.style.top = asSize((orientation == 'top') ? (this.body.domProps.top.height + this.body.domProps.border.top) : (this.body.domProps.top.height + this.body.domProps.centerContainer.height));
  if (this.options.rtl) {
    this.dom.axis.style.right = '0';
  } else {
    this.dom.axis.style.left = '0';
  }
  resized = this._isResized() || resized;
  return resized;
};
ItemSet.prototype._firstGroup = function() {
  var firstGroupIndex = (this.options.orientation.item == 'top') ? 0 : (this.groupIds.length - 1);
  var firstGroupId = this.groupIds[firstGroupIndex];
  var firstGroup = this.groups[firstGroupId] || this.groups[UNGROUPED];
  return firstGroup || null;
};
ItemSet.prototype._updateUngrouped = function() {
  var ungrouped = this.groups[UNGROUPED];
  var background = this.groups[BACKGROUND];
  var item,
      itemId;
  if (this.groupsData) {
    if (ungrouped) {
      ungrouped.hide();
      delete this.groups[UNGROUPED];
      for (itemId in this.items) {
        if (this.items.hasOwnProperty(itemId)) {
          item = this.items[itemId];
          item.parent && item.parent.remove(item);
          var groupId = this._getGroupId(item.data);
          var group = this.groups[groupId];
          group && group.add(item) || item.hide();
        }
      }
    }
  } else {
    if (!ungrouped) {
      var id = null;
      var data = null;
      ungrouped = new Group(id, data, this);
      this.groups[UNGROUPED] = ungrouped;
      for (itemId in this.items) {
        if (this.items.hasOwnProperty(itemId)) {
          item = this.items[itemId];
          ungrouped.add(item);
        }
      }
      ungrouped.show();
    }
  }
};
ItemSet.prototype.getLabelSet = function() {
  return this.dom.labelSet;
};
ItemSet.prototype.setItems = function(items) {
  var me = this,
      ids,
      oldItemsData = this.itemsData;
  if (!items) {
    this.itemsData = null;
  } else if (items instanceof DataSet || items instanceof DataView) {
    this.itemsData = items;
  } else {
    throw new TypeError('Data must be an instance of DataSet or DataView');
  }
  if (oldItemsData) {
    util.forEach(this.itemListeners, function(callback, event) {
      oldItemsData.off(event, callback);
    });
    ids = oldItemsData.getIds();
    this._onRemove(ids);
  }
  if (this.itemsData) {
    var id = this.id;
    util.forEach(this.itemListeners, function(callback, event) {
      me.itemsData.on(event, callback, id);
    });
    ids = this.itemsData.getIds();
    this._onAdd(ids);
    this._updateUngrouped();
  }
  this.body.emitter.emit('_change', {queue: true});
};
ItemSet.prototype.getItems = function() {
  return this.itemsData;
};
ItemSet.prototype.setGroups = function(groups) {
  var me = this,
      ids;
  if (this.groupsData) {
    util.forEach(this.groupListeners, function(callback, event) {
      me.groupsData.off(event, callback);
    });
    ids = this.groupsData.getIds();
    this.groupsData = null;
    this._onRemoveGroups(ids);
  }
  if (!groups) {
    this.groupsData = null;
  } else if (groups instanceof DataSet || groups instanceof DataView) {
    this.groupsData = groups;
  } else {
    throw new TypeError('Data must be an instance of DataSet or DataView');
  }
  if (this.groupsData) {
    var id = this.id;
    util.forEach(this.groupListeners, function(callback, event) {
      me.groupsData.on(event, callback, id);
    });
    ids = this.groupsData.getIds();
    this._onAddGroups(ids);
  }
  this._updateUngrouped();
  this._order();
  this.body.emitter.emit('_change', {queue: true});
};
ItemSet.prototype.getGroups = function() {
  return this.groupsData;
};
ItemSet.prototype.removeItem = function(id) {
  var item = this.itemsData.get(id),
      dataset = this.itemsData.getDataSet();
  if (item) {
    this.options.onRemove(item, function(item) {
      if (item) {
        dataset.remove(id);
      }
    });
  }
};
ItemSet.prototype._getType = function(itemData) {
  return itemData.type || this.options.type || (itemData.end ? 'range' : 'box');
};
ItemSet.prototype._getGroupId = function(itemData) {
  var type = this._getType(itemData);
  if (type == 'background' && itemData.group == undefined) {
    return BACKGROUND;
  } else {
    return this.groupsData ? itemData.group : UNGROUPED;
  }
};
ItemSet.prototype._onUpdate = function(ids) {
  var me = this;
  ids.forEach(function(id) {
    var itemData = me.itemsData.get(id, me.itemOptions);
    var item = me.items[id];
    var type = me._getType(itemData);
    var constructor = ItemSet.types[type];
    var selected;
    if (item) {
      if (!constructor || !(item instanceof constructor)) {
        selected = item.selected;
        me._removeItem(item);
        item = null;
      } else {
        me._updateItem(item, itemData);
      }
    }
    if (!item) {
      if (constructor) {
        item = new constructor(itemData, me.conversion, me.options);
        item.id = id;
        me._addItem(item);
        if (selected) {
          this.selection.push(id);
          item.select();
        }
      } else if (type == 'rangeoverflow') {
        throw new TypeError('Item type "rangeoverflow" is deprecated. Use css styling instead: ' + '.vis-item.vis-range .vis-item-content {overflow: visible;}');
      } else {
        throw new TypeError('Unknown item type "' + type + '"');
      }
    }
  }.bind(this));
  this._order();
  this.stackDirty = true;
  this.body.emitter.emit('_change', {queue: true});
};
ItemSet.prototype._onAdd = ItemSet.prototype._onUpdate;
ItemSet.prototype._onRemove = function(ids) {
  var count = 0;
  var me = this;
  ids.forEach(function(id) {
    var item = me.items[id];
    if (item) {
      count++;
      me._removeItem(item);
    }
  });
  if (count) {
    this._order();
    this.stackDirty = true;
    this.body.emitter.emit('_change', {queue: true});
  }
};
ItemSet.prototype._order = function() {
  util.forEach(this.groups, function(group) {
    group.order();
  });
};
ItemSet.prototype._onUpdateGroups = function(ids) {
  this._onAddGroups(ids);
};
ItemSet.prototype._onAddGroups = function(ids) {
  var me = this;
  ids.forEach(function(id) {
    var groupData = me.groupsData.get(id);
    var group = me.groups[id];
    if (!group) {
      if (id == UNGROUPED || id == BACKGROUND) {
        throw new Error('Illegal group id. ' + id + ' is a reserved id.');
      }
      var groupOptions = Object.create(me.options);
      util.extend(groupOptions, {height: null});
      group = new Group(id, groupData, me);
      me.groups[id] = group;
      for (var itemId in me.items) {
        if (me.items.hasOwnProperty(itemId)) {
          var item = me.items[itemId];
          if (item.data.group == id) {
            group.add(item);
          }
        }
      }
      group.order();
      group.show();
    } else {
      group.setData(groupData);
    }
  });
  this.body.emitter.emit('_change', {queue: true});
};
ItemSet.prototype._onRemoveGroups = function(ids) {
  var groups = this.groups;
  ids.forEach(function(id) {
    var group = groups[id];
    if (group) {
      group.hide();
      delete groups[id];
    }
  });
  this.markDirty();
  this.body.emitter.emit('_change', {queue: true});
};
ItemSet.prototype._orderGroups = function() {
  if (this.groupsData) {
    var groupIds = this.groupsData.getIds({order: this.options.groupOrder});
    var changed = !util.equalArray(groupIds, this.groupIds);
    if (changed) {
      var groups = this.groups;
      groupIds.forEach(function(groupId) {
        groups[groupId].hide();
      });
      groupIds.forEach(function(groupId) {
        groups[groupId].show();
      });
      this.groupIds = groupIds;
    }
    return changed;
  } else {
    return false;
  }
};
ItemSet.prototype._addItem = function(item) {
  this.items[item.id] = item;
  var groupId = this._getGroupId(item.data);
  var group = this.groups[groupId];
  if (group)
    group.add(item);
};
ItemSet.prototype._updateItem = function(item, itemData) {
  var oldGroupId = item.data.group;
  var oldSubGroupId = item.data.subgroup;
  item.setData(itemData);
  if (oldGroupId != item.data.group || oldSubGroupId != item.data.subgroup) {
    var oldGroup = this.groups[oldGroupId];
    if (oldGroup)
      oldGroup.remove(item);
    var groupId = this._getGroupId(item.data);
    var group = this.groups[groupId];
    if (group)
      group.add(item);
  }
};
ItemSet.prototype._removeItem = function(item) {
  item.hide();
  delete this.items[item.id];
  var index = this.selection.indexOf(item.id);
  if (index != -1)
    this.selection.splice(index, 1);
  item.parent && item.parent.remove(item);
};
ItemSet.prototype._constructByEndArray = function(array) {
  var endArray = [];
  for (var i = 0; i < array.length; i++) {
    if (array[i] instanceof RangeItem) {
      endArray.push(array[i]);
    }
  }
  return endArray;
};
ItemSet.prototype._onTouch = function(event) {
  this.touchParams.item = this.itemFromTarget(event);
  this.touchParams.dragLeftItem = event.target.dragLeftItem || false;
  this.touchParams.dragRightItem = event.target.dragRightItem || false;
  this.touchParams.itemProps = null;
};
ItemSet.prototype._getGroupIndex = function(groupId) {
  for (var i = 0; i < this.groupIds.length; i++) {
    if (groupId == this.groupIds[i])
      return i;
  }
};
ItemSet.prototype._onDragStart = function(event) {
  var item = this.touchParams.item || null;
  var me = this;
  var props;
  if (item && (item.selected || this.options.itemsAlwaysDraggable)) {
    if (!this.options.editable.updateTime && !this.options.editable.updateGroup && !item.editable) {
      return;
    }
    if (item.editable === false) {
      return;
    }
    var dragLeftItem = this.touchParams.dragLeftItem;
    var dragRightItem = this.touchParams.dragRightItem;
    if (dragLeftItem) {
      props = {
        item: dragLeftItem,
        initialX: event.center.x,
        dragLeft: true,
        data: this._cloneItemData(item.data)
      };
      this.touchParams.itemProps = [props];
    } else if (dragRightItem) {
      props = {
        item: dragRightItem,
        initialX: event.center.x,
        dragRight: true,
        data: this._cloneItemData(item.data)
      };
      this.touchParams.itemProps = [props];
    } else {
      this.touchParams.selectedItem = item;
      var baseGroupIndex = this._getGroupIndex(item.data.group);
      var itemsToDrag = (this.options.itemsAlwaysDraggable && !item.selected) ? [item.id] : this.getSelection();
      this.touchParams.itemProps = itemsToDrag.map(function(id) {
        var item = me.items[id];
        var groupIndex = me._getGroupIndex(item.data.group);
        return {
          item: item,
          initialX: event.center.x,
          groupOffset: baseGroupIndex - groupIndex,
          data: this._cloneItemData(item.data)
        };
      }.bind(this));
    }
    event.stopPropagation();
  } else if (this.options.editable.add && (event.srcEvent.ctrlKey || event.srcEvent.metaKey)) {
    this._onDragStartAddItem(event);
  }
};
ItemSet.prototype._onDragStartAddItem = function(event) {
  var snap = this.options.snap || null;
  if (this.options.rtl) {
    var xAbs = util.getAbsoluteRight(this.dom.frame);
    var x = xAbs - event.center.x + 10;
  } else {
    var xAbs = util.getAbsoluteLeft(this.dom.frame);
    var x = event.center.x - xAbs - 10;
  }
  var time = this.body.util.toTime(x);
  var scale = this.body.util.getScale();
  var step = this.body.util.getStep();
  var start = snap ? snap(time, scale, step) : time;
  var end = start;
  var itemData = {
    type: 'range',
    start: start,
    end: end,
    content: 'new item'
  };
  var id = util.randomUUID();
  itemData[this.itemsData._fieldId] = id;
  var group = this.groupFromTarget(event);
  if (group) {
    itemData.group = group.groupId;
  }
  var newItem = new RangeItem(itemData, this.conversion, this.options);
  newItem.id = id;
  newItem.data = this._cloneItemData(itemData);
  this._addItem(newItem);
  var props = {
    item: newItem,
    initialX: event.center.x,
    data: newItem.data
  };
  if (this.options.rtl) {
    props.dragLeft = true;
  } else {
    props.dragRight = true;
  }
  this.touchParams.itemProps = [props];
  event.stopPropagation();
};
ItemSet.prototype._onDrag = function(event) {
  if (this.touchParams.itemProps) {
    event.stopPropagation();
    var me = this;
    var snap = this.options.snap || null;
    if (this.options.rtl) {
      var xOffset = this.body.dom.root.offsetLeft + this.body.domProps.right.width;
    } else {
      var xOffset = this.body.dom.root.offsetLeft + this.body.domProps.left.width;
    }
    var scale = this.body.util.getScale();
    var step = this.body.util.getStep();
    var selectedItem = this.touchParams.selectedItem;
    var updateGroupAllowed = me.options.editable.updateGroup;
    var newGroupBase = null;
    if (updateGroupAllowed && selectedItem) {
      if (selectedItem.data.group != undefined) {
        var group = me.groupFromTarget(event);
        if (group) {
          newGroupBase = this._getGroupIndex(group.groupId);
        }
      }
    }
    this.touchParams.itemProps.forEach(function(props) {
      var current = me.body.util.toTime(event.center.x - xOffset);
      var initial = me.body.util.toTime(props.initialX - xOffset);
      if (this.options.rtl) {
        var offset = -(current - initial);
      } else {
        var offset = (current - initial);
      }
      var itemData = this._cloneItemData(props.item.data);
      if (props.item.editable === false) {
        return;
      }
      var updateTimeAllowed = me.options.editable.updateTime || props.item.editable === true;
      if (updateTimeAllowed) {
        if (props.dragLeft) {
          if (this.options.rtl) {
            if (itemData.end != undefined) {
              var initialEnd = util.convert(props.data.end, 'Date');
              var end = new Date(initialEnd.valueOf() + offset);
              itemData.end = snap ? snap(end, scale, step) : end;
            }
          } else {
            if (itemData.start != undefined) {
              var initialStart = util.convert(props.data.start, 'Date');
              var start = new Date(initialStart.valueOf() + offset);
              itemData.start = snap ? snap(start, scale, step) : start;
            }
          }
        } else if (props.dragRight) {
          if (this.options.rtl) {
            if (itemData.start != undefined) {
              var initialStart = util.convert(props.data.start, 'Date');
              var start = new Date(initialStart.valueOf() + offset);
              itemData.start = snap ? snap(start, scale, step) : start;
            }
          } else {
            if (itemData.end != undefined) {
              var initialEnd = util.convert(props.data.end, 'Date');
              var end = new Date(initialEnd.valueOf() + offset);
              itemData.end = snap ? snap(end, scale, step) : end;
            }
          }
        } else {
          if (itemData.start != undefined) {
            var initialStart = util.convert(props.data.start, 'Date').valueOf();
            var start = new Date(initialStart + offset);
            if (itemData.end != undefined) {
              var initialEnd = util.convert(props.data.end, 'Date');
              var duration = initialEnd.valueOf() - initialStart.valueOf();
              itemData.start = snap ? snap(start, scale, step) : start;
              itemData.end = new Date(itemData.start.valueOf() + duration);
            } else {
              itemData.start = snap ? snap(start, scale, step) : start;
            }
          }
        }
      }
      var updateGroupAllowed = me.options.editable.updateGroup || props.item.editable === true;
      if (updateGroupAllowed && (!props.dragLeft && !props.dragRight) && newGroupBase != null) {
        if (itemData.group != undefined) {
          var newOffset = newGroupBase - props.groupOffset;
          newOffset = Math.max(0, newOffset);
          newOffset = Math.min(me.groupIds.length - 1, newOffset);
          itemData.group = me.groupIds[newOffset];
        }
      }
      itemData = this._cloneItemData(itemData);
      me.options.onMoving(itemData, function(itemData) {
        if (itemData) {
          props.item.setData(this._cloneItemData(itemData, 'Date'));
        }
      }.bind(this));
    }.bind(this));
    this.stackDirty = true;
    this.body.emitter.emit('_change');
  }
};
ItemSet.prototype._moveToGroup = function(item, groupId) {
  var group = this.groups[groupId];
  if (group && group.groupId != item.data.group) {
    var oldGroup = item.parent;
    oldGroup.remove(item);
    oldGroup.order();
    group.add(item);
    group.order();
    item.data.group = group.groupId;
  }
};
ItemSet.prototype._onDragEnd = function(event) {
  if (this.touchParams.itemProps) {
    event.stopPropagation();
    var me = this;
    var dataset = this.itemsData.getDataSet();
    var itemProps = this.touchParams.itemProps;
    this.touchParams.itemProps = null;
    itemProps.forEach(function(props) {
      var id = props.item.id;
      var exists = me.itemsData.get(id, me.itemOptions) != null;
      if (!exists) {
        me.options.onAdd(props.item.data, function(itemData) {
          me._removeItem(props.item);
          if (itemData) {
            me.itemsData.getDataSet().add(itemData);
          }
          me.stackDirty = true;
          me.body.emitter.emit('_change');
        });
      } else {
        var itemData = this._cloneItemData(props.item.data);
        me.options.onMove(itemData, function(itemData) {
          if (itemData) {
            itemData[dataset._fieldId] = id;
            dataset.update(itemData);
          } else {
            props.item.setData(props.data);
            me.stackDirty = true;
            me.body.emitter.emit('_change');
          }
        });
      }
    }.bind(this));
  }
};
ItemSet.prototype._onGroupDragStart = function(event) {
  if (this.options.groupEditable.order) {
    this.groupTouchParams.group = this.groupFromTarget(event);
    if (this.groupTouchParams.group) {
      event.stopPropagation();
      this.groupTouchParams.originalOrder = this.groupsData.getIds({order: this.options.groupOrder});
    }
  }
};
ItemSet.prototype._onGroupDrag = function(event) {
  if (this.options.groupEditable.order && this.groupTouchParams.group) {
    event.stopPropagation();
    var group = this.groupFromTarget(event);
    if (group && group.height != this.groupTouchParams.group.height) {
      var movingUp = (group.top < this.groupTouchParams.group.top);
      var clientY = event.center ? event.center.y : event.clientY;
      var targetGroupTop = util.getAbsoluteTop(group.dom.foreground);
      var draggedGroupHeight = this.groupTouchParams.group.height;
      if (movingUp) {
        if (targetGroupTop + draggedGroupHeight < clientY) {
          return;
        }
      } else {
        var targetGroupHeight = group.height;
        if (targetGroupTop + targetGroupHeight - draggedGroupHeight > clientY) {
          return;
        }
      }
    }
    if (group && group != this.groupTouchParams.group) {
      var groupsData = this.groupsData;
      var targetGroup = groupsData.get(group.groupId);
      var draggedGroup = groupsData.get(this.groupTouchParams.group.groupId);
      if (draggedGroup && targetGroup) {
        this.options.groupOrderSwap(draggedGroup, targetGroup, this.groupsData);
        this.groupsData.update(draggedGroup);
        this.groupsData.update(targetGroup);
      }
      var newOrder = this.groupsData.getIds({order: this.options.groupOrder});
      if (!util.equalArray(newOrder, this.groupTouchParams.originalOrder)) {
        var groupsData = this.groupsData;
        var origOrder = this.groupTouchParams.originalOrder;
        var draggedId = this.groupTouchParams.group.groupId;
        var numGroups = Math.min(origOrder.length, newOrder.length);
        var curPos = 0;
        var newOffset = 0;
        var orgOffset = 0;
        while (curPos < numGroups) {
          while ((curPos + newOffset) < numGroups && (curPos + orgOffset) < numGroups && newOrder[curPos + newOffset] == origOrder[curPos + orgOffset]) {
            curPos++;
          }
          if (curPos + newOffset >= numGroups) {
            break;
          }
          if (newOrder[curPos + newOffset] == draggedId) {
            newOffset = 1;
            continue;
          } else if (origOrder[curPos + orgOffset] == draggedId) {
            orgOffset = 1;
            continue;
          } else {
            var slippedPosition = newOrder.indexOf(origOrder[curPos + orgOffset]);
            var switchGroup = groupsData.get(newOrder[curPos + newOffset]);
            var shouldBeGroup = groupsData.get(origOrder[curPos + orgOffset]);
            this.options.groupOrderSwap(switchGroup, shouldBeGroup, groupsData);
            groupsData.update(switchGroup);
            groupsData.update(shouldBeGroup);
            var switchGroupId = newOrder[curPos + newOffset];
            newOrder[curPos + newOffset] = origOrder[curPos + orgOffset];
            newOrder[slippedPosition] = switchGroupId;
            curPos++;
          }
        }
      }
    }
  }
};
ItemSet.prototype._onGroupDragEnd = function(event) {
  if (this.options.groupEditable.order && this.groupTouchParams.group) {
    event.stopPropagation();
    var me = this;
    var id = me.groupTouchParams.group.groupId;
    var dataset = me.groupsData.getDataSet();
    var groupData = util.extend({}, dataset.get(id));
    me.options.onMoveGroup(groupData, function(groupData) {
      if (groupData) {
        groupData[dataset._fieldId] = id;
        dataset.update(groupData);
      } else {
        var newOrder = dataset.getIds({order: me.options.groupOrder});
        if (!util.equalArray(newOrder, me.groupTouchParams.originalOrder)) {
          var origOrder = me.groupTouchParams.originalOrder;
          var numGroups = Math.min(origOrder.length, newOrder.length);
          var curPos = 0;
          while (curPos < numGroups) {
            while (curPos < numGroups && newOrder[curPos] == origOrder[curPos]) {
              curPos++;
            }
            if (curPos >= numGroups) {
              break;
            }
            var slippedPosition = newOrder.indexOf(origOrder[curPos]);
            var switchGroup = dataset.get(newOrder[curPos]);
            var shouldBeGroup = dataset.get(origOrder[curPos]);
            me.options.groupOrderSwap(switchGroup, shouldBeGroup, dataset);
            groupsData.update(switchGroup);
            groupsData.update(shouldBeGroup);
            var switchGroupId = newOrder[curPos];
            newOrder[curPos] = origOrder[curPos];
            newOrder[slippedPosition] = switchGroupId;
            curPos++;
          }
        }
      }
    });
    me.body.emitter.emit('groupDragged', {groupId: id});
  }
};
ItemSet.prototype._onSelectItem = function(event) {
  if (!this.options.selectable)
    return;
  var ctrlKey = event.srcEvent && (event.srcEvent.ctrlKey || event.srcEvent.metaKey);
  var shiftKey = event.srcEvent && event.srcEvent.shiftKey;
  if (ctrlKey || shiftKey) {
    this._onMultiSelectItem(event);
    return;
  }
  var oldSelection = this.getSelection();
  var item = this.itemFromTarget(event);
  var selection = item ? [item.id] : [];
  this.setSelection(selection);
  var newSelection = this.getSelection();
  if (newSelection.length > 0 || oldSelection.length > 0) {
    this.body.emitter.emit('select', {
      items: newSelection,
      event: event
    });
  }
};
ItemSet.prototype._onAddItem = function(event) {
  if (!this.options.selectable)
    return;
  if (!this.options.editable.add)
    return;
  var me = this;
  var snap = this.options.snap || null;
  var item = this.itemFromTarget(event);
  if (item) {
    var itemData = me.itemsData.get(item.id);
    this.options.onUpdate(itemData, function(itemData) {
      if (itemData) {
        me.itemsData.getDataSet().update(itemData);
      }
    });
  } else {
    if (this.options.rtl) {
      var xAbs = util.getAbsoluteRight(this.dom.frame);
      var x = xAbs - event.center.x;
    } else {
      var xAbs = util.getAbsoluteLeft(this.dom.frame);
      var x = event.center.x - xAbs;
    }
    var start = this.body.util.toTime(x);
    var scale = this.body.util.getScale();
    var step = this.body.util.getStep();
    var newItemData = {
      start: snap ? snap(start, scale, step) : start,
      content: 'new item'
    };
    if (this.options.type === 'range') {
      var end = this.body.util.toTime(x + this.props.width / 5);
      newItemData.end = snap ? snap(end, scale, step) : end;
    }
    newItemData[this.itemsData._fieldId] = util.randomUUID();
    var group = this.groupFromTarget(event);
    if (group) {
      newItemData.group = group.groupId;
    }
    newItemData = this._cloneItemData(newItemData);
    this.options.onAdd(newItemData, function(item) {
      if (item) {
        me.itemsData.getDataSet().add(item);
      }
    });
  }
};
ItemSet.prototype._onMultiSelectItem = function(event) {
  if (!this.options.selectable)
    return;
  var item = this.itemFromTarget(event);
  if (item) {
    var selection = this.options.multiselect ? this.getSelection() : [];
    var shiftKey = event.srcEvent && event.srcEvent.shiftKey || false;
    if (shiftKey && this.options.multiselect) {
      var itemGroup = this.itemsData.get(item.id).group;
      var lastSelectedGroup = undefined;
      if (this.options.multiselectPerGroup) {
        if (selection.length > 0) {
          lastSelectedGroup = this.itemsData.get(selection[0]).group;
        }
      }
      if (!this.options.multiselectPerGroup || lastSelectedGroup == undefined || lastSelectedGroup == itemGroup) {
        selection.push(item.id);
      }
      var range = ItemSet._getItemRange(this.itemsData.get(selection, this.itemOptions));
      if (!this.options.multiselectPerGroup || lastSelectedGroup == itemGroup) {
        selection = [];
        for (var id in this.items) {
          if (this.items.hasOwnProperty(id)) {
            var _item = this.items[id];
            var start = _item.data.start;
            var end = (_item.data.end !== undefined) ? _item.data.end : start;
            if (start >= range.min && end <= range.max && (!this.options.multiselectPerGroup || lastSelectedGroup == this.itemsData.get(_item.id).group) && !(_item instanceof BackgroundItem)) {
              selection.push(_item.id);
            }
          }
        }
      }
    } else {
      var index = selection.indexOf(item.id);
      if (index == -1) {
        selection.push(item.id);
      } else {
        selection.splice(index, 1);
      }
    }
    this.setSelection(selection);
    this.body.emitter.emit('select', {
      items: this.getSelection(),
      event: event
    });
  }
};
ItemSet._getItemRange = function(itemsData) {
  var max = null;
  var min = null;
  itemsData.forEach(function(data) {
    if (min == null || data.start < min) {
      min = data.start;
    }
    if (data.end != undefined) {
      if (max == null || data.end > max) {
        max = data.end;
      }
    } else {
      if (max == null || data.start > max) {
        max = data.start;
      }
    }
  });
  return {
    min: min,
    max: max
  };
};
ItemSet.prototype.itemFromTarget = function(event) {
  var target = event.target;
  while (target) {
    if (target.hasOwnProperty('timeline-item')) {
      return target['timeline-item'];
    }
    target = target.parentNode;
  }
  return null;
};
ItemSet.prototype.groupFromTarget = function(event) {
  var clientY = event.center ? event.center.y : event.clientY;
  for (var i = 0; i < this.groupIds.length; i++) {
    var groupId = this.groupIds[i];
    var group = this.groups[groupId];
    var foreground = group.dom.foreground;
    var top = util.getAbsoluteTop(foreground);
    if (clientY > top && clientY < top + foreground.offsetHeight) {
      return group;
    }
    if (this.options.orientation.item === 'top') {
      if (i === this.groupIds.length - 1 && clientY > top) {
        return group;
      }
    } else {
      if (i === 0 && clientY < top + foreground.offset) {
        return group;
      }
    }
  }
  return null;
};
ItemSet.itemSetFromTarget = function(event) {
  var target = event.target;
  while (target) {
    if (target.hasOwnProperty('timeline-itemset')) {
      return target['timeline-itemset'];
    }
    target = target.parentNode;
  }
  return null;
};
ItemSet.prototype._cloneItemData = function(itemData, type) {
  var clone = util.extend({}, itemData);
  if (!type) {
    type = this.itemsData.getDataSet()._options.type;
  }
  if (clone.start != undefined) {
    clone.start = util.convert(clone.start, type && type.start || 'Date');
  }
  if (clone.end != undefined) {
    clone.end = util.convert(clone.end, type && type.end || 'Date');
  }
  return clone;
};
module.exports = ItemSet;
