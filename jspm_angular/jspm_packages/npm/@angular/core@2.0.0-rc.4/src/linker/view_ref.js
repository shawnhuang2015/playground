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
var constants_1 = require('../change_detection/constants');
var exceptions_1 = require('../facade/exceptions');
var ViewRef = (function() {
  function ViewRef() {}
  Object.defineProperty(ViewRef.prototype, "destroyed", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  return ViewRef;
}());
exports.ViewRef = ViewRef;
var EmbeddedViewRef = (function(_super) {
  __extends(EmbeddedViewRef, _super);
  function EmbeddedViewRef() {
    _super.apply(this, arguments);
  }
  Object.defineProperty(EmbeddedViewRef.prototype, "context", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(EmbeddedViewRef.prototype, "rootNodes", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  ;
  return EmbeddedViewRef;
}(ViewRef));
exports.EmbeddedViewRef = EmbeddedViewRef;
var ViewRef_ = (function() {
  function ViewRef_(_view) {
    this._view = _view;
    this._view = _view;
    this._originalMode = this._view.cdMode;
  }
  Object.defineProperty(ViewRef_.prototype, "internalView", {
    get: function() {
      return this._view;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewRef_.prototype, "rootNodes", {
    get: function() {
      return this._view.flatRootNodes;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewRef_.prototype, "context", {
    get: function() {
      return this._view.context;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewRef_.prototype, "destroyed", {
    get: function() {
      return this._view.destroyed;
    },
    enumerable: true,
    configurable: true
  });
  ViewRef_.prototype.markForCheck = function() {
    this._view.markPathToRootAsCheckOnce();
  };
  ViewRef_.prototype.detach = function() {
    this._view.cdMode = constants_1.ChangeDetectorStatus.Detached;
  };
  ViewRef_.prototype.detectChanges = function() {
    this._view.detectChanges(false);
  };
  ViewRef_.prototype.checkNoChanges = function() {
    this._view.detectChanges(true);
  };
  ViewRef_.prototype.reattach = function() {
    this._view.cdMode = this._originalMode;
    this.markForCheck();
  };
  ViewRef_.prototype.onDestroy = function(callback) {
    this._view.disposables.push(callback);
  };
  ViewRef_.prototype.destroy = function() {
    this._view.destroy();
  };
  return ViewRef_;
}());
exports.ViewRef_ = ViewRef_;
