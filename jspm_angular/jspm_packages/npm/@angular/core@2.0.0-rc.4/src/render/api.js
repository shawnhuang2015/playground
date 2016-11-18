/* */ 
"use strict";
var exceptions_1 = require('../facade/exceptions');
var RenderComponentType = (function() {
  function RenderComponentType(id, templateUrl, slotCount, encapsulation, styles) {
    this.id = id;
    this.templateUrl = templateUrl;
    this.slotCount = slotCount;
    this.encapsulation = encapsulation;
    this.styles = styles;
  }
  return RenderComponentType;
}());
exports.RenderComponentType = RenderComponentType;
var RenderDebugInfo = (function() {
  function RenderDebugInfo() {}
  Object.defineProperty(RenderDebugInfo.prototype, "injector", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(RenderDebugInfo.prototype, "component", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(RenderDebugInfo.prototype, "providerTokens", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(RenderDebugInfo.prototype, "references", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(RenderDebugInfo.prototype, "context", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(RenderDebugInfo.prototype, "source", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  return RenderDebugInfo;
}());
exports.RenderDebugInfo = RenderDebugInfo;
var Renderer = (function() {
  function Renderer() {}
  return Renderer;
}());
exports.Renderer = Renderer;
var RootRenderer = (function() {
  function RootRenderer() {}
  return RootRenderer;
}());
exports.RootRenderer = RootRenderer;
