/* */ 
"use strict";
var wtf_impl_1 = require('./wtf_impl');
exports.wtfEnabled = wtf_impl_1.detectWTF();
function noopScope(arg0, arg1) {
  return null;
}
exports.wtfCreateScope = exports.wtfEnabled ? wtf_impl_1.createScope : function(signature, flags) {
  return noopScope;
};
exports.wtfLeave = exports.wtfEnabled ? wtf_impl_1.leave : function(s, r) {
  return r;
};
exports.wtfStartTimeRange = exports.wtfEnabled ? wtf_impl_1.startTimeRange : function(rangeType, action) {
  return null;
};
exports.wtfEndTimeRange = exports.wtfEnabled ? wtf_impl_1.endTimeRange : function(r) {
  return null;
};
