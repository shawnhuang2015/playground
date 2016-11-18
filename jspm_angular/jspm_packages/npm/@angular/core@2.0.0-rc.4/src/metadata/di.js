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
var forward_ref_1 = require('../di/forward_ref');
var metadata_1 = require('../di/metadata');
var lang_1 = require('../facade/lang');
var AttributeMetadata = (function(_super) {
  __extends(AttributeMetadata, _super);
  function AttributeMetadata(attributeName) {
    _super.call(this);
    this.attributeName = attributeName;
  }
  Object.defineProperty(AttributeMetadata.prototype, "token", {
    get: function() {
      return this;
    },
    enumerable: true,
    configurable: true
  });
  AttributeMetadata.prototype.toString = function() {
    return "@Attribute(" + lang_1.stringify(this.attributeName) + ")";
  };
  return AttributeMetadata;
}(metadata_1.DependencyMetadata));
exports.AttributeMetadata = AttributeMetadata;
var QueryMetadata = (function(_super) {
  __extends(QueryMetadata, _super);
  function QueryMetadata(_selector, _a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.descendants,
        descendants = _c === void 0 ? false : _c,
        _d = _b.first,
        first = _d === void 0 ? false : _d,
        _e = _b.read,
        read = _e === void 0 ? null : _e;
    _super.call(this);
    this._selector = _selector;
    this.descendants = descendants;
    this.first = first;
    this.read = read;
  }
  Object.defineProperty(QueryMetadata.prototype, "isViewQuery", {
    get: function() {
      return false;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(QueryMetadata.prototype, "selector", {
    get: function() {
      return forward_ref_1.resolveForwardRef(this._selector);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(QueryMetadata.prototype, "isVarBindingQuery", {
    get: function() {
      return lang_1.isString(this.selector);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(QueryMetadata.prototype, "varBindings", {
    get: function() {
      return lang_1.StringWrapper.split(this.selector, /\s*,\s*/g);
    },
    enumerable: true,
    configurable: true
  });
  QueryMetadata.prototype.toString = function() {
    return "@Query(" + lang_1.stringify(this.selector) + ")";
  };
  return QueryMetadata;
}(metadata_1.DependencyMetadata));
exports.QueryMetadata = QueryMetadata;
var ContentChildrenMetadata = (function(_super) {
  __extends(ContentChildrenMetadata, _super);
  function ContentChildrenMetadata(_selector, _a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.descendants,
        descendants = _c === void 0 ? false : _c,
        _d = _b.read,
        read = _d === void 0 ? null : _d;
    _super.call(this, _selector, {
      descendants: descendants,
      read: read
    });
  }
  return ContentChildrenMetadata;
}(QueryMetadata));
exports.ContentChildrenMetadata = ContentChildrenMetadata;
var ContentChildMetadata = (function(_super) {
  __extends(ContentChildMetadata, _super);
  function ContentChildMetadata(_selector, _a) {
    var _b = (_a === void 0 ? {} : _a).read,
        read = _b === void 0 ? null : _b;
    _super.call(this, _selector, {
      descendants: true,
      first: true,
      read: read
    });
  }
  return ContentChildMetadata;
}(QueryMetadata));
exports.ContentChildMetadata = ContentChildMetadata;
var ViewQueryMetadata = (function(_super) {
  __extends(ViewQueryMetadata, _super);
  function ViewQueryMetadata(_selector, _a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.descendants,
        descendants = _c === void 0 ? false : _c,
        _d = _b.first,
        first = _d === void 0 ? false : _d,
        _e = _b.read,
        read = _e === void 0 ? null : _e;
    _super.call(this, _selector, {
      descendants: descendants,
      first: first,
      read: read
    });
  }
  Object.defineProperty(ViewQueryMetadata.prototype, "isViewQuery", {
    get: function() {
      return true;
    },
    enumerable: true,
    configurable: true
  });
  ViewQueryMetadata.prototype.toString = function() {
    return "@ViewQuery(" + lang_1.stringify(this.selector) + ")";
  };
  return ViewQueryMetadata;
}(QueryMetadata));
exports.ViewQueryMetadata = ViewQueryMetadata;
var ViewChildrenMetadata = (function(_super) {
  __extends(ViewChildrenMetadata, _super);
  function ViewChildrenMetadata(_selector, _a) {
    var _b = (_a === void 0 ? {} : _a).read,
        read = _b === void 0 ? null : _b;
    _super.call(this, _selector, {
      descendants: true,
      read: read
    });
  }
  return ViewChildrenMetadata;
}(ViewQueryMetadata));
exports.ViewChildrenMetadata = ViewChildrenMetadata;
var ViewChildMetadata = (function(_super) {
  __extends(ViewChildMetadata, _super);
  function ViewChildMetadata(_selector, _a) {
    var _b = (_a === void 0 ? {} : _a).read,
        read = _b === void 0 ? null : _b;
    _super.call(this, _selector, {
      descendants: true,
      first: true,
      read: read
    });
  }
  return ViewChildMetadata;
}(ViewQueryMetadata));
exports.ViewChildMetadata = ViewChildMetadata;
