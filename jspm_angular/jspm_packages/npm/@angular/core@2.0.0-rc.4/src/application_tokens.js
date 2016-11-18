/* */ 
"use strict";
var lang_1 = require('./facade/lang');
var di_1 = require('./di');
exports.APP_ID = new di_1.OpaqueToken('AppId');
function _appIdRandomProviderFactory() {
  return "" + _randomChar() + _randomChar() + _randomChar();
}
exports.APP_ID_RANDOM_PROVIDER = {
  provide: exports.APP_ID,
  useFactory: _appIdRandomProviderFactory,
  deps: []
};
function _randomChar() {
  return lang_1.StringWrapper.fromCharCode(97 + lang_1.Math.floor(lang_1.Math.random() * 25));
}
exports.PLATFORM_INITIALIZER = new di_1.OpaqueToken('Platform Initializer');
exports.APP_INITIALIZER = new di_1.OpaqueToken('Application Initializer');
exports.PACKAGE_ROOT_URL = new di_1.OpaqueToken('Application Packages Root URL');
