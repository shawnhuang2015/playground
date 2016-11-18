/* */ 
"use strict";
var index_1 = require('../index');
var _FakeAsyncTestZoneSpecType = Zone['FakeAsyncTestZoneSpec'];
function fakeAsync(fn) {
  if (Zone.current.get('FakeAsyncTestZoneSpec') != null) {
    throw new index_1.BaseException('fakeAsync() calls can not be nested');
  }
  var fakeAsyncTestZoneSpec = new _FakeAsyncTestZoneSpecType();
  var fakeAsyncZone = Zone.current.fork(fakeAsyncTestZoneSpec);
  return function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i - 0] = arguments[_i];
    }
    var res = fakeAsyncZone.run(function() {
      var res = fn.apply(void 0, args);
      flushMicrotasks();
      return res;
    });
    if (fakeAsyncTestZoneSpec.pendingPeriodicTimers.length > 0) {
      throw new index_1.BaseException((fakeAsyncTestZoneSpec.pendingPeriodicTimers.length + " ") + "periodic timer(s) still in the queue.");
    }
    if (fakeAsyncTestZoneSpec.pendingTimers.length > 0) {
      throw new index_1.BaseException(fakeAsyncTestZoneSpec.pendingTimers.length + " timer(s) still in the queue.");
    }
    return res;
  };
}
exports.fakeAsync = fakeAsync;
function _getFakeAsyncZoneSpec() {
  var zoneSpec = Zone.current.get('FakeAsyncTestZoneSpec');
  if (zoneSpec == null) {
    throw new Error('The code should be running in the fakeAsync zone to call this function');
  }
  return zoneSpec;
}
function tick(millis) {
  if (millis === void 0) {
    millis = 0;
  }
  _getFakeAsyncZoneSpec().tick(millis);
}
exports.tick = tick;
function discardPeriodicTasks() {
  var zoneSpec = _getFakeAsyncZoneSpec();
  var pendingTimers = zoneSpec.pendingPeriodicTimers;
  zoneSpec.pendingPeriodicTimers.length = 0;
}
exports.discardPeriodicTasks = discardPeriodicTasks;
function flushMicrotasks() {
  _getFakeAsyncZoneSpec().flushMicrotasks();
}
exports.flushMicrotasks = flushMicrotasks;
