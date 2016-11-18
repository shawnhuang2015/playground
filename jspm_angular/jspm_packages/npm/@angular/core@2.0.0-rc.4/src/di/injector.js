/* */ 
"use strict";
var exceptions_1 = require('../facade/exceptions');
var _THROW_IF_NOT_FOUND = new Object();
exports.THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
var Injector = (function() {
  function Injector() {}
  Injector.prototype.get = function(token, notFoundValue) {
    return exceptions_1.unimplemented();
  };
  Injector.THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
  return Injector;
}());
exports.Injector = Injector;
