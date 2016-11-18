/* */ 
"use strict";
var decorators_1 = require('./di/decorators');
var lang_1 = require('./facade/lang');
var _warnImpl = lang_1.warn;
var Console = (function() {
  function Console() {}
  Console.prototype.log = function(message) {
    lang_1.print(message);
  };
  Console.prototype.warn = function(message) {
    _warnImpl(message);
  };
  Console.decorators = [{type: decorators_1.Injectable}];
  return Console;
}());
exports.Console = Console;
