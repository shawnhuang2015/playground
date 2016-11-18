/* */ 
"use strict";
var collection_1 = require('../facade/collection');
var lang_1 = require('../facade/lang');
var lang_2 = require('../facade/lang');
exports.looseIdentical = lang_2.looseIdentical;
exports.uninitialized = new Object();
function devModeEqual(a, b) {
  if (collection_1.isListLikeIterable(a) && collection_1.isListLikeIterable(b)) {
    return collection_1.areIterablesEqual(a, b, devModeEqual);
  } else if (!collection_1.isListLikeIterable(a) && !lang_1.isPrimitive(a) && !collection_1.isListLikeIterable(b) && !lang_1.isPrimitive(b)) {
    return true;
  } else {
    return lang_1.looseIdentical(a, b);
  }
}
exports.devModeEqual = devModeEqual;
var WrappedValue = (function() {
  function WrappedValue(wrapped) {
    this.wrapped = wrapped;
  }
  WrappedValue.wrap = function(value) {
    return new WrappedValue(value);
  };
  return WrappedValue;
}());
exports.WrappedValue = WrappedValue;
var ValueUnwrapper = (function() {
  function ValueUnwrapper() {
    this.hasWrappedValue = false;
  }
  ValueUnwrapper.prototype.unwrap = function(value) {
    if (value instanceof WrappedValue) {
      this.hasWrappedValue = true;
      return value.wrapped;
    }
    return value;
  };
  ValueUnwrapper.prototype.reset = function() {
    this.hasWrappedValue = false;
  };
  return ValueUnwrapper;
}());
exports.ValueUnwrapper = ValueUnwrapper;
var SimpleChange = (function() {
  function SimpleChange(previousValue, currentValue) {
    this.previousValue = previousValue;
    this.currentValue = currentValue;
  }
  SimpleChange.prototype.isFirstChange = function() {
    return this.previousValue === exports.uninitialized;
  };
  return SimpleChange;
}());
exports.SimpleChange = SimpleChange;
