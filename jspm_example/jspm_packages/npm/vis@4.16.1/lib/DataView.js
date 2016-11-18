/* */ 
var util = require('./util');
var DataSet = require('./DataSet');
function DataView(data, options) {
  this._data = null;
  this._ids = {};
  this.length = 0;
  this._options = options || {};
  this._fieldId = 'id';
  this._subscribers = {};
  var me = this;
  this.listener = function() {
    me._onEvent.apply(me, arguments);
  };
  this.setData(data);
}
DataView.prototype.setData = function(data) {
  var ids,
      id,
      i,
      len;
  if (this._data) {
    if (this._data.off) {
      this._data.off('*', this.listener);
    }
    ids = Object.keys(this._ids);
    this._ids = {};
    this.length = 0;
    this._trigger('remove', {items: ids});
  }
  this._data = data;
  if (this._data) {
    this._fieldId = this._options.fieldId || (this._data && this._data.options && this._data.options.fieldId) || 'id';
    ids = this._data.getIds({filter: this._options && this._options.filter});
    for (i = 0, len = ids.length; i < len; i++) {
      id = ids[i];
      this._ids[id] = true;
    }
    this.length = ids.length;
    this._trigger('add', {items: ids});
    if (this._data.on) {
      this._data.on('*', this.listener);
    }
  }
};
DataView.prototype.refresh = function() {
  var id,
      i,
      len;
  var ids = this._data.getIds({filter: this._options && this._options.filter});
  var oldIds = Object.keys(this._ids);
  var newIds = {};
  var added = [];
  var removed = [];
  for (i = 0, len = ids.length; i < len; i++) {
    id = ids[i];
    newIds[id] = true;
    if (!this._ids[id]) {
      added.push(id);
      this._ids[id] = true;
    }
  }
  for (i = 0, len = oldIds.length; i < len; i++) {
    id = oldIds[i];
    if (!newIds[id]) {
      removed.push(id);
      delete this._ids[id];
    }
  }
  this.length += added.length - removed.length;
  if (added.length) {
    this._trigger('add', {items: added});
  }
  if (removed.length) {
    this._trigger('remove', {items: removed});
  }
};
DataView.prototype.get = function(args) {
  var me = this;
  var ids,
      options,
      data;
  var firstType = util.getType(arguments[0]);
  if (firstType == 'String' || firstType == 'Number' || firstType == 'Array') {
    ids = arguments[0];
    options = arguments[1];
    data = arguments[2];
  } else {
    options = arguments[0];
    data = arguments[1];
  }
  var viewOptions = util.extend({}, this._options, options);
  if (this._options.filter && options && options.filter) {
    viewOptions.filter = function(item) {
      return me._options.filter(item) && options.filter(item);
    };
  }
  var getArguments = [];
  if (ids != undefined) {
    getArguments.push(ids);
  }
  getArguments.push(viewOptions);
  getArguments.push(data);
  return this._data && this._data.get.apply(this._data, getArguments);
};
DataView.prototype.getIds = function(options) {
  var ids;
  if (this._data) {
    var defaultFilter = this._options.filter;
    var filter;
    if (options && options.filter) {
      if (defaultFilter) {
        filter = function(item) {
          return defaultFilter(item) && options.filter(item);
        };
      } else {
        filter = options.filter;
      }
    } else {
      filter = defaultFilter;
    }
    ids = this._data.getIds({
      filter: filter,
      order: options && options.order
    });
  } else {
    ids = [];
  }
  return ids;
};
DataView.prototype.map = function(callback, options) {
  var mappedItems = [];
  if (this._data) {
    var defaultFilter = this._options.filter;
    var filter;
    if (options && options.filter) {
      if (defaultFilter) {
        filter = function(item) {
          return defaultFilter(item) && options.filter(item);
        };
      } else {
        filter = options.filter;
      }
    } else {
      filter = defaultFilter;
    }
    mappedItems = this._data.map(callback, {
      filter: filter,
      order: options && options.order
    });
  } else {
    mappedItems = [];
  }
  return mappedItems;
};
DataView.prototype.getDataSet = function() {
  var dataSet = this;
  while (dataSet instanceof DataView) {
    dataSet = dataSet._data;
  }
  return dataSet || null;
};
DataView.prototype._onEvent = function(event, params, senderId) {
  var i,
      len,
      id,
      item;
  var ids = params && params.items;
  var data = this._data;
  var updatedData = [];
  var added = [];
  var updated = [];
  var removed = [];
  if (ids && data) {
    switch (event) {
      case 'add':
        for (i = 0, len = ids.length; i < len; i++) {
          id = ids[i];
          item = this.get(id);
          if (item) {
            this._ids[id] = true;
            added.push(id);
          }
        }
        break;
      case 'update':
        for (i = 0, len = ids.length; i < len; i++) {
          id = ids[i];
          item = this.get(id);
          if (item) {
            if (this._ids[id]) {
              updated.push(id);
              updatedData.push(params.data[i]);
            } else {
              this._ids[id] = true;
              added.push(id);
            }
          } else {
            if (this._ids[id]) {
              delete this._ids[id];
              removed.push(id);
            } else {}
          }
        }
        break;
      case 'remove':
        for (i = 0, len = ids.length; i < len; i++) {
          id = ids[i];
          if (this._ids[id]) {
            delete this._ids[id];
            removed.push(id);
          }
        }
        break;
    }
    this.length += added.length - removed.length;
    if (added.length) {
      this._trigger('add', {items: added}, senderId);
    }
    if (updated.length) {
      this._trigger('update', {
        items: updated,
        data: updatedData
      }, senderId);
    }
    if (removed.length) {
      this._trigger('remove', {items: removed}, senderId);
    }
  }
};
DataView.prototype.on = DataSet.prototype.on;
DataView.prototype.off = DataSet.prototype.off;
DataView.prototype._trigger = DataSet.prototype._trigger;
DataView.prototype.subscribe = DataView.prototype.on;
DataView.prototype.unsubscribe = DataView.prototype.off;
module.exports = DataView;
