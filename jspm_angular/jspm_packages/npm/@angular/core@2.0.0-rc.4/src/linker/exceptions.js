/* */ 
"use strict";
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var exceptions_1 = require('../facade/exceptions');
var ExpressionChangedAfterItHasBeenCheckedException = (function(_super) {
  __extends(ExpressionChangedAfterItHasBeenCheckedException, _super);
  function ExpressionChangedAfterItHasBeenCheckedException(oldValue, currValue, context) {
    _super.call(this, "Expression has changed after it was checked. " + ("Previous value: '" + oldValue + "'. Current value: '" + currValue + "'"));
  }
  return ExpressionChangedAfterItHasBeenCheckedException;
}(exceptions_1.BaseException));
exports.ExpressionChangedAfterItHasBeenCheckedException = ExpressionChangedAfterItHasBeenCheckedException;
var ViewWrappedException = (function(_super) {
  __extends(ViewWrappedException, _super);
  function ViewWrappedException(originalException, originalStack, context) {
    _super.call(this, "Error in " + context.source, originalException, originalStack, context);
  }
  return ViewWrappedException;
}(exceptions_1.WrappedException));
exports.ViewWrappedException = ViewWrappedException;
var ViewDestroyedException = (function(_super) {
  __extends(ViewDestroyedException, _super);
  function ViewDestroyedException(details) {
    _super.call(this, "Attempt to use a destroyed view: " + details);
  }
  return ViewDestroyedException;
}(exceptions_1.BaseException));
exports.ViewDestroyedException = ViewDestroyedException;
