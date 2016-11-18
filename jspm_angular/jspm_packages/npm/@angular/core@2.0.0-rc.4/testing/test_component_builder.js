/* */ 
"use strict";
var index_1 = require('../index');
var async_1 = require('../src/facade/async');
var lang_1 = require('../src/facade/lang');
var component_fixture_1 = require('./component_fixture');
var fake_async_1 = require('./fake_async');
var TestComponentRenderer = (function() {
  function TestComponentRenderer() {}
  TestComponentRenderer.prototype.insertRootElement = function(rootElementId) {};
  return TestComponentRenderer;
}());
exports.TestComponentRenderer = TestComponentRenderer;
exports.ComponentFixtureAutoDetect = new index_1.OpaqueToken('ComponentFixtureAutoDetect');
exports.ComponentFixtureNoNgZone = new index_1.OpaqueToken('ComponentFixtureNoNgZone');
var _nextRootElementId = 0;
var TestComponentBuilder = (function() {
  function TestComponentBuilder(_injector) {
    this._injector = _injector;
  }
  TestComponentBuilder.prototype.overrideTemplate = function(componentType, template) {
    throw new Error('overrideTemplate is not supported in this implementation of TestComponentBuilder.');
  };
  TestComponentBuilder.prototype.overrideView = function(componentType, view) {
    throw new Error('overrideView is not supported in this implementation of TestComponentBuilder.');
  };
  TestComponentBuilder.prototype.overrideDirective = function(componentType, from, to) {
    throw new Error('overrideDirective is not supported in this implementation of TestComponentBuilder.');
  };
  TestComponentBuilder.prototype.overrideProviders = function(type, providers) {
    throw new Error('overrideProviders is not supported in this implementation of TestComponentBuilder.');
  };
  TestComponentBuilder.prototype.overrideViewProviders = function(type, providers) {
    throw new Error('overrideViewProviders is not supported in this implementation of TestComponentBuilder.');
  };
  TestComponentBuilder.prototype.overrideAnimations = function(componentType, animations) {
    throw new Error('overrideAnimations is not supported in this implementation of TestComponentBuilder.');
  };
  TestComponentBuilder.prototype.createFromFactory = function(ngZone, componentFactory) {
    var rootElId = "root" + _nextRootElementId++;
    var testComponentRenderer = this._injector.get(TestComponentRenderer);
    testComponentRenderer.insertRootElement(rootElId);
    var componentRef = componentFactory.create(this._injector, [], "#" + rootElId);
    var autoDetect = this._injector.get(exports.ComponentFixtureAutoDetect, false);
    return new component_fixture_1.ComponentFixture(componentRef, ngZone, autoDetect);
  };
  TestComponentBuilder.prototype.createAsync = function(rootComponentType) {
    var _this = this;
    var noNgZone = lang_1.IS_DART || this._injector.get(exports.ComponentFixtureNoNgZone, false);
    var ngZone = noNgZone ? null : this._injector.get(index_1.NgZone, null);
    var compiler = this._injector.get(index_1.Compiler);
    var initComponent = function() {
      var promise = compiler.compileComponentAsync(rootComponentType);
      return promise.then(function(componentFactory) {
        return _this.createFromFactory(ngZone, componentFactory);
      });
    };
    return ngZone == null ? initComponent() : ngZone.run(initComponent);
  };
  TestComponentBuilder.prototype.createFakeAsync = function(rootComponentType) {
    var result;
    var error;
    async_1.PromiseWrapper.then(this.createAsync(rootComponentType), function(_result) {
      result = _result;
    }, function(_error) {
      error = _error;
    });
    fake_async_1.tick();
    if (lang_1.isPresent(error)) {
      throw error;
    }
    return result;
  };
  TestComponentBuilder.prototype.createSync = function(rootComponentType) {
    var _this = this;
    var noNgZone = lang_1.IS_DART || this._injector.get(exports.ComponentFixtureNoNgZone, false);
    var ngZone = noNgZone ? null : this._injector.get(index_1.NgZone, null);
    var compiler = this._injector.get(index_1.Compiler);
    var initComponent = function() {
      return _this.createFromFactory(ngZone, _this._injector.get(index_1.Compiler).compileComponentSync(rootComponentType));
    };
    return ngZone == null ? initComponent() : ngZone.run(initComponent);
  };
  TestComponentBuilder.decorators = [{type: index_1.Injectable}];
  TestComponentBuilder.ctorParameters = [{type: index_1.Injector}];
  return TestComponentBuilder;
}());
exports.TestComponentBuilder = TestComponentBuilder;
