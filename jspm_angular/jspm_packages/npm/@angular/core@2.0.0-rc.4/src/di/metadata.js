/* */ 
"use strict";
var lang_1 = require('../facade/lang');
var InjectMetadata = (function() {
  function InjectMetadata(token) {
    this.token = token;
  }
  InjectMetadata.prototype.toString = function() {
    return "@Inject(" + lang_1.stringify(this.token) + ")";
  };
  return InjectMetadata;
}());
exports.InjectMetadata = InjectMetadata;
var OptionalMetadata = (function() {
  function OptionalMetadata() {}
  OptionalMetadata.prototype.toString = function() {
    return "@Optional()";
  };
  return OptionalMetadata;
}());
exports.OptionalMetadata = OptionalMetadata;
var DependencyMetadata = (function() {
  function DependencyMetadata() {}
  Object.defineProperty(DependencyMetadata.prototype, "token", {
    get: function() {
      return null;
    },
    enumerable: true,
    configurable: true
  });
  return DependencyMetadata;
}());
exports.DependencyMetadata = DependencyMetadata;
var InjectableMetadata = (function() {
  function InjectableMetadata() {}
  return InjectableMetadata;
}());
exports.InjectableMetadata = InjectableMetadata;
var SelfMetadata = (function() {
  function SelfMetadata() {}
  SelfMetadata.prototype.toString = function() {
    return "@Self()";
  };
  return SelfMetadata;
}());
exports.SelfMetadata = SelfMetadata;
var SkipSelfMetadata = (function() {
  function SkipSelfMetadata() {}
  SkipSelfMetadata.prototype.toString = function() {
    return "@SkipSelf()";
  };
  return SkipSelfMetadata;
}());
exports.SkipSelfMetadata = SkipSelfMetadata;
var HostMetadata = (function() {
  function HostMetadata() {}
  HostMetadata.prototype.toString = function() {
    return "@Host()";
  };
  return HostMetadata;
}());
exports.HostMetadata = HostMetadata;
