/* */ 
"use strict";
var test_injector_1 = require('./test_injector');
var _global = (typeof window === 'undefined' ? global : window);
exports.expect = _global.expect;
exports.afterEach = _global.afterEach;
exports.describe = _global.describe;
exports.fdescribe = _global.fdescribe;
exports.ddescribe = _global.ddescribe;
exports.xdescribe = _global.xdescribe;
exports.beforeEach = _global.beforeEach;
exports.it = _global.it;
exports.fit = _global.fit;
exports.iit = _global.fit;
exports.xit = _global.xit;
var testInjector = test_injector_1.getTestInjector();
if (_global.beforeEach) {
  exports.beforeEach(function() {
    testInjector.reset();
  });
}
function addProviders(providers) {
  if (!providers)
    return;
  try {
    testInjector.addProviders(providers);
  } catch (e) {
    throw new Error('addProviders can\'t be called after the injector has been already created for this test. ' + 'This is most likely because you\'ve already used the injector to inject a beforeEach or the ' + 'current `it` function.');
  }
}
exports.addProviders = addProviders;
function beforeEachProviders(fn) {
  exports.beforeEach(function() {
    addProviders(fn());
  });
}
exports.beforeEachProviders = beforeEachProviders;
