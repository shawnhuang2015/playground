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
var metadata_1 = require('../di/metadata');
var lang_1 = require('../facade/lang');
var DirectiveMetadata = (function(_super) {
  __extends(DirectiveMetadata, _super);
  function DirectiveMetadata(_a) {
    var _b = _a === void 0 ? {} : _a,
        selector = _b.selector,
        inputs = _b.inputs,
        outputs = _b.outputs,
        properties = _b.properties,
        events = _b.events,
        host = _b.host,
        providers = _b.providers,
        exportAs = _b.exportAs,
        queries = _b.queries;
    _super.call(this);
    this.selector = selector;
    this._inputs = inputs;
    this._properties = properties;
    this._outputs = outputs;
    this._events = events;
    this.host = host;
    this.exportAs = exportAs;
    this.queries = queries;
    this._providers = providers;
  }
  Object.defineProperty(DirectiveMetadata.prototype, "inputs", {
    get: function() {
      return lang_1.isPresent(this._properties) && this._properties.length > 0 ? this._properties : this._inputs;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DirectiveMetadata.prototype, "properties", {
    get: function() {
      return this.inputs;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DirectiveMetadata.prototype, "outputs", {
    get: function() {
      return lang_1.isPresent(this._events) && this._events.length > 0 ? this._events : this._outputs;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DirectiveMetadata.prototype, "events", {
    get: function() {
      return this.outputs;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DirectiveMetadata.prototype, "providers", {
    get: function() {
      return this._providers;
    },
    enumerable: true,
    configurable: true
  });
  return DirectiveMetadata;
}(metadata_1.InjectableMetadata));
exports.DirectiveMetadata = DirectiveMetadata;
var ComponentMetadata = (function(_super) {
  __extends(ComponentMetadata, _super);
  function ComponentMetadata(_a) {
    var _b = _a === void 0 ? {} : _a,
        selector = _b.selector,
        inputs = _b.inputs,
        outputs = _b.outputs,
        properties = _b.properties,
        events = _b.events,
        host = _b.host,
        exportAs = _b.exportAs,
        moduleId = _b.moduleId,
        providers = _b.providers,
        viewProviders = _b.viewProviders,
        _c = _b.changeDetection,
        changeDetection = _c === void 0 ? constants_1.ChangeDetectionStrategy.Default : _c,
        queries = _b.queries,
        templateUrl = _b.templateUrl,
        template = _b.template,
        styleUrls = _b.styleUrls,
        styles = _b.styles,
        animations = _b.animations,
        directives = _b.directives,
        pipes = _b.pipes,
        encapsulation = _b.encapsulation,
        interpolation = _b.interpolation,
        precompile = _b.precompile;
    _super.call(this, {
      selector: selector,
      inputs: inputs,
      outputs: outputs,
      properties: properties,
      events: events,
      host: host,
      exportAs: exportAs,
      providers: providers,
      queries: queries
    });
    this.changeDetection = changeDetection;
    this._viewProviders = viewProviders;
    this.templateUrl = templateUrl;
    this.template = template;
    this.styleUrls = styleUrls;
    this.styles = styles;
    this.directives = directives;
    this.pipes = pipes;
    this.encapsulation = encapsulation;
    this.moduleId = moduleId;
    this.animations = animations;
    this.interpolation = interpolation;
    this.precompile = precompile;
  }
  Object.defineProperty(ComponentMetadata.prototype, "viewProviders", {
    get: function() {
      return this._viewProviders;
    },
    enumerable: true,
    configurable: true
  });
  return ComponentMetadata;
}(DirectiveMetadata));
exports.ComponentMetadata = ComponentMetadata;
var PipeMetadata = (function(_super) {
  __extends(PipeMetadata, _super);
  function PipeMetadata(_a) {
    var name = _a.name,
        pure = _a.pure;
    _super.call(this);
    this.name = name;
    this._pure = pure;
  }
  Object.defineProperty(PipeMetadata.prototype, "pure", {
    get: function() {
      return lang_1.isPresent(this._pure) ? this._pure : true;
    },
    enumerable: true,
    configurable: true
  });
  return PipeMetadata;
}(metadata_1.InjectableMetadata));
exports.PipeMetadata = PipeMetadata;
var InputMetadata = (function() {
  function InputMetadata(bindingPropertyName) {
    this.bindingPropertyName = bindingPropertyName;
  }
  return InputMetadata;
}());
exports.InputMetadata = InputMetadata;
var OutputMetadata = (function() {
  function OutputMetadata(bindingPropertyName) {
    this.bindingPropertyName = bindingPropertyName;
  }
  return OutputMetadata;
}());
exports.OutputMetadata = OutputMetadata;
var HostBindingMetadata = (function() {
  function HostBindingMetadata(hostPropertyName) {
    this.hostPropertyName = hostPropertyName;
  }
  return HostBindingMetadata;
}());
exports.HostBindingMetadata = HostBindingMetadata;
var HostListenerMetadata = (function() {
  function HostListenerMetadata(eventName, args) {
    this.eventName = eventName;
    this.args = args;
  }
  return HostListenerMetadata;
}());
exports.HostListenerMetadata = HostListenerMetadata;
