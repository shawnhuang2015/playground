/* */ 
"use strict";
var collection_1 = require('../facade/collection');
var exceptions_1 = require('../facade/exceptions');
var lang_1 = require('../facade/lang');
var profile_1 = require('../profile/profile');
var ViewContainerRef = (function() {
  function ViewContainerRef() {}
  Object.defineProperty(ViewContainerRef.prototype, "element", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewContainerRef.prototype, "injector", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewContainerRef.prototype, "parentInjector", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewContainerRef.prototype, "length", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  ;
  return ViewContainerRef;
}());
exports.ViewContainerRef = ViewContainerRef;
var ViewContainerRef_ = (function() {
  function ViewContainerRef_(_element) {
    this._element = _element;
    this._createComponentInContainerScope = profile_1.wtfCreateScope('ViewContainerRef#createComponent()');
    this._insertScope = profile_1.wtfCreateScope('ViewContainerRef#insert()');
    this._removeScope = profile_1.wtfCreateScope('ViewContainerRef#remove()');
    this._detachScope = profile_1.wtfCreateScope('ViewContainerRef#detach()');
  }
  ViewContainerRef_.prototype.get = function(index) {
    return this._element.nestedViews[index].ref;
  };
  Object.defineProperty(ViewContainerRef_.prototype, "length", {
    get: function() {
      var views = this._element.nestedViews;
      return lang_1.isPresent(views) ? views.length : 0;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewContainerRef_.prototype, "element", {
    get: function() {
      return this._element.elementRef;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewContainerRef_.prototype, "injector", {
    get: function() {
      return this._element.injector;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewContainerRef_.prototype, "parentInjector", {
    get: function() {
      return this._element.parentInjector;
    },
    enumerable: true,
    configurable: true
  });
  ViewContainerRef_.prototype.createEmbeddedView = function(templateRef, context, index) {
    if (context === void 0) {
      context = null;
    }
    if (index === void 0) {
      index = -1;
    }
    var viewRef = templateRef.createEmbeddedView(context);
    this.insert(viewRef, index);
    return viewRef;
  };
  ViewContainerRef_.prototype.createComponent = function(componentFactory, index, injector, projectableNodes) {
    if (index === void 0) {
      index = -1;
    }
    if (injector === void 0) {
      injector = null;
    }
    if (projectableNodes === void 0) {
      projectableNodes = null;
    }
    var s = this._createComponentInContainerScope();
    var contextInjector = lang_1.isPresent(injector) ? injector : this._element.parentInjector;
    var componentRef = componentFactory.create(contextInjector, projectableNodes);
    this.insert(componentRef.hostView, index);
    return profile_1.wtfLeave(s, componentRef);
  };
  ViewContainerRef_.prototype.insert = function(viewRef, index) {
    if (index === void 0) {
      index = -1;
    }
    var s = this._insertScope();
    if (index == -1)
      index = this.length;
    var viewRef_ = viewRef;
    this._element.attachView(viewRef_.internalView, index);
    return profile_1.wtfLeave(s, viewRef_);
  };
  ViewContainerRef_.prototype.indexOf = function(viewRef) {
    return collection_1.ListWrapper.indexOf(this._element.nestedViews, viewRef.internalView);
  };
  ViewContainerRef_.prototype.remove = function(index) {
    if (index === void 0) {
      index = -1;
    }
    var s = this._removeScope();
    if (index == -1)
      index = this.length - 1;
    var view = this._element.detachView(index);
    view.destroy();
    profile_1.wtfLeave(s);
  };
  ViewContainerRef_.prototype.detach = function(index) {
    if (index === void 0) {
      index = -1;
    }
    var s = this._detachScope();
    if (index == -1)
      index = this.length - 1;
    var view = this._element.detachView(index);
    return profile_1.wtfLeave(s, view.ref);
  };
  ViewContainerRef_.prototype.clear = function() {
    for (var i = this.length - 1; i >= 0; i--) {
      this.remove(i);
    }
  };
  return ViewContainerRef_;
}());
exports.ViewContainerRef_ = ViewContainerRef_;
