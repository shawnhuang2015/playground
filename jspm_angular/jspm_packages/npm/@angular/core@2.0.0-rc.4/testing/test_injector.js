/* */ 
"use strict";
var index_1 = require('../index');
var application_ref_1 = require('../src/application_ref');
var collection_1 = require('../src/facade/collection');
var exceptions_1 = require('../src/facade/exceptions');
var lang_1 = require('../src/facade/lang');
var async_test_completer_1 = require('./async_test_completer');
var TestInjector = (function() {
  function TestInjector() {
    this._instantiated = false;
    this._injector = null;
    this._providers = [];
    this.platformProviders = [];
    this.applicationProviders = [];
  }
  TestInjector.prototype.reset = function() {
    this._injector = null;
    this._providers = [];
    this._instantiated = false;
  };
  TestInjector.prototype.addProviders = function(providers) {
    if (this._instantiated) {
      throw new exceptions_1.BaseException('Cannot add providers after test injector is instantiated');
    }
    this._providers = collection_1.ListWrapper.concat(this._providers, providers);
  };
  TestInjector.prototype.createInjector = function() {
    application_ref_1.lockRunMode();
    var rootInjector = index_1.ReflectiveInjector.resolveAndCreate(this.platformProviders);
    this._injector = rootInjector.resolveAndCreateChild(collection_1.ListWrapper.concat(this.applicationProviders, this._providers));
    this._instantiated = true;
    return this._injector;
  };
  TestInjector.prototype.get = function(token) {
    if (!this._instantiated) {
      this.createInjector();
    }
    return this._injector.get(token);
  };
  TestInjector.prototype.execute = function(tokens, fn) {
    var _this = this;
    if (!this._instantiated) {
      this.createInjector();
    }
    var params = tokens.map(function(t) {
      return _this._injector.get(t);
    });
    return lang_1.FunctionWrapper.apply(fn, params);
  };
  return TestInjector;
}());
exports.TestInjector = TestInjector;
var _testInjector = null;
function getTestInjector() {
  if (_testInjector == null) {
    _testInjector = new TestInjector();
  }
  return _testInjector;
}
exports.getTestInjector = getTestInjector;
function setBaseTestProviders(platformProviders, applicationProviders) {
  var testInjector = getTestInjector();
  if (testInjector.platformProviders.length > 0 || testInjector.applicationProviders.length > 0) {
    throw new exceptions_1.BaseException('Cannot set base providers because it has already been called');
  }
  testInjector.platformProviders = platformProviders;
  testInjector.applicationProviders = applicationProviders;
  var injector = testInjector.createInjector();
  var inits = injector.get(index_1.PLATFORM_INITIALIZER, null);
  if (lang_1.isPresent(inits)) {
    inits.forEach(function(init) {
      return init();
    });
  }
  testInjector.reset();
}
exports.setBaseTestProviders = setBaseTestProviders;
function resetBaseTestProviders() {
  var testInjector = getTestInjector();
  testInjector.platformProviders = [];
  testInjector.applicationProviders = [];
  testInjector.reset();
}
exports.resetBaseTestProviders = resetBaseTestProviders;
function inject(tokens, fn) {
  var testInjector = getTestInjector();
  if (tokens.indexOf(async_test_completer_1.AsyncTestCompleter) >= 0) {
    return function() {
      var completer = testInjector.get(async_test_completer_1.AsyncTestCompleter);
      testInjector.execute(tokens, fn);
      return completer.promise;
    };
  } else {
    return function() {
      return getTestInjector().execute(tokens, fn);
    };
  }
}
exports.inject = inject;
var InjectSetupWrapper = (function() {
  function InjectSetupWrapper(_providers) {
    this._providers = _providers;
  }
  InjectSetupWrapper.prototype._addProviders = function() {
    var additionalProviders = this._providers();
    if (additionalProviders.length > 0) {
      getTestInjector().addProviders(additionalProviders);
    }
  };
  InjectSetupWrapper.prototype.inject = function(tokens, fn) {
    var _this = this;
    return function() {
      _this._addProviders();
      return inject_impl(tokens, fn)();
    };
  };
  return InjectSetupWrapper;
}());
exports.InjectSetupWrapper = InjectSetupWrapper;
function withProviders(providers) {
  return new InjectSetupWrapper(providers);
}
exports.withProviders = withProviders;
var inject_impl = inject;
