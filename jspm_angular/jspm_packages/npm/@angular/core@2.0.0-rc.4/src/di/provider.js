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
var lang_1 = require('../facade/lang');
var Provider = (function() {
  function Provider(token, _a) {
    var useClass = _a.useClass,
        useValue = _a.useValue,
        useExisting = _a.useExisting,
        useFactory = _a.useFactory,
        deps = _a.deps,
        multi = _a.multi;
    this.token = token;
    this.useClass = useClass;
    this.useValue = useValue;
    this.useExisting = useExisting;
    this.useFactory = useFactory;
    this.dependencies = deps;
    this._multi = multi;
  }
  Object.defineProperty(Provider.prototype, "multi", {
    get: function() {
      return lang_1.normalizeBool(this._multi);
    },
    enumerable: true,
    configurable: true
  });
  return Provider;
}());
exports.Provider = Provider;
var Binding = (function(_super) {
  __extends(Binding, _super);
  function Binding(token, _a) {
    var toClass = _a.toClass,
        toValue = _a.toValue,
        toAlias = _a.toAlias,
        toFactory = _a.toFactory,
        deps = _a.deps,
        multi = _a.multi;
    _super.call(this, token, {
      useClass: toClass,
      useValue: toValue,
      useExisting: toAlias,
      useFactory: toFactory,
      deps: deps,
      multi: multi
    });
  }
  Object.defineProperty(Binding.prototype, "toClass", {
    get: function() {
      return this.useClass;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Binding.prototype, "toAlias", {
    get: function() {
      return this.useExisting;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Binding.prototype, "toFactory", {
    get: function() {
      return this.useFactory;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Binding.prototype, "toValue", {
    get: function() {
      return this.useValue;
    },
    enumerable: true,
    configurable: true
  });
  return Binding;
}(Provider));
exports.Binding = Binding;
function bind(token) {
  return new ProviderBuilder(token);
}
exports.bind = bind;
var ProviderBuilder = (function() {
  function ProviderBuilder(token) {
    this.token = token;
  }
  ProviderBuilder.prototype.toClass = function(type) {
    if (!lang_1.isType(type)) {
      throw new exceptions_1.BaseException("Trying to create a class provider but \"" + lang_1.stringify(type) + "\" is not a class!");
    }
    return new Provider(this.token, {useClass: type});
  };
  ProviderBuilder.prototype.toValue = function(value) {
    return new Provider(this.token, {useValue: value});
  };
  ProviderBuilder.prototype.toAlias = function(aliasToken) {
    if (lang_1.isBlank(aliasToken)) {
      throw new exceptions_1.BaseException("Can not alias " + lang_1.stringify(this.token) + " to a blank value!");
    }
    return new Provider(this.token, {useExisting: aliasToken});
  };
  ProviderBuilder.prototype.toFactory = function(factory, dependencies) {
    if (!lang_1.isFunction(factory)) {
      throw new exceptions_1.BaseException("Trying to create a factory provider but \"" + lang_1.stringify(factory) + "\" is not a function!");
    }
    return new Provider(this.token, {
      useFactory: factory,
      deps: dependencies
    });
  };
  return ProviderBuilder;
}());
exports.ProviderBuilder = ProviderBuilder;
function provide(token, _a) {
  var useClass = _a.useClass,
      useValue = _a.useValue,
      useExisting = _a.useExisting,
      useFactory = _a.useFactory,
      deps = _a.deps,
      multi = _a.multi;
  return new Provider(token, {
    useClass: useClass,
    useValue: useValue,
    useExisting: useExisting,
    useFactory: useFactory,
    deps: deps,
    multi: multi
  });
}
exports.provide = provide;
