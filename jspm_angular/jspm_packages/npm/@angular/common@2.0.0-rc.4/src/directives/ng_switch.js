/* */ 
"use strict";
var core_1 = require('@angular/core');
var collection_1 = require('../facade/collection');
var lang_1 = require('../facade/lang');
var _CASE_DEFAULT = new Object();
var _warned = false;
var SwitchView = (function() {
  function SwitchView(_viewContainerRef, _templateRef) {
    this._viewContainerRef = _viewContainerRef;
    this._templateRef = _templateRef;
  }
  SwitchView.prototype.create = function() {
    this._viewContainerRef.createEmbeddedView(this._templateRef);
  };
  SwitchView.prototype.destroy = function() {
    this._viewContainerRef.clear();
  };
  return SwitchView;
}());
exports.SwitchView = SwitchView;
var NgSwitch = (function() {
  function NgSwitch() {
    this._useDefault = false;
    this._valueViews = new collection_1.Map();
    this._activeViews = [];
  }
  Object.defineProperty(NgSwitch.prototype, "ngSwitch", {
    set: function(value) {
      this._emptyAllActiveViews();
      this._useDefault = false;
      var views = this._valueViews.get(value);
      if (lang_1.isBlank(views)) {
        this._useDefault = true;
        views = lang_1.normalizeBlank(this._valueViews.get(_CASE_DEFAULT));
      }
      this._activateViews(views);
      this._switchValue = value;
    },
    enumerable: true,
    configurable: true
  });
  NgSwitch.prototype._onCaseValueChanged = function(oldCase, newCase, view) {
    this._deregisterView(oldCase, view);
    this._registerView(newCase, view);
    if (oldCase === this._switchValue) {
      view.destroy();
      collection_1.ListWrapper.remove(this._activeViews, view);
    } else if (newCase === this._switchValue) {
      if (this._useDefault) {
        this._useDefault = false;
        this._emptyAllActiveViews();
      }
      view.create();
      this._activeViews.push(view);
    }
    if (this._activeViews.length === 0 && !this._useDefault) {
      this._useDefault = true;
      this._activateViews(this._valueViews.get(_CASE_DEFAULT));
    }
  };
  NgSwitch.prototype._emptyAllActiveViews = function() {
    var activeContainers = this._activeViews;
    for (var i = 0; i < activeContainers.length; i++) {
      activeContainers[i].destroy();
    }
    this._activeViews = [];
  };
  NgSwitch.prototype._activateViews = function(views) {
    if (lang_1.isPresent(views)) {
      for (var i = 0; i < views.length; i++) {
        views[i].create();
      }
      this._activeViews = views;
    }
  };
  NgSwitch.prototype._registerView = function(value, view) {
    var views = this._valueViews.get(value);
    if (lang_1.isBlank(views)) {
      views = [];
      this._valueViews.set(value, views);
    }
    views.push(view);
  };
  NgSwitch.prototype._deregisterView = function(value, view) {
    if (value === _CASE_DEFAULT)
      return;
    var views = this._valueViews.get(value);
    if (views.length == 1) {
      this._valueViews.delete(value);
    } else {
      collection_1.ListWrapper.remove(views, view);
    }
  };
  NgSwitch.decorators = [{
    type: core_1.Directive,
    args: [{
      selector: '[ngSwitch]',
      inputs: ['ngSwitch']
    }]
  }];
  return NgSwitch;
}());
exports.NgSwitch = NgSwitch;
var NgSwitchCase = (function() {
  function NgSwitchCase(viewContainer, templateRef, ngSwitch) {
    this._value = _CASE_DEFAULT;
    this._switch = ngSwitch;
    this._view = new SwitchView(viewContainer, templateRef);
  }
  Object.defineProperty(NgSwitchCase.prototype, "ngSwitchCase", {
    set: function(value) {
      this._switch._onCaseValueChanged(this._value, value, this._view);
      this._value = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(NgSwitchCase.prototype, "ngSwitchWhen", {
    set: function(value) {
      if (!_warned) {
        _warned = true;
        console.warn('*ngSwitchWhen is deprecated and will be removed. Use *ngSwitchCase instead');
      }
      this._switch._onCaseValueChanged(this._value, value, this._view);
      this._value = value;
    },
    enumerable: true,
    configurable: true
  });
  NgSwitchCase.decorators = [{
    type: core_1.Directive,
    args: [{
      selector: '[ngSwitchCase],[ngSwitchWhen]',
      inputs: ['ngSwitchCase', 'ngSwitchWhen']
    }]
  }];
  NgSwitchCase.ctorParameters = [{type: core_1.ViewContainerRef}, {type: core_1.TemplateRef}, {
    type: NgSwitch,
    decorators: [{type: core_1.Host}]
  }];
  return NgSwitchCase;
}());
exports.NgSwitchCase = NgSwitchCase;
var NgSwitchDefault = (function() {
  function NgSwitchDefault(viewContainer, templateRef, sswitch) {
    sswitch._registerView(_CASE_DEFAULT, new SwitchView(viewContainer, templateRef));
  }
  NgSwitchDefault.decorators = [{
    type: core_1.Directive,
    args: [{selector: '[ngSwitchDefault]'}]
  }];
  NgSwitchDefault.ctorParameters = [{type: core_1.ViewContainerRef}, {type: core_1.TemplateRef}, {
    type: NgSwitch,
    decorators: [{type: core_1.Host}]
  }];
  return NgSwitchDefault;
}());
exports.NgSwitchDefault = NgSwitchDefault;
