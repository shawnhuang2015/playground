/* */ 
"use strict";
var promise_1 = require('../src/facade/promise');
var AsyncTestCompleter = (function() {
  function AsyncTestCompleter() {
    this._completer = new promise_1.PromiseCompleter();
  }
  AsyncTestCompleter.prototype.done = function(value) {
    this._completer.resolve(value);
  };
  AsyncTestCompleter.prototype.fail = function(error, stackTrace) {
    this._completer.reject(error, stackTrace);
  };
  Object.defineProperty(AsyncTestCompleter.prototype, "promise", {
    get: function() {
      return this._completer.promise;
    },
    enumerable: true,
    configurable: true
  });
  return AsyncTestCompleter;
}());
exports.AsyncTestCompleter = AsyncTestCompleter;
