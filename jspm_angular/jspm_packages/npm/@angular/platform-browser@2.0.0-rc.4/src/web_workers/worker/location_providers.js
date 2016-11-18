/* */ 
"use strict";
var common_1 = require('@angular/common');
var core_1 = require('@angular/core');
var platform_location_1 = require('./platform_location');
exports.WORKER_APP_LOCATION_PROVIDERS = [{
  provide: common_1.PlatformLocation,
  useClass: platform_location_1.WebWorkerPlatformLocation
}, {
  provide: core_1.APP_INITIALIZER,
  useFactory: appInitFnFactory,
  multi: true,
  deps: [common_1.PlatformLocation, core_1.NgZone]
}];
function appInitFnFactory(platformLocation, zone) {
  return function() {
    return zone.runGuarded(function() {
      return platformLocation.init();
    });
  };
}
