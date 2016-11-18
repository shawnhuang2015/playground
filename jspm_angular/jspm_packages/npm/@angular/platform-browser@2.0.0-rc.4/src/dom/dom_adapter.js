/* */ 
"use strict";
var lang_1 = require('../facade/lang');
var _DOM = null;
function getDOM() {
  return _DOM;
}
exports.getDOM = getDOM;
function setDOM(adapter) {
  _DOM = adapter;
}
exports.setDOM = setDOM;
function setRootDomAdapter(adapter) {
  if (lang_1.isBlank(_DOM)) {
    _DOM = adapter;
  }
}
exports.setRootDomAdapter = setRootDomAdapter;
var DomAdapter = (function() {
  function DomAdapter() {
    this.xhrType = null;
  }
  DomAdapter.prototype.getXHR = function() {
    return this.xhrType;
  };
  Object.defineProperty(DomAdapter.prototype, "attrToPropMap", {
    get: function() {
      return this._attrToPropMap;
    },
    set: function(value) {
      this._attrToPropMap = value;
    },
    enumerable: true,
    configurable: true
  });
  ;
  ;
  return DomAdapter;
}());
exports.DomAdapter = DomAdapter;
