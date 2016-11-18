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
var lang_1 = require('../facade/lang');
var EMPTY_CONTEXT = new Object();
var TemplateRef = (function() {
  function TemplateRef() {}
  Object.defineProperty(TemplateRef.prototype, "elementRef", {
    get: function() {
      return null;
    },
    enumerable: true,
    configurable: true
  });
  return TemplateRef;
}());
exports.TemplateRef = TemplateRef;
var TemplateRef_ = (function(_super) {
  __extends(TemplateRef_, _super);
  function TemplateRef_(_appElement, _viewFactory) {
    _super.call(this);
    this._appElement = _appElement;
    this._viewFactory = _viewFactory;
  }
  TemplateRef_.prototype.createEmbeddedView = function(context) {
    var view = this._viewFactory(this._appElement.parentView.viewUtils, this._appElement.parentInjector, this._appElement);
    if (lang_1.isBlank(context)) {
      context = EMPTY_CONTEXT;
    }
    view.create(context, null, null);
    return view.ref;
  };
  Object.defineProperty(TemplateRef_.prototype, "elementRef", {
    get: function() {
      return this._appElement.elementRef;
    },
    enumerable: true,
    configurable: true
  });
  return TemplateRef_;
}(TemplateRef));
exports.TemplateRef_ = TemplateRef_;
