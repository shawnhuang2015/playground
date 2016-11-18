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
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/compiler'), require('@angular/core'), require('@angular/platform-browser'), require('rxjs/Subject'), require('rxjs/observable/PromiseObservable'), require('rxjs/operator/toPromise'), require('rxjs/Observable')) : typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/compiler', '@angular/core', '@angular/platform-browser', 'rxjs/Subject', 'rxjs/observable/PromiseObservable', 'rxjs/operator/toPromise', 'rxjs/Observable'], factory) : (factory((global.ng = global.ng || {}, global.ng.platformBrowserDynamic = global.ng.platformBrowserDynamic || {}), global.ng.common, global.ng.compiler, global.ng.core, global.ng.platformBrowser, global.Rx, global.Rx, global.Rx.Observable.prototype, global.Rx));
  }(this, function(exports, _angular_common, _angular_compiler, _angular_core, _angular_platformBrowser, rxjs_Subject, rxjs_observable_PromiseObservable, rxjs_operator_toPromise, rxjs_Observable) {
    'use strict';
    var ReflectionCapabilities = _angular_core.__core_private__.ReflectionCapabilities;
    var reflector = _angular_core.__core_private__.reflector;
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
    var global$1 = globalScope;
    global$1.assert = function assert(condition) {};
    function isPresent(obj) {
      return obj !== undefined && obj !== null;
    }
    function isBlank(obj) {
      return obj === undefined || obj === null;
    }
    function isArray(obj) {
      return Array.isArray(obj);
    }
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
    var CachedXHR = (function(_super) {
      __extends(CachedXHR, _super);
      function CachedXHR() {
        _super.call(this);
        this._cache = global$1.$templateCache;
        if (this._cache == null) {
          throw new BaseException('CachedXHR: Template cache was not found in $templateCache.');
        }
      }
      CachedXHR.prototype.get = function(url) {
        if (this._cache.hasOwnProperty(url)) {
          return PromiseWrapper.resolve(this._cache[url]);
        } else {
          return PromiseWrapper.reject('CachedXHR: Did not find cached template for ' + url, null);
        }
      };
      return CachedXHR;
    }(_angular_compiler.XHR));
    var XHRImpl = (function(_super) {
      __extends(XHRImpl, _super);
      function XHRImpl() {
        _super.apply(this, arguments);
      }
      XHRImpl.prototype.get = function(url) {
        var completer = PromiseWrapper.completer();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'text';
        xhr.onload = function() {
          var response = isPresent(xhr.response) ? xhr.response : xhr.responseText;
          var status = xhr.status === 1223 ? 204 : xhr.status;
          if (status === 0) {
            status = response ? 200 : 0;
          }
          if (200 <= status && status <= 300) {
            completer.resolve(response);
          } else {
            completer.reject("Failed to load " + url, null);
          }
        };
        xhr.onerror = function() {
          completer.reject("Failed to load " + url, null);
        };
        xhr.send();
        return completer.promise;
      };
      return XHRImpl;
    }(_angular_compiler.XHR));
    var BROWSER_APP_COMPILER_PROVIDERS = [_angular_compiler.COMPILER_PROVIDERS, {
      provide: _angular_compiler.CompilerConfig,
      useFactory: function(platformDirectives, platformPipes) {
        return new _angular_compiler.CompilerConfig({
          platformDirectives: platformDirectives,
          platformPipes: platformPipes
        });
      },
      deps: [_angular_core.PLATFORM_DIRECTIVES, _angular_core.PLATFORM_PIPES]
    }, {
      provide: _angular_compiler.XHR,
      useClass: XHRImpl
    }, {
      provide: _angular_core.PLATFORM_DIRECTIVES,
      useValue: _angular_common.COMMON_DIRECTIVES,
      multi: true
    }, {
      provide: _angular_core.PLATFORM_PIPES,
      useValue: _angular_common.COMMON_PIPES,
      multi: true
    }];
    var CACHED_TEMPLATE_PROVIDER = [{
      provide: _angular_compiler.XHR,
      useClass: CachedXHR
    }];
    function bootstrap(appComponentType, customProviders) {
      reflector.reflectionCapabilities = new ReflectionCapabilities();
      var providers = [_angular_platformBrowser.BROWSER_APP_PROVIDERS, BROWSER_APP_COMPILER_PROVIDERS, isPresent(customProviders) ? customProviders : []];
      var appInjector = _angular_core.ReflectiveInjector.resolveAndCreate(providers, _angular_platformBrowser.browserPlatform().injector);
      return _angular_core.coreLoadAndBootstrap(appComponentType, appInjector);
    }
    function bootstrapWorkerUi(workerScriptUri, customProviders) {
      var app = _angular_core.ReflectiveInjector.resolveAndCreate([_angular_platformBrowser.WORKER_UI_APPLICATION_PROVIDERS, BROWSER_APP_COMPILER_PROVIDERS, {
        provide: _angular_platformBrowser.WORKER_SCRIPT,
        useValue: workerScriptUri
      }, isPresent(customProviders) ? customProviders : []], _angular_platformBrowser.workerUiPlatform().injector);
      return PromiseWrapper.resolve(app.get(_angular_core.ApplicationRef));
    }
    var WORKER_APP_COMPILER_PROVIDERS = [_angular_compiler.COMPILER_PROVIDERS, {
      provide: _angular_compiler.CompilerConfig,
      useFactory: function(platformDirectives, platformPipes) {
        return new _angular_compiler.CompilerConfig({
          platformDirectives: platformDirectives,
          platformPipes: platformPipes
        });
      },
      deps: [_angular_core.PLATFORM_DIRECTIVES, _angular_core.PLATFORM_PIPES]
    }, {
      provide: _angular_compiler.XHR,
      useClass: XHRImpl
    }, {
      provide: _angular_core.PLATFORM_DIRECTIVES,
      useValue: _angular_common.COMMON_DIRECTIVES,
      multi: true
    }, {
      provide: _angular_core.PLATFORM_PIPES,
      useValue: _angular_common.COMMON_PIPES,
      multi: true
    }];
    function bootstrapWorkerApp(appComponentType, customProviders) {
      var appInjector = _angular_core.ReflectiveInjector.resolveAndCreate([_angular_platformBrowser.WORKER_APP_APPLICATION_PROVIDERS, WORKER_APP_COMPILER_PROVIDERS, isPresent(customProviders) ? customProviders : []], _angular_platformBrowser.workerAppPlatform().injector);
      return _angular_core.coreLoadAndBootstrap(appComponentType, appInjector);
    }
    exports.BROWSER_APP_COMPILER_PROVIDERS = BROWSER_APP_COMPILER_PROVIDERS;
    exports.CACHED_TEMPLATE_PROVIDER = CACHED_TEMPLATE_PROVIDER;
    exports.bootstrap = bootstrap;
    exports.bootstrapWorkerUi = bootstrapWorkerUi;
    exports.bootstrapWorkerApp = bootstrapWorkerApp;
  }));
})(require('process'));
