/* */ 
"use strict";
var async_1 = require('../facade/async');
var collection_1 = require('../facade/collection');
var lang_1 = require('../facade/lang');
var QueryList = (function() {
  function QueryList() {
    this._dirty = true;
    this._results = [];
    this._emitter = new async_1.EventEmitter();
  }
  Object.defineProperty(QueryList.prototype, "changes", {
    get: function() {
      return this._emitter;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(QueryList.prototype, "length", {
    get: function() {
      return this._results.length;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(QueryList.prototype, "first", {
    get: function() {
      return this._results[0];
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(QueryList.prototype, "last", {
    get: function() {
      return this._results[this.length - 1];
    },
    enumerable: true,
    configurable: true
  });
  QueryList.prototype.map = function(fn) {
    return this._results.map(fn);
  };
  QueryList.prototype.filter = function(fn) {
    return this._results.filter(fn);
  };
  QueryList.prototype.reduce = function(fn, init) {
    return this._results.reduce(fn, init);
  };
  QueryList.prototype.forEach = function(fn) {
    this._results.forEach(fn);
  };
  QueryList.prototype.some = function(fn) {
    return this._results.some(fn);
  };
  QueryList.prototype.toArray = function() {
    return this._results.slice();
  };
  QueryList.prototype[lang_1.getSymbolIterator()] = function() {
    return this._results[lang_1.getSymbolIterator()]();
  };
  QueryList.prototype.toString = function() {
    return this._results.toString();
  };
  QueryList.prototype.reset = function(res) {
    this._results = collection_1.ListWrapper.flatten(res);
    this._dirty = false;
  };
  QueryList.prototype.notifyOnChanges = function() {
    this._emitter.emit(this);
  };
  QueryList.prototype.setDirty = function() {
    this._dirty = true;
  };
  Object.defineProperty(QueryList.prototype, "dirty", {
    get: function() {
      return this._dirty;
    },
    enumerable: true,
    configurable: true
  });
  return QueryList;
}());
exports.QueryList = QueryList;
