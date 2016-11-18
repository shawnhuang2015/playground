/* */ 
"use strict";
var exceptions_1 = require('../facade/exceptions');
var lang_1 = require('../facade/lang');
var Compiler = (function() {
  function Compiler() {}
  Compiler.prototype.compileComponentAsync = function(component) {
    throw new exceptions_1.BaseException("Runtime compiler is not loaded. Tried to compile " + lang_1.stringify(component));
  };
  Compiler.prototype.compileComponentSync = function(component) {
    throw new exceptions_1.BaseException("Runtime compiler is not loaded. Tried to compile " + lang_1.stringify(component));
  };
  Compiler.prototype.clearCache = function() {};
  Compiler.prototype.clearCacheFor = function(compType) {};
  return Compiler;
}());
exports.Compiler = Compiler;
