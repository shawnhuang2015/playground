/* */ 
(function(process) {
  "use strict";
  var common_1 = require('@angular/common');
  var compiler_1 = require('@angular/compiler');
  var core_1 = require('@angular/core');
  var platform_browser_1 = require('@angular/platform-browser');
  var core_private_1 = require('./core_private');
  var async_1 = require('./src/facade/async');
  var lang_1 = require('./src/facade/lang');
  var xhr_cache_1 = require('./src/xhr/xhr_cache');
  var xhr_impl_1 = require('./src/xhr/xhr_impl');
  exports.BROWSER_APP_COMPILER_PROVIDERS = [compiler_1.COMPILER_PROVIDERS, {
    provide: compiler_1.CompilerConfig,
    useFactory: function(platformDirectives, platformPipes) {
      return new compiler_1.CompilerConfig({
        platformDirectives: platformDirectives,
        platformPipes: platformPipes
      });
    },
    deps: [core_1.PLATFORM_DIRECTIVES, core_1.PLATFORM_PIPES]
  }, {
    provide: compiler_1.XHR,
    useClass: xhr_impl_1.XHRImpl
  }, {
    provide: core_1.PLATFORM_DIRECTIVES,
    useValue: common_1.COMMON_DIRECTIVES,
    multi: true
  }, {
    provide: core_1.PLATFORM_PIPES,
    useValue: common_1.COMMON_PIPES,
    multi: true
  }];
  exports.CACHED_TEMPLATE_PROVIDER = [{
    provide: compiler_1.XHR,
    useClass: xhr_cache_1.CachedXHR
  }];
  function bootstrap(appComponentType, customProviders) {
    core_private_1.reflector.reflectionCapabilities = new core_private_1.ReflectionCapabilities();
    var providers = [platform_browser_1.BROWSER_APP_PROVIDERS, exports.BROWSER_APP_COMPILER_PROVIDERS, lang_1.isPresent(customProviders) ? customProviders : []];
    var appInjector = core_1.ReflectiveInjector.resolveAndCreate(providers, platform_browser_1.browserPlatform().injector);
    return core_1.coreLoadAndBootstrap(appComponentType, appInjector);
  }
  exports.bootstrap = bootstrap;
  function bootstrapWorkerUi(workerScriptUri, customProviders) {
    var app = core_1.ReflectiveInjector.resolveAndCreate([platform_browser_1.WORKER_UI_APPLICATION_PROVIDERS, exports.BROWSER_APP_COMPILER_PROVIDERS, {
      provide: platform_browser_1.WORKER_SCRIPT,
      useValue: workerScriptUri
    }, lang_1.isPresent(customProviders) ? customProviders : []], platform_browser_1.workerUiPlatform().injector);
    return async_1.PromiseWrapper.resolve(app.get(core_1.ApplicationRef));
  }
  exports.bootstrapWorkerUi = bootstrapWorkerUi;
  var WORKER_APP_COMPILER_PROVIDERS = [compiler_1.COMPILER_PROVIDERS, {
    provide: compiler_1.CompilerConfig,
    useFactory: function(platformDirectives, platformPipes) {
      return new compiler_1.CompilerConfig({
        platformDirectives: platformDirectives,
        platformPipes: platformPipes
      });
    },
    deps: [core_1.PLATFORM_DIRECTIVES, core_1.PLATFORM_PIPES]
  }, {
    provide: compiler_1.XHR,
    useClass: xhr_impl_1.XHRImpl
  }, {
    provide: core_1.PLATFORM_DIRECTIVES,
    useValue: common_1.COMMON_DIRECTIVES,
    multi: true
  }, {
    provide: core_1.PLATFORM_PIPES,
    useValue: common_1.COMMON_PIPES,
    multi: true
  }];
  function bootstrapWorkerApp(appComponentType, customProviders) {
    var appInjector = core_1.ReflectiveInjector.resolveAndCreate([platform_browser_1.WORKER_APP_APPLICATION_PROVIDERS, WORKER_APP_COMPILER_PROVIDERS, lang_1.isPresent(customProviders) ? customProviders : []], platform_browser_1.workerAppPlatform().injector);
    return core_1.coreLoadAndBootstrap(appComponentType, appInjector);
  }
  exports.bootstrapWorkerApp = bootstrapWorkerApp;
})(require('process'));
