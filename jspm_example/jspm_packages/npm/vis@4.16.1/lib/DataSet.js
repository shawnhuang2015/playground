/* */ 
var util = require('./util');
var Queue = require('./Queue');
function DataSet(data, options) {
  if (data && !Array.isArray(data)) {
    options = data;
    data = null;
  }
  this._options = options || {};
  this._data = {};
  this.length = 0;
  this._fieldId = this._options.fieldId || 'id';
  this._type = {};
  if (this._options.type) {
    var fields = Object.keys(this._options.type);
    for (var i = 0,
        len = fields.length; i < len; i++) {
      var field = fields[i];
      var value = this._options.type[field];
      if (value == 'Date' || value == 'ISODate' || value == 'ASPDate') {
        this._type[field] = 'Date';
      } else {
        this._type[field] = value;
      }
    }
  }
  if (this._options.convert) {
    throw new Error('Option "convert" is deprecated. Use "type" instead.');
  }
  this._subscribers = {};
  if (data) {
    this.add(data);
  }
  this.setOptions(options);
}
DataSet.prototype.setOptions = function(options) {
  if (options && options.queue !== undefined) {
    if (options.queue === false) {
      if (this._queue) {
        this._queue.destroy();
        delete this._queue;
      }
    } else {
      if (!this._queue) {
        this._queue = Queue.extend(this, {replace: ['add', 'update', 'remove']});
      }
      if (typeof options.queue === 'object') {
        this._queue.setOptions(options.queue);
      }
    }
  }
};
DataSet.prototype.on = function(event, callback) {
  var subscribers = this._subscribers[event];
  if (!subscribers) {
    subscribers = [];
    this._subscribers[event] = subscribers;
  }
  subscribers.push({callback: callback});
};
DataSet.prototype.subscribe = function() {
  throw new Error('DataSet.subscribe is deprecated. Use DataSet.on instead.');
};
DataSet.prototype.off = function(event, callback) {
  var subscribers = this._subscribers[event];
  if (subscribers) {
    this._subscribers[event] = subscribers.filter((listener) => listener.callback != callback);
  }
};
DataSet.prototype.unsubscribe = function() {
  throw new Error('DataSet.unsubscribe is deprecated. Use DataSet.off instead.');
};
DataSet.prototype._trigger = function(event, params, senderId) {
  if (event == '*') {
    throw new Error('Cannot trigger event *');
  }
  var subscribers = [];
  if (event in this._subscribers) {
    subscribers = subscribers.concat(this._subscribers[event]);
  }
  if ('*' in this._subscribers) {
    subscribers = subscribers.concat(this._subscribers['*']);
  }
  for (var i = 0,
      len = subscribers.length; i < len; i++) {
    var subscriber = subscribers[i];
    if (subscriber.callback) {
      subscriber.callback(event, params, senderId || null);
    }
  }
};
DataSet.prototype.add = function(data, senderId) {
  var addedIds = [],
      id,
      me = this;
  if (Array.isArray(data)) {
    for (var i = 0,
        len = data.length; i < len; i++) {
      id = me._addItem(data[i]);
      addedIds.push(id);
    }
  } else if (data instanceof Object) {
    id = me._addItem(data);
    addedIds.push(id);
  } else {
    throw new Error('Unknown dataType');
  }
  if (addedIds.length) {
    this._trigger('add', {items: addedIds}, senderId);
  }
  return addedIds;
};
DataSet.prototype.update = function(data, senderId) {
  var addedIds = [];
  var updatedIds = [];
  var oldData = [];
  var updatedData = [];
  var me = this;
  var fieldId = me._fieldId;
  var addOrUpdate = function(item) {
    var id = item[fieldId];
    if (me._data[id]) {
      var oldItem = util.extend({}, me._data[id]);
      id = me._updateItem(item);
      updatedIds.push(id);
      updatedData.push(item);
      oldData.push(oldItem);
    } else {
      id = me._addItem(item);
      addedIds.push(id);
    }
  };
  if (Array.isArray(data)) {
    for (var i = 0,
        len = data.length; i < len; i++) {
      if (data[i] instanceof Object) {
        addOrUpdate(data[i]);
      } else {
        console.warn('Ignoring input item, which is not an object at index ' + i);
      }
    }
  } else if (data instanceof Object) {
    addOrUpdate(data);
  } else {
    throw new Error('Unknown dataType');
  }
  if (addedIds.length) {
    this._trigger('add', {items: addedIds}, senderId);
  }
  if (updatedIds.length) {
    var props = {
      items: updatedIds,
      oldData: oldData,
      data: updatedData
    };
    this._trigger('update', props, senderId);
  }
  return addedIds.concat(updatedIds);
};
DataSet.prototype.get = function(args) {
  var me = this;
  var id,
      ids,
      options;
  var firstType = util.getType(arguments[0]);
  if (firstType == 'String' || firstType == 'Number') {
    id = arguments[0];
    options = arguments[1];
  } else if (firstType == 'Array') {
    ids = arguments[0];
    options = arguments[1];
  } else {
    options = arguments[0];
  }
  var returnType;
  if (options && options.returnType) {
    var allowedValues = ['Array', 'Object'];
    returnType = allowedValues.indexOf(options.returnType) == -1 ? 'Array' : options.returnType;
  } else {
    returnType = 'Array';
  }
  var type = options && options.type || this._options.type;
  var filter = options && options.filter;
  var items = [],
      item,
      itemIds,
      itemId,
      i,
      len;
  if (id != undefined) {
    item = me._getItem(id, type);
    if (item && filter && !filter(item)) {
      item = null;
    }
  } else if (ids != undefined) {
    for (i = 0, len = ids.length; i < len; i++) {
      item = me._getItem(ids[i], type);
      if (!filter || filter(item)) {
        items.push(item);
      }
    }
  } else {
    itemIds = Object.keys(this._data);
    for (i = 0, len = itemIds.length; i < len; i++) {
      itemId = itemIds[i];
      item = me._getItem(itemId, type);
      if (!filter || filter(item)) {
        items.push(item);
      }
    }
  }
  if (options && options.order && id == undefined) {
    this._sort(items, options.order);
  }
  if (options && options.fields) {
    var fields = options.fields;
    if (id != undefined) {
      item = this._filterFields(item, fields);
    } else {
      for (i = 0, len = items.length; i < len; i++) {
        items[i] = this._filterFields(items[i], fields);
      }
    }
  }
  if (returnType == 'Object') {
    var result = {},
        resultant;
    for (i = 0, len = items.length; i < len; i++) {
      resultant = items[i];
      result[resultant.id] = resultant;
    }
    return result;
  } else {
    if (id != undefined) {
      return item;
    } else {
      return items;
    }
  }
};
DataSet.prototype.getIds = function(options) {
  var data = this._data,
      filter = options && options.filter,
      order = options && options.order,
      type = options && options.type || this._options.type,
      itemIds = Object.keys(data),
      i,
      len,
      id,
      item,
      items,
      ids = [];
  if (filter) {
    if (order) {
      items = [];
      for (i = 0, len = itemIds.length; i < len; i++) {
        id = itemIds[i];
        item = this._getItem(id, type);
        if (filter(item)) {
          items.push(item);
        }
      }
      this._sort(items, order);
      for (i = 0, len = items.length; i < len; i++) {
        ids.push(items[i][this._fieldId]);
      }
    } else {
      for (i = 0, len = itemIds.length; i < len; i++) {
        id = itemIds[i];
        item = this._getItem(id, type);
        if (filter(item)) {
          ids.push(item[this._fieldId]);
        }
      }
    }
  } else {
    if (order) {
      items = [];
      for (i = 0, len = itemIds.length; i < len; i++) {
        id = itemIds[i];
        items.push(data[id]);
      }
      this._sort(items, order);
      for (i = 0, len = items.length; i < len; i++) {
        ids.push(items[i][this._fieldId]);
      }
    } else {
      for (i = 0, len = itemIds.length; i < len; i++) {
        id = itemIds[i];
        item = data[id];
        ids.push(item[this._fieldId]);
      }
    }
  }
  return ids;
};
DataSet.prototype.getDataSet = function() {
  return this;
};
DataSet.prototype.forEach = function(callback, options) {
  var filter = options && options.filter,
      type = options && options.type || this._options.type,
      data = this._data,
      itemIds = Object.keys(data),
      i,
      len,
      item,
      id;
  if (options && options.order) {
    var items = this.get(options);
    for (i = 0, len = items.length; i < len; i++) {
      item = items[i];
      id = item[this._fieldId];
      callback(item, id);
    }
  } else {
    for (i = 0, len = itemIds.length; i < len; i++) {
      id = itemIds[i];
      item = this._getItem(id, type);
      if (!filter || filter(item)) {
        callback(item, id);
      }
    }
  }
};
DataSet.prototype.map = function(callback, options) {
  var filter = options && options.filter,
      type = options && options.type || this._options.type,
      mappedItems = [],
      data = this._data,
      itemIds = Object.keys(data),
      i,
      len,
      id,
      item;
  for (i = 0, len = itemIds.length; i < len; i++) {
    id = itemIds[i];
    item = this._getItem(id, type);
    if (!filter || filter(item)) {
      mappedItems.push(callback(item, id));
    }
  }
  if (options && options.order) {
    this._sort(mappedItems, options.order);
  }
  return mappedItems;
};
DataSet.prototype._filterFields = function(item, fields) {
  if (!item) {
    return item;
  }
  var filteredItem = {},
      itemFields = Object.keys(item),
      len = itemFields.length,
      i,
      field;
  if (Array.isArray(fields)) {
    for (i = 0; i < len; i++) {
      field = itemFields[i];
      if (fields.indexOf(field) != -1) {
        filteredItem[field] = item[field];
      }
    }
  } else {
    for (i = 0; i < len; i++) {
      field = itemFields[i];
      if (fields.hasOwnProperty(field)) {
        filteredItem[fields[field]] = item[field];
      }
    }
  }
  return filteredItem;
};
DataSet.prototype._sort = function(items, order) {
  if (util.isString(order)) {
    var name = order;
    items.sort(function(a, b) {
      var av = a[name];
      var bv = b[name];
      return (av > bv) ? 1 : ((av < bv) ? -1 : 0);
    });
  } else if (typeof order === 'function') {
    items.sort(order);
  } else {
    throw new TypeError('Order must be a function or a string');
  }
};
DataSet.prototype.remove = function(id, senderId) {
  var removedIds = [],
      i,
      len,
      removedId;
  if (Array.isArray(id)) {
    for (i = 0, len = id.length; i < len; i++) {
      removedId = this._remove(id[i]);
      if (removedId != null) {
        removedIds.push(removedId);
      }
    }
  } else {
    removedId = this._remove(id);
    if (removedId != null) {
      removedIds.push(removedId);
    }
  }
  if (removedIds.length) {
    this._trigger('remove', {items: removedIds}, senderId);
  }
  return removedIds;
};
DataSet.prototype._remove = function(id) {
  if (util.isNumber(id) || util.isString(id)) {
    if (this._data[id]) {
      delete this._data[id];
      this.length--;
      return id;
    }
  } else if (id instanceof Object) {
    var itemId = id[this._fieldId];
    if (itemId !== undefined && this._data[itemId]) {
      delete this._data[itemId];
      this.length--;
      return itemId;
    }
  }
  return null;
};
DataSet.prototype.clear = function(senderId) {
  var ids = Object.keys(this._data);
  this._data = {};
  this.length = 0;
  this._trigger('remove', {items: ids}, senderId);
  return ids;
};
DataSet.prototype.max = function(field) {
  var data = this._data,
      itemIds = Object.keys(data),
      max = null,
      maxField = null,
      i,
      len;
  for (i = 0, len = itemIds.length; i < len; i++) {
    var id = itemIds[i];
    var item = data[id];
    var itemField = item[field];
    if (itemField != null && (!max || itemField > maxField)) {
      max = item;
      maxField = itemField;
    }
  }
  return max;
};
DataSet.prototype.min = function(field) {
  var data = this._data,
      itemIds = Object.keys(data),
      min = null,
      minField = null,
      i,
      len;
  for (i = 0, len = itemIds.length; i < len; i++) {
    var id = itemIds[i];
    var item = data[id];
    var itemField = item[field];
    if (itemField != null && (!min || itemField < minField)) {
      min = item;
      minField = itemField;
    }
  }
  return min;
};
DataSet.prototype.distinct = function(field) {
  var data = this._data;
  var itemIds = Object.keys(data);
  var values = [];
  var fieldType = this._options.type && this._options.type[field] || null;
  var count = 0;
  var i,
      j,
      len;
  for (i = 0, len = itemIds.length; i < len; i++) {
    var id = itemIds[i];
    var item = data[id];
    var value = item[field];
    var exists = false;
    for (j = 0; j < count; j++) {
      if (values[j] == value) {
        exists = true;
        break;
      }
    }
    if (!exists && (value !== undefined)) {
      values[count] = value;
      count++;
    }
  }
  if (fieldType) {
    for (i = 0, len = values.length; i < len; i++) {
      values[i] = util.convert(values[i], fieldType);
    }
  }
  return values;
};
DataSet.prototype._addItem = function(item) {
  var id = item[this._fieldId];
  if (id != undefined) {
    if (this._data[id]) {
      throw new Error('Cannot add item: item with id ' + id + ' already exists');
    }
  } else {
    id = util.randomUUID();
    item[this._fieldId] = id;
  }
  var d = {},
      fields = Object.keys(item),
      i,
      len;
  for (i = 0, len = fields.length; i < len; i++) {
    var field = fields[i];
    var fieldType = this._type[field];
    d[field] = util.convert(item[field], fieldType);
  }
  this._data[id] = d;
  this.length++;
  return id;
};
DataSet.prototype._getItem = function(id, types) {
  var field,
      value,
      i,
      len;
  var raw = this._data[id];
  if (!raw) {
    return null;
  }
  var converted = {},
      fields = Object.keys(raw);
  if (types) {
    for (i = 0, len = fields.length; i < len; i++) {
      field = fields[i];
      value = raw[field];
      converted[field] = util.convert(value, types[field]);
    }
  } else {
    for (i = 0, len = fields.length; i < len; i++) {
      field = fields[i];
      value = raw[field];
      converted[field] = value;
    }
  }
  return converted;
};
DataSet.prototype._updateItem = function(item) {
  var id = item[this._fieldId];
  if (id == undefined) {
    throw new Error('Cannot update item: item has no id (item: ' + JSON.stringify(item) + ')');
  }
  var d = this._data[id];
  if (!d) {
    throw new Error('Cannot update item: no item with id ' + id + ' found');
  }
  var fields = Object.keys(item);
  for (var i = 0,
      len = fields.length; i < len; i++) {
    var field = fields[i];
    var fieldType = this._type[field];
    d[field] = util.convert(item[field], fieldType);
  }
  return id;
};
module.exports = DataSet;
