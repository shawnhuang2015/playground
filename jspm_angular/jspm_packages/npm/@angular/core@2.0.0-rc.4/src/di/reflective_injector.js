/* */ 
(function(process) {
  "use strict";
  var collection_1 = require('../facade/collection');
  var exceptions_1 = require('../facade/exceptions');
  var injector_1 = require('./injector');
  var metadata_1 = require('./metadata');
  var reflective_exceptions_1 = require('./reflective_exceptions');
  var reflective_key_1 = require('./reflective_key');
  var reflective_provider_1 = require('./reflective_provider');
  var __unused;
  var _MAX_CONSTRUCTION_COUNTER = 10;
  var UNDEFINED = new Object();
  var ReflectiveProtoInjectorInlineStrategy = (function() {
    function ReflectiveProtoInjectorInlineStrategy(protoEI, providers) {
      this.provider0 = null;
      this.provider1 = null;
      this.provider2 = null;
      this.provider3 = null;
      this.provider4 = null;
      this.provider5 = null;
      this.provider6 = null;
      this.provider7 = null;
      this.provider8 = null;
      this.provider9 = null;
      this.keyId0 = null;
      this.keyId1 = null;
      this.keyId2 = null;
      this.keyId3 = null;
      this.keyId4 = null;
      this.keyId5 = null;
      this.keyId6 = null;
      this.keyId7 = null;
      this.keyId8 = null;
      this.keyId9 = null;
      var length = providers.length;
      if (length > 0) {
        this.provider0 = providers[0];
        this.keyId0 = providers[0].key.id;
      }
      if (length > 1) {
        this.provider1 = providers[1];
        this.keyId1 = providers[1].key.id;
      }
      if (length > 2) {
        this.provider2 = providers[2];
        this.keyId2 = providers[2].key.id;
      }
      if (length > 3) {
        this.provider3 = providers[3];
        this.keyId3 = providers[3].key.id;
      }
      if (length > 4) {
        this.provider4 = providers[4];
        this.keyId4 = providers[4].key.id;
      }
      if (length > 5) {
        this.provider5 = providers[5];
        this.keyId5 = providers[5].key.id;
      }
      if (length > 6) {
        this.provider6 = providers[6];
        this.keyId6 = providers[6].key.id;
      }
      if (length > 7) {
        this.provider7 = providers[7];
        this.keyId7 = providers[7].key.id;
      }
      if (length > 8) {
        this.provider8 = providers[8];
        this.keyId8 = providers[8].key.id;
      }
      if (length > 9) {
        this.provider9 = providers[9];
        this.keyId9 = providers[9].key.id;
      }
    }
    ReflectiveProtoInjectorInlineStrategy.prototype.getProviderAtIndex = function(index) {
      if (index == 0)
        return this.provider0;
      if (index == 1)
        return this.provider1;
      if (index == 2)
        return this.provider2;
      if (index == 3)
        return this.provider3;
      if (index == 4)
        return this.provider4;
      if (index == 5)
        return this.provider5;
      if (index == 6)
        return this.provider6;
      if (index == 7)
        return this.provider7;
      if (index == 8)
        return this.provider8;
      if (index == 9)
        return this.provider9;
      throw new reflective_exceptions_1.OutOfBoundsError(index);
    };
    ReflectiveProtoInjectorInlineStrategy.prototype.createInjectorStrategy = function(injector) {
      return new ReflectiveInjectorInlineStrategy(injector, this);
    };
    return ReflectiveProtoInjectorInlineStrategy;
  }());
  exports.ReflectiveProtoInjectorInlineStrategy = ReflectiveProtoInjectorInlineStrategy;
  var ReflectiveProtoInjectorDynamicStrategy = (function() {
    function ReflectiveProtoInjectorDynamicStrategy(protoInj, providers) {
      this.providers = providers;
      var len = providers.length;
      this.keyIds = collection_1.ListWrapper.createFixedSize(len);
      for (var i = 0; i < len; i++) {
        this.keyIds[i] = providers[i].key.id;
      }
    }
    ReflectiveProtoInjectorDynamicStrategy.prototype.getProviderAtIndex = function(index) {
      if (index < 0 || index >= this.providers.length) {
        throw new reflective_exceptions_1.OutOfBoundsError(index);
      }
      return this.providers[index];
    };
    ReflectiveProtoInjectorDynamicStrategy.prototype.createInjectorStrategy = function(ei) {
      return new ReflectiveInjectorDynamicStrategy(this, ei);
    };
    return ReflectiveProtoInjectorDynamicStrategy;
  }());
  exports.ReflectiveProtoInjectorDynamicStrategy = ReflectiveProtoInjectorDynamicStrategy;
  var ReflectiveProtoInjector = (function() {
    function ReflectiveProtoInjector(providers) {
      this.numberOfProviders = providers.length;
      this._strategy = providers.length > _MAX_CONSTRUCTION_COUNTER ? new ReflectiveProtoInjectorDynamicStrategy(this, providers) : new ReflectiveProtoInjectorInlineStrategy(this, providers);
    }
    ReflectiveProtoInjector.fromResolvedProviders = function(providers) {
      return new ReflectiveProtoInjector(providers);
    };
    ReflectiveProtoInjector.prototype.getProviderAtIndex = function(index) {
      return this._strategy.getProviderAtIndex(index);
    };
    return ReflectiveProtoInjector;
  }());
  exports.ReflectiveProtoInjector = ReflectiveProtoInjector;
  var ReflectiveInjectorInlineStrategy = (function() {
    function ReflectiveInjectorInlineStrategy(injector, protoStrategy) {
      this.injector = injector;
      this.protoStrategy = protoStrategy;
      this.obj0 = UNDEFINED;
      this.obj1 = UNDEFINED;
      this.obj2 = UNDEFINED;
      this.obj3 = UNDEFINED;
      this.obj4 = UNDEFINED;
      this.obj5 = UNDEFINED;
      this.obj6 = UNDEFINED;
      this.obj7 = UNDEFINED;
      this.obj8 = UNDEFINED;
      this.obj9 = UNDEFINED;
    }
    ReflectiveInjectorInlineStrategy.prototype.resetConstructionCounter = function() {
      this.injector._constructionCounter = 0;
    };
    ReflectiveInjectorInlineStrategy.prototype.instantiateProvider = function(provider) {
      return this.injector._new(provider);
    };
    ReflectiveInjectorInlineStrategy.prototype.getObjByKeyId = function(keyId) {
      var p = this.protoStrategy;
      var inj = this.injector;
      if (p.keyId0 === keyId) {
        if (this.obj0 === UNDEFINED) {
          this.obj0 = inj._new(p.provider0);
        }
        return this.obj0;
      }
      if (p.keyId1 === keyId) {
        if (this.obj1 === UNDEFINED) {
          this.obj1 = inj._new(p.provider1);
        }
        return this.obj1;
      }
      if (p.keyId2 === keyId) {
        if (this.obj2 === UNDEFINED) {
          this.obj2 = inj._new(p.provider2);
        }
        return this.obj2;
      }
      if (p.keyId3 === keyId) {
        if (this.obj3 === UNDEFINED) {
          this.obj3 = inj._new(p.provider3);
        }
        return this.obj3;
      }
      if (p.keyId4 === keyId) {
        if (this.obj4 === UNDEFINED) {
          this.obj4 = inj._new(p.provider4);
        }
        return this.obj4;
      }
      if (p.keyId5 === keyId) {
        if (this.obj5 === UNDEFINED) {
          this.obj5 = inj._new(p.provider5);
        }
        return this.obj5;
      }
      if (p.keyId6 === keyId) {
        if (this.obj6 === UNDEFINED) {
          this.obj6 = inj._new(p.provider6);
        }
        return this.obj6;
      }
      if (p.keyId7 === keyId) {
        if (this.obj7 === UNDEFINED) {
          this.obj7 = inj._new(p.provider7);
        }
        return this.obj7;
      }
      if (p.keyId8 === keyId) {
        if (this.obj8 === UNDEFINED) {
          this.obj8 = inj._new(p.provider8);
        }
        return this.obj8;
      }
      if (p.keyId9 === keyId) {
        if (this.obj9 === UNDEFINED) {
          this.obj9 = inj._new(p.provider9);
        }
        return this.obj9;
      }
      return UNDEFINED;
    };
    ReflectiveInjectorInlineStrategy.prototype.getObjAtIndex = function(index) {
      if (index == 0)
        return this.obj0;
      if (index == 1)
        return this.obj1;
      if (index == 2)
        return this.obj2;
      if (index == 3)
        return this.obj3;
      if (index == 4)
        return this.obj4;
      if (index == 5)
        return this.obj5;
      if (index == 6)
        return this.obj6;
      if (index == 7)
        return this.obj7;
      if (index == 8)
        return this.obj8;
      if (index == 9)
        return this.obj9;
      throw new reflective_exceptions_1.OutOfBoundsError(index);
    };
    ReflectiveInjectorInlineStrategy.prototype.getMaxNumberOfObjects = function() {
      return _MAX_CONSTRUCTION_COUNTER;
    };
    return ReflectiveInjectorInlineStrategy;
  }());
  exports.ReflectiveInjectorInlineStrategy = ReflectiveInjectorInlineStrategy;
  var ReflectiveInjectorDynamicStrategy = (function() {
    function ReflectiveInjectorDynamicStrategy(protoStrategy, injector) {
      this.protoStrategy = protoStrategy;
      this.injector = injector;
      this.objs = collection_1.ListWrapper.createFixedSize(protoStrategy.providers.length);
      collection_1.ListWrapper.fill(this.objs, UNDEFINED);
    }
    ReflectiveInjectorDynamicStrategy.prototype.resetConstructionCounter = function() {
      this.injector._constructionCounter = 0;
    };
    ReflectiveInjectorDynamicStrategy.prototype.instantiateProvider = function(provider) {
      return this.injector._new(provider);
    };
    ReflectiveInjectorDynamicStrategy.prototype.getObjByKeyId = function(keyId) {
      var p = this.protoStrategy;
      for (var i = 0; i < p.keyIds.length; i++) {
        if (p.keyIds[i] === keyId) {
          if (this.objs[i] === UNDEFINED) {
            this.objs[i] = this.injector._new(p.providers[i]);
          }
          return this.objs[i];
        }
      }
      return UNDEFINED;
    };
    ReflectiveInjectorDynamicStrategy.prototype.getObjAtIndex = function(index) {
      if (index < 0 || index >= this.objs.length) {
        throw new reflective_exceptions_1.OutOfBoundsError(index);
      }
      return this.objs[index];
    };
    ReflectiveInjectorDynamicStrategy.prototype.getMaxNumberOfObjects = function() {
      return this.objs.length;
    };
    return ReflectiveInjectorDynamicStrategy;
  }());
  exports.ReflectiveInjectorDynamicStrategy = ReflectiveInjectorDynamicStrategy;
  var ReflectiveInjector = (function() {
    function ReflectiveInjector() {}
    ReflectiveInjector.resolve = function(providers) {
      return reflective_provider_1.resolveReflectiveProviders(providers);
    };
    ReflectiveInjector.resolveAndCreate = function(providers, parent) {
      if (parent === void 0) {
        parent = null;
      }
      var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
      return ReflectiveInjector.fromResolvedProviders(ResolvedReflectiveProviders, parent);
    };
    ReflectiveInjector.fromResolvedProviders = function(providers, parent) {
      if (parent === void 0) {
        parent = null;
      }
      return new ReflectiveInjector_(ReflectiveProtoInjector.fromResolvedProviders(providers), parent);
    };
    ReflectiveInjector.fromResolvedBindings = function(providers) {
      return ReflectiveInjector.fromResolvedProviders(providers);
    };
    Object.defineProperty(ReflectiveInjector.prototype, "parent", {
      get: function() {
        return exceptions_1.unimplemented();
      },
      enumerable: true,
      configurable: true
    });
    ReflectiveInjector.prototype.debugContext = function() {
      return null;
    };
    ReflectiveInjector.prototype.resolveAndCreateChild = function(providers) {
      return exceptions_1.unimplemented();
    };
    ReflectiveInjector.prototype.createChildFromResolved = function(providers) {
      return exceptions_1.unimplemented();
    };
    ReflectiveInjector.prototype.resolveAndInstantiate = function(provider) {
      return exceptions_1.unimplemented();
    };
    ReflectiveInjector.prototype.instantiateResolved = function(provider) {
      return exceptions_1.unimplemented();
    };
    return ReflectiveInjector;
  }());
  exports.ReflectiveInjector = ReflectiveInjector;
  var ReflectiveInjector_ = (function() {
    function ReflectiveInjector_(_proto, _parent, _debugContext) {
      if (_parent === void 0) {
        _parent = null;
      }
      if (_debugContext === void 0) {
        _debugContext = null;
      }
      this._debugContext = _debugContext;
      this._constructionCounter = 0;
      this._proto = _proto;
      this._parent = _parent;
      this._strategy = _proto._strategy.createInjectorStrategy(this);
    }
    ReflectiveInjector_.prototype.debugContext = function() {
      return this._debugContext();
    };
    ReflectiveInjector_.prototype.get = function(token, notFoundValue) {
      if (notFoundValue === void 0) {
        notFoundValue = injector_1.THROW_IF_NOT_FOUND;
      }
      return this._getByKey(reflective_key_1.ReflectiveKey.get(token), null, null, notFoundValue);
    };
    ReflectiveInjector_.prototype.getAt = function(index) {
      return this._strategy.getObjAtIndex(index);
    };
    Object.defineProperty(ReflectiveInjector_.prototype, "parent", {
      get: function() {
        return this._parent;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ReflectiveInjector_.prototype, "internalStrategy", {
      get: function() {
        return this._strategy;
      },
      enumerable: true,
      configurable: true
    });
    ReflectiveInjector_.prototype.resolveAndCreateChild = function(providers) {
      var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
      return this.createChildFromResolved(ResolvedReflectiveProviders);
    };
    ReflectiveInjector_.prototype.createChildFromResolved = function(providers) {
      var proto = new ReflectiveProtoInjector(providers);
      var inj = new ReflectiveInjector_(proto);
      inj._parent = this;
      return inj;
    };
    ReflectiveInjector_.prototype.resolveAndInstantiate = function(provider) {
      return this.instantiateResolved(ReflectiveInjector.resolve([provider])[0]);
    };
    ReflectiveInjector_.prototype.instantiateResolved = function(provider) {
      return this._instantiateProvider(provider);
    };
    ReflectiveInjector_.prototype._new = function(provider) {
      if (this._constructionCounter++ > this._strategy.getMaxNumberOfObjects()) {
        throw new reflective_exceptions_1.CyclicDependencyError(this, provider.key);
      }
      return this._instantiateProvider(provider);
    };
    ReflectiveInjector_.prototype._instantiateProvider = function(provider) {
      if (provider.multiProvider) {
        var res = collection_1.ListWrapper.createFixedSize(provider.resolvedFactories.length);
        for (var i = 0; i < provider.resolvedFactories.length; ++i) {
          res[i] = this._instantiate(provider, provider.resolvedFactories[i]);
        }
        return res;
      } else {
        return this._instantiate(provider, provider.resolvedFactories[0]);
      }
    };
    ReflectiveInjector_.prototype._instantiate = function(provider, ResolvedReflectiveFactory) {
      var factory = ResolvedReflectiveFactory.factory;
      var deps = ResolvedReflectiveFactory.dependencies;
      var length = deps.length;
      var d0;
      var d1;
      var d2;
      var d3;
      var d4;
      var d5;
      var d6;
      var d7;
      var d8;
      var d9;
      var d10;
      var d11;
      var d12;
      var d13;
      var d14;
      var d15;
      var d16;
      var d17;
      var d18;
      var d19;
      try {
        d0 = length > 0 ? this._getByReflectiveDependency(provider, deps[0]) : null;
        d1 = length > 1 ? this._getByReflectiveDependency(provider, deps[1]) : null;
        d2 = length > 2 ? this._getByReflectiveDependency(provider, deps[2]) : null;
        d3 = length > 3 ? this._getByReflectiveDependency(provider, deps[3]) : null;
        d4 = length > 4 ? this._getByReflectiveDependency(provider, deps[4]) : null;
        d5 = length > 5 ? this._getByReflectiveDependency(provider, deps[5]) : null;
        d6 = length > 6 ? this._getByReflectiveDependency(provider, deps[6]) : null;
        d7 = length > 7 ? this._getByReflectiveDependency(provider, deps[7]) : null;
        d8 = length > 8 ? this._getByReflectiveDependency(provider, deps[8]) : null;
        d9 = length > 9 ? this._getByReflectiveDependency(provider, deps[9]) : null;
        d10 = length > 10 ? this._getByReflectiveDependency(provider, deps[10]) : null;
        d11 = length > 11 ? this._getByReflectiveDependency(provider, deps[11]) : null;
        d12 = length > 12 ? this._getByReflectiveDependency(provider, deps[12]) : null;
        d13 = length > 13 ? this._getByReflectiveDependency(provider, deps[13]) : null;
        d14 = length > 14 ? this._getByReflectiveDependency(provider, deps[14]) : null;
        d15 = length > 15 ? this._getByReflectiveDependency(provider, deps[15]) : null;
        d16 = length > 16 ? this._getByReflectiveDependency(provider, deps[16]) : null;
        d17 = length > 17 ? this._getByReflectiveDependency(provider, deps[17]) : null;
        d18 = length > 18 ? this._getByReflectiveDependency(provider, deps[18]) : null;
        d19 = length > 19 ? this._getByReflectiveDependency(provider, deps[19]) : null;
      } catch (e) {
        if (e instanceof reflective_exceptions_1.AbstractProviderError || e instanceof reflective_exceptions_1.InstantiationError) {
          e.addKey(this, provider.key);
        }
        throw e;
      }
      var obj;
      try {
        switch (length) {
          case 0:
            obj = factory();
            break;
          case 1:
            obj = factory(d0);
            break;
          case 2:
            obj = factory(d0, d1);
            break;
          case 3:
            obj = factory(d0, d1, d2);
            break;
          case 4:
            obj = factory(d0, d1, d2, d3);
            break;
          case 5:
            obj = factory(d0, d1, d2, d3, d4);
            break;
          case 6:
            obj = factory(d0, d1, d2, d3, d4, d5);
            break;
          case 7:
            obj = factory(d0, d1, d2, d3, d4, d5, d6);
            break;
          case 8:
            obj = factory(d0, d1, d2, d3, d4, d5, d6, d7);
            break;
          case 9:
            obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8);
            break;
          case 10:
            obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9);
            break;
          case 11:
            obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10);
            break;
          case 12:
            obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11);
            break;
          case 13:
            obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12);
            break;
          case 14:
            obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13);
            break;
          case 15:
            obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14);
            break;
          case 16:
            obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15);
            break;
          case 17:
            obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16);
            break;
          case 18:
            obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17);
            break;
          case 19:
            obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18);
            break;
          case 20:
            obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19);
            break;
          default:
            throw new exceptions_1.BaseException("Cannot instantiate '" + provider.key.displayName + "' because it has more than 20 dependencies");
        }
      } catch (e) {
        throw new reflective_exceptions_1.InstantiationError(this, e, e.stack, provider.key);
      }
      return obj;
    };
    ReflectiveInjector_.prototype._getByReflectiveDependency = function(provider, dep) {
      return this._getByKey(dep.key, dep.lowerBoundVisibility, dep.upperBoundVisibility, dep.optional ? null : injector_1.THROW_IF_NOT_FOUND);
    };
    ReflectiveInjector_.prototype._getByKey = function(key, lowerBoundVisibility, upperBoundVisibility, notFoundValue) {
      if (key === INJECTOR_KEY) {
        return this;
      }
      if (upperBoundVisibility instanceof metadata_1.SelfMetadata) {
        return this._getByKeySelf(key, notFoundValue);
      } else {
        return this._getByKeyDefault(key, notFoundValue, lowerBoundVisibility);
      }
    };
    ReflectiveInjector_.prototype._throwOrNull = function(key, notFoundValue) {
      if (notFoundValue !== injector_1.THROW_IF_NOT_FOUND) {
        return notFoundValue;
      } else {
        throw new reflective_exceptions_1.NoProviderError(this, key);
      }
    };
    ReflectiveInjector_.prototype._getByKeySelf = function(key, notFoundValue) {
      var obj = this._strategy.getObjByKeyId(key.id);
      return (obj !== UNDEFINED) ? obj : this._throwOrNull(key, notFoundValue);
    };
    ReflectiveInjector_.prototype._getByKeyDefault = function(key, notFoundValue, lowerBoundVisibility) {
      var inj;
      if (lowerBoundVisibility instanceof metadata_1.SkipSelfMetadata) {
        inj = this._parent;
      } else {
        inj = this;
      }
      while (inj instanceof ReflectiveInjector_) {
        var inj_ = inj;
        var obj = inj_._strategy.getObjByKeyId(key.id);
        if (obj !== UNDEFINED)
          return obj;
        inj = inj_._parent;
      }
      if (inj !== null) {
        return inj.get(key.token, notFoundValue);
      } else {
        return this._throwOrNull(key, notFoundValue);
      }
    };
    Object.defineProperty(ReflectiveInjector_.prototype, "displayName", {
      get: function() {
        var providers = _mapProviders(this, function(b) {
          return ' "' + b.key.displayName + '" ';
        }).join(', ');
        return "ReflectiveInjector(providers: [" + providers + "])";
      },
      enumerable: true,
      configurable: true
    });
    ReflectiveInjector_.prototype.toString = function() {
      return this.displayName;
    };
    return ReflectiveInjector_;
  }());
  exports.ReflectiveInjector_ = ReflectiveInjector_;
  var INJECTOR_KEY = reflective_key_1.ReflectiveKey.get(injector_1.Injector);
  function _mapProviders(injector, fn) {
    var res = new Array(injector._proto.numberOfProviders);
    for (var i = 0; i < injector._proto.numberOfProviders; ++i) {
      res[i] = fn(injector._proto.getProviderAtIndex(i));
    }
    return res;
  }
})(require('process'));
