/* */ 
"format cjs";
(function(process) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/Subject'), require('rxjs/observable/PromiseObservable'), require('rxjs/operator/toPromise'), require('rxjs/Observable')) : typeof define === 'function' && define.amd ? define(['exports', 'rxjs/Subject', 'rxjs/observable/PromiseObservable', 'rxjs/operator/toPromise', 'rxjs/Observable'], factory) : (factory((global.ng = global.ng || {}, global.ng.core = global.ng.core || {}), global.Rx, global.Rx, global.Rx.Observable.prototype, global.Rx));
  }(this, function(exports, rxjs_Subject, rxjs_observable_PromiseObservable, rxjs_operator_toPromise, rxjs_Observable) {
    'use strict';
    var globalScope;
    if (typeof window === 'undefined') {
      if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        globalScope = self;
      } else {
        globalScope = global;
      }
    } else {
      globalScope = window;
    }
    function scheduleMicroTask(fn) {
      Zone.current.scheduleMicroTask('scheduleMicrotask', fn);
    }
    var IS_DART = false;
    var global$1 = globalScope;
    var Type = Function;
    function getTypeNameForDebugging(type) {
      if (type['name']) {
        return type['name'];
      }
      return typeof type;
    }
    var Math = global$1.Math;
    global$1.assert = function assert(condition) {};
    function isPresent(obj) {
      return obj !== undefined && obj !== null;
    }
    function isBlank(obj) {
      return obj === undefined || obj === null;
    }
    function isString(obj) {
      return typeof obj === 'string';
    }
    function isFunction(obj) {
      return typeof obj === 'function';
    }
    function isType(obj) {
      return isFunction(obj);
    }
    function isPromise(obj) {
      return obj instanceof global$1.Promise;
    }
    function isArray(obj) {
      return Array.isArray(obj);
    }
    function noop() {}
    function stringify(token) {
      if (typeof token === 'string') {
        return token;
      }
      if (token === undefined || token === null) {
        return '' + token;
      }
      if (token.name) {
        return token.name;
      }
      if (token.overriddenName) {
        return token.overriddenName;
      }
      var res = token.toString();
      var newLineIndex = res.indexOf('\n');
      return (newLineIndex === -1) ? res : res.substring(0, newLineIndex);
    }
    var StringWrapper = (function() {
      function StringWrapper() {}
      StringWrapper.fromCharCode = function(code) {
        return String.fromCharCode(code);
      };
      StringWrapper.charCodeAt = function(s, index) {
        return s.charCodeAt(index);
      };
      StringWrapper.split = function(s, regExp) {
        return s.split(regExp);
      };
      StringWrapper.equals = function(s, s2) {
        return s === s2;
      };
      StringWrapper.stripLeft = function(s, charVal) {
        if (s && s.length) {
          var pos = 0;
          for (var i = 0; i < s.length; i++) {
            if (s[i] != charVal)
              break;
            pos++;
          }
          s = s.substring(pos);
        }
        return s;
      };
      StringWrapper.stripRight = function(s, charVal) {
        if (s && s.length) {
          var pos = s.length;
          for (var i = s.length - 1; i >= 0; i--) {
            if (s[i] != charVal)
              break;
            pos--;
          }
          s = s.substring(0, pos);
        }
        return s;
      };
      StringWrapper.replace = function(s, from, replace) {
        return s.replace(from, replace);
      };
      StringWrapper.replaceAll = function(s, from, replace) {
        return s.replace(from, replace);
      };
      StringWrapper.slice = function(s, from, to) {
        if (from === void 0) {
          from = 0;
        }
        if (to === void 0) {
          to = null;
        }
        return s.slice(from, to === null ? undefined : to);
      };
      StringWrapper.replaceAllMapped = function(s, from, cb) {
        return s.replace(from, function() {
          var matches = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            matches[_i - 0] = arguments[_i];
          }
          matches.splice(-2, 2);
          return cb(matches);
        });
      };
      StringWrapper.contains = function(s, substr) {
        return s.indexOf(substr) != -1;
      };
      StringWrapper.compare = function(a, b) {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        } else {
          return 0;
        }
      };
      return StringWrapper;
    }());
    var NumberParseError = (function(_super) {
      __extends(NumberParseError, _super);
      function NumberParseError(message) {
        _super.call(this);
        this.message = message;
      }
      NumberParseError.prototype.toString = function() {
        return this.message;
      };
      return NumberParseError;
    }(Error));
    var NumberWrapper = (function() {
      function NumberWrapper() {}
      NumberWrapper.toFixed = function(n, fractionDigits) {
        return n.toFixed(fractionDigits);
      };
      NumberWrapper.equal = function(a, b) {
        return a === b;
      };
      NumberWrapper.parseIntAutoRadix = function(text) {
        var result = parseInt(text);
        if (isNaN(result)) {
          throw new NumberParseError('Invalid integer literal when parsing ' + text);
        }
        return result;
      };
      NumberWrapper.parseInt = function(text, radix) {
        if (radix == 10) {
          if (/^(\-|\+)?[0-9]+$/.test(text)) {
            return parseInt(text, radix);
          }
        } else if (radix == 16) {
          if (/^(\-|\+)?[0-9ABCDEFabcdef]+$/.test(text)) {
            return parseInt(text, radix);
          }
        } else {
          var result = parseInt(text, radix);
          if (!isNaN(result)) {
            return result;
          }
        }
        throw new NumberParseError('Invalid integer literal when parsing ' + text + ' in base ' + radix);
      };
      NumberWrapper.parseFloat = function(text) {
        return parseFloat(text);
      };
      Object.defineProperty(NumberWrapper, "NaN", {
        get: function() {
          return NaN;
        },
        enumerable: true,
        configurable: true
      });
      NumberWrapper.isNumeric = function(value) {
        return !isNaN(value - parseFloat(value));
      };
      NumberWrapper.isNaN = function(value) {
        return isNaN(value);
      };
      NumberWrapper.isInteger = function(value) {
        return Number.isInteger(value);
      };
      return NumberWrapper;
    }());
    function looseIdentical(a, b) {
      return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
    }
    function getMapKey(value) {
      return value;
    }
    function normalizeBool(obj) {
      return isBlank(obj) ? false : obj;
    }
    function isJsObject(o) {
      return o !== null && (typeof o === 'function' || typeof o === 'object');
    }
    function print(obj) {
      console.log(obj);
    }
    function warn(obj) {
      console.warn(obj);
    }
    var _symbolIterator = null;
    function getSymbolIterator() {
      if (isBlank(_symbolIterator)) {
        if (isPresent(globalScope.Symbol) && isPresent(Symbol.iterator)) {
          _symbolIterator = Symbol.iterator;
        } else {
          var keys = Object.getOwnPropertyNames(Map.prototype);
          for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (key !== 'entries' && key !== 'size' && Map.prototype[key] === Map.prototype['entries']) {
              _symbolIterator = key;
            }
          }
        }
      }
      return _symbolIterator;
    }
    function isPrimitive(obj) {
      return !isJsObject(obj);
    }
    function forwardRef(forwardRefFn) {
      forwardRefFn.__forward_ref__ = forwardRef;
      forwardRefFn.toString = function() {
        return stringify(this());
      };
      return forwardRefFn;
    }
    function resolveForwardRef(type) {
      if (isFunction(type) && type.hasOwnProperty('__forward_ref__') && type.__forward_ref__ === forwardRef) {
        return type();
      } else {
        return type;
      }
    }
    var InjectMetadata = (function() {
      function InjectMetadata(token) {
        this.token = token;
      }
      InjectMetadata.prototype.toString = function() {
        return "@Inject(" + stringify(this.token) + ")";
      };
      return InjectMetadata;
    }());
    var OptionalMetadata = (function() {
      function OptionalMetadata() {}
      OptionalMetadata.prototype.toString = function() {
        return "@Optional()";
      };
      return OptionalMetadata;
    }());
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
    var InjectableMetadata = (function() {
      function InjectableMetadata() {}
      return InjectableMetadata;
    }());
    var SelfMetadata = (function() {
      function SelfMetadata() {}
      SelfMetadata.prototype.toString = function() {
        return "@Self()";
      };
      return SelfMetadata;
    }());
    var SkipSelfMetadata = (function() {
      function SkipSelfMetadata() {}
      SkipSelfMetadata.prototype.toString = function() {
        return "@SkipSelf()";
      };
      return SkipSelfMetadata;
    }());
    var HostMetadata = (function() {
      function HostMetadata() {}
      HostMetadata.prototype.toString = function() {
        return "@Host()";
      };
      return HostMetadata;
    }());
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
        return "@Attribute(" + stringify(this.attributeName) + ")";
      };
      return AttributeMetadata;
    }(DependencyMetadata));
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
          return resolveForwardRef(this._selector);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(QueryMetadata.prototype, "isVarBindingQuery", {
        get: function() {
          return isString(this.selector);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(QueryMetadata.prototype, "varBindings", {
        get: function() {
          return StringWrapper.split(this.selector, /\s*,\s*/g);
        },
        enumerable: true,
        configurable: true
      });
      QueryMetadata.prototype.toString = function() {
        return "@Query(" + stringify(this.selector) + ")";
      };
      return QueryMetadata;
    }(DependencyMetadata));
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
        return "@ViewQuery(" + stringify(this.selector) + ")";
      };
      return ViewQueryMetadata;
    }(QueryMetadata));
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
    exports.ChangeDetectionStrategy;
    (function(ChangeDetectionStrategy) {
      ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 0] = "OnPush";
      ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 1] = "Default";
    })(exports.ChangeDetectionStrategy || (exports.ChangeDetectionStrategy = {}));
    var ChangeDetectorStatus;
    (function(ChangeDetectorStatus) {
      ChangeDetectorStatus[ChangeDetectorStatus["CheckOnce"] = 0] = "CheckOnce";
      ChangeDetectorStatus[ChangeDetectorStatus["Checked"] = 1] = "Checked";
      ChangeDetectorStatus[ChangeDetectorStatus["CheckAlways"] = 2] = "CheckAlways";
      ChangeDetectorStatus[ChangeDetectorStatus["Detached"] = 3] = "Detached";
      ChangeDetectorStatus[ChangeDetectorStatus["Errored"] = 4] = "Errored";
      ChangeDetectorStatus[ChangeDetectorStatus["Destroyed"] = 5] = "Destroyed";
    })(ChangeDetectorStatus || (ChangeDetectorStatus = {}));
    var CHANGE_DETECTION_STRATEGY_VALUES = [exports.ChangeDetectionStrategy.OnPush, exports.ChangeDetectionStrategy.Default];
    function isDefaultChangeDetectionStrategy(changeDetectionStrategy) {
      return isBlank(changeDetectionStrategy) || changeDetectionStrategy === exports.ChangeDetectionStrategy.Default;
    }
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
          return isPresent(this._properties) && this._properties.length > 0 ? this._properties : this._inputs;
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
          return isPresent(this._events) && this._events.length > 0 ? this._events : this._outputs;
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
    }(InjectableMetadata));
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
            changeDetection = _c === void 0 ? exports.ChangeDetectionStrategy.Default : _c,
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
          return isPresent(this._pure) ? this._pure : true;
        },
        enumerable: true,
        configurable: true
      });
      return PipeMetadata;
    }(InjectableMetadata));
    var InputMetadata = (function() {
      function InputMetadata(bindingPropertyName) {
        this.bindingPropertyName = bindingPropertyName;
      }
      return InputMetadata;
    }());
    var OutputMetadata = (function() {
      function OutputMetadata(bindingPropertyName) {
        this.bindingPropertyName = bindingPropertyName;
      }
      return OutputMetadata;
    }());
    var HostBindingMetadata = (function() {
      function HostBindingMetadata(hostPropertyName) {
        this.hostPropertyName = hostPropertyName;
      }
      return HostBindingMetadata;
    }());
    var HostListenerMetadata = (function() {
      function HostListenerMetadata(eventName, args) {
        this.eventName = eventName;
        this.args = args;
      }
      return HostListenerMetadata;
    }());
    exports.ViewEncapsulation;
    (function(ViewEncapsulation) {
      ViewEncapsulation[ViewEncapsulation["Emulated"] = 0] = "Emulated";
      ViewEncapsulation[ViewEncapsulation["Native"] = 1] = "Native";
      ViewEncapsulation[ViewEncapsulation["None"] = 2] = "None";
    })(exports.ViewEncapsulation || (exports.ViewEncapsulation = {}));
    var VIEW_ENCAPSULATION_VALUES = [exports.ViewEncapsulation.Emulated, exports.ViewEncapsulation.Native, exports.ViewEncapsulation.None];
    var ViewMetadata = (function() {
      function ViewMetadata(_a) {
        var _b = _a === void 0 ? {} : _a,
            templateUrl = _b.templateUrl,
            template = _b.template,
            directives = _b.directives,
            pipes = _b.pipes,
            encapsulation = _b.encapsulation,
            styles = _b.styles,
            styleUrls = _b.styleUrls,
            animations = _b.animations,
            interpolation = _b.interpolation;
        this.templateUrl = templateUrl;
        this.template = template;
        this.styleUrls = styleUrls;
        this.styles = styles;
        this.directives = directives;
        this.pipes = pipes;
        this.encapsulation = encapsulation;
        this.animations = animations;
        this.interpolation = interpolation;
      }
      return ViewMetadata;
    }());
    var LifecycleHooks;
    (function(LifecycleHooks) {
      LifecycleHooks[LifecycleHooks["OnInit"] = 0] = "OnInit";
      LifecycleHooks[LifecycleHooks["OnDestroy"] = 1] = "OnDestroy";
      LifecycleHooks[LifecycleHooks["DoCheck"] = 2] = "DoCheck";
      LifecycleHooks[LifecycleHooks["OnChanges"] = 3] = "OnChanges";
      LifecycleHooks[LifecycleHooks["AfterContentInit"] = 4] = "AfterContentInit";
      LifecycleHooks[LifecycleHooks["AfterContentChecked"] = 5] = "AfterContentChecked";
      LifecycleHooks[LifecycleHooks["AfterViewInit"] = 6] = "AfterViewInit";
      LifecycleHooks[LifecycleHooks["AfterViewChecked"] = 7] = "AfterViewChecked";
    })(LifecycleHooks || (LifecycleHooks = {}));
    var LIFECYCLE_HOOKS_VALUES = [LifecycleHooks.OnInit, LifecycleHooks.OnDestroy, LifecycleHooks.DoCheck, LifecycleHooks.OnChanges, LifecycleHooks.AfterContentInit, LifecycleHooks.AfterContentChecked, LifecycleHooks.AfterViewInit, LifecycleHooks.AfterViewChecked];
    var OnChanges = (function() {
      function OnChanges() {}
      return OnChanges;
    }());
    var OnInit = (function() {
      function OnInit() {}
      return OnInit;
    }());
    var DoCheck = (function() {
      function DoCheck() {}
      return DoCheck;
    }());
    var OnDestroy = (function() {
      function OnDestroy() {}
      return OnDestroy;
    }());
    var AfterContentInit = (function() {
      function AfterContentInit() {}
      return AfterContentInit;
    }());
    var AfterContentChecked = (function() {
      function AfterContentChecked() {}
      return AfterContentChecked;
    }());
    var AfterViewInit = (function() {
      function AfterViewInit() {}
      return AfterViewInit;
    }());
    var AfterViewChecked = (function() {
      function AfterViewChecked() {}
      return AfterViewChecked;
    }());
    var _nextClassId = 0;
    function extractAnnotation(annotation) {
      if (isFunction(annotation) && annotation.hasOwnProperty('annotation')) {
        annotation = annotation.annotation;
      }
      return annotation;
    }
    function applyParams(fnOrArray, key) {
      if (fnOrArray === Object || fnOrArray === String || fnOrArray === Function || fnOrArray === Number || fnOrArray === Array) {
        throw new Error("Can not use native " + stringify(fnOrArray) + " as constructor");
      }
      if (isFunction(fnOrArray)) {
        return fnOrArray;
      } else if (fnOrArray instanceof Array) {
        var annotations = fnOrArray;
        var fn = fnOrArray[fnOrArray.length - 1];
        if (!isFunction(fn)) {
          throw new Error("Last position of Class method array must be Function in key " + key + " was '" + stringify(fn) + "'");
        }
        var annoLength = annotations.length - 1;
        if (annoLength != fn.length) {
          throw new Error("Number of annotations (" + annoLength + ") does not match number of arguments (" + fn.length + ") in the function: " + stringify(fn));
        }
        var paramsAnnotations = [];
        for (var i = 0,
            ii = annotations.length - 1; i < ii; i++) {
          var paramAnnotations = [];
          paramsAnnotations.push(paramAnnotations);
          var annotation = annotations[i];
          if (annotation instanceof Array) {
            for (var j = 0; j < annotation.length; j++) {
              paramAnnotations.push(extractAnnotation(annotation[j]));
            }
          } else if (isFunction(annotation)) {
            paramAnnotations.push(extractAnnotation(annotation));
          } else {
            paramAnnotations.push(annotation);
          }
        }
        Reflect.defineMetadata('parameters', paramsAnnotations, fn);
        return fn;
      } else {
        throw new Error("Only Function or Array is supported in Class definition for key '" + key + "' is '" + stringify(fnOrArray) + "'");
      }
    }
    function Class(clsDef) {
      var constructor = applyParams(clsDef.hasOwnProperty('constructor') ? clsDef.constructor : undefined, 'constructor');
      var proto = constructor.prototype;
      if (clsDef.hasOwnProperty('extends')) {
        if (isFunction(clsDef.extends)) {
          constructor.prototype = proto = Object.create(clsDef.extends.prototype);
        } else {
          throw new Error("Class definition 'extends' property must be a constructor function was: " + stringify(clsDef.extends));
        }
      }
      for (var key in clsDef) {
        if (key != 'extends' && key != 'prototype' && clsDef.hasOwnProperty(key)) {
          proto[key] = applyParams(clsDef[key], key);
        }
      }
      if (this && this.annotations instanceof Array) {
        Reflect.defineMetadata('annotations', this.annotations, constructor);
      }
      if (!constructor['name']) {
        constructor['overriddenName'] = "class" + _nextClassId++;
      }
      return constructor;
    }
    var Reflect = global$1.Reflect;
    function makeDecorator(annotationCls, chainFn) {
      if (chainFn === void 0) {
        chainFn = null;
      }
      function DecoratorFactory(objOrType) {
        var annotationInstance = new annotationCls(objOrType);
        if (this instanceof annotationCls) {
          return annotationInstance;
        } else {
          var chainAnnotation = isFunction(this) && this.annotations instanceof Array ? this.annotations : [];
          chainAnnotation.push(annotationInstance);
          var TypeDecorator = function TypeDecorator(cls) {
            var annotations = Reflect.getOwnMetadata('annotations', cls);
            annotations = annotations || [];
            annotations.push(annotationInstance);
            Reflect.defineMetadata('annotations', annotations, cls);
            return cls;
          };
          TypeDecorator.annotations = chainAnnotation;
          TypeDecorator.Class = Class;
          if (chainFn)
            chainFn(TypeDecorator);
          return TypeDecorator;
        }
      }
      DecoratorFactory.prototype = Object.create(annotationCls.prototype);
      DecoratorFactory.annotationCls = annotationCls;
      return DecoratorFactory;
    }
    function makeParamDecorator(annotationCls) {
      function ParamDecoratorFactory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i - 0] = arguments[_i];
        }
        var annotationInstance = Object.create(annotationCls.prototype);
        annotationCls.apply(annotationInstance, args);
        if (this instanceof annotationCls) {
          return annotationInstance;
        } else {
          ParamDecorator.annotation = annotationInstance;
          return ParamDecorator;
        }
        function ParamDecorator(cls, unusedKey, index) {
          var parameters = Reflect.getMetadata('parameters', cls);
          parameters = parameters || [];
          while (parameters.length <= index) {
            parameters.push(null);
          }
          parameters[index] = parameters[index] || [];
          var annotationsForParam = parameters[index];
          annotationsForParam.push(annotationInstance);
          Reflect.defineMetadata('parameters', parameters, cls);
          return cls;
        }
      }
      ParamDecoratorFactory.prototype = Object.create(annotationCls.prototype);
      ParamDecoratorFactory.annotationCls = annotationCls;
      return ParamDecoratorFactory;
    }
    function makePropDecorator(annotationCls) {
      function PropDecoratorFactory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i - 0] = arguments[_i];
        }
        var decoratorInstance = Object.create(annotationCls.prototype);
        annotationCls.apply(decoratorInstance, args);
        if (this instanceof annotationCls) {
          return decoratorInstance;
        } else {
          return function PropDecorator(target, name) {
            var meta = Reflect.getOwnMetadata('propMetadata', target.constructor);
            meta = meta || {};
            meta[name] = meta[name] || [];
            meta[name].unshift(decoratorInstance);
            Reflect.defineMetadata('propMetadata', meta, target.constructor);
          };
        }
      }
      PropDecoratorFactory.prototype = Object.create(annotationCls.prototype);
      PropDecoratorFactory.annotationCls = annotationCls;
      return PropDecoratorFactory;
    }
    var Component = makeDecorator(ComponentMetadata, function(fn) {
      return fn.View = View;
    });
    var Directive = makeDecorator(DirectiveMetadata);
    var View = makeDecorator(ViewMetadata, function(fn) {
      return fn.View = View;
    });
    var Attribute = makeParamDecorator(AttributeMetadata);
    var Query = makeParamDecorator(QueryMetadata);
    var ContentChildren = makePropDecorator(ContentChildrenMetadata);
    var ContentChild = makePropDecorator(ContentChildMetadata);
    var ViewChildren = makePropDecorator(ViewChildrenMetadata);
    var ViewChild = makePropDecorator(ViewChildMetadata);
    var ViewQuery = makeParamDecorator(ViewQueryMetadata);
    var Pipe = makeDecorator(PipeMetadata);
    var Input = makePropDecorator(InputMetadata);
    var Output = makePropDecorator(OutputMetadata);
    var HostBinding = makePropDecorator(HostBindingMetadata);
    var HostListener = makePropDecorator(HostListenerMetadata);
    var Inject = makeParamDecorator(InjectMetadata);
    var Optional = makeParamDecorator(OptionalMetadata);
    var Injectable = makeDecorator(InjectableMetadata);
    var Self = makeParamDecorator(SelfMetadata);
    var Host = makeParamDecorator(HostMetadata);
    var SkipSelf = makeParamDecorator(SkipSelfMetadata);
    var BaseWrappedException = (function(_super) {
      __extends(BaseWrappedException, _super);
      function BaseWrappedException(message) {
        _super.call(this, message);
      }
      Object.defineProperty(BaseWrappedException.prototype, "wrapperMessage", {
        get: function() {
          return '';
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(BaseWrappedException.prototype, "wrapperStack", {
        get: function() {
          return null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(BaseWrappedException.prototype, "originalException", {
        get: function() {
          return null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(BaseWrappedException.prototype, "originalStack", {
        get: function() {
          return null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(BaseWrappedException.prototype, "context", {
        get: function() {
          return null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(BaseWrappedException.prototype, "message", {
        get: function() {
          return '';
        },
        enumerable: true,
        configurable: true
      });
      return BaseWrappedException;
    }(Error));
    var Map$1 = global$1.Map;
    var Set = global$1.Set;
    var createMapFromPairs = (function() {
      try {
        if (new Map$1([[1, 2]]).size === 1) {
          return function createMapFromPairs(pairs) {
            return new Map$1(pairs);
          };
        }
      } catch (e) {}
      return function createMapAndPopulateFromPairs(pairs) {
        var map = new Map$1();
        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i];
          map.set(pair[0], pair[1]);
        }
        return map;
      };
    })();
    var createMapFromMap = (function() {
      try {
        if (new Map$1(new Map$1())) {
          return function createMapFromMap(m) {
            return new Map$1(m);
          };
        }
      } catch (e) {}
      return function createMapAndPopulateFromMap(m) {
        var map = new Map$1();
        m.forEach(function(v, k) {
          map.set(k, v);
        });
        return map;
      };
    })();
    var _clearValues = (function() {
      if ((new Map$1()).keys().next) {
        return function _clearValues(m) {
          var keyIterator = m.keys();
          var k;
          while (!((k = keyIterator.next()).done)) {
            m.set(k.value, null);
          }
        };
      } else {
        return function _clearValuesWithForeEach(m) {
          m.forEach(function(v, k) {
            m.set(k, null);
          });
        };
      }
    })();
    var _arrayFromMap = (function() {
      try {
        if ((new Map$1()).values().next) {
          return function createArrayFromMap(m, getValues) {
            return getValues ? Array.from(m.values()) : Array.from(m.keys());
          };
        }
      } catch (e) {}
      return function createArrayFromMapWithForeach(m, getValues) {
        var res = ListWrapper.createFixedSize(m.size),
            i = 0;
        m.forEach(function(v, k) {
          res[i] = getValues ? v : k;
          i++;
        });
        return res;
      };
    })();
    var MapWrapper = (function() {
      function MapWrapper() {}
      MapWrapper.clone = function(m) {
        return createMapFromMap(m);
      };
      MapWrapper.createFromStringMap = function(stringMap) {
        var result = new Map$1();
        for (var prop in stringMap) {
          result.set(prop, stringMap[prop]);
        }
        return result;
      };
      MapWrapper.toStringMap = function(m) {
        var r = {};
        m.forEach(function(v, k) {
          return r[k] = v;
        });
        return r;
      };
      MapWrapper.createFromPairs = function(pairs) {
        return createMapFromPairs(pairs);
      };
      MapWrapper.clearValues = function(m) {
        _clearValues(m);
      };
      MapWrapper.iterable = function(m) {
        return m;
      };
      MapWrapper.keys = function(m) {
        return _arrayFromMap(m, false);
      };
      MapWrapper.values = function(m) {
        return _arrayFromMap(m, true);
      };
      return MapWrapper;
    }());
    var StringMapWrapper = (function() {
      function StringMapWrapper() {}
      StringMapWrapper.create = function() {
        return {};
      };
      StringMapWrapper.contains = function(map, key) {
        return map.hasOwnProperty(key);
      };
      StringMapWrapper.get = function(map, key) {
        return map.hasOwnProperty(key) ? map[key] : undefined;
      };
      StringMapWrapper.set = function(map, key, value) {
        map[key] = value;
      };
      StringMapWrapper.keys = function(map) {
        return Object.keys(map);
      };
      StringMapWrapper.values = function(map) {
        return Object.keys(map).reduce(function(r, a) {
          r.push(map[a]);
          return r;
        }, []);
      };
      StringMapWrapper.isEmpty = function(map) {
        for (var prop in map) {
          return false;
        }
        return true;
      };
      StringMapWrapper.delete = function(map, key) {
        delete map[key];
      };
      StringMapWrapper.forEach = function(map, callback) {
        for (var prop in map) {
          if (map.hasOwnProperty(prop)) {
            callback(map[prop], prop);
          }
        }
      };
      StringMapWrapper.merge = function(m1, m2) {
        var m = {};
        for (var attr in m1) {
          if (m1.hasOwnProperty(attr)) {
            m[attr] = m1[attr];
          }
        }
        for (var attr in m2) {
          if (m2.hasOwnProperty(attr)) {
            m[attr] = m2[attr];
          }
        }
        return m;
      };
      StringMapWrapper.equals = function(m1, m2) {
        var k1 = Object.keys(m1);
        var k2 = Object.keys(m2);
        if (k1.length != k2.length) {
          return false;
        }
        var key;
        for (var i = 0; i < k1.length; i++) {
          key = k1[i];
          if (m1[key] !== m2[key]) {
            return false;
          }
        }
        return true;
      };
      return StringMapWrapper;
    }());
    var ListWrapper = (function() {
      function ListWrapper() {}
      ListWrapper.createFixedSize = function(size) {
        return new Array(size);
      };
      ListWrapper.createGrowableSize = function(size) {
        return new Array(size);
      };
      ListWrapper.clone = function(array) {
        return array.slice(0);
      };
      ListWrapper.forEachWithIndex = function(array, fn) {
        for (var i = 0; i < array.length; i++) {
          fn(array[i], i);
        }
      };
      ListWrapper.first = function(array) {
        if (!array)
          return null;
        return array[0];
      };
      ListWrapper.last = function(array) {
        if (!array || array.length == 0)
          return null;
        return array[array.length - 1];
      };
      ListWrapper.indexOf = function(array, value, startIndex) {
        if (startIndex === void 0) {
          startIndex = 0;
        }
        return array.indexOf(value, startIndex);
      };
      ListWrapper.contains = function(list, el) {
        return list.indexOf(el) !== -1;
      };
      ListWrapper.reversed = function(array) {
        var a = ListWrapper.clone(array);
        return a.reverse();
      };
      ListWrapper.concat = function(a, b) {
        return a.concat(b);
      };
      ListWrapper.insert = function(list, index, value) {
        list.splice(index, 0, value);
      };
      ListWrapper.removeAt = function(list, index) {
        var res = list[index];
        list.splice(index, 1);
        return res;
      };
      ListWrapper.removeAll = function(list, items) {
        for (var i = 0; i < items.length; ++i) {
          var index = list.indexOf(items[i]);
          list.splice(index, 1);
        }
      };
      ListWrapper.remove = function(list, el) {
        var index = list.indexOf(el);
        if (index > -1) {
          list.splice(index, 1);
          return true;
        }
        return false;
      };
      ListWrapper.clear = function(list) {
        list.length = 0;
      };
      ListWrapper.isEmpty = function(list) {
        return list.length == 0;
      };
      ListWrapper.fill = function(list, value, start, end) {
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = null;
        }
        list.fill(value, start, end === null ? list.length : end);
      };
      ListWrapper.equals = function(a, b) {
        if (a.length != b.length)
          return false;
        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i])
            return false;
        }
        return true;
      };
      ListWrapper.slice = function(l, from, to) {
        if (from === void 0) {
          from = 0;
        }
        if (to === void 0) {
          to = null;
        }
        return l.slice(from, to === null ? undefined : to);
      };
      ListWrapper.splice = function(l, from, length) {
        return l.splice(from, length);
      };
      ListWrapper.sort = function(l, compareFn) {
        if (isPresent(compareFn)) {
          l.sort(compareFn);
        } else {
          l.sort();
        }
      };
      ListWrapper.toString = function(l) {
        return l.toString();
      };
      ListWrapper.toJSON = function(l) {
        return JSON.stringify(l);
      };
      ListWrapper.maximum = function(list, predicate) {
        if (list.length == 0) {
          return null;
        }
        var solution = null;
        var maxValue = -Infinity;
        for (var index = 0; index < list.length; index++) {
          var candidate = list[index];
          if (isBlank(candidate)) {
            continue;
          }
          var candidateValue = predicate(candidate);
          if (candidateValue > maxValue) {
            solution = candidate;
            maxValue = candidateValue;
          }
        }
        return solution;
      };
      ListWrapper.flatten = function(list) {
        var target = [];
        _flattenArray(list, target);
        return target;
      };
      ListWrapper.addAll = function(list, source) {
        for (var i = 0; i < source.length; i++) {
          list.push(source[i]);
        }
      };
      return ListWrapper;
    }());
    function _flattenArray(source, target) {
      if (isPresent(source)) {
        for (var i = 0; i < source.length; i++) {
          var item = source[i];
          if (isArray(item)) {
            _flattenArray(item, target);
          } else {
            target.push(item);
          }
        }
      }
      return target;
    }
    function isListLikeIterable(obj) {
      if (!isJsObject(obj))
        return false;
      return isArray(obj) || (!(obj instanceof Map$1) && getSymbolIterator() in obj);
    }
    function areIterablesEqual(a, b, comparator) {
      var iterator1 = a[getSymbolIterator()]();
      var iterator2 = b[getSymbolIterator()]();
      while (true) {
        var item1 = iterator1.next();
        var item2 = iterator2.next();
        if (item1.done && item2.done)
          return true;
        if (item1.done || item2.done)
          return false;
        if (!comparator(item1.value, item2.value))
          return false;
      }
    }
    function iterateListLike(obj, fn) {
      if (isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
          fn(obj[i]);
        }
      } else {
        var iterator = obj[getSymbolIterator()]();
        var item;
        while (!((item = iterator.next()).done)) {
          fn(item.value);
        }
      }
    }
    var createSetFromList = (function() {
      var test = new Set([1, 2, 3]);
      if (test.size === 3) {
        return function createSetFromList(lst) {
          return new Set(lst);
        };
      } else {
        return function createSetAndPopulateFromList(lst) {
          var res = new Set(lst);
          if (res.size !== lst.length) {
            for (var i = 0; i < lst.length; i++) {
              res.add(lst[i]);
            }
          }
          return res;
        };
      }
    })();
    var SetWrapper = (function() {
      function SetWrapper() {}
      SetWrapper.createFromList = function(lst) {
        return createSetFromList(lst);
      };
      SetWrapper.has = function(s, key) {
        return s.has(key);
      };
      SetWrapper.delete = function(m, k) {
        m.delete(k);
      };
      return SetWrapper;
    }());
    var _ArrayLogger = (function() {
      function _ArrayLogger() {
        this.res = [];
      }
      _ArrayLogger.prototype.log = function(s) {
        this.res.push(s);
      };
      _ArrayLogger.prototype.logError = function(s) {
        this.res.push(s);
      };
      _ArrayLogger.prototype.logGroup = function(s) {
        this.res.push(s);
      };
      _ArrayLogger.prototype.logGroupEnd = function() {};
      ;
      return _ArrayLogger;
    }());
    var ExceptionHandler = (function() {
      function ExceptionHandler(_logger, _rethrowException) {
        if (_rethrowException === void 0) {
          _rethrowException = true;
        }
        this._logger = _logger;
        this._rethrowException = _rethrowException;
      }
      ExceptionHandler.exceptionToString = function(exception, stackTrace, reason) {
        if (stackTrace === void 0) {
          stackTrace = null;
        }
        if (reason === void 0) {
          reason = null;
        }
        var l = new _ArrayLogger();
        var e = new ExceptionHandler(l, false);
        e.call(exception, stackTrace, reason);
        return l.res.join('\n');
      };
      ExceptionHandler.prototype.call = function(exception, stackTrace, reason) {
        if (stackTrace === void 0) {
          stackTrace = null;
        }
        if (reason === void 0) {
          reason = null;
        }
        var originalException = this._findOriginalException(exception);
        var originalStack = this._findOriginalStack(exception);
        var context = this._findContext(exception);
        this._logger.logGroup("EXCEPTION: " + this._extractMessage(exception));
        if (isPresent(stackTrace) && isBlank(originalStack)) {
          this._logger.logError('STACKTRACE:');
          this._logger.logError(this._longStackTrace(stackTrace));
        }
        if (isPresent(reason)) {
          this._logger.logError("REASON: " + reason);
        }
        if (isPresent(originalException)) {
          this._logger.logError("ORIGINAL EXCEPTION: " + this._extractMessage(originalException));
        }
        if (isPresent(originalStack)) {
          this._logger.logError('ORIGINAL STACKTRACE:');
          this._logger.logError(this._longStackTrace(originalStack));
        }
        if (isPresent(context)) {
          this._logger.logError('ERROR CONTEXT:');
          this._logger.logError(context);
        }
        this._logger.logGroupEnd();
        if (this._rethrowException)
          throw exception;
      };
      ExceptionHandler.prototype._extractMessage = function(exception) {
        return exception instanceof BaseWrappedException ? exception.wrapperMessage : exception.toString();
      };
      ExceptionHandler.prototype._longStackTrace = function(stackTrace) {
        return isListLikeIterable(stackTrace) ? stackTrace.join('\n\n-----async gap-----\n') : stackTrace.toString();
      };
      ExceptionHandler.prototype._findContext = function(exception) {
        try {
          if (!(exception instanceof BaseWrappedException))
            return null;
          return isPresent(exception.context) ? exception.context : this._findContext(exception.originalException);
        } catch (e) {
          return null;
        }
      };
      ExceptionHandler.prototype._findOriginalException = function(exception) {
        if (!(exception instanceof BaseWrappedException))
          return null;
        var e = exception.originalException;
        while (e instanceof BaseWrappedException && isPresent(e.originalException)) {
          e = e.originalException;
        }
        return e;
      };
      ExceptionHandler.prototype._findOriginalStack = function(exception) {
        if (!(exception instanceof BaseWrappedException))
          return null;
        var e = exception;
        var stack = exception.originalStack;
        while (e instanceof BaseWrappedException && isPresent(e.originalException)) {
          e = e.originalException;
          if (e instanceof BaseWrappedException && isPresent(e.originalException)) {
            stack = e.originalStack;
          }
        }
        return stack;
      };
      return ExceptionHandler;
    }());
    var BaseException = (function(_super) {
      __extends(BaseException, _super);
      function BaseException(message) {
        if (message === void 0) {
          message = '--';
        }
        _super.call(this, message);
        this.message = message;
        this.stack = (new Error(message)).stack;
      }
      BaseException.prototype.toString = function() {
        return this.message;
      };
      return BaseException;
    }(Error));
    var WrappedException = (function(_super) {
      __extends(WrappedException, _super);
      function WrappedException(_wrapperMessage, _originalException, _originalStack, _context) {
        _super.call(this, _wrapperMessage);
        this._wrapperMessage = _wrapperMessage;
        this._originalException = _originalException;
        this._originalStack = _originalStack;
        this._context = _context;
        this._wrapperStack = (new Error(_wrapperMessage)).stack;
      }
      Object.defineProperty(WrappedException.prototype, "wrapperMessage", {
        get: function() {
          return this._wrapperMessage;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WrappedException.prototype, "wrapperStack", {
        get: function() {
          return this._wrapperStack;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WrappedException.prototype, "originalException", {
        get: function() {
          return this._originalException;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WrappedException.prototype, "originalStack", {
        get: function() {
          return this._originalStack;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WrappedException.prototype, "context", {
        get: function() {
          return this._context;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WrappedException.prototype, "message", {
        get: function() {
          return ExceptionHandler.exceptionToString(this);
        },
        enumerable: true,
        configurable: true
      });
      WrappedException.prototype.toString = function() {
        return this.message;
      };
      return WrappedException;
    }(BaseWrappedException));
    function unimplemented() {
      throw new BaseException('unimplemented');
    }
    var _THROW_IF_NOT_FOUND = new Object();
    var THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
    var Injector = (function() {
      function Injector() {}
      Injector.prototype.get = function(token, notFoundValue) {
        return unimplemented();
      };
      return Injector;
    }());
    Injector.THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
    function findFirstClosedCycle(keys) {
      var res = [];
      for (var i = 0; i < keys.length; ++i) {
        if (ListWrapper.contains(res, keys[i])) {
          res.push(keys[i]);
          return res;
        }
        res.push(keys[i]);
      }
      return res;
    }
    function constructResolvingPath(keys) {
      if (keys.length > 1) {
        var reversed = findFirstClosedCycle(ListWrapper.reversed(keys));
        var tokenStrs = reversed.map(function(k) {
          return stringify(k.token);
        });
        return ' (' + tokenStrs.join(' -> ') + ')';
      }
      return '';
    }
    var AbstractProviderError = (function(_super) {
      __extends(AbstractProviderError, _super);
      function AbstractProviderError(injector, key, constructResolvingMessage) {
        _super.call(this, 'DI Exception');
        this.keys = [key];
        this.injectors = [injector];
        this.constructResolvingMessage = constructResolvingMessage;
        this.message = this.constructResolvingMessage(this.keys);
      }
      AbstractProviderError.prototype.addKey = function(injector, key) {
        this.injectors.push(injector);
        this.keys.push(key);
        this.message = this.constructResolvingMessage(this.keys);
      };
      Object.defineProperty(AbstractProviderError.prototype, "context", {
        get: function() {
          return this.injectors[this.injectors.length - 1].debugContext();
        },
        enumerable: true,
        configurable: true
      });
      return AbstractProviderError;
    }(BaseException));
    var NoProviderError = (function(_super) {
      __extends(NoProviderError, _super);
      function NoProviderError(injector, key) {
        _super.call(this, injector, key, function(keys) {
          var first = stringify(ListWrapper.first(keys).token);
          return "No provider for " + first + "!" + constructResolvingPath(keys);
        });
      }
      return NoProviderError;
    }(AbstractProviderError));
    var CyclicDependencyError = (function(_super) {
      __extends(CyclicDependencyError, _super);
      function CyclicDependencyError(injector, key) {
        _super.call(this, injector, key, function(keys) {
          return "Cannot instantiate cyclic dependency!" + constructResolvingPath(keys);
        });
      }
      return CyclicDependencyError;
    }(AbstractProviderError));
    var InstantiationError = (function(_super) {
      __extends(InstantiationError, _super);
      function InstantiationError(injector, originalException, originalStack, key) {
        _super.call(this, 'DI Exception', originalException, originalStack, null);
        this.keys = [key];
        this.injectors = [injector];
      }
      InstantiationError.prototype.addKey = function(injector, key) {
        this.injectors.push(injector);
        this.keys.push(key);
      };
      Object.defineProperty(InstantiationError.prototype, "wrapperMessage", {
        get: function() {
          var first = stringify(ListWrapper.first(this.keys).token);
          return "Error during instantiation of " + first + "!" + constructResolvingPath(this.keys) + ".";
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(InstantiationError.prototype, "causeKey", {
        get: function() {
          return this.keys[0];
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(InstantiationError.prototype, "context", {
        get: function() {
          return this.injectors[this.injectors.length - 1].debugContext();
        },
        enumerable: true,
        configurable: true
      });
      return InstantiationError;
    }(WrappedException));
    var InvalidProviderError = (function(_super) {
      __extends(InvalidProviderError, _super);
      function InvalidProviderError(provider) {
        _super.call(this, "Invalid provider - only instances of Provider and Type are allowed, got: " + provider);
      }
      return InvalidProviderError;
    }(BaseException));
    var NoAnnotationError = (function(_super) {
      __extends(NoAnnotationError, _super);
      function NoAnnotationError(typeOrFunc, params) {
        _super.call(this, NoAnnotationError._genMessage(typeOrFunc, params));
      }
      NoAnnotationError._genMessage = function(typeOrFunc, params) {
        var signature = [];
        for (var i = 0,
            ii = params.length; i < ii; i++) {
          var parameter = params[i];
          if (isBlank(parameter) || parameter.length == 0) {
            signature.push('?');
          } else {
            signature.push(parameter.map(stringify).join(' '));
          }
        }
        return 'Cannot resolve all parameters for \'' + stringify(typeOrFunc) + '\'(' + signature.join(', ') + '). ' + 'Make sure that all the parameters are decorated with Inject or have valid type annotations and that \'' + stringify(typeOrFunc) + '\' is decorated with Injectable.';
      };
      return NoAnnotationError;
    }(BaseException));
    var OutOfBoundsError = (function(_super) {
      __extends(OutOfBoundsError, _super);
      function OutOfBoundsError(index) {
        _super.call(this, "Index " + index + " is out-of-bounds.");
      }
      return OutOfBoundsError;
    }(BaseException));
    var MixingMultiProvidersWithRegularProvidersError = (function(_super) {
      __extends(MixingMultiProvidersWithRegularProvidersError, _super);
      function MixingMultiProvidersWithRegularProvidersError(provider1, provider2) {
        _super.call(this, 'Cannot mix multi providers and regular providers, got: ' + provider1.toString() + ' ' + provider2.toString());
      }
      return MixingMultiProvidersWithRegularProvidersError;
    }(BaseException));
    var ReflectiveKey = (function() {
      function ReflectiveKey(token, id) {
        this.token = token;
        this.id = id;
        if (isBlank(token)) {
          throw new BaseException('Token must be defined!');
        }
      }
      Object.defineProperty(ReflectiveKey.prototype, "displayName", {
        get: function() {
          return stringify(this.token);
        },
        enumerable: true,
        configurable: true
      });
      ReflectiveKey.get = function(token) {
        return _globalKeyRegistry.get(resolveForwardRef(token));
      };
      Object.defineProperty(ReflectiveKey, "numberOfKeys", {
        get: function() {
          return _globalKeyRegistry.numberOfKeys;
        },
        enumerable: true,
        configurable: true
      });
      return ReflectiveKey;
    }());
    var KeyRegistry = (function() {
      function KeyRegistry() {
        this._allKeys = new Map();
      }
      KeyRegistry.prototype.get = function(token) {
        if (token instanceof ReflectiveKey)
          return token;
        if (this._allKeys.has(token)) {
          return this._allKeys.get(token);
        }
        var newKey = new ReflectiveKey(token, ReflectiveKey.numberOfKeys);
        this._allKeys.set(token, newKey);
        return newKey;
      };
      Object.defineProperty(KeyRegistry.prototype, "numberOfKeys", {
        get: function() {
          return this._allKeys.size;
        },
        enumerable: true,
        configurable: true
      });
      return KeyRegistry;
    }());
    var _globalKeyRegistry = new KeyRegistry();
    var ReflectionCapabilities = (function() {
      function ReflectionCapabilities(reflect) {
        this._reflect = isPresent(reflect) ? reflect : global$1.Reflect;
      }
      ReflectionCapabilities.prototype.isReflectionEnabled = function() {
        return true;
      };
      ReflectionCapabilities.prototype.factory = function(t) {
        switch (t.length) {
          case 0:
            return function() {
              return new t();
            };
          case 1:
            return function(a1) {
              return new t(a1);
            };
          case 2:
            return function(a1, a2) {
              return new t(a1, a2);
            };
          case 3:
            return function(a1, a2, a3) {
              return new t(a1, a2, a3);
            };
          case 4:
            return function(a1, a2, a3, a4) {
              return new t(a1, a2, a3, a4);
            };
          case 5:
            return function(a1, a2, a3, a4, a5) {
              return new t(a1, a2, a3, a4, a5);
            };
          case 6:
            return function(a1, a2, a3, a4, a5, a6) {
              return new t(a1, a2, a3, a4, a5, a6);
            };
          case 7:
            return function(a1, a2, a3, a4, a5, a6, a7) {
              return new t(a1, a2, a3, a4, a5, a6, a7);
            };
          case 8:
            return function(a1, a2, a3, a4, a5, a6, a7, a8) {
              return new t(a1, a2, a3, a4, a5, a6, a7, a8);
            };
          case 9:
            return function(a1, a2, a3, a4, a5, a6, a7, a8, a9) {
              return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9);
            };
          case 10:
            return function(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
              return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
            };
          case 11:
            return function(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) {
              return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11);
            };
          case 12:
            return function(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) {
              return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12);
            };
          case 13:
            return function(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13) {
              return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13);
            };
          case 14:
            return function(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14) {
              return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14);
            };
          case 15:
            return function(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) {
              return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15);
            };
          case 16:
            return function(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16) {
              return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16);
            };
          case 17:
            return function(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17) {
              return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17);
            };
          case 18:
            return function(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18) {
              return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18);
            };
          case 19:
            return function(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19) {
              return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19);
            };
          case 20:
            return function(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20) {
              return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20);
            };
        }
        ;
        throw new Error("Cannot create a factory for '" + stringify(t) + "' because its constructor has more than 20 arguments");
      };
      ReflectionCapabilities.prototype._zipTypesAndAnnotations = function(paramTypes, paramAnnotations) {
        var result;
        if (typeof paramTypes === 'undefined') {
          result = new Array(paramAnnotations.length);
        } else {
          result = new Array(paramTypes.length);
        }
        for (var i = 0; i < result.length; i++) {
          if (typeof paramTypes === 'undefined') {
            result[i] = [];
          } else if (paramTypes[i] != Object) {
            result[i] = [paramTypes[i]];
          } else {
            result[i] = [];
          }
          if (isPresent(paramAnnotations) && isPresent(paramAnnotations[i])) {
            result[i] = result[i].concat(paramAnnotations[i]);
          }
        }
        return result;
      };
      ReflectionCapabilities.prototype.parameters = function(typeOrFunc) {
        if (isPresent(typeOrFunc.parameters)) {
          return typeOrFunc.parameters;
        }
        if (isPresent(typeOrFunc.ctorParameters)) {
          var ctorParameters = typeOrFunc.ctorParameters;
          var paramTypes_1 = ctorParameters.map(function(ctorParam) {
            return ctorParam && ctorParam.type;
          });
          var paramAnnotations_1 = ctorParameters.map(function(ctorParam) {
            return ctorParam && convertTsickleDecoratorIntoMetadata(ctorParam.decorators);
          });
          return this._zipTypesAndAnnotations(paramTypes_1, paramAnnotations_1);
        }
        if (isPresent(this._reflect) && isPresent(this._reflect.getMetadata)) {
          var paramAnnotations = this._reflect.getMetadata('parameters', typeOrFunc);
          var paramTypes = this._reflect.getMetadata('design:paramtypes', typeOrFunc);
          if (isPresent(paramTypes) || isPresent(paramAnnotations)) {
            return this._zipTypesAndAnnotations(paramTypes, paramAnnotations);
          }
        }
        var parameters = new Array(typeOrFunc.length);
        parameters.fill(undefined);
        return parameters;
      };
      ReflectionCapabilities.prototype.annotations = function(typeOrFunc) {
        if (isPresent(typeOrFunc.annotations)) {
          var annotations = typeOrFunc.annotations;
          if (isFunction(annotations) && annotations.annotations) {
            annotations = annotations.annotations;
          }
          return annotations;
        }
        if (isPresent(typeOrFunc.decorators)) {
          return convertTsickleDecoratorIntoMetadata(typeOrFunc.decorators);
        }
        if (isPresent(this._reflect) && isPresent(this._reflect.getMetadata)) {
          var annotations = this._reflect.getMetadata('annotations', typeOrFunc);
          if (isPresent(annotations))
            return annotations;
        }
        return [];
      };
      ReflectionCapabilities.prototype.propMetadata = function(typeOrFunc) {
        if (isPresent(typeOrFunc.propMetadata)) {
          var propMetadata = typeOrFunc.propMetadata;
          if (isFunction(propMetadata) && propMetadata.propMetadata) {
            propMetadata = propMetadata.propMetadata;
          }
          return propMetadata;
        }
        if (isPresent(typeOrFunc.propDecorators)) {
          var propDecorators_1 = typeOrFunc.propDecorators;
          var propMetadata_1 = {};
          Object.keys(propDecorators_1).forEach(function(prop) {
            propMetadata_1[prop] = convertTsickleDecoratorIntoMetadata(propDecorators_1[prop]);
          });
          return propMetadata_1;
        }
        if (isPresent(this._reflect) && isPresent(this._reflect.getMetadata)) {
          var propMetadata = this._reflect.getMetadata('propMetadata', typeOrFunc);
          if (isPresent(propMetadata))
            return propMetadata;
        }
        return {};
      };
      ReflectionCapabilities.prototype.interfaces = function(type) {
        return [];
      };
      ReflectionCapabilities.prototype.hasLifecycleHook = function(type, lcInterface, lcProperty) {
        if (!(type instanceof Type))
          return false;
        var proto = type.prototype;
        return !!proto[lcProperty];
      };
      ReflectionCapabilities.prototype.getter = function(name) {
        return new Function('o', 'return o.' + name + ';');
      };
      ReflectionCapabilities.prototype.setter = function(name) {
        return new Function('o', 'v', 'return o.' + name + ' = v;');
      };
      ReflectionCapabilities.prototype.method = function(name) {
        var functionBody = "if (!o." + name + ") throw new Error('\"" + name + "\" is undefined');\n        return o." + name + ".apply(o, args);";
        return new Function('o', 'args', functionBody);
      };
      ReflectionCapabilities.prototype.importUri = function(type) {
        if (typeof type === 'object' && type['filePath']) {
          return type['filePath'];
        }
        return "./" + stringify(type);
      };
      return ReflectionCapabilities;
    }());
    function convertTsickleDecoratorIntoMetadata(decoratorInvocations) {
      if (!decoratorInvocations) {
        return [];
      }
      return decoratorInvocations.map(function(decoratorInvocation) {
        var decoratorType = decoratorInvocation.type;
        var annotationCls = decoratorType.annotationCls;
        var annotationArgs = decoratorInvocation.args ? decoratorInvocation.args : [];
        var annotation = Object.create(annotationCls.prototype);
        annotationCls.apply(annotation, annotationArgs);
        return annotation;
      });
    }
    var ReflectorReader = (function() {
      function ReflectorReader() {}
      return ReflectorReader;
    }());
    var Reflector = (function(_super) {
      __extends(Reflector, _super);
      function Reflector(reflectionCapabilities) {
        _super.call(this);
        this._injectableInfo = new Map$1();
        this._getters = new Map$1();
        this._setters = new Map$1();
        this._methods = new Map$1();
        this._usedKeys = null;
        this.reflectionCapabilities = reflectionCapabilities;
      }
      Reflector.prototype.updateCapabilities = function(caps) {
        this.reflectionCapabilities = caps;
      };
      Reflector.prototype.isReflectionEnabled = function() {
        return this.reflectionCapabilities.isReflectionEnabled();
      };
      Reflector.prototype.trackUsage = function() {
        this._usedKeys = new Set();
      };
      Reflector.prototype.listUnusedKeys = function() {
        var _this = this;
        if (this._usedKeys == null) {
          throw new BaseException('Usage tracking is disabled');
        }
        var allTypes = MapWrapper.keys(this._injectableInfo);
        return allTypes.filter(function(key) {
          return !SetWrapper.has(_this._usedKeys, key);
        });
      };
      Reflector.prototype.registerFunction = function(func, funcInfo) {
        this._injectableInfo.set(func, funcInfo);
      };
      Reflector.prototype.registerType = function(type, typeInfo) {
        this._injectableInfo.set(type, typeInfo);
      };
      Reflector.prototype.registerGetters = function(getters) {
        _mergeMaps(this._getters, getters);
      };
      Reflector.prototype.registerSetters = function(setters) {
        _mergeMaps(this._setters, setters);
      };
      Reflector.prototype.registerMethods = function(methods) {
        _mergeMaps(this._methods, methods);
      };
      Reflector.prototype.factory = function(type) {
        if (this._containsReflectionInfo(type)) {
          var res = this._getReflectionInfo(type).factory;
          return isPresent(res) ? res : null;
        } else {
          return this.reflectionCapabilities.factory(type);
        }
      };
      Reflector.prototype.parameters = function(typeOrFunc) {
        if (this._injectableInfo.has(typeOrFunc)) {
          var res = this._getReflectionInfo(typeOrFunc).parameters;
          return isPresent(res) ? res : [];
        } else {
          return this.reflectionCapabilities.parameters(typeOrFunc);
        }
      };
      Reflector.prototype.annotations = function(typeOrFunc) {
        if (this._injectableInfo.has(typeOrFunc)) {
          var res = this._getReflectionInfo(typeOrFunc).annotations;
          return isPresent(res) ? res : [];
        } else {
          return this.reflectionCapabilities.annotations(typeOrFunc);
        }
      };
      Reflector.prototype.propMetadata = function(typeOrFunc) {
        if (this._injectableInfo.has(typeOrFunc)) {
          var res = this._getReflectionInfo(typeOrFunc).propMetadata;
          return isPresent(res) ? res : {};
        } else {
          return this.reflectionCapabilities.propMetadata(typeOrFunc);
        }
      };
      Reflector.prototype.interfaces = function(type) {
        if (this._injectableInfo.has(type)) {
          var res = this._getReflectionInfo(type).interfaces;
          return isPresent(res) ? res : [];
        } else {
          return this.reflectionCapabilities.interfaces(type);
        }
      };
      Reflector.prototype.hasLifecycleHook = function(type, lcInterface, lcProperty) {
        var interfaces = this.interfaces(type);
        if (interfaces.indexOf(lcInterface) !== -1) {
          return true;
        } else {
          return this.reflectionCapabilities.hasLifecycleHook(type, lcInterface, lcProperty);
        }
      };
      Reflector.prototype.getter = function(name) {
        if (this._getters.has(name)) {
          return this._getters.get(name);
        } else {
          return this.reflectionCapabilities.getter(name);
        }
      };
      Reflector.prototype.setter = function(name) {
        if (this._setters.has(name)) {
          return this._setters.get(name);
        } else {
          return this.reflectionCapabilities.setter(name);
        }
      };
      Reflector.prototype.method = function(name) {
        if (this._methods.has(name)) {
          return this._methods.get(name);
        } else {
          return this.reflectionCapabilities.method(name);
        }
      };
      Reflector.prototype._getReflectionInfo = function(typeOrFunc) {
        if (isPresent(this._usedKeys)) {
          this._usedKeys.add(typeOrFunc);
        }
        return this._injectableInfo.get(typeOrFunc);
      };
      Reflector.prototype._containsReflectionInfo = function(typeOrFunc) {
        return this._injectableInfo.has(typeOrFunc);
      };
      Reflector.prototype.importUri = function(type) {
        return this.reflectionCapabilities.importUri(type);
      };
      return Reflector;
    }(ReflectorReader));
    function _mergeMaps(target, config) {
      StringMapWrapper.forEach(config, function(v, k) {
        return target.set(k, v);
      });
    }
    var reflector = new Reflector(new ReflectionCapabilities());
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
          return normalizeBool(this._multi);
        },
        enumerable: true,
        configurable: true
      });
      return Provider;
    }());
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
    function bind(token) {
      return new ProviderBuilder(token);
    }
    var ProviderBuilder = (function() {
      function ProviderBuilder(token) {
        this.token = token;
      }
      ProviderBuilder.prototype.toClass = function(type) {
        if (!isType(type)) {
          throw new BaseException("Trying to create a class provider but \"" + stringify(type) + "\" is not a class!");
        }
        return new Provider(this.token, {useClass: type});
      };
      ProviderBuilder.prototype.toValue = function(value) {
        return new Provider(this.token, {useValue: value});
      };
      ProviderBuilder.prototype.toAlias = function(aliasToken) {
        if (isBlank(aliasToken)) {
          throw new BaseException("Can not alias " + stringify(this.token) + " to a blank value!");
        }
        return new Provider(this.token, {useExisting: aliasToken});
      };
      ProviderBuilder.prototype.toFactory = function(factory, dependencies) {
        if (!isFunction(factory)) {
          throw new BaseException("Trying to create a factory provider but \"" + stringify(factory) + "\" is not a function!");
        }
        return new Provider(this.token, {
          useFactory: factory,
          deps: dependencies
        });
      };
      return ProviderBuilder;
    }());
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
    function isProviderLiteral(obj) {
      return obj && typeof obj == 'object' && obj.provide;
    }
    function createProvider(obj) {
      return new Provider(obj.provide, obj);
    }
    var ReflectiveDependency = (function() {
      function ReflectiveDependency(key, optional, lowerBoundVisibility, upperBoundVisibility, properties) {
        this.key = key;
        this.optional = optional;
        this.lowerBoundVisibility = lowerBoundVisibility;
        this.upperBoundVisibility = upperBoundVisibility;
        this.properties = properties;
      }
      ReflectiveDependency.fromKey = function(key) {
        return new ReflectiveDependency(key, false, null, null, []);
      };
      return ReflectiveDependency;
    }());
    var _EMPTY_LIST = [];
    var ResolvedReflectiveProvider_ = (function() {
      function ResolvedReflectiveProvider_(key, resolvedFactories, multiProvider) {
        this.key = key;
        this.resolvedFactories = resolvedFactories;
        this.multiProvider = multiProvider;
      }
      Object.defineProperty(ResolvedReflectiveProvider_.prototype, "resolvedFactory", {
        get: function() {
          return this.resolvedFactories[0];
        },
        enumerable: true,
        configurable: true
      });
      return ResolvedReflectiveProvider_;
    }());
    var ResolvedReflectiveFactory = (function() {
      function ResolvedReflectiveFactory(factory, dependencies) {
        this.factory = factory;
        this.dependencies = dependencies;
      }
      return ResolvedReflectiveFactory;
    }());
    function resolveReflectiveFactory(provider) {
      var factoryFn;
      var resolvedDeps;
      if (isPresent(provider.useClass)) {
        var useClass = resolveForwardRef(provider.useClass);
        factoryFn = reflector.factory(useClass);
        resolvedDeps = _dependenciesFor(useClass);
      } else if (isPresent(provider.useExisting)) {
        factoryFn = function(aliasInstance) {
          return aliasInstance;
        };
        resolvedDeps = [ReflectiveDependency.fromKey(ReflectiveKey.get(provider.useExisting))];
      } else if (isPresent(provider.useFactory)) {
        factoryFn = provider.useFactory;
        resolvedDeps = constructDependencies(provider.useFactory, provider.dependencies);
      } else {
        factoryFn = function() {
          return provider.useValue;
        };
        resolvedDeps = _EMPTY_LIST;
      }
      return new ResolvedReflectiveFactory(factoryFn, resolvedDeps);
    }
    function resolveReflectiveProvider(provider) {
      return new ResolvedReflectiveProvider_(ReflectiveKey.get(provider.token), [resolveReflectiveFactory(provider)], provider.multi);
    }
    function resolveReflectiveProviders(providers) {
      var normalized = _normalizeProviders(providers, []);
      var resolved = normalized.map(resolveReflectiveProvider);
      return MapWrapper.values(mergeResolvedReflectiveProviders(resolved, new Map()));
    }
    function mergeResolvedReflectiveProviders(providers, normalizedProvidersMap) {
      for (var i = 0; i < providers.length; i++) {
        var provider = providers[i];
        var existing = normalizedProvidersMap.get(provider.key.id);
        if (isPresent(existing)) {
          if (provider.multiProvider !== existing.multiProvider) {
            throw new MixingMultiProvidersWithRegularProvidersError(existing, provider);
          }
          if (provider.multiProvider) {
            for (var j = 0; j < provider.resolvedFactories.length; j++) {
              existing.resolvedFactories.push(provider.resolvedFactories[j]);
            }
          } else {
            normalizedProvidersMap.set(provider.key.id, provider);
          }
        } else {
          var resolvedProvider;
          if (provider.multiProvider) {
            resolvedProvider = new ResolvedReflectiveProvider_(provider.key, ListWrapper.clone(provider.resolvedFactories), provider.multiProvider);
          } else {
            resolvedProvider = provider;
          }
          normalizedProvidersMap.set(provider.key.id, resolvedProvider);
        }
      }
      return normalizedProvidersMap;
    }
    function _normalizeProviders(providers, res) {
      providers.forEach(function(b) {
        if (b instanceof Type) {
          res.push(provide(b, {useClass: b}));
        } else if (b instanceof Provider) {
          res.push(b);
        } else if (isProviderLiteral(b)) {
          res.push(createProvider(b));
        } else if (b instanceof Array) {
          _normalizeProviders(b, res);
        } else if (b instanceof ProviderBuilder) {
          throw new InvalidProviderError(b.token);
        } else {
          throw new InvalidProviderError(b);
        }
      });
      return res;
    }
    function constructDependencies(typeOrFunc, dependencies) {
      if (isBlank(dependencies)) {
        return _dependenciesFor(typeOrFunc);
      } else {
        var params = dependencies.map(function(t) {
          return [t];
        });
        return dependencies.map(function(t) {
          return _extractToken(typeOrFunc, t, params);
        });
      }
    }
    function _dependenciesFor(typeOrFunc) {
      var params = reflector.parameters(typeOrFunc);
      if (isBlank(params))
        return [];
      if (params.some(isBlank)) {
        throw new NoAnnotationError(typeOrFunc, params);
      }
      return params.map(function(p) {
        return _extractToken(typeOrFunc, p, params);
      });
    }
    function _extractToken(typeOrFunc, metadata, params) {
      var depProps = [];
      var token = null;
      var optional = false;
      if (!isArray(metadata)) {
        if (metadata instanceof InjectMetadata) {
          return _createDependency(metadata.token, optional, null, null, depProps);
        } else {
          return _createDependency(metadata, optional, null, null, depProps);
        }
      }
      var lowerBoundVisibility = null;
      var upperBoundVisibility = null;
      for (var i = 0; i < metadata.length; ++i) {
        var paramMetadata = metadata[i];
        if (paramMetadata instanceof Type) {
          token = paramMetadata;
        } else if (paramMetadata instanceof InjectMetadata) {
          token = paramMetadata.token;
        } else if (paramMetadata instanceof OptionalMetadata) {
          optional = true;
        } else if (paramMetadata instanceof SelfMetadata) {
          upperBoundVisibility = paramMetadata;
        } else if (paramMetadata instanceof HostMetadata) {
          upperBoundVisibility = paramMetadata;
        } else if (paramMetadata instanceof SkipSelfMetadata) {
          lowerBoundVisibility = paramMetadata;
        } else if (paramMetadata instanceof DependencyMetadata) {
          if (isPresent(paramMetadata.token)) {
            token = paramMetadata.token;
          }
          depProps.push(paramMetadata);
        }
      }
      token = resolveForwardRef(token);
      if (isPresent(token)) {
        return _createDependency(token, optional, lowerBoundVisibility, upperBoundVisibility, depProps);
      } else {
        throw new NoAnnotationError(typeOrFunc, params);
      }
    }
    function _createDependency(token, optional, lowerBoundVisibility, upperBoundVisibility, depProps) {
      return new ReflectiveDependency(ReflectiveKey.get(token), optional, lowerBoundVisibility, upperBoundVisibility, depProps);
    }
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
        throw new OutOfBoundsError(index);
      };
      ReflectiveProtoInjectorInlineStrategy.prototype.createInjectorStrategy = function(injector) {
        return new ReflectiveInjectorInlineStrategy(injector, this);
      };
      return ReflectiveProtoInjectorInlineStrategy;
    }());
    var ReflectiveProtoInjectorDynamicStrategy = (function() {
      function ReflectiveProtoInjectorDynamicStrategy(protoInj, providers) {
        this.providers = providers;
        var len = providers.length;
        this.keyIds = ListWrapper.createFixedSize(len);
        for (var i = 0; i < len; i++) {
          this.keyIds[i] = providers[i].key.id;
        }
      }
      ReflectiveProtoInjectorDynamicStrategy.prototype.getProviderAtIndex = function(index) {
        if (index < 0 || index >= this.providers.length) {
          throw new OutOfBoundsError(index);
        }
        return this.providers[index];
      };
      ReflectiveProtoInjectorDynamicStrategy.prototype.createInjectorStrategy = function(ei) {
        return new ReflectiveInjectorDynamicStrategy(this, ei);
      };
      return ReflectiveProtoInjectorDynamicStrategy;
    }());
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
        throw new OutOfBoundsError(index);
      };
      ReflectiveInjectorInlineStrategy.prototype.getMaxNumberOfObjects = function() {
        return _MAX_CONSTRUCTION_COUNTER;
      };
      return ReflectiveInjectorInlineStrategy;
    }());
    var ReflectiveInjectorDynamicStrategy = (function() {
      function ReflectiveInjectorDynamicStrategy(protoStrategy, injector) {
        this.protoStrategy = protoStrategy;
        this.injector = injector;
        this.objs = ListWrapper.createFixedSize(protoStrategy.providers.length);
        ListWrapper.fill(this.objs, UNDEFINED);
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
          throw new OutOfBoundsError(index);
        }
        return this.objs[index];
      };
      ReflectiveInjectorDynamicStrategy.prototype.getMaxNumberOfObjects = function() {
        return this.objs.length;
      };
      return ReflectiveInjectorDynamicStrategy;
    }());
    var ReflectiveInjector = (function() {
      function ReflectiveInjector() {}
      ReflectiveInjector.resolve = function(providers) {
        return resolveReflectiveProviders(providers);
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
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      ReflectiveInjector.prototype.debugContext = function() {
        return null;
      };
      ReflectiveInjector.prototype.resolveAndCreateChild = function(providers) {
        return unimplemented();
      };
      ReflectiveInjector.prototype.createChildFromResolved = function(providers) {
        return unimplemented();
      };
      ReflectiveInjector.prototype.resolveAndInstantiate = function(provider) {
        return unimplemented();
      };
      ReflectiveInjector.prototype.instantiateResolved = function(provider) {
        return unimplemented();
      };
      return ReflectiveInjector;
    }());
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
          notFoundValue = THROW_IF_NOT_FOUND;
        }
        return this._getByKey(ReflectiveKey.get(token), null, null, notFoundValue);
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
          throw new CyclicDependencyError(this, provider.key);
        }
        return this._instantiateProvider(provider);
      };
      ReflectiveInjector_.prototype._instantiateProvider = function(provider) {
        if (provider.multiProvider) {
          var res = ListWrapper.createFixedSize(provider.resolvedFactories.length);
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
          if (e instanceof AbstractProviderError || e instanceof InstantiationError) {
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
              throw new BaseException("Cannot instantiate '" + provider.key.displayName + "' because it has more than 20 dependencies");
          }
        } catch (e) {
          throw new InstantiationError(this, e, e.stack, provider.key);
        }
        return obj;
      };
      ReflectiveInjector_.prototype._getByReflectiveDependency = function(provider, dep) {
        return this._getByKey(dep.key, dep.lowerBoundVisibility, dep.upperBoundVisibility, dep.optional ? null : THROW_IF_NOT_FOUND);
      };
      ReflectiveInjector_.prototype._getByKey = function(key, lowerBoundVisibility, upperBoundVisibility, notFoundValue) {
        if (key === INJECTOR_KEY) {
          return this;
        }
        if (upperBoundVisibility instanceof SelfMetadata) {
          return this._getByKeySelf(key, notFoundValue);
        } else {
          return this._getByKeyDefault(key, notFoundValue, lowerBoundVisibility);
        }
      };
      ReflectiveInjector_.prototype._throwOrNull = function(key, notFoundValue) {
        if (notFoundValue !== THROW_IF_NOT_FOUND) {
          return notFoundValue;
        } else {
          throw new NoProviderError(this, key);
        }
      };
      ReflectiveInjector_.prototype._getByKeySelf = function(key, notFoundValue) {
        var obj = this._strategy.getObjByKeyId(key.id);
        return (obj !== UNDEFINED) ? obj : this._throwOrNull(key, notFoundValue);
      };
      ReflectiveInjector_.prototype._getByKeyDefault = function(key, notFoundValue, lowerBoundVisibility) {
        var inj;
        if (lowerBoundVisibility instanceof SkipSelfMetadata) {
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
    var INJECTOR_KEY = ReflectiveKey.get(Injector);
    function _mapProviders(injector, fn) {
      var res = new Array(injector._proto.numberOfProviders);
      for (var i = 0; i < injector._proto.numberOfProviders; ++i) {
        res[i] = fn(injector._proto.getProviderAtIndex(i));
      }
      return res;
    }
    var OpaqueToken = (function() {
      function OpaqueToken(_desc) {
        this._desc = _desc;
      }
      OpaqueToken.prototype.toString = function() {
        return "Token " + this._desc;
      };
      return OpaqueToken;
    }());
    var PromiseCompleter = (function() {
      function PromiseCompleter() {
        var _this = this;
        this.promise = new Promise(function(res, rej) {
          _this.resolve = res;
          _this.reject = rej;
        });
      }
      return PromiseCompleter;
    }());
    var PromiseWrapper = (function() {
      function PromiseWrapper() {}
      PromiseWrapper.resolve = function(obj) {
        return Promise.resolve(obj);
      };
      PromiseWrapper.reject = function(obj, _) {
        return Promise.reject(obj);
      };
      PromiseWrapper.catchError = function(promise, onError) {
        return promise.catch(onError);
      };
      PromiseWrapper.all = function(promises) {
        if (promises.length == 0)
          return Promise.resolve([]);
        return Promise.all(promises);
      };
      PromiseWrapper.then = function(promise, success, rejection) {
        return promise.then(success, rejection);
      };
      PromiseWrapper.wrap = function(computation) {
        return new Promise(function(res, rej) {
          try {
            res(computation());
          } catch (e) {
            rej(e);
          }
        });
      };
      PromiseWrapper.scheduleMicrotask = function(computation) {
        PromiseWrapper.then(PromiseWrapper.resolve(null), computation, function(_) {});
      };
      PromiseWrapper.completer = function() {
        return new PromiseCompleter();
      };
      return PromiseWrapper;
    }());
    var ObservableWrapper = (function() {
      function ObservableWrapper() {}
      ObservableWrapper.subscribe = function(emitter, onNext, onError, onComplete) {
        if (onComplete === void 0) {
          onComplete = function() {};
        }
        onError = (typeof onError === 'function') && onError || noop;
        onComplete = (typeof onComplete === 'function') && onComplete || noop;
        return emitter.subscribe({
          next: onNext,
          error: onError,
          complete: onComplete
        });
      };
      ObservableWrapper.isObservable = function(obs) {
        return !!obs.subscribe;
      };
      ObservableWrapper.hasSubscribers = function(obs) {
        return obs.observers.length > 0;
      };
      ObservableWrapper.dispose = function(subscription) {
        subscription.unsubscribe();
      };
      ObservableWrapper.callNext = function(emitter, value) {
        emitter.emit(value);
      };
      ObservableWrapper.callEmit = function(emitter, value) {
        emitter.emit(value);
      };
      ObservableWrapper.callError = function(emitter, error) {
        emitter.error(error);
      };
      ObservableWrapper.callComplete = function(emitter) {
        emitter.complete();
      };
      ObservableWrapper.fromPromise = function(promise) {
        return rxjs_observable_PromiseObservable.PromiseObservable.create(promise);
      };
      ObservableWrapper.toPromise = function(obj) {
        return rxjs_operator_toPromise.toPromise.call(obj);
      };
      return ObservableWrapper;
    }());
    var EventEmitter = (function(_super) {
      __extends(EventEmitter, _super);
      function EventEmitter(isAsync) {
        if (isAsync === void 0) {
          isAsync = false;
        }
        _super.call(this);
        this.__isAsync = isAsync;
      }
      EventEmitter.prototype.emit = function(value) {
        _super.prototype.next.call(this, value);
      };
      EventEmitter.prototype.next = function(value) {
        _super.prototype.next.call(this, value);
      };
      EventEmitter.prototype.subscribe = function(generatorOrNext, error, complete) {
        var schedulerFn;
        var errorFn = function(err) {
          return null;
        };
        var completeFn = function() {
          return null;
        };
        if (generatorOrNext && typeof generatorOrNext === 'object') {
          schedulerFn = this.__isAsync ? function(value) {
            setTimeout(function() {
              return generatorOrNext.next(value);
            });
          } : function(value) {
            generatorOrNext.next(value);
          };
          if (generatorOrNext.error) {
            errorFn = this.__isAsync ? function(err) {
              setTimeout(function() {
                return generatorOrNext.error(err);
              });
            } : function(err) {
              generatorOrNext.error(err);
            };
          }
          if (generatorOrNext.complete) {
            completeFn = this.__isAsync ? function() {
              setTimeout(function() {
                return generatorOrNext.complete();
              });
            } : function() {
              generatorOrNext.complete();
            };
          }
        } else {
          schedulerFn = this.__isAsync ? function(value) {
            setTimeout(function() {
              return generatorOrNext(value);
            });
          } : function(value) {
            generatorOrNext(value);
          };
          if (error) {
            errorFn = this.__isAsync ? function(err) {
              setTimeout(function() {
                return error(err);
              });
            } : function(err) {
              error(err);
            };
          }
          if (complete) {
            completeFn = this.__isAsync ? function() {
              setTimeout(function() {
                return complete();
              });
            } : function() {
              complete();
            };
          }
        }
        return _super.prototype.subscribe.call(this, schedulerFn, errorFn, completeFn);
      };
      return EventEmitter;
    }(rxjs_Subject.Subject));
    var APP_ID = new OpaqueToken('AppId');
    function _appIdRandomProviderFactory() {
      return "" + _randomChar() + _randomChar() + _randomChar();
    }
    var APP_ID_RANDOM_PROVIDER = {
      provide: APP_ID,
      useFactory: _appIdRandomProviderFactory,
      deps: []
    };
    function _randomChar() {
      return StringWrapper.fromCharCode(97 + Math.floor(Math.random() * 25));
    }
    var PLATFORM_INITIALIZER = new OpaqueToken('Platform Initializer');
    var APP_INITIALIZER = new OpaqueToken('Application Initializer');
    var PACKAGE_ROOT_URL = new OpaqueToken('Application Packages Root URL');
    var _warnImpl = warn;
    var Console = (function() {
      function Console() {}
      Console.prototype.log = function(message) {
        print(message);
      };
      Console.prototype.warn = function(message) {
        _warnImpl(message);
      };
      return Console;
    }());
    Console.decorators = [{type: Injectable}];
    var DefaultIterableDifferFactory = (function() {
      function DefaultIterableDifferFactory() {}
      DefaultIterableDifferFactory.prototype.supports = function(obj) {
        return isListLikeIterable(obj);
      };
      DefaultIterableDifferFactory.prototype.create = function(cdRef, trackByFn) {
        return new DefaultIterableDiffer(trackByFn);
      };
      return DefaultIterableDifferFactory;
    }());
    var trackByIdentity = function(index, item) {
      return item;
    };
    var DefaultIterableDiffer = (function() {
      function DefaultIterableDiffer(_trackByFn) {
        this._trackByFn = _trackByFn;
        this._length = null;
        this._collection = null;
        this._linkedRecords = null;
        this._unlinkedRecords = null;
        this._previousItHead = null;
        this._itHead = null;
        this._itTail = null;
        this._additionsHead = null;
        this._additionsTail = null;
        this._movesHead = null;
        this._movesTail = null;
        this._removalsHead = null;
        this._removalsTail = null;
        this._identityChangesHead = null;
        this._identityChangesTail = null;
        this._trackByFn = isPresent(this._trackByFn) ? this._trackByFn : trackByIdentity;
      }
      Object.defineProperty(DefaultIterableDiffer.prototype, "collection", {
        get: function() {
          return this._collection;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DefaultIterableDiffer.prototype, "length", {
        get: function() {
          return this._length;
        },
        enumerable: true,
        configurable: true
      });
      DefaultIterableDiffer.prototype.forEachItem = function(fn) {
        var record;
        for (record = this._itHead; record !== null; record = record._next) {
          fn(record);
        }
      };
      DefaultIterableDiffer.prototype.forEachPreviousItem = function(fn) {
        var record;
        for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
          fn(record);
        }
      };
      DefaultIterableDiffer.prototype.forEachAddedItem = function(fn) {
        var record;
        for (record = this._additionsHead; record !== null; record = record._nextAdded) {
          fn(record);
        }
      };
      DefaultIterableDiffer.prototype.forEachMovedItem = function(fn) {
        var record;
        for (record = this._movesHead; record !== null; record = record._nextMoved) {
          fn(record);
        }
      };
      DefaultIterableDiffer.prototype.forEachRemovedItem = function(fn) {
        var record;
        for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
          fn(record);
        }
      };
      DefaultIterableDiffer.prototype.forEachIdentityChange = function(fn) {
        var record;
        for (record = this._identityChangesHead; record !== null; record = record._nextIdentityChange) {
          fn(record);
        }
      };
      DefaultIterableDiffer.prototype.diff = function(collection) {
        if (isBlank(collection))
          collection = [];
        if (!isListLikeIterable(collection)) {
          throw new BaseException("Error trying to diff '" + collection + "'");
        }
        if (this.check(collection)) {
          return this;
        } else {
          return null;
        }
      };
      DefaultIterableDiffer.prototype.onDestroy = function() {};
      DefaultIterableDiffer.prototype.check = function(collection) {
        var _this = this;
        this._reset();
        var record = this._itHead;
        var mayBeDirty = false;
        var index;
        var item;
        var itemTrackBy;
        if (isArray(collection)) {
          var list = collection;
          this._length = collection.length;
          for (index = 0; index < this._length; index++) {
            item = list[index];
            itemTrackBy = this._trackByFn(index, item);
            if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
              record = this._mismatch(record, item, itemTrackBy, index);
              mayBeDirty = true;
            } else {
              if (mayBeDirty) {
                record = this._verifyReinsertion(record, item, itemTrackBy, index);
              }
              if (!looseIdentical(record.item, item))
                this._addIdentityChange(record, item);
            }
            record = record._next;
          }
        } else {
          index = 0;
          iterateListLike(collection, function(item) {
            itemTrackBy = _this._trackByFn(index, item);
            if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
              record = _this._mismatch(record, item, itemTrackBy, index);
              mayBeDirty = true;
            } else {
              if (mayBeDirty) {
                record = _this._verifyReinsertion(record, item, itemTrackBy, index);
              }
              if (!looseIdentical(record.item, item))
                _this._addIdentityChange(record, item);
            }
            record = record._next;
            index++;
          });
          this._length = index;
        }
        this._truncate(record);
        this._collection = collection;
        return this.isDirty;
      };
      Object.defineProperty(DefaultIterableDiffer.prototype, "isDirty", {
        get: function() {
          return this._additionsHead !== null || this._movesHead !== null || this._removalsHead !== null || this._identityChangesHead !== null;
        },
        enumerable: true,
        configurable: true
      });
      DefaultIterableDiffer.prototype._reset = function() {
        if (this.isDirty) {
          var record;
          var nextRecord;
          for (record = this._previousItHead = this._itHead; record !== null; record = record._next) {
            record._nextPrevious = record._next;
          }
          for (record = this._additionsHead; record !== null; record = record._nextAdded) {
            record.previousIndex = record.currentIndex;
          }
          this._additionsHead = this._additionsTail = null;
          for (record = this._movesHead; record !== null; record = nextRecord) {
            record.previousIndex = record.currentIndex;
            nextRecord = record._nextMoved;
          }
          this._movesHead = this._movesTail = null;
          this._removalsHead = this._removalsTail = null;
          this._identityChangesHead = this._identityChangesTail = null;
        }
      };
      DefaultIterableDiffer.prototype._mismatch = function(record, item, itemTrackBy, index) {
        var previousRecord;
        if (record === null) {
          previousRecord = this._itTail;
        } else {
          previousRecord = record._prev;
          this._remove(record);
        }
        record = this._linkedRecords === null ? null : this._linkedRecords.get(itemTrackBy, index);
        if (record !== null) {
          if (!looseIdentical(record.item, item))
            this._addIdentityChange(record, item);
          this._moveAfter(record, previousRecord, index);
        } else {
          record = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy);
          if (record !== null) {
            if (!looseIdentical(record.item, item))
              this._addIdentityChange(record, item);
            this._reinsertAfter(record, previousRecord, index);
          } else {
            record = this._addAfter(new CollectionChangeRecord(item, itemTrackBy), previousRecord, index);
          }
        }
        return record;
      };
      DefaultIterableDiffer.prototype._verifyReinsertion = function(record, item, itemTrackBy, index) {
        var reinsertRecord = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy);
        if (reinsertRecord !== null) {
          record = this._reinsertAfter(reinsertRecord, record._prev, index);
        } else if (record.currentIndex != index) {
          record.currentIndex = index;
          this._addToMoves(record, index);
        }
        return record;
      };
      DefaultIterableDiffer.prototype._truncate = function(record) {
        while (record !== null) {
          var nextRecord = record._next;
          this._addToRemovals(this._unlink(record));
          record = nextRecord;
        }
        if (this._unlinkedRecords !== null) {
          this._unlinkedRecords.clear();
        }
        if (this._additionsTail !== null) {
          this._additionsTail._nextAdded = null;
        }
        if (this._movesTail !== null) {
          this._movesTail._nextMoved = null;
        }
        if (this._itTail !== null) {
          this._itTail._next = null;
        }
        if (this._removalsTail !== null) {
          this._removalsTail._nextRemoved = null;
        }
        if (this._identityChangesTail !== null) {
          this._identityChangesTail._nextIdentityChange = null;
        }
      };
      DefaultIterableDiffer.prototype._reinsertAfter = function(record, prevRecord, index) {
        if (this._unlinkedRecords !== null) {
          this._unlinkedRecords.remove(record);
        }
        var prev = record._prevRemoved;
        var next = record._nextRemoved;
        if (prev === null) {
          this._removalsHead = next;
        } else {
          prev._nextRemoved = next;
        }
        if (next === null) {
          this._removalsTail = prev;
        } else {
          next._prevRemoved = prev;
        }
        this._insertAfter(record, prevRecord, index);
        this._addToMoves(record, index);
        return record;
      };
      DefaultIterableDiffer.prototype._moveAfter = function(record, prevRecord, index) {
        this._unlink(record);
        this._insertAfter(record, prevRecord, index);
        this._addToMoves(record, index);
        return record;
      };
      DefaultIterableDiffer.prototype._addAfter = function(record, prevRecord, index) {
        this._insertAfter(record, prevRecord, index);
        if (this._additionsTail === null) {
          this._additionsTail = this._additionsHead = record;
        } else {
          this._additionsTail = this._additionsTail._nextAdded = record;
        }
        return record;
      };
      DefaultIterableDiffer.prototype._insertAfter = function(record, prevRecord, index) {
        var next = prevRecord === null ? this._itHead : prevRecord._next;
        record._next = next;
        record._prev = prevRecord;
        if (next === null) {
          this._itTail = record;
        } else {
          next._prev = record;
        }
        if (prevRecord === null) {
          this._itHead = record;
        } else {
          prevRecord._next = record;
        }
        if (this._linkedRecords === null) {
          this._linkedRecords = new _DuplicateMap();
        }
        this._linkedRecords.put(record);
        record.currentIndex = index;
        return record;
      };
      DefaultIterableDiffer.prototype._remove = function(record) {
        return this._addToRemovals(this._unlink(record));
      };
      DefaultIterableDiffer.prototype._unlink = function(record) {
        if (this._linkedRecords !== null) {
          this._linkedRecords.remove(record);
        }
        var prev = record._prev;
        var next = record._next;
        if (prev === null) {
          this._itHead = next;
        } else {
          prev._next = next;
        }
        if (next === null) {
          this._itTail = prev;
        } else {
          next._prev = prev;
        }
        return record;
      };
      DefaultIterableDiffer.prototype._addToMoves = function(record, toIndex) {
        if (record.previousIndex === toIndex) {
          return record;
        }
        if (this._movesTail === null) {
          this._movesTail = this._movesHead = record;
        } else {
          this._movesTail = this._movesTail._nextMoved = record;
        }
        return record;
      };
      DefaultIterableDiffer.prototype._addToRemovals = function(record) {
        if (this._unlinkedRecords === null) {
          this._unlinkedRecords = new _DuplicateMap();
        }
        this._unlinkedRecords.put(record);
        record.currentIndex = null;
        record._nextRemoved = null;
        if (this._removalsTail === null) {
          this._removalsTail = this._removalsHead = record;
          record._prevRemoved = null;
        } else {
          record._prevRemoved = this._removalsTail;
          this._removalsTail = this._removalsTail._nextRemoved = record;
        }
        return record;
      };
      DefaultIterableDiffer.prototype._addIdentityChange = function(record, item) {
        record.item = item;
        if (this._identityChangesTail === null) {
          this._identityChangesTail = this._identityChangesHead = record;
        } else {
          this._identityChangesTail = this._identityChangesTail._nextIdentityChange = record;
        }
        return record;
      };
      DefaultIterableDiffer.prototype.toString = function() {
        var list = [];
        this.forEachItem(function(record) {
          return list.push(record);
        });
        var previous = [];
        this.forEachPreviousItem(function(record) {
          return previous.push(record);
        });
        var additions = [];
        this.forEachAddedItem(function(record) {
          return additions.push(record);
        });
        var moves = [];
        this.forEachMovedItem(function(record) {
          return moves.push(record);
        });
        var removals = [];
        this.forEachRemovedItem(function(record) {
          return removals.push(record);
        });
        var identityChanges = [];
        this.forEachIdentityChange(function(record) {
          return identityChanges.push(record);
        });
        return 'collection: ' + list.join(', ') + '\n' + 'previous: ' + previous.join(', ') + '\n' + 'additions: ' + additions.join(', ') + '\n' + 'moves: ' + moves.join(', ') + '\n' + 'removals: ' + removals.join(', ') + '\n' + 'identityChanges: ' + identityChanges.join(', ') + '\n';
      };
      return DefaultIterableDiffer;
    }());
    var CollectionChangeRecord = (function() {
      function CollectionChangeRecord(item, trackById) {
        this.item = item;
        this.trackById = trackById;
        this.currentIndex = null;
        this.previousIndex = null;
        this._nextPrevious = null;
        this._prev = null;
        this._next = null;
        this._prevDup = null;
        this._nextDup = null;
        this._prevRemoved = null;
        this._nextRemoved = null;
        this._nextAdded = null;
        this._nextMoved = null;
        this._nextIdentityChange = null;
      }
      CollectionChangeRecord.prototype.toString = function() {
        return this.previousIndex === this.currentIndex ? stringify(this.item) : stringify(this.item) + '[' + stringify(this.previousIndex) + '->' + stringify(this.currentIndex) + ']';
      };
      return CollectionChangeRecord;
    }());
    var _DuplicateItemRecordList = (function() {
      function _DuplicateItemRecordList() {
        this._head = null;
        this._tail = null;
      }
      _DuplicateItemRecordList.prototype.add = function(record) {
        if (this._head === null) {
          this._head = this._tail = record;
          record._nextDup = null;
          record._prevDup = null;
        } else {
          this._tail._nextDup = record;
          record._prevDup = this._tail;
          record._nextDup = null;
          this._tail = record;
        }
      };
      _DuplicateItemRecordList.prototype.get = function(trackById, afterIndex) {
        var record;
        for (record = this._head; record !== null; record = record._nextDup) {
          if ((afterIndex === null || afterIndex < record.currentIndex) && looseIdentical(record.trackById, trackById)) {
            return record;
          }
        }
        return null;
      };
      _DuplicateItemRecordList.prototype.remove = function(record) {
        var prev = record._prevDup;
        var next = record._nextDup;
        if (prev === null) {
          this._head = next;
        } else {
          prev._nextDup = next;
        }
        if (next === null) {
          this._tail = prev;
        } else {
          next._prevDup = prev;
        }
        return this._head === null;
      };
      return _DuplicateItemRecordList;
    }());
    var _DuplicateMap = (function() {
      function _DuplicateMap() {
        this.map = new Map();
      }
      _DuplicateMap.prototype.put = function(record) {
        var key = getMapKey(record.trackById);
        var duplicates = this.map.get(key);
        if (!isPresent(duplicates)) {
          duplicates = new _DuplicateItemRecordList();
          this.map.set(key, duplicates);
        }
        duplicates.add(record);
      };
      _DuplicateMap.prototype.get = function(trackById, afterIndex) {
        if (afterIndex === void 0) {
          afterIndex = null;
        }
        var key = getMapKey(trackById);
        var recordList = this.map.get(key);
        return isBlank(recordList) ? null : recordList.get(trackById, afterIndex);
      };
      _DuplicateMap.prototype.remove = function(record) {
        var key = getMapKey(record.trackById);
        var recordList = this.map.get(key);
        if (recordList.remove(record)) {
          this.map.delete(key);
        }
        return record;
      };
      Object.defineProperty(_DuplicateMap.prototype, "isEmpty", {
        get: function() {
          return this.map.size === 0;
        },
        enumerable: true,
        configurable: true
      });
      _DuplicateMap.prototype.clear = function() {
        this.map.clear();
      };
      _DuplicateMap.prototype.toString = function() {
        return '_DuplicateMap(' + stringify(this.map) + ')';
      };
      return _DuplicateMap;
    }());
    var DefaultKeyValueDifferFactory = (function() {
      function DefaultKeyValueDifferFactory() {}
      DefaultKeyValueDifferFactory.prototype.supports = function(obj) {
        return obj instanceof Map || isJsObject(obj);
      };
      DefaultKeyValueDifferFactory.prototype.create = function(cdRef) {
        return new DefaultKeyValueDiffer();
      };
      return DefaultKeyValueDifferFactory;
    }());
    var DefaultKeyValueDiffer = (function() {
      function DefaultKeyValueDiffer() {
        this._records = new Map();
        this._mapHead = null;
        this._previousMapHead = null;
        this._changesHead = null;
        this._changesTail = null;
        this._additionsHead = null;
        this._additionsTail = null;
        this._removalsHead = null;
        this._removalsTail = null;
      }
      Object.defineProperty(DefaultKeyValueDiffer.prototype, "isDirty", {
        get: function() {
          return this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null;
        },
        enumerable: true,
        configurable: true
      });
      DefaultKeyValueDiffer.prototype.forEachItem = function(fn) {
        var record;
        for (record = this._mapHead; record !== null; record = record._next) {
          fn(record);
        }
      };
      DefaultKeyValueDiffer.prototype.forEachPreviousItem = function(fn) {
        var record;
        for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
          fn(record);
        }
      };
      DefaultKeyValueDiffer.prototype.forEachChangedItem = function(fn) {
        var record;
        for (record = this._changesHead; record !== null; record = record._nextChanged) {
          fn(record);
        }
      };
      DefaultKeyValueDiffer.prototype.forEachAddedItem = function(fn) {
        var record;
        for (record = this._additionsHead; record !== null; record = record._nextAdded) {
          fn(record);
        }
      };
      DefaultKeyValueDiffer.prototype.forEachRemovedItem = function(fn) {
        var record;
        for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
          fn(record);
        }
      };
      DefaultKeyValueDiffer.prototype.diff = function(map) {
        if (isBlank(map))
          map = MapWrapper.createFromPairs([]);
        if (!(map instanceof Map || isJsObject(map))) {
          throw new BaseException("Error trying to diff '" + map + "'");
        }
        if (this.check(map)) {
          return this;
        } else {
          return null;
        }
      };
      DefaultKeyValueDiffer.prototype.onDestroy = function() {};
      DefaultKeyValueDiffer.prototype.check = function(map) {
        var _this = this;
        this._reset();
        var records = this._records;
        var oldSeqRecord = this._mapHead;
        var lastOldSeqRecord = null;
        var lastNewSeqRecord = null;
        var seqChanged = false;
        this._forEach(map, function(value, key) {
          var newSeqRecord;
          if (oldSeqRecord !== null && key === oldSeqRecord.key) {
            newSeqRecord = oldSeqRecord;
            if (!looseIdentical(value, oldSeqRecord.currentValue)) {
              oldSeqRecord.previousValue = oldSeqRecord.currentValue;
              oldSeqRecord.currentValue = value;
              _this._addToChanges(oldSeqRecord);
            }
          } else {
            seqChanged = true;
            if (oldSeqRecord !== null) {
              oldSeqRecord._next = null;
              _this._removeFromSeq(lastOldSeqRecord, oldSeqRecord);
              _this._addToRemovals(oldSeqRecord);
            }
            if (records.has(key)) {
              newSeqRecord = records.get(key);
            } else {
              newSeqRecord = new KeyValueChangeRecord(key);
              records.set(key, newSeqRecord);
              newSeqRecord.currentValue = value;
              _this._addToAdditions(newSeqRecord);
            }
          }
          if (seqChanged) {
            if (_this._isInRemovals(newSeqRecord)) {
              _this._removeFromRemovals(newSeqRecord);
            }
            if (lastNewSeqRecord == null) {
              _this._mapHead = newSeqRecord;
            } else {
              lastNewSeqRecord._next = newSeqRecord;
            }
          }
          lastOldSeqRecord = oldSeqRecord;
          lastNewSeqRecord = newSeqRecord;
          oldSeqRecord = oldSeqRecord === null ? null : oldSeqRecord._next;
        });
        this._truncate(lastOldSeqRecord, oldSeqRecord);
        return this.isDirty;
      };
      DefaultKeyValueDiffer.prototype._reset = function() {
        if (this.isDirty) {
          var record;
          for (record = this._previousMapHead = this._mapHead; record !== null; record = record._next) {
            record._nextPrevious = record._next;
          }
          for (record = this._changesHead; record !== null; record = record._nextChanged) {
            record.previousValue = record.currentValue;
          }
          for (record = this._additionsHead; record != null; record = record._nextAdded) {
            record.previousValue = record.currentValue;
          }
          this._changesHead = this._changesTail = null;
          this._additionsHead = this._additionsTail = null;
          this._removalsHead = this._removalsTail = null;
        }
      };
      DefaultKeyValueDiffer.prototype._truncate = function(lastRecord, record) {
        while (record !== null) {
          if (lastRecord === null) {
            this._mapHead = null;
          } else {
            lastRecord._next = null;
          }
          var nextRecord = record._next;
          this._addToRemovals(record);
          lastRecord = record;
          record = nextRecord;
        }
        for (var rec = this._removalsHead; rec !== null; rec = rec._nextRemoved) {
          rec.previousValue = rec.currentValue;
          rec.currentValue = null;
          this._records.delete(rec.key);
        }
      };
      DefaultKeyValueDiffer.prototype._isInRemovals = function(record) {
        return record === this._removalsHead || record._nextRemoved !== null || record._prevRemoved !== null;
      };
      DefaultKeyValueDiffer.prototype._addToRemovals = function(record) {
        if (this._removalsHead === null) {
          this._removalsHead = this._removalsTail = record;
        } else {
          this._removalsTail._nextRemoved = record;
          record._prevRemoved = this._removalsTail;
          this._removalsTail = record;
        }
      };
      DefaultKeyValueDiffer.prototype._removeFromSeq = function(prev, record) {
        var next = record._next;
        if (prev === null) {
          this._mapHead = next;
        } else {
          prev._next = next;
        }
      };
      DefaultKeyValueDiffer.prototype._removeFromRemovals = function(record) {
        var prev = record._prevRemoved;
        var next = record._nextRemoved;
        if (prev === null) {
          this._removalsHead = next;
        } else {
          prev._nextRemoved = next;
        }
        if (next === null) {
          this._removalsTail = prev;
        } else {
          next._prevRemoved = prev;
        }
        record._prevRemoved = record._nextRemoved = null;
      };
      DefaultKeyValueDiffer.prototype._addToAdditions = function(record) {
        if (this._additionsHead === null) {
          this._additionsHead = this._additionsTail = record;
        } else {
          this._additionsTail._nextAdded = record;
          this._additionsTail = record;
        }
      };
      DefaultKeyValueDiffer.prototype._addToChanges = function(record) {
        if (this._changesHead === null) {
          this._changesHead = this._changesTail = record;
        } else {
          this._changesTail._nextChanged = record;
          this._changesTail = record;
        }
      };
      DefaultKeyValueDiffer.prototype.toString = function() {
        var items = [];
        var previous = [];
        var changes = [];
        var additions = [];
        var removals = [];
        var record;
        for (record = this._mapHead; record !== null; record = record._next) {
          items.push(stringify(record));
        }
        for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
          previous.push(stringify(record));
        }
        for (record = this._changesHead; record !== null; record = record._nextChanged) {
          changes.push(stringify(record));
        }
        for (record = this._additionsHead; record !== null; record = record._nextAdded) {
          additions.push(stringify(record));
        }
        for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
          removals.push(stringify(record));
        }
        return 'map: ' + items.join(', ') + '\n' + 'previous: ' + previous.join(', ') + '\n' + 'additions: ' + additions.join(', ') + '\n' + 'changes: ' + changes.join(', ') + '\n' + 'removals: ' + removals.join(', ') + '\n';
      };
      DefaultKeyValueDiffer.prototype._forEach = function(obj, fn) {
        if (obj instanceof Map) {
          obj.forEach(fn);
        } else {
          StringMapWrapper.forEach(obj, fn);
        }
      };
      return DefaultKeyValueDiffer;
    }());
    var KeyValueChangeRecord = (function() {
      function KeyValueChangeRecord(key) {
        this.key = key;
        this.previousValue = null;
        this.currentValue = null;
        this._nextPrevious = null;
        this._next = null;
        this._nextAdded = null;
        this._nextRemoved = null;
        this._prevRemoved = null;
        this._nextChanged = null;
      }
      KeyValueChangeRecord.prototype.toString = function() {
        return looseIdentical(this.previousValue, this.currentValue) ? stringify(this.key) : (stringify(this.key) + '[' + stringify(this.previousValue) + '->' + stringify(this.currentValue) + ']');
      };
      return KeyValueChangeRecord;
    }());
    var IterableDiffers = (function() {
      function IterableDiffers(factories) {
        this.factories = factories;
      }
      IterableDiffers.create = function(factories, parent) {
        if (isPresent(parent)) {
          var copied = ListWrapper.clone(parent.factories);
          factories = factories.concat(copied);
          return new IterableDiffers(factories);
        } else {
          return new IterableDiffers(factories);
        }
      };
      IterableDiffers.extend = function(factories) {
        return new Provider(IterableDiffers, {
          useFactory: function(parent) {
            if (isBlank(parent)) {
              throw new BaseException('Cannot extend IterableDiffers without a parent injector');
            }
            return IterableDiffers.create(factories, parent);
          },
          deps: [[IterableDiffers, new SkipSelfMetadata(), new OptionalMetadata()]]
        });
      };
      IterableDiffers.prototype.find = function(iterable) {
        var factory = this.factories.find(function(f) {
          return f.supports(iterable);
        });
        if (isPresent(factory)) {
          return factory;
        } else {
          throw new BaseException("Cannot find a differ supporting object '" + iterable + "' of type '" + getTypeNameForDebugging(iterable) + "'");
        }
      };
      return IterableDiffers;
    }());
    var KeyValueDiffers = (function() {
      function KeyValueDiffers(factories) {
        this.factories = factories;
      }
      KeyValueDiffers.create = function(factories, parent) {
        if (isPresent(parent)) {
          var copied = ListWrapper.clone(parent.factories);
          factories = factories.concat(copied);
          return new KeyValueDiffers(factories);
        } else {
          return new KeyValueDiffers(factories);
        }
      };
      KeyValueDiffers.extend = function(factories) {
        return new Provider(KeyValueDiffers, {
          useFactory: function(parent) {
            if (isBlank(parent)) {
              throw new BaseException('Cannot extend KeyValueDiffers without a parent injector');
            }
            return KeyValueDiffers.create(factories, parent);
          },
          deps: [[KeyValueDiffers, new SkipSelfMetadata(), new OptionalMetadata()]]
        });
      };
      KeyValueDiffers.prototype.find = function(kv) {
        var factory = this.factories.find(function(f) {
          return f.supports(kv);
        });
        if (isPresent(factory)) {
          return factory;
        } else {
          throw new BaseException("Cannot find a differ supporting object '" + kv + "'");
        }
      };
      return KeyValueDiffers;
    }());
    var uninitialized = new Object();
    function devModeEqual(a, b) {
      if (isListLikeIterable(a) && isListLikeIterable(b)) {
        return areIterablesEqual(a, b, devModeEqual);
      } else if (!isListLikeIterable(a) && !isPrimitive(a) && !isListLikeIterable(b) && !isPrimitive(b)) {
        return true;
      } else {
        return looseIdentical(a, b);
      }
    }
    var WrappedValue = (function() {
      function WrappedValue(wrapped) {
        this.wrapped = wrapped;
      }
      WrappedValue.wrap = function(value) {
        return new WrappedValue(value);
      };
      return WrappedValue;
    }());
    var ValueUnwrapper = (function() {
      function ValueUnwrapper() {
        this.hasWrappedValue = false;
      }
      ValueUnwrapper.prototype.unwrap = function(value) {
        if (value instanceof WrappedValue) {
          this.hasWrappedValue = true;
          return value.wrapped;
        }
        return value;
      };
      ValueUnwrapper.prototype.reset = function() {
        this.hasWrappedValue = false;
      };
      return ValueUnwrapper;
    }());
    var SimpleChange = (function() {
      function SimpleChange(previousValue, currentValue) {
        this.previousValue = previousValue;
        this.currentValue = currentValue;
      }
      SimpleChange.prototype.isFirstChange = function() {
        return this.previousValue === uninitialized;
      };
      return SimpleChange;
    }());
    var ChangeDetectorRef = (function() {
      function ChangeDetectorRef() {}
      return ChangeDetectorRef;
    }());
    var keyValDiff = [new DefaultKeyValueDifferFactory()];
    var iterableDiff = [new DefaultIterableDifferFactory()];
    var defaultIterableDiffers = new IterableDiffers(iterableDiff);
    var defaultKeyValueDiffers = new KeyValueDiffers(keyValDiff);
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
    var RenderDebugInfo = (function() {
      function RenderDebugInfo() {}
      Object.defineProperty(RenderDebugInfo.prototype, "injector", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(RenderDebugInfo.prototype, "component", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(RenderDebugInfo.prototype, "providerTokens", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(RenderDebugInfo.prototype, "references", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(RenderDebugInfo.prototype, "context", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(RenderDebugInfo.prototype, "source", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      return RenderDebugInfo;
    }());
    var Renderer = (function() {
      function Renderer() {}
      return Renderer;
    }());
    var RootRenderer = (function() {
      function RootRenderer() {}
      return RootRenderer;
    }());
    var SecurityContext;
    (function(SecurityContext) {
      SecurityContext[SecurityContext["NONE"] = 0] = "NONE";
      SecurityContext[SecurityContext["HTML"] = 1] = "HTML";
      SecurityContext[SecurityContext["STYLE"] = 2] = "STYLE";
      SecurityContext[SecurityContext["SCRIPT"] = 3] = "SCRIPT";
      SecurityContext[SecurityContext["URL"] = 4] = "URL";
      SecurityContext[SecurityContext["RESOURCE_URL"] = 5] = "RESOURCE_URL";
    })(SecurityContext || (SecurityContext = {}));
    var SanitizationService = (function() {
      function SanitizationService() {}
      return SanitizationService;
    }());
    var ElementRef = (function() {
      function ElementRef(nativeElement) {
        this.nativeElement = nativeElement;
      }
      return ElementRef;
    }());
    var trace;
    var events;
    function detectWTF() {
      var wtf = global$1['wtf'];
      if (wtf) {
        trace = wtf['trace'];
        if (trace) {
          events = trace['events'];
          return true;
        }
      }
      return false;
    }
    function createScope(signature, flags) {
      if (flags === void 0) {
        flags = null;
      }
      return events.createScope(signature, flags);
    }
    function leave(scope, returnValue) {
      trace.leaveScope(scope, returnValue);
      return returnValue;
    }
    function startTimeRange(rangeType, action) {
      return trace.beginTimeRange(rangeType, action);
    }
    function endTimeRange(range) {
      trace.endTimeRange(range);
    }
    var wtfEnabled = detectWTF();
    function noopScope(arg0, arg1) {
      return null;
    }
    var wtfCreateScope = wtfEnabled ? createScope : function(signature, flags) {
      return noopScope;
    };
    var wtfLeave = wtfEnabled ? leave : function(s, r) {
      return r;
    };
    var wtfStartTimeRange = wtfEnabled ? startTimeRange : function(rangeType, action) {
      return null;
    };
    var wtfEndTimeRange = wtfEnabled ? endTimeRange : function(r) {
      return null;
    };
    var ViewContainerRef = (function() {
      function ViewContainerRef() {}
      Object.defineProperty(ViewContainerRef.prototype, "element", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ViewContainerRef.prototype, "injector", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ViewContainerRef.prototype, "parentInjector", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ViewContainerRef.prototype, "length", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      ;
      return ViewContainerRef;
    }());
    var ViewContainerRef_ = (function() {
      function ViewContainerRef_(_element) {
        this._element = _element;
        this._createComponentInContainerScope = wtfCreateScope('ViewContainerRef#createComponent()');
        this._insertScope = wtfCreateScope('ViewContainerRef#insert()');
        this._removeScope = wtfCreateScope('ViewContainerRef#remove()');
        this._detachScope = wtfCreateScope('ViewContainerRef#detach()');
      }
      ViewContainerRef_.prototype.get = function(index) {
        return this._element.nestedViews[index].ref;
      };
      Object.defineProperty(ViewContainerRef_.prototype, "length", {
        get: function() {
          var views = this._element.nestedViews;
          return isPresent(views) ? views.length : 0;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ViewContainerRef_.prototype, "element", {
        get: function() {
          return this._element.elementRef;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ViewContainerRef_.prototype, "injector", {
        get: function() {
          return this._element.injector;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ViewContainerRef_.prototype, "parentInjector", {
        get: function() {
          return this._element.parentInjector;
        },
        enumerable: true,
        configurable: true
      });
      ViewContainerRef_.prototype.createEmbeddedView = function(templateRef, context, index) {
        if (context === void 0) {
          context = null;
        }
        if (index === void 0) {
          index = -1;
        }
        var viewRef = templateRef.createEmbeddedView(context);
        this.insert(viewRef, index);
        return viewRef;
      };
      ViewContainerRef_.prototype.createComponent = function(componentFactory, index, injector, projectableNodes) {
        if (index === void 0) {
          index = -1;
        }
        if (injector === void 0) {
          injector = null;
        }
        if (projectableNodes === void 0) {
          projectableNodes = null;
        }
        var s = this._createComponentInContainerScope();
        var contextInjector = isPresent(injector) ? injector : this._element.parentInjector;
        var componentRef = componentFactory.create(contextInjector, projectableNodes);
        this.insert(componentRef.hostView, index);
        return wtfLeave(s, componentRef);
      };
      ViewContainerRef_.prototype.insert = function(viewRef, index) {
        if (index === void 0) {
          index = -1;
        }
        var s = this._insertScope();
        if (index == -1)
          index = this.length;
        var viewRef_ = viewRef;
        this._element.attachView(viewRef_.internalView, index);
        return wtfLeave(s, viewRef_);
      };
      ViewContainerRef_.prototype.indexOf = function(viewRef) {
        return ListWrapper.indexOf(this._element.nestedViews, viewRef.internalView);
      };
      ViewContainerRef_.prototype.remove = function(index) {
        if (index === void 0) {
          index = -1;
        }
        var s = this._removeScope();
        if (index == -1)
          index = this.length - 1;
        var view = this._element.detachView(index);
        view.destroy();
        wtfLeave(s);
      };
      ViewContainerRef_.prototype.detach = function(index) {
        if (index === void 0) {
          index = -1;
        }
        var s = this._detachScope();
        if (index == -1)
          index = this.length - 1;
        var view = this._element.detachView(index);
        return wtfLeave(s, view.ref);
      };
      ViewContainerRef_.prototype.clear = function() {
        for (var i = this.length - 1; i >= 0; i--) {
          this.remove(i);
        }
      };
      return ViewContainerRef_;
    }());
    var ViewType;
    (function(ViewType) {
      ViewType[ViewType["HOST"] = 0] = "HOST";
      ViewType[ViewType["COMPONENT"] = 1] = "COMPONENT";
      ViewType[ViewType["EMBEDDED"] = 2] = "EMBEDDED";
    })(ViewType || (ViewType = {}));
    var AppElement = (function() {
      function AppElement(index, parentIndex, parentView, nativeElement) {
        this.index = index;
        this.parentIndex = parentIndex;
        this.parentView = parentView;
        this.nativeElement = nativeElement;
        this.nestedViews = null;
        this.componentView = null;
      }
      Object.defineProperty(AppElement.prototype, "elementRef", {
        get: function() {
          return new ElementRef(this.nativeElement);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AppElement.prototype, "vcRef", {
        get: function() {
          return new ViewContainerRef_(this);
        },
        enumerable: true,
        configurable: true
      });
      AppElement.prototype.initComponent = function(component, componentConstructorViewQueries, view) {
        this.component = component;
        this.componentConstructorViewQueries = componentConstructorViewQueries;
        this.componentView = view;
      };
      Object.defineProperty(AppElement.prototype, "parentInjector", {
        get: function() {
          return this.parentView.injector(this.parentIndex);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AppElement.prototype, "injector", {
        get: function() {
          return this.parentView.injector(this.index);
        },
        enumerable: true,
        configurable: true
      });
      AppElement.prototype.mapNestedViews = function(nestedViewClass, callback) {
        var result = [];
        if (isPresent(this.nestedViews)) {
          this.nestedViews.forEach(function(nestedView) {
            if (nestedView.clazz === nestedViewClass) {
              result.push(callback(nestedView));
            }
          });
        }
        return result;
      };
      AppElement.prototype.attachView = function(view, viewIndex) {
        if (view.type === ViewType.COMPONENT) {
          throw new BaseException("Component views can't be moved!");
        }
        var nestedViews = this.nestedViews;
        if (nestedViews == null) {
          nestedViews = [];
          this.nestedViews = nestedViews;
        }
        ListWrapper.insert(nestedViews, viewIndex, view);
        var refRenderNode;
        if (viewIndex > 0) {
          var prevView = nestedViews[viewIndex - 1];
          refRenderNode = prevView.lastRootNode;
        } else {
          refRenderNode = this.nativeElement;
        }
        if (isPresent(refRenderNode)) {
          view.renderer.attachViewAfter(refRenderNode, view.flatRootNodes);
        }
        view.addToContentChildren(this);
      };
      AppElement.prototype.detachView = function(viewIndex) {
        var view = ListWrapper.removeAt(this.nestedViews, viewIndex);
        if (view.type === ViewType.COMPONENT) {
          throw new BaseException("Component views can't be moved!");
        }
        view.detach();
        view.removeFromContentChildren(this);
        return view;
      };
      return AppElement;
    }());
    var ExpressionChangedAfterItHasBeenCheckedException = (function(_super) {
      __extends(ExpressionChangedAfterItHasBeenCheckedException, _super);
      function ExpressionChangedAfterItHasBeenCheckedException(oldValue, currValue, context) {
        _super.call(this, "Expression has changed after it was checked. " + ("Previous value: '" + oldValue + "'. Current value: '" + currValue + "'"));
      }
      return ExpressionChangedAfterItHasBeenCheckedException;
    }(BaseException));
    var ViewWrappedException = (function(_super) {
      __extends(ViewWrappedException, _super);
      function ViewWrappedException(originalException, originalStack, context) {
        _super.call(this, "Error in " + context.source, originalException, originalStack, context);
      }
      return ViewWrappedException;
    }(WrappedException));
    var ViewDestroyedException = (function(_super) {
      __extends(ViewDestroyedException, _super);
      function ViewDestroyedException(details) {
        _super.call(this, "Attempt to use a destroyed view: " + details);
      }
      return ViewDestroyedException;
    }(BaseException));
    var ViewUtils = (function() {
      function ViewUtils(_renderer, _appId, sanitizer) {
        this._renderer = _renderer;
        this._appId = _appId;
        this._nextCompTypeId = 0;
        this.sanitizer = sanitizer;
      }
      ViewUtils.prototype.createRenderComponentType = function(templateUrl, slotCount, encapsulation, styles) {
        return new RenderComponentType(this._appId + "-" + this._nextCompTypeId++, templateUrl, slotCount, encapsulation, styles);
      };
      ViewUtils.prototype.renderComponent = function(renderComponentType) {
        return this._renderer.renderComponent(renderComponentType);
      };
      return ViewUtils;
    }());
    ViewUtils.decorators = [{type: Injectable}];
    ViewUtils.ctorParameters = [{type: RootRenderer}, {
      type: undefined,
      decorators: [{
        type: Inject,
        args: [APP_ID]
      }]
    }, {type: SanitizationService}];
    function flattenNestedViewRenderNodes(nodes) {
      return _flattenNestedViewRenderNodes(nodes, []);
    }
    function _flattenNestedViewRenderNodes(nodes, renderNodes) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node instanceof AppElement) {
          var appEl = node;
          renderNodes.push(appEl.nativeElement);
          if (isPresent(appEl.nestedViews)) {
            for (var k = 0; k < appEl.nestedViews.length; k++) {
              _flattenNestedViewRenderNodes(appEl.nestedViews[k].rootNodesOrAppElements, renderNodes);
            }
          }
        } else {
          renderNodes.push(node);
        }
      }
      return renderNodes;
    }
    var EMPTY_ARR = [];
    function ensureSlotCount(projectableNodes, expectedSlotCount) {
      var res;
      if (isBlank(projectableNodes)) {
        res = EMPTY_ARR;
      } else if (projectableNodes.length < expectedSlotCount) {
        var givenSlotCount = projectableNodes.length;
        res = ListWrapper.createFixedSize(expectedSlotCount);
        for (var i = 0; i < expectedSlotCount; i++) {
          res[i] = (i < givenSlotCount) ? projectableNodes[i] : EMPTY_ARR;
        }
      } else {
        res = projectableNodes;
      }
      return res;
    }
    var MAX_INTERPOLATION_VALUES = 9;
    function interpolate(valueCount, c0, a1, c1, a2, c2, a3, c3, a4, c4, a5, c5, a6, c6, a7, c7, a8, c8, a9, c9) {
      switch (valueCount) {
        case 1:
          return c0 + _toStringWithNull(a1) + c1;
        case 2:
          return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2;
        case 3:
          return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3;
        case 4:
          return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4;
        case 5:
          return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5;
        case 6:
          return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6;
        case 7:
          return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6 + _toStringWithNull(a7) + c7;
        case 8:
          return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8;
        case 9:
          return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8 + _toStringWithNull(a9) + c9;
        default:
          throw new BaseException("Does not support more than 9 expressions");
      }
    }
    function _toStringWithNull(v) {
      return v != null ? v.toString() : '';
    }
    function checkBinding(throwOnChange, oldValue, newValue) {
      if (throwOnChange) {
        if (!devModeEqual(oldValue, newValue)) {
          throw new ExpressionChangedAfterItHasBeenCheckedException(oldValue, newValue, null);
        }
        return false;
      } else {
        return !looseIdentical(oldValue, newValue);
      }
    }
    function castByValue(input, value) {
      return input;
    }
    var EMPTY_ARRAY = [];
    var EMPTY_MAP = {};
    function pureProxy1(fn) {
      var result;
      var v0;
      v0 = uninitialized;
      return function(p0) {
        if (!looseIdentical(v0, p0)) {
          v0 = p0;
          result = fn(p0);
        }
        return result;
      };
    }
    function pureProxy2(fn) {
      var result;
      var v0,
          v1;
      v0 = v1 = uninitialized;
      return function(p0, p1) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1)) {
          v0 = p0;
          v1 = p1;
          result = fn(p0, p1);
        }
        return result;
      };
    }
    function pureProxy3(fn) {
      var result;
      var v0,
          v1,
          v2;
      v0 = v1 = v2 = uninitialized;
      return function(p0, p1, p2) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2)) {
          v0 = p0;
          v1 = p1;
          v2 = p2;
          result = fn(p0, p1, p2);
        }
        return result;
      };
    }
    function pureProxy4(fn) {
      var result;
      var v0,
          v1,
          v2,
          v3;
      v0 = v1 = v2 = v3 = uninitialized;
      return function(p0, p1, p2, p3) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3)) {
          v0 = p0;
          v1 = p1;
          v2 = p2;
          v3 = p3;
          result = fn(p0, p1, p2, p3);
        }
        return result;
      };
    }
    function pureProxy5(fn) {
      var result;
      var v0,
          v1,
          v2,
          v3,
          v4;
      v0 = v1 = v2 = v3 = v4 = uninitialized;
      return function(p0, p1, p2, p3, p4) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4)) {
          v0 = p0;
          v1 = p1;
          v2 = p2;
          v3 = p3;
          v4 = p4;
          result = fn(p0, p1, p2, p3, p4);
        }
        return result;
      };
    }
    function pureProxy6(fn) {
      var result;
      var v0,
          v1,
          v2,
          v3,
          v4,
          v5;
      v0 = v1 = v2 = v3 = v4 = v5 = uninitialized;
      return function(p0, p1, p2, p3, p4, p5) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5)) {
          v0 = p0;
          v1 = p1;
          v2 = p2;
          v3 = p3;
          v4 = p4;
          v5 = p5;
          result = fn(p0, p1, p2, p3, p4, p5);
        }
        return result;
      };
    }
    function pureProxy7(fn) {
      var result;
      var v0,
          v1,
          v2,
          v3,
          v4,
          v5,
          v6;
      v0 = v1 = v2 = v3 = v4 = v5 = v6 = uninitialized;
      return function(p0, p1, p2, p3, p4, p5, p6) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) || !looseIdentical(v6, p6)) {
          v0 = p0;
          v1 = p1;
          v2 = p2;
          v3 = p3;
          v4 = p4;
          v5 = p5;
          v6 = p6;
          result = fn(p0, p1, p2, p3, p4, p5, p6);
        }
        return result;
      };
    }
    function pureProxy8(fn) {
      var result;
      var v0,
          v1,
          v2,
          v3,
          v4,
          v5,
          v6,
          v7;
      v0 = v1 = v2 = v3 = v4 = v5 = v6 = v7 = uninitialized;
      return function(p0, p1, p2, p3, p4, p5, p6, p7) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) || !looseIdentical(v6, p6) || !looseIdentical(v7, p7)) {
          v0 = p0;
          v1 = p1;
          v2 = p2;
          v3 = p3;
          v4 = p4;
          v5 = p5;
          v6 = p6;
          v7 = p7;
          result = fn(p0, p1, p2, p3, p4, p5, p6, p7);
        }
        return result;
      };
    }
    function pureProxy9(fn) {
      var result;
      var v0,
          v1,
          v2,
          v3,
          v4,
          v5,
          v6,
          v7,
          v8;
      v0 = v1 = v2 = v3 = v4 = v5 = v6 = v7 = v8 = uninitialized;
      return function(p0, p1, p2, p3, p4, p5, p6, p7, p8) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) || !looseIdentical(v6, p6) || !looseIdentical(v7, p7) || !looseIdentical(v8, p8)) {
          v0 = p0;
          v1 = p1;
          v2 = p2;
          v3 = p3;
          v4 = p4;
          v5 = p5;
          v6 = p6;
          v7 = p7;
          v8 = p8;
          result = fn(p0, p1, p2, p3, p4, p5, p6, p7, p8);
        }
        return result;
      };
    }
    function pureProxy10(fn) {
      var result;
      var v0,
          v1,
          v2,
          v3,
          v4,
          v5,
          v6,
          v7,
          v8,
          v9;
      v0 = v1 = v2 = v3 = v4 = v5 = v6 = v7 = v8 = v9 = uninitialized;
      return function(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9) {
        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) || !looseIdentical(v6, p6) || !looseIdentical(v7, p7) || !looseIdentical(v8, p8) || !looseIdentical(v9, p9)) {
          v0 = p0;
          v1 = p1;
          v2 = p2;
          v3 = p3;
          v4 = p4;
          v5 = p5;
          v6 = p6;
          v7 = p7;
          v8 = p8;
          v9 = p9;
          result = fn(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9);
        }
        return result;
      };
    }
    var ComponentRef = (function() {
      function ComponentRef() {}
      Object.defineProperty(ComponentRef.prototype, "location", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ComponentRef.prototype, "injector", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ComponentRef.prototype, "instance", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      ;
      Object.defineProperty(ComponentRef.prototype, "hostView", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      ;
      Object.defineProperty(ComponentRef.prototype, "changeDetectorRef", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ComponentRef.prototype, "componentType", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      return ComponentRef;
    }());
    var ComponentRef_ = (function(_super) {
      __extends(ComponentRef_, _super);
      function ComponentRef_(_hostElement, _componentType) {
        _super.call(this);
        this._hostElement = _hostElement;
        this._componentType = _componentType;
      }
      Object.defineProperty(ComponentRef_.prototype, "location", {
        get: function() {
          return this._hostElement.elementRef;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ComponentRef_.prototype, "injector", {
        get: function() {
          return this._hostElement.injector;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ComponentRef_.prototype, "instance", {
        get: function() {
          return this._hostElement.component;
        },
        enumerable: true,
        configurable: true
      });
      ;
      Object.defineProperty(ComponentRef_.prototype, "hostView", {
        get: function() {
          return this._hostElement.parentView.ref;
        },
        enumerable: true,
        configurable: true
      });
      ;
      Object.defineProperty(ComponentRef_.prototype, "changeDetectorRef", {
        get: function() {
          return this._hostElement.parentView.ref;
        },
        enumerable: true,
        configurable: true
      });
      ;
      Object.defineProperty(ComponentRef_.prototype, "componentType", {
        get: function() {
          return this._componentType;
        },
        enumerable: true,
        configurable: true
      });
      ComponentRef_.prototype.destroy = function() {
        this._hostElement.parentView.destroy();
      };
      ComponentRef_.prototype.onDestroy = function(callback) {
        this.hostView.onDestroy(callback);
      };
      return ComponentRef_;
    }(ComponentRef));
    var EMPTY_CONTEXT = new Object();
    var ComponentFactory = (function() {
      function ComponentFactory(selector, _viewFactory, _componentType) {
        this.selector = selector;
        this._viewFactory = _viewFactory;
        this._componentType = _componentType;
      }
      Object.defineProperty(ComponentFactory.prototype, "componentType", {
        get: function() {
          return this._componentType;
        },
        enumerable: true,
        configurable: true
      });
      ComponentFactory.prototype.create = function(injector, projectableNodes, rootSelectorOrNode) {
        if (projectableNodes === void 0) {
          projectableNodes = null;
        }
        if (rootSelectorOrNode === void 0) {
          rootSelectorOrNode = null;
        }
        var vu = injector.get(ViewUtils);
        if (isBlank(projectableNodes)) {
          projectableNodes = [];
        }
        var hostView = this._viewFactory(vu, injector, null);
        var hostElement = hostView.create(EMPTY_CONTEXT, projectableNodes, rootSelectorOrNode);
        return new ComponentRef_(hostElement, this._componentType);
      };
      return ComponentFactory;
    }());
    var ComponentResolver = (function() {
      function ComponentResolver() {}
      return ComponentResolver;
    }());
    function _isComponentFactory(type) {
      return type instanceof ComponentFactory;
    }
    var ReflectorComponentResolver = (function(_super) {
      __extends(ReflectorComponentResolver, _super);
      function ReflectorComponentResolver() {
        _super.apply(this, arguments);
      }
      ReflectorComponentResolver.prototype.resolveComponent = function(component) {
        if (isString(component)) {
          return PromiseWrapper.reject(new BaseException("Cannot resolve component using '" + component + "'."), null);
        }
        var metadatas = reflector.annotations(component);
        var componentFactory = metadatas.find(_isComponentFactory);
        if (isBlank(componentFactory)) {
          throw new BaseException("No precompiled component " + stringify(component) + " found");
        }
        return PromiseWrapper.resolve(componentFactory);
      };
      ReflectorComponentResolver.prototype.clearCache = function() {};
      return ReflectorComponentResolver;
    }(ComponentResolver));
    ReflectorComponentResolver.decorators = [{type: Injectable}];
    var NgZoneError = (function() {
      function NgZoneError(error, stackTrace) {
        this.error = error;
        this.stackTrace = stackTrace;
      }
      return NgZoneError;
    }());
    var NgZoneImpl = (function() {
      function NgZoneImpl(_a) {
        var _this = this;
        var trace = _a.trace,
            onEnter = _a.onEnter,
            onLeave = _a.onLeave,
            setMicrotask = _a.setMicrotask,
            setMacrotask = _a.setMacrotask,
            onError = _a.onError;
        this.onEnter = onEnter;
        this.onLeave = onLeave;
        this.setMicrotask = setMicrotask;
        this.setMacrotask = setMacrotask;
        this.onError = onError;
        if (Zone) {
          this.outer = this.inner = Zone.current;
          if (Zone['wtfZoneSpec']) {
            this.inner = this.inner.fork(Zone['wtfZoneSpec']);
          }
          if (trace && Zone['longStackTraceZoneSpec']) {
            this.inner = this.inner.fork(Zone['longStackTraceZoneSpec']);
          }
          this.inner = this.inner.fork({
            name: 'angular',
            properties: {'isAngularZone': true},
            onInvokeTask: function(delegate, current, target, task, applyThis, applyArgs) {
              try {
                _this.onEnter();
                return delegate.invokeTask(target, task, applyThis, applyArgs);
              } finally {
                _this.onLeave();
              }
            },
            onInvoke: function(delegate, current, target, callback, applyThis, applyArgs, source) {
              try {
                _this.onEnter();
                return delegate.invoke(target, callback, applyThis, applyArgs, source);
              } finally {
                _this.onLeave();
              }
            },
            onHasTask: function(delegate, current, target, hasTaskState) {
              delegate.hasTask(target, hasTaskState);
              if (current == target) {
                if (hasTaskState.change == 'microTask') {
                  _this.setMicrotask(hasTaskState.microTask);
                } else if (hasTaskState.change == 'macroTask') {
                  _this.setMacrotask(hasTaskState.macroTask);
                }
              }
            },
            onHandleError: function(delegate, current, target, error) {
              delegate.handleError(target, error);
              _this.onError(new NgZoneError(error, error.stack));
              return false;
            }
          });
        } else {
          throw new Error('Angular requires Zone.js polyfill.');
        }
      }
      NgZoneImpl.isInAngularZone = function() {
        return Zone.current.get('isAngularZone') === true;
      };
      NgZoneImpl.prototype.runInner = function(fn) {
        return this.inner.run(fn);
      };
      ;
      NgZoneImpl.prototype.runInnerGuarded = function(fn) {
        return this.inner.runGuarded(fn);
      };
      ;
      NgZoneImpl.prototype.runOuter = function(fn) {
        return this.outer.run(fn);
      };
      ;
      return NgZoneImpl;
    }());
    var NgZone = (function() {
      function NgZone(_a) {
        var _this = this;
        var _b = _a.enableLongStackTrace,
            enableLongStackTrace = _b === void 0 ? false : _b;
        this._hasPendingMicrotasks = false;
        this._hasPendingMacrotasks = false;
        this._isStable = true;
        this._nesting = 0;
        this._onUnstable = new EventEmitter(false);
        this._onMicrotaskEmpty = new EventEmitter(false);
        this._onStable = new EventEmitter(false);
        this._onErrorEvents = new EventEmitter(false);
        this._zoneImpl = new NgZoneImpl({
          trace: enableLongStackTrace,
          onEnter: function() {
            _this._nesting++;
            if (_this._isStable) {
              _this._isStable = false;
              _this._onUnstable.emit(null);
            }
          },
          onLeave: function() {
            _this._nesting--;
            _this._checkStable();
          },
          setMicrotask: function(hasMicrotasks) {
            _this._hasPendingMicrotasks = hasMicrotasks;
            _this._checkStable();
          },
          setMacrotask: function(hasMacrotasks) {
            _this._hasPendingMacrotasks = hasMacrotasks;
          },
          onError: function(error) {
            return _this._onErrorEvents.emit(error);
          }
        });
      }
      NgZone.isInAngularZone = function() {
        return NgZoneImpl.isInAngularZone();
      };
      NgZone.assertInAngularZone = function() {
        if (!NgZoneImpl.isInAngularZone()) {
          throw new BaseException('Expected to be in Angular Zone, but it is not!');
        }
      };
      NgZone.assertNotInAngularZone = function() {
        if (NgZoneImpl.isInAngularZone()) {
          throw new BaseException('Expected to not be in Angular Zone, but it is!');
        }
      };
      NgZone.prototype._checkStable = function() {
        var _this = this;
        if (this._nesting == 0) {
          if (!this._hasPendingMicrotasks && !this._isStable) {
            try {
              this._nesting++;
              this._onMicrotaskEmpty.emit(null);
            } finally {
              this._nesting--;
              if (!this._hasPendingMicrotasks) {
                try {
                  this.runOutsideAngular(function() {
                    return _this._onStable.emit(null);
                  });
                } finally {
                  this._isStable = true;
                }
              }
            }
          }
        }
      };
      ;
      Object.defineProperty(NgZone.prototype, "onUnstable", {
        get: function() {
          return this._onUnstable;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgZone.prototype, "onMicrotaskEmpty", {
        get: function() {
          return this._onMicrotaskEmpty;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgZone.prototype, "onStable", {
        get: function() {
          return this._onStable;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgZone.prototype, "onError", {
        get: function() {
          return this._onErrorEvents;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgZone.prototype, "isStable", {
        get: function() {
          return this._isStable;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgZone.prototype, "hasPendingMicrotasks", {
        get: function() {
          return this._hasPendingMicrotasks;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgZone.prototype, "hasPendingMacrotasks", {
        get: function() {
          return this._hasPendingMacrotasks;
        },
        enumerable: true,
        configurable: true
      });
      NgZone.prototype.run = function(fn) {
        return this._zoneImpl.runInner(fn);
      };
      NgZone.prototype.runGuarded = function(fn) {
        return this._zoneImpl.runInnerGuarded(fn);
      };
      NgZone.prototype.runOutsideAngular = function(fn) {
        return this._zoneImpl.runOuter(fn);
      };
      return NgZone;
    }());
    var Testability = (function() {
      function Testability(_ngZone) {
        this._ngZone = _ngZone;
        this._pendingCount = 0;
        this._isZoneStable = true;
        this._didWork = false;
        this._callbacks = [];
        this._watchAngularEvents();
      }
      Testability.prototype._watchAngularEvents = function() {
        var _this = this;
        ObservableWrapper.subscribe(this._ngZone.onUnstable, function(_) {
          _this._didWork = true;
          _this._isZoneStable = false;
        });
        this._ngZone.runOutsideAngular(function() {
          ObservableWrapper.subscribe(_this._ngZone.onStable, function(_) {
            NgZone.assertNotInAngularZone();
            scheduleMicroTask(function() {
              _this._isZoneStable = true;
              _this._runCallbacksIfReady();
            });
          });
        });
      };
      Testability.prototype.increasePendingRequestCount = function() {
        this._pendingCount += 1;
        this._didWork = true;
        return this._pendingCount;
      };
      Testability.prototype.decreasePendingRequestCount = function() {
        this._pendingCount -= 1;
        if (this._pendingCount < 0) {
          throw new BaseException('pending async requests below zero');
        }
        this._runCallbacksIfReady();
        return this._pendingCount;
      };
      Testability.prototype.isStable = function() {
        return this._isZoneStable && this._pendingCount == 0 && !this._ngZone.hasPendingMacrotasks;
      };
      Testability.prototype._runCallbacksIfReady = function() {
        var _this = this;
        if (this.isStable()) {
          scheduleMicroTask(function() {
            while (_this._callbacks.length !== 0) {
              (_this._callbacks.pop())(_this._didWork);
            }
            _this._didWork = false;
          });
        } else {
          this._didWork = true;
        }
      };
      Testability.prototype.whenStable = function(callback) {
        this._callbacks.push(callback);
        this._runCallbacksIfReady();
      };
      Testability.prototype.getPendingRequestCount = function() {
        return this._pendingCount;
      };
      Testability.prototype.findBindings = function(using, provider, exactMatch) {
        return [];
      };
      Testability.prototype.findProviders = function(using, provider, exactMatch) {
        return [];
      };
      return Testability;
    }());
    Testability.decorators = [{type: Injectable}];
    Testability.ctorParameters = [{type: NgZone}];
    var TestabilityRegistry = (function() {
      function TestabilityRegistry() {
        this._applications = new Map$1();
        _testabilityGetter.addToWindow(this);
      }
      TestabilityRegistry.prototype.registerApplication = function(token, testability) {
        this._applications.set(token, testability);
      };
      TestabilityRegistry.prototype.getTestability = function(elem) {
        return this._applications.get(elem);
      };
      TestabilityRegistry.prototype.getAllTestabilities = function() {
        return MapWrapper.values(this._applications);
      };
      TestabilityRegistry.prototype.getAllRootElements = function() {
        return MapWrapper.keys(this._applications);
      };
      TestabilityRegistry.prototype.findTestabilityInTree = function(elem, findInAncestors) {
        if (findInAncestors === void 0) {
          findInAncestors = true;
        }
        return _testabilityGetter.findTestabilityInTree(this, elem, findInAncestors);
      };
      return TestabilityRegistry;
    }());
    TestabilityRegistry.decorators = [{type: Injectable}];
    TestabilityRegistry.ctorParameters = [];
    var _NoopGetTestability = (function() {
      function _NoopGetTestability() {}
      _NoopGetTestability.prototype.addToWindow = function(registry) {};
      _NoopGetTestability.prototype.findTestabilityInTree = function(registry, elem, findInAncestors) {
        return null;
      };
      return _NoopGetTestability;
    }());
    function setTestabilityGetter(getter) {
      _testabilityGetter = getter;
    }
    var _testabilityGetter = new _NoopGetTestability();
    function createNgZone() {
      return new NgZone({enableLongStackTrace: isDevMode()});
    }
    var _devMode = true;
    var _runModeLocked = false;
    var _platform;
    var _inPlatformCreate = false;
    function enableProdMode() {
      if (_runModeLocked) {
        throw new BaseException('Cannot enable prod mode after platform setup.');
      }
      _devMode = false;
    }
    function isDevMode() {
      if (!_runModeLocked) {
        throw new BaseException("Dev mode can't be read before bootstrap!");
      }
      return _devMode;
    }
    function lockRunMode() {
      _runModeLocked = true;
    }
    function createPlatform(injector) {
      if (_inPlatformCreate) {
        throw new BaseException('Already creating a platform...');
      }
      if (isPresent(_platform) && !_platform.disposed) {
        throw new BaseException('There can be only one platform. Destroy the previous one to create a new one.');
      }
      lockRunMode();
      _inPlatformCreate = true;
      try {
        _platform = injector.get(PlatformRef);
      } finally {
        _inPlatformCreate = false;
      }
      return _platform;
    }
    function assertPlatform(requiredToken) {
      var platform = getPlatform();
      if (isBlank(platform)) {
        throw new BaseException('No platform exists!');
      }
      if (isPresent(platform) && isBlank(platform.injector.get(requiredToken, null))) {
        throw new BaseException('A platform with a different configuration has been created. Please destroy it first.');
      }
      return platform;
    }
    function disposePlatform() {
      if (isPresent(_platform) && !_platform.disposed) {
        _platform.dispose();
      }
    }
    function getPlatform() {
      return isPresent(_platform) && !_platform.disposed ? _platform : null;
    }
    function coreBootstrap(componentFactory, injector) {
      var appRef = injector.get(ApplicationRef);
      return appRef.bootstrap(componentFactory);
    }
    function coreLoadAndBootstrap(componentType, injector) {
      var appRef = injector.get(ApplicationRef);
      return appRef.run(function() {
        var componentResolver = injector.get(ComponentResolver);
        return PromiseWrapper.all([componentResolver.resolveComponent(componentType), appRef.waitForAsyncInitializers()]).then(function(arr) {
          return appRef.bootstrap(arr[0]);
        });
      });
    }
    var PlatformRef = (function() {
      function PlatformRef() {}
      Object.defineProperty(PlatformRef.prototype, "injector", {
        get: function() {
          throw unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      ;
      Object.defineProperty(PlatformRef.prototype, "disposed", {
        get: function() {
          throw unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      return PlatformRef;
    }());
    var PlatformRef_ = (function(_super) {
      __extends(PlatformRef_, _super);
      function PlatformRef_(_injector) {
        _super.call(this);
        this._injector = _injector;
        this._applications = [];
        this._disposeListeners = [];
        this._disposed = false;
        if (!_inPlatformCreate) {
          throw new BaseException('Platforms have to be created via `createPlatform`!');
        }
        var inits = _injector.get(PLATFORM_INITIALIZER, null);
        if (isPresent(inits))
          inits.forEach(function(init) {
            return init();
          });
      }
      PlatformRef_.prototype.registerDisposeListener = function(dispose) {
        this._disposeListeners.push(dispose);
      };
      Object.defineProperty(PlatformRef_.prototype, "injector", {
        get: function() {
          return this._injector;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PlatformRef_.prototype, "disposed", {
        get: function() {
          return this._disposed;
        },
        enumerable: true,
        configurable: true
      });
      PlatformRef_.prototype.addApplication = function(appRef) {
        this._applications.push(appRef);
      };
      PlatformRef_.prototype.dispose = function() {
        ListWrapper.clone(this._applications).forEach(function(app) {
          return app.dispose();
        });
        this._disposeListeners.forEach(function(dispose) {
          return dispose();
        });
        this._disposed = true;
      };
      PlatformRef_.prototype._applicationDisposed = function(app) {
        ListWrapper.remove(this._applications, app);
      };
      return PlatformRef_;
    }(PlatformRef));
    PlatformRef_.decorators = [{type: Injectable}];
    PlatformRef_.ctorParameters = [{type: Injector}];
    var ApplicationRef = (function() {
      function ApplicationRef() {}
      Object.defineProperty(ApplicationRef.prototype, "injector", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      ;
      Object.defineProperty(ApplicationRef.prototype, "zone", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      ;
      Object.defineProperty(ApplicationRef.prototype, "componentTypes", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      ;
      return ApplicationRef;
    }());
    var ApplicationRef_ = (function(_super) {
      __extends(ApplicationRef_, _super);
      function ApplicationRef_(_platform, _zone, _injector) {
        var _this = this;
        _super.call(this);
        this._platform = _platform;
        this._zone = _zone;
        this._injector = _injector;
        this._bootstrapListeners = [];
        this._disposeListeners = [];
        this._rootComponents = [];
        this._rootComponentTypes = [];
        this._changeDetectorRefs = [];
        this._runningTick = false;
        this._enforceNoNewChanges = false;
        var zone = _injector.get(NgZone);
        this._enforceNoNewChanges = isDevMode();
        zone.run(function() {
          _this._exceptionHandler = _injector.get(ExceptionHandler);
        });
        this._asyncInitDonePromise = this.run(function() {
          var inits = _injector.get(APP_INITIALIZER, null);
          var asyncInitResults = [];
          var asyncInitDonePromise;
          if (isPresent(inits)) {
            for (var i = 0; i < inits.length; i++) {
              var initResult = inits[i]();
              if (isPromise(initResult)) {
                asyncInitResults.push(initResult);
              }
            }
          }
          if (asyncInitResults.length > 0) {
            asyncInitDonePromise = PromiseWrapper.all(asyncInitResults).then(function(_) {
              return _this._asyncInitDone = true;
            });
            _this._asyncInitDone = false;
          } else {
            _this._asyncInitDone = true;
            asyncInitDonePromise = PromiseWrapper.resolve(true);
          }
          return asyncInitDonePromise;
        });
        ObservableWrapper.subscribe(zone.onError, function(error) {
          _this._exceptionHandler.call(error.error, error.stackTrace);
        });
        ObservableWrapper.subscribe(this._zone.onMicrotaskEmpty, function(_) {
          _this._zone.run(function() {
            _this.tick();
          });
        });
      }
      ApplicationRef_.prototype.registerBootstrapListener = function(listener) {
        this._bootstrapListeners.push(listener);
      };
      ApplicationRef_.prototype.registerDisposeListener = function(dispose) {
        this._disposeListeners.push(dispose);
      };
      ApplicationRef_.prototype.registerChangeDetector = function(changeDetector) {
        this._changeDetectorRefs.push(changeDetector);
      };
      ApplicationRef_.prototype.unregisterChangeDetector = function(changeDetector) {
        ListWrapper.remove(this._changeDetectorRefs, changeDetector);
      };
      ApplicationRef_.prototype.waitForAsyncInitializers = function() {
        return this._asyncInitDonePromise;
      };
      ApplicationRef_.prototype.run = function(callback) {
        var _this = this;
        var zone = this.injector.get(NgZone);
        var result;
        var completer = PromiseWrapper.completer();
        zone.run(function() {
          try {
            result = callback();
            if (isPromise(result)) {
              PromiseWrapper.then(result, function(ref) {
                completer.resolve(ref);
              }, function(err, stackTrace) {
                completer.reject(err, stackTrace);
                _this._exceptionHandler.call(err, stackTrace);
              });
            }
          } catch (e) {
            _this._exceptionHandler.call(e, e.stack);
            throw e;
          }
        });
        return isPromise(result) ? completer.promise : result;
      };
      ApplicationRef_.prototype.bootstrap = function(componentFactory) {
        var _this = this;
        if (!this._asyncInitDone) {
          throw new BaseException('Cannot bootstrap as there are still asynchronous initializers running. Wait for them using waitForAsyncInitializers().');
        }
        return this.run(function() {
          _this._rootComponentTypes.push(componentFactory.componentType);
          var compRef = componentFactory.create(_this._injector, [], componentFactory.selector);
          compRef.onDestroy(function() {
            _this._unloadComponent(compRef);
          });
          var testability = compRef.injector.get(Testability, null);
          if (isPresent(testability)) {
            compRef.injector.get(TestabilityRegistry).registerApplication(compRef.location.nativeElement, testability);
          }
          _this._loadComponent(compRef);
          var c = _this._injector.get(Console);
          if (isDevMode()) {
            var prodDescription = IS_DART ? 'Production mode is disabled in Dart.' : 'Call enableProdMode() to enable the production mode.';
            c.log("Angular 2 is running in the development mode. " + prodDescription);
          }
          return compRef;
        });
      };
      ApplicationRef_.prototype._loadComponent = function(componentRef) {
        this._changeDetectorRefs.push(componentRef.changeDetectorRef);
        this.tick();
        this._rootComponents.push(componentRef);
        this._bootstrapListeners.forEach(function(listener) {
          return listener(componentRef);
        });
      };
      ApplicationRef_.prototype._unloadComponent = function(componentRef) {
        if (!ListWrapper.contains(this._rootComponents, componentRef)) {
          return;
        }
        this.unregisterChangeDetector(componentRef.changeDetectorRef);
        ListWrapper.remove(this._rootComponents, componentRef);
      };
      Object.defineProperty(ApplicationRef_.prototype, "injector", {
        get: function() {
          return this._injector;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ApplicationRef_.prototype, "zone", {
        get: function() {
          return this._zone;
        },
        enumerable: true,
        configurable: true
      });
      ApplicationRef_.prototype.tick = function() {
        if (this._runningTick) {
          throw new BaseException('ApplicationRef.tick is called recursively');
        }
        var s = ApplicationRef_._tickScope();
        try {
          this._runningTick = true;
          this._changeDetectorRefs.forEach(function(detector) {
            return detector.detectChanges();
          });
          if (this._enforceNoNewChanges) {
            this._changeDetectorRefs.forEach(function(detector) {
              return detector.checkNoChanges();
            });
          }
        } finally {
          this._runningTick = false;
          wtfLeave(s);
        }
      };
      ApplicationRef_.prototype.dispose = function() {
        ListWrapper.clone(this._rootComponents).forEach(function(ref) {
          return ref.destroy();
        });
        this._disposeListeners.forEach(function(dispose) {
          return dispose();
        });
        this._platform._applicationDisposed(this);
      };
      Object.defineProperty(ApplicationRef_.prototype, "componentTypes", {
        get: function() {
          return this._rootComponentTypes;
        },
        enumerable: true,
        configurable: true
      });
      return ApplicationRef_;
    }(ApplicationRef));
    ApplicationRef_._tickScope = wtfCreateScope('ApplicationRef#tick()');
    ApplicationRef_.decorators = [{type: Injectable}];
    ApplicationRef_.ctorParameters = [{type: PlatformRef_}, {type: NgZone}, {type: Injector}];
    var PLATFORM_CORE_PROVIDERS = [PlatformRef_, ({
      provide: PlatformRef,
      useExisting: PlatformRef_
    })];
    var APPLICATION_CORE_PROVIDERS = [{
      provide: NgZone,
      useFactory: createNgZone,
      deps: []
    }, ApplicationRef_, {
      provide: ApplicationRef,
      useExisting: ApplicationRef_
    }];
    var Compiler = (function() {
      function Compiler() {}
      Compiler.prototype.compileComponentAsync = function(component) {
        throw new BaseException("Runtime compiler is not loaded. Tried to compile " + stringify(component));
      };
      Compiler.prototype.compileComponentSync = function(component) {
        throw new BaseException("Runtime compiler is not loaded. Tried to compile " + stringify(component));
      };
      Compiler.prototype.clearCache = function() {};
      Compiler.prototype.clearCacheFor = function(compType) {};
      return Compiler;
    }());
    var NoComponentFactoryError = (function(_super) {
      __extends(NoComponentFactoryError, _super);
      function NoComponentFactoryError(component) {
        _super.call(this, "No component factory found for " + stringify(component));
        this.component = component;
      }
      return NoComponentFactoryError;
    }(BaseException));
    var _NullComponentFactoryResolver = (function() {
      function _NullComponentFactoryResolver() {}
      _NullComponentFactoryResolver.prototype.resolveComponentFactory = function(component) {
        throw new NoComponentFactoryError(component);
      };
      return _NullComponentFactoryResolver;
    }());
    var ComponentFactoryResolver = (function() {
      function ComponentFactoryResolver() {}
      return ComponentFactoryResolver;
    }());
    ComponentFactoryResolver.NULL = new _NullComponentFactoryResolver();
    var CodegenComponentFactoryResolver = (function() {
      function CodegenComponentFactoryResolver(factories, _parent) {
        this._parent = _parent;
        this._factories = new Map();
        for (var i = 0; i < factories.length; i++) {
          var factory = factories[i];
          this._factories.set(factory.componentType, factory);
        }
      }
      CodegenComponentFactoryResolver.prototype.resolveComponentFactory = function(component) {
        var result = this._factories.get(component);
        if (!result) {
          result = this._parent.resolveComponentFactory(component);
        }
        return result;
      };
      return CodegenComponentFactoryResolver;
    }());
    var DynamicComponentLoader = (function() {
      function DynamicComponentLoader() {}
      return DynamicComponentLoader;
    }());
    var DynamicComponentLoader_ = (function(_super) {
      __extends(DynamicComponentLoader_, _super);
      function DynamicComponentLoader_(_compiler) {
        _super.call(this);
        this._compiler = _compiler;
      }
      DynamicComponentLoader_.prototype.loadAsRoot = function(type, overrideSelectorOrNode, injector, onDispose, projectableNodes) {
        return this._compiler.resolveComponent(type).then(function(componentFactory) {
          var componentRef = componentFactory.create(injector, projectableNodes, isPresent(overrideSelectorOrNode) ? overrideSelectorOrNode : componentFactory.selector);
          if (isPresent(onDispose)) {
            componentRef.onDestroy(onDispose);
          }
          return componentRef;
        });
      };
      DynamicComponentLoader_.prototype.loadNextToLocation = function(type, location, providers, projectableNodes) {
        if (providers === void 0) {
          providers = null;
        }
        if (projectableNodes === void 0) {
          projectableNodes = null;
        }
        return this._compiler.resolveComponent(type).then(function(componentFactory) {
          var contextInjector = location.parentInjector;
          var childInjector = isPresent(providers) && providers.length > 0 ? ReflectiveInjector.fromResolvedProviders(providers, contextInjector) : contextInjector;
          return location.createComponent(componentFactory, location.length, childInjector, projectableNodes);
        });
      };
      return DynamicComponentLoader_;
    }(DynamicComponentLoader));
    DynamicComponentLoader_.decorators = [{type: Injectable}];
    DynamicComponentLoader_.ctorParameters = [{type: ComponentResolver}];
    var QueryList = (function() {
      function QueryList() {
        this._dirty = true;
        this._results = [];
        this._emitter = new EventEmitter();
      }
      Object.defineProperty(QueryList.prototype, "changes", {
        get: function() {
          return this._emitter;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(QueryList.prototype, "length", {
        get: function() {
          return this._results.length;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(QueryList.prototype, "first", {
        get: function() {
          return this._results[0];
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(QueryList.prototype, "last", {
        get: function() {
          return this._results[this.length - 1];
        },
        enumerable: true,
        configurable: true
      });
      QueryList.prototype.map = function(fn) {
        return this._results.map(fn);
      };
      QueryList.prototype.filter = function(fn) {
        return this._results.filter(fn);
      };
      QueryList.prototype.reduce = function(fn, init) {
        return this._results.reduce(fn, init);
      };
      QueryList.prototype.forEach = function(fn) {
        this._results.forEach(fn);
      };
      QueryList.prototype.some = function(fn) {
        return this._results.some(fn);
      };
      QueryList.prototype.toArray = function() {
        return this._results.slice();
      };
      QueryList.prototype[getSymbolIterator()] = function() {
        return this._results[getSymbolIterator()]();
      };
      QueryList.prototype.toString = function() {
        return this._results.toString();
      };
      QueryList.prototype.reset = function(res) {
        this._results = ListWrapper.flatten(res);
        this._dirty = false;
      };
      QueryList.prototype.notifyOnChanges = function() {
        this._emitter.emit(this);
      };
      QueryList.prototype.setDirty = function() {
        this._dirty = true;
      };
      Object.defineProperty(QueryList.prototype, "dirty", {
        get: function() {
          return this._dirty;
        },
        enumerable: true,
        configurable: true
      });
      return QueryList;
    }());
    var _SEPARATOR = '#';
    var SystemJsComponentResolver = (function() {
      function SystemJsComponentResolver(_resolver) {
        this._resolver = _resolver;
      }
      SystemJsComponentResolver.prototype.resolveComponent = function(componentType) {
        var _this = this;
        if (isString(componentType)) {
          var _a = componentType.split(_SEPARATOR),
              module = _a[0],
              component_1 = _a[1];
          if (component_1 === void(0)) {
            component_1 = 'default';
          }
          return global$1.System.import(module).then(function(module) {
            return _this._resolver.resolveComponent(module[component_1]);
          });
        }
        return this._resolver.resolveComponent(componentType);
      };
      SystemJsComponentResolver.prototype.clearCache = function() {};
      return SystemJsComponentResolver;
    }());
    var FACTORY_MODULE_SUFFIX = '.ngfactory';
    var FACTORY_CLASS_SUFFIX = 'NgFactory';
    var SystemJsCmpFactoryResolver = (function() {
      function SystemJsCmpFactoryResolver() {}
      SystemJsCmpFactoryResolver.prototype.resolveComponent = function(componentType) {
        if (isString(componentType)) {
          var _a = componentType.split(_SEPARATOR),
              module = _a[0],
              factory_1 = _a[1];
          return global$1.System.import(module + FACTORY_MODULE_SUFFIX).then(function(module) {
            return module[factory_1 + FACTORY_CLASS_SUFFIX];
          });
        }
        return Promise.resolve(null);
      };
      SystemJsCmpFactoryResolver.prototype.clearCache = function() {};
      return SystemJsCmpFactoryResolver;
    }());
    var EMPTY_CONTEXT$1 = new Object();
    var TemplateRef = (function() {
      function TemplateRef() {}
      Object.defineProperty(TemplateRef.prototype, "elementRef", {
        get: function() {
          return null;
        },
        enumerable: true,
        configurable: true
      });
      return TemplateRef;
    }());
    var TemplateRef_ = (function(_super) {
      __extends(TemplateRef_, _super);
      function TemplateRef_(_appElement, _viewFactory) {
        _super.call(this);
        this._appElement = _appElement;
        this._viewFactory = _viewFactory;
      }
      TemplateRef_.prototype.createEmbeddedView = function(context) {
        var view = this._viewFactory(this._appElement.parentView.viewUtils, this._appElement.parentInjector, this._appElement);
        if (isBlank(context)) {
          context = EMPTY_CONTEXT$1;
        }
        view.create(context, null, null);
        return view.ref;
      };
      Object.defineProperty(TemplateRef_.prototype, "elementRef", {
        get: function() {
          return this._appElement.elementRef;
        },
        enumerable: true,
        configurable: true
      });
      return TemplateRef_;
    }(TemplateRef));
    var ViewRef = (function() {
      function ViewRef() {}
      Object.defineProperty(ViewRef.prototype, "destroyed", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      return ViewRef;
    }());
    var EmbeddedViewRef = (function(_super) {
      __extends(EmbeddedViewRef, _super);
      function EmbeddedViewRef() {
        _super.apply(this, arguments);
      }
      Object.defineProperty(EmbeddedViewRef.prototype, "context", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(EmbeddedViewRef.prototype, "rootNodes", {
        get: function() {
          return unimplemented();
        },
        enumerable: true,
        configurable: true
      });
      ;
      return EmbeddedViewRef;
    }(ViewRef));
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
        this._view.cdMode = ChangeDetectorStatus.Detached;
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
    var EventListener = (function() {
      function EventListener(name, callback) {
        this.name = name;
        this.callback = callback;
      }
      ;
      return EventListener;
    }());
    var DebugNode = (function() {
      function DebugNode(nativeNode, parent, _debugInfo) {
        this._debugInfo = _debugInfo;
        this.nativeNode = nativeNode;
        if (isPresent(parent) && parent instanceof DebugElement) {
          parent.addChild(this);
        } else {
          this.parent = null;
        }
        this.listeners = [];
      }
      Object.defineProperty(DebugNode.prototype, "injector", {
        get: function() {
          return isPresent(this._debugInfo) ? this._debugInfo.injector : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugNode.prototype, "componentInstance", {
        get: function() {
          return isPresent(this._debugInfo) ? this._debugInfo.component : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugNode.prototype, "context", {
        get: function() {
          return isPresent(this._debugInfo) ? this._debugInfo.context : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugNode.prototype, "references", {
        get: function() {
          return isPresent(this._debugInfo) ? this._debugInfo.references : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugNode.prototype, "providerTokens", {
        get: function() {
          return isPresent(this._debugInfo) ? this._debugInfo.providerTokens : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugNode.prototype, "source", {
        get: function() {
          return isPresent(this._debugInfo) ? this._debugInfo.source : null;
        },
        enumerable: true,
        configurable: true
      });
      DebugNode.prototype.inject = function(token) {
        return this.injector.get(token);
      };
      return DebugNode;
    }());
    var DebugElement = (function(_super) {
      __extends(DebugElement, _super);
      function DebugElement(nativeNode, parent, _debugInfo) {
        _super.call(this, nativeNode, parent, _debugInfo);
        this.properties = {};
        this.attributes = {};
        this.classes = {};
        this.styles = {};
        this.childNodes = [];
        this.nativeElement = nativeNode;
      }
      DebugElement.prototype.addChild = function(child) {
        if (isPresent(child)) {
          this.childNodes.push(child);
          child.parent = this;
        }
      };
      DebugElement.prototype.removeChild = function(child) {
        var childIndex = this.childNodes.indexOf(child);
        if (childIndex !== -1) {
          child.parent = null;
          this.childNodes.splice(childIndex, 1);
        }
      };
      DebugElement.prototype.insertChildrenAfter = function(child, newChildren) {
        var siblingIndex = this.childNodes.indexOf(child);
        if (siblingIndex !== -1) {
          var previousChildren = this.childNodes.slice(0, siblingIndex + 1);
          var nextChildren = this.childNodes.slice(siblingIndex + 1);
          this.childNodes = ListWrapper.concat(ListWrapper.concat(previousChildren, newChildren), nextChildren);
          for (var i = 0; i < newChildren.length; ++i) {
            var newChild = newChildren[i];
            if (isPresent(newChild.parent)) {
              newChild.parent.removeChild(newChild);
            }
            newChild.parent = this;
          }
        }
      };
      DebugElement.prototype.query = function(predicate) {
        var results = this.queryAll(predicate);
        return results.length > 0 ? results[0] : null;
      };
      DebugElement.prototype.queryAll = function(predicate) {
        var matches = [];
        _queryElementChildren(this, predicate, matches);
        return matches;
      };
      DebugElement.prototype.queryAllNodes = function(predicate) {
        var matches = [];
        _queryNodeChildren(this, predicate, matches);
        return matches;
      };
      Object.defineProperty(DebugElement.prototype, "children", {
        get: function() {
          var children = [];
          this.childNodes.forEach(function(node) {
            if (node instanceof DebugElement) {
              children.push(node);
            }
          });
          return children;
        },
        enumerable: true,
        configurable: true
      });
      DebugElement.prototype.triggerEventHandler = function(eventName, eventObj) {
        this.listeners.forEach(function(listener) {
          if (listener.name == eventName) {
            listener.callback(eventObj);
          }
        });
      };
      return DebugElement;
    }(DebugNode));
    function asNativeElements(debugEls) {
      return debugEls.map(function(el) {
        return el.nativeElement;
      });
    }
    function _queryElementChildren(element, predicate, matches) {
      element.childNodes.forEach(function(node) {
        if (node instanceof DebugElement) {
          if (predicate(node)) {
            matches.push(node);
          }
          _queryElementChildren(node, predicate, matches);
        }
      });
    }
    function _queryNodeChildren(parentNode, predicate, matches) {
      if (parentNode instanceof DebugElement) {
        parentNode.childNodes.forEach(function(node) {
          if (predicate(node)) {
            matches.push(node);
          }
          if (node instanceof DebugElement) {
            _queryNodeChildren(node, predicate, matches);
          }
        });
      }
    }
    var _nativeNodeToDebugNode = new Map();
    function getDebugNode(nativeNode) {
      return _nativeNodeToDebugNode.get(nativeNode);
    }
    function indexDebugNode(node) {
      _nativeNodeToDebugNode.set(node.nativeNode, node);
    }
    function removeDebugNodeFromIndex(node) {
      _nativeNodeToDebugNode.delete(node.nativeNode);
    }
    var PLATFORM_DIRECTIVES = new OpaqueToken('Platform Directives');
    var PLATFORM_PIPES = new OpaqueToken('Platform Pipes');
    function _reflector() {
      return reflector;
    }
    var PLATFORM_COMMON_PROVIDERS = [PLATFORM_CORE_PROVIDERS, {
      provide: Reflector,
      useFactory: _reflector,
      deps: []
    }, {
      provide: ReflectorReader,
      useExisting: Reflector
    }, TestabilityRegistry, Console];
    var APPLICATION_COMMON_PROVIDERS = [APPLICATION_CORE_PROVIDERS, {
      provide: ComponentResolver,
      useClass: ReflectorComponentResolver
    }, {
      provide: ComponentFactoryResolver,
      useValue: ComponentFactoryResolver.NULL
    }, APP_ID_RANDOM_PROVIDER, ViewUtils, {
      provide: IterableDiffers,
      useValue: defaultIterableDiffers
    }, {
      provide: KeyValueDiffers,
      useValue: defaultKeyValueDiffers
    }, {
      provide: DynamicComponentLoader,
      useClass: DynamicComponentLoader_
    }];
    var FILL_STYLE_FLAG = 'true';
    var ANY_STATE = '*';
    var DEFAULT_STATE = '*';
    var EMPTY_STATE = 'void';
    var AnimationPlayer = (function() {
      function AnimationPlayer() {}
      Object.defineProperty(AnimationPlayer.prototype, "parentPlayer", {
        get: function() {
          throw new BaseException('NOT IMPLEMENTED: Base Class');
        },
        set: function(player) {
          throw new BaseException('NOT IMPLEMENTED: Base Class');
        },
        enumerable: true,
        configurable: true
      });
      return AnimationPlayer;
    }());
    var NoOpAnimationPlayer = (function() {
      function NoOpAnimationPlayer() {
        var _this = this;
        this._subscriptions = [];
        this.parentPlayer = null;
        scheduleMicroTask(function() {
          return _this._onFinish();
        });
      }
      NoOpAnimationPlayer.prototype._onFinish = function() {
        this._subscriptions.forEach(function(entry) {
          entry();
        });
        this._subscriptions = [];
      };
      NoOpAnimationPlayer.prototype.onDone = function(fn) {
        this._subscriptions.push(fn);
      };
      NoOpAnimationPlayer.prototype.play = function() {};
      NoOpAnimationPlayer.prototype.pause = function() {};
      NoOpAnimationPlayer.prototype.restart = function() {};
      NoOpAnimationPlayer.prototype.finish = function() {
        this._onFinish();
      };
      NoOpAnimationPlayer.prototype.destroy = function() {};
      NoOpAnimationPlayer.prototype.reset = function() {};
      NoOpAnimationPlayer.prototype.setPosition = function(p) {};
      NoOpAnimationPlayer.prototype.getPosition = function() {
        return 0;
      };
      return NoOpAnimationPlayer;
    }());
    var AnimationDriver = (function() {
      function AnimationDriver() {}
      return AnimationDriver;
    }());
    var NoOpAnimationDriver = (function(_super) {
      __extends(NoOpAnimationDriver, _super);
      function NoOpAnimationDriver() {
        _super.apply(this, arguments);
      }
      NoOpAnimationDriver.prototype.animate = function(element, startingStyles, keyframes, duration, delay, easing) {
        return new NoOpAnimationPlayer();
      };
      return NoOpAnimationDriver;
    }(AnimationDriver));
    var Math$1 = global$1.Math;
    var AnimationGroupPlayer = (function() {
      function AnimationGroupPlayer(_players) {
        var _this = this;
        this._players = _players;
        this._subscriptions = [];
        this._finished = false;
        this.parentPlayer = null;
        var count = 0;
        var total = this._players.length;
        if (total == 0) {
          scheduleMicroTask(function() {
            return _this._onFinish();
          });
        } else {
          this._players.forEach(function(player) {
            player.parentPlayer = _this;
            player.onDone(function() {
              if (++count >= total) {
                _this._onFinish();
              }
            });
          });
        }
      }
      AnimationGroupPlayer.prototype._onFinish = function() {
        if (!this._finished) {
          this._finished = true;
          if (!isPresent(this.parentPlayer)) {
            this.destroy();
          }
          this._subscriptions.forEach(function(subscription) {
            return subscription();
          });
          this._subscriptions = [];
        }
      };
      AnimationGroupPlayer.prototype.onDone = function(fn) {
        this._subscriptions.push(fn);
      };
      AnimationGroupPlayer.prototype.play = function() {
        this._players.forEach(function(player) {
          return player.play();
        });
      };
      AnimationGroupPlayer.prototype.pause = function() {
        this._players.forEach(function(player) {
          return player.pause();
        });
      };
      AnimationGroupPlayer.prototype.restart = function() {
        this._players.forEach(function(player) {
          return player.restart();
        });
      };
      AnimationGroupPlayer.prototype.finish = function() {
        this._onFinish();
        this._players.forEach(function(player) {
          return player.finish();
        });
      };
      AnimationGroupPlayer.prototype.destroy = function() {
        this._onFinish();
        this._players.forEach(function(player) {
          return player.destroy();
        });
      };
      AnimationGroupPlayer.prototype.reset = function() {
        this._players.forEach(function(player) {
          return player.reset();
        });
      };
      AnimationGroupPlayer.prototype.setPosition = function(p) {
        this._players.forEach(function(player) {
          player.setPosition(p);
        });
      };
      AnimationGroupPlayer.prototype.getPosition = function() {
        var min = 0;
        this._players.forEach(function(player) {
          var p = player.getPosition();
          min = Math$1.min(p, min);
        });
        return min;
      };
      return AnimationGroupPlayer;
    }());
    var AnimationKeyframe = (function() {
      function AnimationKeyframe(offset, styles) {
        this.offset = offset;
        this.styles = styles;
      }
      return AnimationKeyframe;
    }());
    var AnimationSequencePlayer = (function() {
      function AnimationSequencePlayer(_players) {
        var _this = this;
        this._players = _players;
        this._currentIndex = 0;
        this._subscriptions = [];
        this._finished = false;
        this.parentPlayer = null;
        this._players.forEach(function(player) {
          player.parentPlayer = _this;
        });
        this._onNext(false);
      }
      AnimationSequencePlayer.prototype._onNext = function(start) {
        var _this = this;
        if (this._finished)
          return;
        if (this._players.length == 0) {
          this._activePlayer = new NoOpAnimationPlayer();
          scheduleMicroTask(function() {
            return _this._onFinish();
          });
        } else if (this._currentIndex >= this._players.length) {
          this._activePlayer = new NoOpAnimationPlayer();
          this._onFinish();
        } else {
          var player = this._players[this._currentIndex++];
          player.onDone(function() {
            return _this._onNext(true);
          });
          this._activePlayer = player;
          if (start) {
            player.play();
          }
        }
      };
      AnimationSequencePlayer.prototype._onFinish = function() {
        if (!this._finished) {
          this._finished = true;
          if (!isPresent(this.parentPlayer)) {
            this.destroy();
          }
          this._subscriptions.forEach(function(subscription) {
            return subscription();
          });
          this._subscriptions = [];
        }
      };
      AnimationSequencePlayer.prototype.onDone = function(fn) {
        this._subscriptions.push(fn);
      };
      AnimationSequencePlayer.prototype.play = function() {
        this._activePlayer.play();
      };
      AnimationSequencePlayer.prototype.pause = function() {
        this._activePlayer.pause();
      };
      AnimationSequencePlayer.prototype.restart = function() {
        if (this._players.length > 0) {
          this.reset();
          this._players[0].restart();
        }
      };
      AnimationSequencePlayer.prototype.reset = function() {
        this._players.forEach(function(player) {
          return player.reset();
        });
      };
      AnimationSequencePlayer.prototype.finish = function() {
        this._onFinish();
        this._players.forEach(function(player) {
          return player.finish();
        });
      };
      AnimationSequencePlayer.prototype.destroy = function() {
        this._onFinish();
        this._players.forEach(function(player) {
          return player.destroy();
        });
      };
      AnimationSequencePlayer.prototype.setPosition = function(p) {
        this._players[0].setPosition(p);
      };
      AnimationSequencePlayer.prototype.getPosition = function() {
        return this._players[0].getPosition();
      };
      return AnimationSequencePlayer;
    }());
    var AUTO_STYLE = '*';
    var AnimationEntryMetadata = (function() {
      function AnimationEntryMetadata(name, definitions) {
        this.name = name;
        this.definitions = definitions;
      }
      return AnimationEntryMetadata;
    }());
    var AnimationStateMetadata = (function() {
      function AnimationStateMetadata() {}
      return AnimationStateMetadata;
    }());
    var AnimationStateDeclarationMetadata = (function(_super) {
      __extends(AnimationStateDeclarationMetadata, _super);
      function AnimationStateDeclarationMetadata(stateNameExpr, styles) {
        _super.call(this);
        this.stateNameExpr = stateNameExpr;
        this.styles = styles;
      }
      return AnimationStateDeclarationMetadata;
    }(AnimationStateMetadata));
    var AnimationStateTransitionMetadata = (function(_super) {
      __extends(AnimationStateTransitionMetadata, _super);
      function AnimationStateTransitionMetadata(stateChangeExpr, steps) {
        _super.call(this);
        this.stateChangeExpr = stateChangeExpr;
        this.steps = steps;
      }
      return AnimationStateTransitionMetadata;
    }(AnimationStateMetadata));
    var AnimationMetadata = (function() {
      function AnimationMetadata() {}
      return AnimationMetadata;
    }());
    var AnimationKeyframesSequenceMetadata = (function(_super) {
      __extends(AnimationKeyframesSequenceMetadata, _super);
      function AnimationKeyframesSequenceMetadata(steps) {
        _super.call(this);
        this.steps = steps;
      }
      return AnimationKeyframesSequenceMetadata;
    }(AnimationMetadata));
    var AnimationStyleMetadata = (function(_super) {
      __extends(AnimationStyleMetadata, _super);
      function AnimationStyleMetadata(styles, offset) {
        if (offset === void 0) {
          offset = null;
        }
        _super.call(this);
        this.styles = styles;
        this.offset = offset;
      }
      return AnimationStyleMetadata;
    }(AnimationMetadata));
    var AnimationAnimateMetadata = (function(_super) {
      __extends(AnimationAnimateMetadata, _super);
      function AnimationAnimateMetadata(timings, styles) {
        _super.call(this);
        this.timings = timings;
        this.styles = styles;
      }
      return AnimationAnimateMetadata;
    }(AnimationMetadata));
    var AnimationWithStepsMetadata = (function(_super) {
      __extends(AnimationWithStepsMetadata, _super);
      function AnimationWithStepsMetadata() {
        _super.call(this);
      }
      Object.defineProperty(AnimationWithStepsMetadata.prototype, "steps", {
        get: function() {
          throw new BaseException('NOT IMPLEMENTED: Base Class');
        },
        enumerable: true,
        configurable: true
      });
      return AnimationWithStepsMetadata;
    }(AnimationMetadata));
    var AnimationSequenceMetadata = (function(_super) {
      __extends(AnimationSequenceMetadata, _super);
      function AnimationSequenceMetadata(_steps) {
        _super.call(this);
        this._steps = _steps;
      }
      Object.defineProperty(AnimationSequenceMetadata.prototype, "steps", {
        get: function() {
          return this._steps;
        },
        enumerable: true,
        configurable: true
      });
      return AnimationSequenceMetadata;
    }(AnimationWithStepsMetadata));
    var AnimationGroupMetadata = (function(_super) {
      __extends(AnimationGroupMetadata, _super);
      function AnimationGroupMetadata(_steps) {
        _super.call(this);
        this._steps = _steps;
      }
      Object.defineProperty(AnimationGroupMetadata.prototype, "steps", {
        get: function() {
          return this._steps;
        },
        enumerable: true,
        configurable: true
      });
      return AnimationGroupMetadata;
    }(AnimationWithStepsMetadata));
    function animate(timing, styles) {
      if (styles === void 0) {
        styles = null;
      }
      var stylesEntry = styles;
      if (!isPresent(stylesEntry)) {
        var EMPTY_STYLE = {};
        stylesEntry = new AnimationStyleMetadata([EMPTY_STYLE], 1);
      }
      return new AnimationAnimateMetadata(timing, stylesEntry);
    }
    function group(steps) {
      return new AnimationGroupMetadata(steps);
    }
    function sequence(steps) {
      return new AnimationSequenceMetadata(steps);
    }
    function style(tokens) {
      var input;
      var offset = null;
      if (isString(tokens)) {
        input = [tokens];
      } else {
        if (isArray(tokens)) {
          input = tokens;
        } else {
          input = [tokens];
        }
        input.forEach(function(entry) {
          var entryOffset = entry['offset'];
          if (isPresent(entryOffset)) {
            offset = offset == null ? NumberWrapper.parseFloat(entryOffset) : offset;
          }
        });
      }
      return new AnimationStyleMetadata(input, offset);
    }
    function state(stateNameExpr, styles) {
      return new AnimationStateDeclarationMetadata(stateNameExpr, styles);
    }
    function keyframes(steps) {
      return new AnimationKeyframesSequenceMetadata(steps);
    }
    function transition(stateChangeExpr, steps) {
      var animationData = isArray(steps) ? new AnimationSequenceMetadata(steps) : steps;
      return new AnimationStateTransitionMetadata(stateChangeExpr, animationData);
    }
    function trigger(name, animation) {
      return new AnimationEntryMetadata(name, animation);
    }
    function prepareFinalAnimationStyles(previousStyles, newStyles, nullValue) {
      if (nullValue === void 0) {
        nullValue = null;
      }
      var finalStyles = {};
      StringMapWrapper.forEach(newStyles, function(value, prop) {
        finalStyles[prop] = value == AUTO_STYLE ? nullValue : value.toString();
      });
      StringMapWrapper.forEach(previousStyles, function(value, prop) {
        if (!isPresent(finalStyles[prop])) {
          finalStyles[prop] = nullValue;
        }
      });
      return finalStyles;
    }
    function balanceAnimationKeyframes(collectedStyles, finalStateStyles, keyframes) {
      var limit = keyframes.length - 1;
      var firstKeyframe = keyframes[0];
      var flatenedFirstKeyframeStyles = flattenStyles(firstKeyframe.styles.styles);
      var extraFirstKeyframeStyles = {};
      var hasExtraFirstStyles = false;
      StringMapWrapper.forEach(collectedStyles, function(value, prop) {
        if (!flatenedFirstKeyframeStyles[prop]) {
          flatenedFirstKeyframeStyles[prop] = value;
          extraFirstKeyframeStyles[prop] = value;
          hasExtraFirstStyles = true;
        }
      });
      var keyframeCollectedStyles = StringMapWrapper.merge({}, flatenedFirstKeyframeStyles);
      var finalKeyframe = keyframes[limit];
      ListWrapper.insert(finalKeyframe.styles.styles, 0, finalStateStyles);
      var flatenedFinalKeyframeStyles = flattenStyles(finalKeyframe.styles.styles);
      var extraFinalKeyframeStyles = {};
      var hasExtraFinalStyles = false;
      StringMapWrapper.forEach(keyframeCollectedStyles, function(value, prop) {
        if (!isPresent(flatenedFinalKeyframeStyles[prop])) {
          extraFinalKeyframeStyles[prop] = AUTO_STYLE;
          hasExtraFinalStyles = true;
        }
      });
      if (hasExtraFinalStyles) {
        finalKeyframe.styles.styles.push(extraFinalKeyframeStyles);
      }
      StringMapWrapper.forEach(flatenedFinalKeyframeStyles, function(value, prop) {
        if (!isPresent(flatenedFirstKeyframeStyles[prop])) {
          extraFirstKeyframeStyles[prop] = AUTO_STYLE;
          hasExtraFirstStyles = true;
        }
      });
      if (hasExtraFirstStyles) {
        firstKeyframe.styles.styles.push(extraFirstKeyframeStyles);
      }
      return keyframes;
    }
    function clearStyles(styles) {
      var finalStyles = {};
      StringMapWrapper.keys(styles).forEach(function(key) {
        finalStyles[key] = null;
      });
      return finalStyles;
    }
    function collectAndResolveStyles(collection, styles) {
      return styles.map(function(entry) {
        var stylesObj = {};
        StringMapWrapper.forEach(entry, function(value, prop) {
          if (value == FILL_STYLE_FLAG) {
            value = collection[prop];
            if (!isPresent(value)) {
              value = AUTO_STYLE;
            }
          }
          collection[prop] = value;
          stylesObj[prop] = value;
        });
        return stylesObj;
      });
    }
    function renderStyles(element, renderer, styles) {
      StringMapWrapper.forEach(styles, function(value, prop) {
        renderer.setElementStyle(element, prop, value);
      });
    }
    function flattenStyles(styles) {
      var finalStyles = {};
      styles.forEach(function(entry) {
        StringMapWrapper.forEach(entry, function(value, prop) {
          finalStyles[prop] = value;
        });
      });
      return finalStyles;
    }
    var AnimationStyles = (function() {
      function AnimationStyles(styles) {
        this.styles = styles;
      }
      return AnimationStyles;
    }());
    var DebugDomRootRenderer = (function() {
      function DebugDomRootRenderer(_delegate) {
        this._delegate = _delegate;
      }
      DebugDomRootRenderer.prototype.renderComponent = function(componentProto) {
        return new DebugDomRenderer(this._delegate.renderComponent(componentProto));
      };
      return DebugDomRootRenderer;
    }());
    var DebugDomRenderer = (function() {
      function DebugDomRenderer(_delegate) {
        this._delegate = _delegate;
      }
      DebugDomRenderer.prototype.selectRootElement = function(selectorOrNode, debugInfo) {
        var nativeEl = this._delegate.selectRootElement(selectorOrNode, debugInfo);
        var debugEl = new DebugElement(nativeEl, null, debugInfo);
        indexDebugNode(debugEl);
        return nativeEl;
      };
      DebugDomRenderer.prototype.createElement = function(parentElement, name, debugInfo) {
        var nativeEl = this._delegate.createElement(parentElement, name, debugInfo);
        var debugEl = new DebugElement(nativeEl, getDebugNode(parentElement), debugInfo);
        debugEl.name = name;
        indexDebugNode(debugEl);
        return nativeEl;
      };
      DebugDomRenderer.prototype.createViewRoot = function(hostElement) {
        return this._delegate.createViewRoot(hostElement);
      };
      DebugDomRenderer.prototype.createTemplateAnchor = function(parentElement, debugInfo) {
        var comment = this._delegate.createTemplateAnchor(parentElement, debugInfo);
        var debugEl = new DebugNode(comment, getDebugNode(parentElement), debugInfo);
        indexDebugNode(debugEl);
        return comment;
      };
      DebugDomRenderer.prototype.createText = function(parentElement, value, debugInfo) {
        var text = this._delegate.createText(parentElement, value, debugInfo);
        var debugEl = new DebugNode(text, getDebugNode(parentElement), debugInfo);
        indexDebugNode(debugEl);
        return text;
      };
      DebugDomRenderer.prototype.projectNodes = function(parentElement, nodes) {
        var debugParent = getDebugNode(parentElement);
        if (isPresent(debugParent) && debugParent instanceof DebugElement) {
          var debugElement_1 = debugParent;
          nodes.forEach(function(node) {
            debugElement_1.addChild(getDebugNode(node));
          });
        }
        this._delegate.projectNodes(parentElement, nodes);
      };
      DebugDomRenderer.prototype.attachViewAfter = function(node, viewRootNodes) {
        var debugNode = getDebugNode(node);
        if (isPresent(debugNode)) {
          var debugParent = debugNode.parent;
          if (viewRootNodes.length > 0 && isPresent(debugParent)) {
            var debugViewRootNodes = [];
            viewRootNodes.forEach(function(rootNode) {
              return debugViewRootNodes.push(getDebugNode(rootNode));
            });
            debugParent.insertChildrenAfter(debugNode, debugViewRootNodes);
          }
        }
        this._delegate.attachViewAfter(node, viewRootNodes);
      };
      DebugDomRenderer.prototype.detachView = function(viewRootNodes) {
        viewRootNodes.forEach(function(node) {
          var debugNode = getDebugNode(node);
          if (isPresent(debugNode) && isPresent(debugNode.parent)) {
            debugNode.parent.removeChild(debugNode);
          }
        });
        this._delegate.detachView(viewRootNodes);
      };
      DebugDomRenderer.prototype.destroyView = function(hostElement, viewAllNodes) {
        viewAllNodes.forEach(function(node) {
          removeDebugNodeFromIndex(getDebugNode(node));
        });
        this._delegate.destroyView(hostElement, viewAllNodes);
      };
      DebugDomRenderer.prototype.listen = function(renderElement, name, callback) {
        var debugEl = getDebugNode(renderElement);
        if (isPresent(debugEl)) {
          debugEl.listeners.push(new EventListener(name, callback));
        }
        return this._delegate.listen(renderElement, name, callback);
      };
      DebugDomRenderer.prototype.listenGlobal = function(target, name, callback) {
        return this._delegate.listenGlobal(target, name, callback);
      };
      DebugDomRenderer.prototype.setElementProperty = function(renderElement, propertyName, propertyValue) {
        var debugEl = getDebugNode(renderElement);
        if (isPresent(debugEl) && debugEl instanceof DebugElement) {
          debugEl.properties[propertyName] = propertyValue;
        }
        this._delegate.setElementProperty(renderElement, propertyName, propertyValue);
      };
      DebugDomRenderer.prototype.setElementAttribute = function(renderElement, attributeName, attributeValue) {
        var debugEl = getDebugNode(renderElement);
        if (isPresent(debugEl) && debugEl instanceof DebugElement) {
          debugEl.attributes[attributeName] = attributeValue;
        }
        this._delegate.setElementAttribute(renderElement, attributeName, attributeValue);
      };
      DebugDomRenderer.prototype.setBindingDebugInfo = function(renderElement, propertyName, propertyValue) {
        this._delegate.setBindingDebugInfo(renderElement, propertyName, propertyValue);
      };
      DebugDomRenderer.prototype.setElementClass = function(renderElement, className, isAdd) {
        var debugEl = getDebugNode(renderElement);
        if (isPresent(debugEl) && debugEl instanceof DebugElement) {
          debugEl.classes[className] = isAdd;
        }
        this._delegate.setElementClass(renderElement, className, isAdd);
      };
      DebugDomRenderer.prototype.setElementStyle = function(renderElement, styleName, styleValue) {
        var debugEl = getDebugNode(renderElement);
        if (isPresent(debugEl) && debugEl instanceof DebugElement) {
          debugEl.styles[styleName] = styleValue;
        }
        this._delegate.setElementStyle(renderElement, styleName, styleValue);
      };
      DebugDomRenderer.prototype.invokeElementMethod = function(renderElement, methodName, args) {
        this._delegate.invokeElementMethod(renderElement, methodName, args);
      };
      DebugDomRenderer.prototype.setText = function(renderNode, text) {
        this._delegate.setText(renderNode, text);
      };
      DebugDomRenderer.prototype.animate = function(element, startingStyles, keyframes, duration, delay, easing) {
        return this._delegate.animate(element, startingStyles, keyframes, duration, delay, easing);
      };
      return DebugDomRenderer;
    }());
    var StaticNodeDebugInfo = (function() {
      function StaticNodeDebugInfo(providerTokens, componentToken, refTokens) {
        this.providerTokens = providerTokens;
        this.componentToken = componentToken;
        this.refTokens = refTokens;
      }
      return StaticNodeDebugInfo;
    }());
    var DebugContext = (function() {
      function DebugContext(_view, _nodeIndex, _tplRow, _tplCol) {
        this._view = _view;
        this._nodeIndex = _nodeIndex;
        this._tplRow = _tplRow;
        this._tplCol = _tplCol;
      }
      Object.defineProperty(DebugContext.prototype, "_staticNodeInfo", {
        get: function() {
          return isPresent(this._nodeIndex) ? this._view.staticNodeDebugInfos[this._nodeIndex] : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugContext.prototype, "context", {
        get: function() {
          return this._view.context;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugContext.prototype, "component", {
        get: function() {
          var staticNodeInfo = this._staticNodeInfo;
          if (isPresent(staticNodeInfo) && isPresent(staticNodeInfo.componentToken)) {
            return this.injector.get(staticNodeInfo.componentToken);
          }
          return null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugContext.prototype, "componentRenderElement", {
        get: function() {
          var componentView = this._view;
          while (isPresent(componentView.declarationAppElement) && componentView.type !== ViewType.COMPONENT) {
            componentView = componentView.declarationAppElement.parentView;
          }
          return isPresent(componentView.declarationAppElement) ? componentView.declarationAppElement.nativeElement : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugContext.prototype, "injector", {
        get: function() {
          return this._view.injector(this._nodeIndex);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugContext.prototype, "renderNode", {
        get: function() {
          if (isPresent(this._nodeIndex) && isPresent(this._view.allNodes)) {
            return this._view.allNodes[this._nodeIndex];
          } else {
            return null;
          }
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugContext.prototype, "providerTokens", {
        get: function() {
          var staticNodeInfo = this._staticNodeInfo;
          return isPresent(staticNodeInfo) ? staticNodeInfo.providerTokens : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugContext.prototype, "source", {
        get: function() {
          return this._view.componentType.templateUrl + ":" + this._tplRow + ":" + this._tplCol;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugContext.prototype, "references", {
        get: function() {
          var _this = this;
          var varValues = {};
          var staticNodeInfo = this._staticNodeInfo;
          if (isPresent(staticNodeInfo)) {
            var refs = staticNodeInfo.refTokens;
            StringMapWrapper.forEach(refs, function(refToken, refName) {
              var varValue;
              if (isBlank(refToken)) {
                varValue = isPresent(_this._view.allNodes) ? _this._view.allNodes[_this._nodeIndex] : null;
              } else {
                varValue = _this._view.injectorGet(refToken, _this._nodeIndex, null);
              }
              varValues[refName] = varValue;
            });
          }
          return varValues;
        },
        enumerable: true,
        configurable: true
      });
      return DebugContext;
    }());
    var _UNDEFINED = new Object();
    var ElementInjector = (function(_super) {
      __extends(ElementInjector, _super);
      function ElementInjector(_view, _nodeIndex) {
        _super.call(this);
        this._view = _view;
        this._nodeIndex = _nodeIndex;
      }
      ElementInjector.prototype.get = function(token, notFoundValue) {
        if (notFoundValue === void 0) {
          notFoundValue = THROW_IF_NOT_FOUND;
        }
        var result = _UNDEFINED;
        if (result === _UNDEFINED) {
          result = this._view.injectorGet(token, this._nodeIndex, _UNDEFINED);
        }
        if (result === _UNDEFINED) {
          result = this._view.parentInjector.get(token, notFoundValue);
        }
        return result;
      };
      return ElementInjector;
    }(Injector));
    var ActiveAnimationPlayersMap = (function() {
      function ActiveAnimationPlayersMap() {
        this._map = new Map$1();
        this._allPlayers = [];
      }
      Object.defineProperty(ActiveAnimationPlayersMap.prototype, "length", {
        get: function() {
          return this.getAllPlayers().length;
        },
        enumerable: true,
        configurable: true
      });
      ActiveAnimationPlayersMap.prototype.find = function(element, animationName) {
        var playersByAnimation = this._map.get(element);
        if (isPresent(playersByAnimation)) {
          return playersByAnimation[animationName];
        }
      };
      ActiveAnimationPlayersMap.prototype.findAllPlayersByElement = function(element) {
        var players = [];
        StringMapWrapper.forEach(this._map.get(element), function(player) {
          return players.push(player);
        });
        return players;
      };
      ActiveAnimationPlayersMap.prototype.set = function(element, animationName, player) {
        var playersByAnimation = this._map.get(element);
        if (!isPresent(playersByAnimation)) {
          playersByAnimation = {};
        }
        var existingEntry = playersByAnimation[animationName];
        if (isPresent(existingEntry)) {
          this.remove(element, animationName);
        }
        playersByAnimation[animationName] = player;
        this._allPlayers.push(player);
        this._map.set(element, playersByAnimation);
      };
      ActiveAnimationPlayersMap.prototype.getAllPlayers = function() {
        return this._allPlayers;
      };
      ActiveAnimationPlayersMap.prototype.remove = function(element, animationName) {
        var playersByAnimation = this._map.get(element);
        if (isPresent(playersByAnimation)) {
          var player = playersByAnimation[animationName];
          delete playersByAnimation[animationName];
          var index = this._allPlayers.indexOf(player);
          ListWrapper.removeAt(this._allPlayers, index);
          if (StringMapWrapper.isEmpty(playersByAnimation)) {
            this._map.delete(element);
          }
        }
      };
      return ActiveAnimationPlayersMap;
    }());
    var _scope_check = wtfCreateScope("AppView#check(ascii id)");
    var AppView = (function() {
      function AppView(clazz, componentType, type, viewUtils, parentInjector, declarationAppElement, cdMode) {
        this.clazz = clazz;
        this.componentType = componentType;
        this.type = type;
        this.viewUtils = viewUtils;
        this.parentInjector = parentInjector;
        this.declarationAppElement = declarationAppElement;
        this.cdMode = cdMode;
        this.contentChildren = [];
        this.viewChildren = [];
        this.viewContainerElement = null;
        this.numberOfChecks = 0;
        this.activeAnimationPlayers = new ActiveAnimationPlayersMap();
        this.ref = new ViewRef_(this);
        if (type === ViewType.COMPONENT || type === ViewType.HOST) {
          this.renderer = viewUtils.renderComponent(componentType);
        } else {
          this.renderer = declarationAppElement.parentView.renderer;
        }
      }
      Object.defineProperty(AppView.prototype, "destroyed", {
        get: function() {
          return this.cdMode === ChangeDetectorStatus.Destroyed;
        },
        enumerable: true,
        configurable: true
      });
      AppView.prototype.cancelActiveAnimation = function(element, animationName, removeAllAnimations) {
        if (removeAllAnimations === void 0) {
          removeAllAnimations = false;
        }
        if (removeAllAnimations) {
          this.activeAnimationPlayers.findAllPlayersByElement(element).forEach(function(player) {
            return player.destroy();
          });
        } else {
          var player = this.activeAnimationPlayers.find(element, animationName);
          if (isPresent(player)) {
            player.destroy();
          }
        }
      };
      AppView.prototype.registerAndStartAnimation = function(element, animationName, player) {
        var _this = this;
        this.activeAnimationPlayers.set(element, animationName, player);
        player.onDone(function() {
          _this.activeAnimationPlayers.remove(element, animationName);
        });
        player.play();
      };
      AppView.prototype.create = function(context, givenProjectableNodes, rootSelectorOrNode) {
        this.context = context;
        var projectableNodes;
        switch (this.type) {
          case ViewType.COMPONENT:
            projectableNodes = ensureSlotCount(givenProjectableNodes, this.componentType.slotCount);
            break;
          case ViewType.EMBEDDED:
            projectableNodes = this.declarationAppElement.parentView.projectableNodes;
            break;
          case ViewType.HOST:
            projectableNodes = givenProjectableNodes;
            break;
        }
        this._hasExternalHostElement = isPresent(rootSelectorOrNode);
        this.projectableNodes = projectableNodes;
        return this.createInternal(rootSelectorOrNode);
      };
      AppView.prototype.createInternal = function(rootSelectorOrNode) {
        return null;
      };
      AppView.prototype.init = function(rootNodesOrAppElements, allNodes, disposables, subscriptions) {
        this.rootNodesOrAppElements = rootNodesOrAppElements;
        this.allNodes = allNodes;
        this.disposables = disposables;
        this.subscriptions = subscriptions;
        if (this.type === ViewType.COMPONENT) {
          this.declarationAppElement.parentView.viewChildren.push(this);
          this.dirtyParentQueriesInternal();
        }
      };
      AppView.prototype.selectOrCreateHostElement = function(elementName, rootSelectorOrNode, debugInfo) {
        var hostElement;
        if (isPresent(rootSelectorOrNode)) {
          hostElement = this.renderer.selectRootElement(rootSelectorOrNode, debugInfo);
        } else {
          hostElement = this.renderer.createElement(null, elementName, debugInfo);
        }
        return hostElement;
      };
      AppView.prototype.injectorGet = function(token, nodeIndex, notFoundResult) {
        return this.injectorGetInternal(token, nodeIndex, notFoundResult);
      };
      AppView.prototype.injectorGetInternal = function(token, nodeIndex, notFoundResult) {
        return notFoundResult;
      };
      AppView.prototype.injector = function(nodeIndex) {
        if (isPresent(nodeIndex)) {
          return new ElementInjector(this, nodeIndex);
        } else {
          return this.parentInjector;
        }
      };
      AppView.prototype.destroy = function() {
        if (this._hasExternalHostElement) {
          this.renderer.detachView(this.flatRootNodes);
        } else if (isPresent(this.viewContainerElement)) {
          this.viewContainerElement.detachView(this.viewContainerElement.nestedViews.indexOf(this));
        }
        this._destroyRecurse();
      };
      AppView.prototype._destroyRecurse = function() {
        if (this.cdMode === ChangeDetectorStatus.Destroyed) {
          return;
        }
        var children = this.contentChildren;
        for (var i = 0; i < children.length; i++) {
          children[i]._destroyRecurse();
        }
        children = this.viewChildren;
        for (var i = 0; i < children.length; i++) {
          children[i]._destroyRecurse();
        }
        this.destroyLocal();
        this.cdMode = ChangeDetectorStatus.Destroyed;
      };
      AppView.prototype.destroyLocal = function() {
        var _this = this;
        var hostElement = this.type === ViewType.COMPONENT ? this.declarationAppElement.nativeElement : null;
        for (var i = 0; i < this.disposables.length; i++) {
          this.disposables[i]();
        }
        for (var i = 0; i < this.subscriptions.length; i++) {
          ObservableWrapper.dispose(this.subscriptions[i]);
        }
        this.destroyInternal();
        this.dirtyParentQueriesInternal();
        if (this.activeAnimationPlayers.length == 0) {
          this.renderer.destroyView(hostElement, this.allNodes);
        } else {
          var player = new AnimationGroupPlayer(this.activeAnimationPlayers.getAllPlayers());
          player.onDone(function() {
            _this.renderer.destroyView(hostElement, _this.allNodes);
          });
        }
      };
      AppView.prototype.destroyInternal = function() {};
      AppView.prototype.detachInternal = function() {};
      AppView.prototype.detach = function() {
        var _this = this;
        this.detachInternal();
        if (this.activeAnimationPlayers.length == 0) {
          this.renderer.detachView(this.flatRootNodes);
        } else {
          var player = new AnimationGroupPlayer(this.activeAnimationPlayers.getAllPlayers());
          player.onDone(function() {
            _this.renderer.detachView(_this.flatRootNodes);
          });
        }
      };
      Object.defineProperty(AppView.prototype, "changeDetectorRef", {
        get: function() {
          return this.ref;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AppView.prototype, "parent", {
        get: function() {
          return isPresent(this.declarationAppElement) ? this.declarationAppElement.parentView : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AppView.prototype, "flatRootNodes", {
        get: function() {
          return flattenNestedViewRenderNodes(this.rootNodesOrAppElements);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AppView.prototype, "lastRootNode", {
        get: function() {
          var lastNode = this.rootNodesOrAppElements.length > 0 ? this.rootNodesOrAppElements[this.rootNodesOrAppElements.length - 1] : null;
          return _findLastRenderNode(lastNode);
        },
        enumerable: true,
        configurable: true
      });
      AppView.prototype.dirtyParentQueriesInternal = function() {};
      AppView.prototype.detectChanges = function(throwOnChange) {
        var s = _scope_check(this.clazz);
        if (this.cdMode === ChangeDetectorStatus.Checked || this.cdMode === ChangeDetectorStatus.Errored)
          return;
        if (this.cdMode === ChangeDetectorStatus.Destroyed) {
          this.throwDestroyedError('detectChanges');
        }
        this.detectChangesInternal(throwOnChange);
        if (this.cdMode === ChangeDetectorStatus.CheckOnce)
          this.cdMode = ChangeDetectorStatus.Checked;
        this.numberOfChecks++;
        wtfLeave(s);
      };
      AppView.prototype.detectChangesInternal = function(throwOnChange) {
        this.detectContentChildrenChanges(throwOnChange);
        this.detectViewChildrenChanges(throwOnChange);
      };
      AppView.prototype.detectContentChildrenChanges = function(throwOnChange) {
        for (var i = 0; i < this.contentChildren.length; ++i) {
          var child = this.contentChildren[i];
          if (child.cdMode === ChangeDetectorStatus.Detached)
            continue;
          child.detectChanges(throwOnChange);
        }
      };
      AppView.prototype.detectViewChildrenChanges = function(throwOnChange) {
        for (var i = 0; i < this.viewChildren.length; ++i) {
          var child = this.viewChildren[i];
          if (child.cdMode === ChangeDetectorStatus.Detached)
            continue;
          child.detectChanges(throwOnChange);
        }
      };
      AppView.prototype.addToContentChildren = function(renderAppElement) {
        renderAppElement.parentView.contentChildren.push(this);
        this.viewContainerElement = renderAppElement;
        this.dirtyParentQueriesInternal();
      };
      AppView.prototype.removeFromContentChildren = function(renderAppElement) {
        ListWrapper.remove(renderAppElement.parentView.contentChildren, this);
        this.dirtyParentQueriesInternal();
        this.viewContainerElement = null;
      };
      AppView.prototype.markAsCheckOnce = function() {
        this.cdMode = ChangeDetectorStatus.CheckOnce;
      };
      AppView.prototype.markPathToRootAsCheckOnce = function() {
        var c = this;
        while (isPresent(c) && c.cdMode !== ChangeDetectorStatus.Detached) {
          if (c.cdMode === ChangeDetectorStatus.Checked) {
            c.cdMode = ChangeDetectorStatus.CheckOnce;
          }
          var parentEl = c.type === ViewType.COMPONENT ? c.declarationAppElement : c.viewContainerElement;
          c = isPresent(parentEl) ? parentEl.parentView : null;
        }
      };
      AppView.prototype.eventHandler = function(cb) {
        return cb;
      };
      AppView.prototype.throwDestroyedError = function(details) {
        throw new ViewDestroyedException(details);
      };
      return AppView;
    }());
    var DebugAppView = (function(_super) {
      __extends(DebugAppView, _super);
      function DebugAppView(clazz, componentType, type, viewUtils, parentInjector, declarationAppElement, cdMode, staticNodeDebugInfos) {
        _super.call(this, clazz, componentType, type, viewUtils, parentInjector, declarationAppElement, cdMode);
        this.staticNodeDebugInfos = staticNodeDebugInfos;
        this._currentDebugContext = null;
      }
      DebugAppView.prototype.create = function(context, givenProjectableNodes, rootSelectorOrNode) {
        this._resetDebug();
        try {
          return _super.prototype.create.call(this, context, givenProjectableNodes, rootSelectorOrNode);
        } catch (e) {
          this._rethrowWithContext(e, e.stack);
          throw e;
        }
      };
      DebugAppView.prototype.injectorGet = function(token, nodeIndex, notFoundResult) {
        this._resetDebug();
        try {
          return _super.prototype.injectorGet.call(this, token, nodeIndex, notFoundResult);
        } catch (e) {
          this._rethrowWithContext(e, e.stack);
          throw e;
        }
      };
      DebugAppView.prototype.detach = function() {
        this._resetDebug();
        try {
          _super.prototype.detach.call(this);
        } catch (e) {
          this._rethrowWithContext(e, e.stack);
          throw e;
        }
      };
      DebugAppView.prototype.destroyLocal = function() {
        this._resetDebug();
        try {
          _super.prototype.destroyLocal.call(this);
        } catch (e) {
          this._rethrowWithContext(e, e.stack);
          throw e;
        }
      };
      DebugAppView.prototype.detectChanges = function(throwOnChange) {
        this._resetDebug();
        try {
          _super.prototype.detectChanges.call(this, throwOnChange);
        } catch (e) {
          this._rethrowWithContext(e, e.stack);
          throw e;
        }
      };
      DebugAppView.prototype._resetDebug = function() {
        this._currentDebugContext = null;
      };
      DebugAppView.prototype.debug = function(nodeIndex, rowNum, colNum) {
        return this._currentDebugContext = new DebugContext(this, nodeIndex, rowNum, colNum);
      };
      DebugAppView.prototype._rethrowWithContext = function(e, stack) {
        if (!(e instanceof ViewWrappedException)) {
          if (!(e instanceof ExpressionChangedAfterItHasBeenCheckedException)) {
            this.cdMode = ChangeDetectorStatus.Errored;
          }
          if (isPresent(this._currentDebugContext)) {
            throw new ViewWrappedException(e, stack, this._currentDebugContext);
          }
        }
      };
      DebugAppView.prototype.eventHandler = function(cb) {
        var _this = this;
        var superHandler = _super.prototype.eventHandler.call(this, cb);
        return function(event) {
          _this._resetDebug();
          try {
            return superHandler(event);
          } catch (e) {
            _this._rethrowWithContext(e, e.stack);
            throw e;
          }
        };
      };
      return DebugAppView;
    }(AppView));
    function _findLastRenderNode(node) {
      var lastNode;
      if (node instanceof AppElement) {
        var appEl = node;
        lastNode = appEl.nativeElement;
        if (isPresent(appEl.nestedViews)) {
          for (var i = appEl.nestedViews.length - 1; i >= 0; i--) {
            var nestedView = appEl.nestedViews[i];
            if (nestedView.rootNodesOrAppElements.length > 0) {
              lastNode = _findLastRenderNode(nestedView.rootNodesOrAppElements[nestedView.rootNodesOrAppElements.length - 1]);
            }
          }
        }
      } else {
        lastNode = node;
      }
      return lastNode;
    }
    function wtfInit() {}
    var __core_private__ = {
      isDefaultChangeDetectionStrategy: isDefaultChangeDetectionStrategy,
      ChangeDetectorStatus: ChangeDetectorStatus,
      CHANGE_DETECTION_STRATEGY_VALUES: CHANGE_DETECTION_STRATEGY_VALUES,
      constructDependencies: constructDependencies,
      LifecycleHooks: LifecycleHooks,
      LIFECYCLE_HOOKS_VALUES: LIFECYCLE_HOOKS_VALUES,
      ReflectorReader: ReflectorReader,
      ReflectorComponentResolver: ReflectorComponentResolver,
      CodegenComponentFactoryResolver: CodegenComponentFactoryResolver,
      AppElement: AppElement,
      AppView: AppView,
      DebugAppView: DebugAppView,
      ViewType: ViewType,
      MAX_INTERPOLATION_VALUES: MAX_INTERPOLATION_VALUES,
      checkBinding: checkBinding,
      flattenNestedViewRenderNodes: flattenNestedViewRenderNodes,
      interpolate: interpolate,
      ViewUtils: ViewUtils,
      VIEW_ENCAPSULATION_VALUES: VIEW_ENCAPSULATION_VALUES,
      DebugContext: DebugContext,
      StaticNodeDebugInfo: StaticNodeDebugInfo,
      devModeEqual: devModeEqual,
      uninitialized: uninitialized,
      ValueUnwrapper: ValueUnwrapper,
      RenderDebugInfo: RenderDebugInfo,
      SecurityContext: SecurityContext,
      SanitizationService: SanitizationService,
      TemplateRef_: TemplateRef_,
      wtfInit: wtfInit,
      ReflectionCapabilities: ReflectionCapabilities,
      makeDecorator: makeDecorator,
      DebugDomRootRenderer: DebugDomRootRenderer,
      createProvider: createProvider,
      isProviderLiteral: isProviderLiteral,
      EMPTY_ARRAY: EMPTY_ARRAY,
      EMPTY_MAP: EMPTY_MAP,
      pureProxy1: pureProxy1,
      pureProxy2: pureProxy2,
      pureProxy3: pureProxy3,
      pureProxy4: pureProxy4,
      pureProxy5: pureProxy5,
      pureProxy6: pureProxy6,
      pureProxy7: pureProxy7,
      pureProxy8: pureProxy8,
      pureProxy9: pureProxy9,
      pureProxy10: pureProxy10,
      castByValue: castByValue,
      Console: Console,
      reflector: reflector,
      Reflector: Reflector,
      NoOpAnimationPlayer: NoOpAnimationPlayer,
      AnimationPlayer: AnimationPlayer,
      NoOpAnimationDriver: NoOpAnimationDriver,
      AnimationDriver: AnimationDriver,
      AnimationSequencePlayer: AnimationSequencePlayer,
      AnimationGroupPlayer: AnimationGroupPlayer,
      AnimationKeyframe: AnimationKeyframe,
      prepareFinalAnimationStyles: prepareFinalAnimationStyles,
      balanceAnimationKeyframes: balanceAnimationKeyframes,
      flattenStyles: flattenStyles,
      clearStyles: clearStyles,
      renderStyles: renderStyles,
      collectAndResolveStyles: collectAndResolveStyles,
      AnimationStyles: AnimationStyles,
      ANY_STATE: ANY_STATE,
      DEFAULT_STATE: DEFAULT_STATE,
      EMPTY_STATE: EMPTY_STATE,
      FILL_STYLE_FLAG: FILL_STYLE_FLAG
    };
    exports.createPlatform = createPlatform;
    exports.assertPlatform = assertPlatform;
    exports.disposePlatform = disposePlatform;
    exports.getPlatform = getPlatform;
    exports.coreBootstrap = coreBootstrap;
    exports.coreLoadAndBootstrap = coreLoadAndBootstrap;
    exports.createNgZone = createNgZone;
    exports.PlatformRef = PlatformRef;
    exports.ApplicationRef = ApplicationRef;
    exports.enableProdMode = enableProdMode;
    exports.lockRunMode = lockRunMode;
    exports.isDevMode = isDevMode;
    exports.APP_ID = APP_ID;
    exports.APP_INITIALIZER = APP_INITIALIZER;
    exports.PACKAGE_ROOT_URL = PACKAGE_ROOT_URL;
    exports.PLATFORM_INITIALIZER = PLATFORM_INITIALIZER;
    exports.DebugElement = DebugElement;
    exports.DebugNode = DebugNode;
    exports.asNativeElements = asNativeElements;
    exports.getDebugNode = getDebugNode;
    exports.wtfCreateScope = wtfCreateScope;
    exports.wtfLeave = wtfLeave;
    exports.wtfStartTimeRange = wtfStartTimeRange;
    exports.wtfEndTimeRange = wtfEndTimeRange;
    exports.Type = Type;
    exports.EventEmitter = EventEmitter;
    exports.ExceptionHandler = ExceptionHandler;
    exports.WrappedException = WrappedException;
    exports.BaseException = BaseException;
    exports.AnimationPlayer = AnimationPlayer;
    exports.Component = Component;
    exports.Directive = Directive;
    exports.Attribute = Attribute;
    exports.Query = Query;
    exports.ContentChildren = ContentChildren;
    exports.ContentChild = ContentChild;
    exports.ViewChildren = ViewChildren;
    exports.ViewChild = ViewChild;
    exports.ViewQuery = ViewQuery;
    exports.Pipe = Pipe;
    exports.Input = Input;
    exports.Output = Output;
    exports.HostBinding = HostBinding;
    exports.HostListener = HostListener;
    exports.AttributeMetadata = AttributeMetadata;
    exports.ContentChildMetadata = ContentChildMetadata;
    exports.ContentChildrenMetadata = ContentChildrenMetadata;
    exports.QueryMetadata = QueryMetadata;
    exports.ViewChildMetadata = ViewChildMetadata;
    exports.ViewChildrenMetadata = ViewChildrenMetadata;
    exports.ViewQueryMetadata = ViewQueryMetadata;
    exports.ComponentMetadata = ComponentMetadata;
    exports.DirectiveMetadata = DirectiveMetadata;
    exports.HostBindingMetadata = HostBindingMetadata;
    exports.HostListenerMetadata = HostListenerMetadata;
    exports.InputMetadata = InputMetadata;
    exports.OutputMetadata = OutputMetadata;
    exports.PipeMetadata = PipeMetadata;
    exports.AfterContentChecked = AfterContentChecked;
    exports.AfterContentInit = AfterContentInit;
    exports.AfterViewChecked = AfterViewChecked;
    exports.AfterViewInit = AfterViewInit;
    exports.DoCheck = DoCheck;
    exports.OnChanges = OnChanges;
    exports.OnDestroy = OnDestroy;
    exports.OnInit = OnInit;
    exports.ViewMetadata = ViewMetadata;
    exports.Class = Class;
    exports.HostMetadata = HostMetadata;
    exports.InjectMetadata = InjectMetadata;
    exports.InjectableMetadata = InjectableMetadata;
    exports.OptionalMetadata = OptionalMetadata;
    exports.SelfMetadata = SelfMetadata;
    exports.SkipSelfMetadata = SkipSelfMetadata;
    exports.forwardRef = forwardRef;
    exports.resolveForwardRef = resolveForwardRef;
    exports.Injector = Injector;
    exports.ReflectiveInjector = ReflectiveInjector;
    exports.Binding = Binding;
    exports.ProviderBuilder = ProviderBuilder;
    exports.bind = bind;
    exports.Provider = Provider;
    exports.provide = provide;
    exports.ResolvedReflectiveFactory = ResolvedReflectiveFactory;
    exports.ReflectiveKey = ReflectiveKey;
    exports.NoProviderError = NoProviderError;
    exports.AbstractProviderError = AbstractProviderError;
    exports.CyclicDependencyError = CyclicDependencyError;
    exports.InstantiationError = InstantiationError;
    exports.InvalidProviderError = InvalidProviderError;
    exports.NoAnnotationError = NoAnnotationError;
    exports.OutOfBoundsError = OutOfBoundsError;
    exports.OpaqueToken = OpaqueToken;
    exports.Inject = Inject;
    exports.Optional = Optional;
    exports.Injectable = Injectable;
    exports.Self = Self;
    exports.Host = Host;
    exports.SkipSelf = SkipSelf;
    exports.NgZone = NgZone;
    exports.NgZoneError = NgZoneError;
    exports.RenderComponentType = RenderComponentType;
    exports.Renderer = Renderer;
    exports.RootRenderer = RootRenderer;
    exports.Compiler = Compiler;
    exports.ComponentFactory = ComponentFactory;
    exports.ComponentRef = ComponentRef;
    exports.ComponentFactoryResolver = ComponentFactoryResolver;
    exports.NoComponentFactoryError = NoComponentFactoryError;
    exports.ComponentResolver = ComponentResolver;
    exports.DynamicComponentLoader = DynamicComponentLoader;
    exports.ElementRef = ElementRef;
    exports.ExpressionChangedAfterItHasBeenCheckedException = ExpressionChangedAfterItHasBeenCheckedException;
    exports.QueryList = QueryList;
    exports.SystemJsCmpFactoryResolver = SystemJsCmpFactoryResolver;
    exports.SystemJsComponentResolver = SystemJsComponentResolver;
    exports.TemplateRef = TemplateRef;
    exports.ViewContainerRef = ViewContainerRef;
    exports.EmbeddedViewRef = EmbeddedViewRef;
    exports.ViewRef = ViewRef;
    exports.Testability = Testability;
    exports.TestabilityRegistry = TestabilityRegistry;
    exports.setTestabilityGetter = setTestabilityGetter;
    exports.ChangeDetectorRef = ChangeDetectorRef;
    exports.CollectionChangeRecord = CollectionChangeRecord;
    exports.DefaultIterableDiffer = DefaultIterableDiffer;
    exports.IterableDiffers = IterableDiffers;
    exports.KeyValueChangeRecord = KeyValueChangeRecord;
    exports.KeyValueDiffers = KeyValueDiffers;
    exports.SimpleChange = SimpleChange;
    exports.WrappedValue = WrappedValue;
    exports.PLATFORM_DIRECTIVES = PLATFORM_DIRECTIVES;
    exports.PLATFORM_PIPES = PLATFORM_PIPES;
    exports.PLATFORM_COMMON_PROVIDERS = PLATFORM_COMMON_PROVIDERS;
    exports.APPLICATION_COMMON_PROVIDERS = APPLICATION_COMMON_PROVIDERS;
    exports.__core_private__ = __core_private__;
    exports.AUTO_STYLE = AUTO_STYLE;
    exports.AnimationEntryMetadata = AnimationEntryMetadata;
    exports.AnimationStateMetadata = AnimationStateMetadata;
    exports.AnimationStateDeclarationMetadata = AnimationStateDeclarationMetadata;
    exports.AnimationStateTransitionMetadata = AnimationStateTransitionMetadata;
    exports.AnimationMetadata = AnimationMetadata;
    exports.AnimationKeyframesSequenceMetadata = AnimationKeyframesSequenceMetadata;
    exports.AnimationStyleMetadata = AnimationStyleMetadata;
    exports.AnimationAnimateMetadata = AnimationAnimateMetadata;
    exports.AnimationWithStepsMetadata = AnimationWithStepsMetadata;
    exports.AnimationSequenceMetadata = AnimationSequenceMetadata;
    exports.AnimationGroupMetadata = AnimationGroupMetadata;
    exports.animate = animate;
    exports.group = group;
    exports.sequence = sequence;
    exports.style = style;
    exports.state = state;
    exports.keyframes = keyframes;
    exports.transition = transition;
    exports.trigger = trigger;
  }));
})(require('process'));
