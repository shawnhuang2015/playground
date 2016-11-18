/* */ 
"use strict";
var application_ref_1 = require('./application_ref');
var application_tokens_1 = require('./application_tokens');
var change_detection_1 = require('./change_detection/change_detection');
var component_factory_resolver_1 = require('./linker/component_factory_resolver');
var component_resolver_1 = require('./linker/component_resolver');
var dynamic_component_loader_1 = require('./linker/dynamic_component_loader');
var view_utils_1 = require('./linker/view_utils');
var __unused;
exports.APPLICATION_COMMON_PROVIDERS = [application_ref_1.APPLICATION_CORE_PROVIDERS, {
  provide: component_resolver_1.ComponentResolver,
  useClass: component_resolver_1.ReflectorComponentResolver
}, {
  provide: component_factory_resolver_1.ComponentFactoryResolver,
  useValue: component_factory_resolver_1.ComponentFactoryResolver.NULL
}, application_tokens_1.APP_ID_RANDOM_PROVIDER, view_utils_1.ViewUtils, {
  provide: change_detection_1.IterableDiffers,
  useValue: change_detection_1.defaultIterableDiffers
}, {
  provide: change_detection_1.KeyValueDiffers,
  useValue: change_detection_1.defaultKeyValueDiffers
}, {
  provide: dynamic_component_loader_1.DynamicComponentLoader,
  useClass: dynamic_component_loader_1.DynamicComponentLoader_
}];
