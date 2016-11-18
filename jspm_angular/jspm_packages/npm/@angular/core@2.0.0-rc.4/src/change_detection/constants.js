/* */ 
"use strict";
var lang_1 = require('../facade/lang');
(function(ChangeDetectionStrategy) {
  ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 0] = "OnPush";
  ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 1] = "Default";
})(exports.ChangeDetectionStrategy || (exports.ChangeDetectionStrategy = {}));
var ChangeDetectionStrategy = exports.ChangeDetectionStrategy;
(function(ChangeDetectorStatus) {
  ChangeDetectorStatus[ChangeDetectorStatus["CheckOnce"] = 0] = "CheckOnce";
  ChangeDetectorStatus[ChangeDetectorStatus["Checked"] = 1] = "Checked";
  ChangeDetectorStatus[ChangeDetectorStatus["CheckAlways"] = 2] = "CheckAlways";
  ChangeDetectorStatus[ChangeDetectorStatus["Detached"] = 3] = "Detached";
  ChangeDetectorStatus[ChangeDetectorStatus["Errored"] = 4] = "Errored";
  ChangeDetectorStatus[ChangeDetectorStatus["Destroyed"] = 5] = "Destroyed";
})(exports.ChangeDetectorStatus || (exports.ChangeDetectorStatus = {}));
var ChangeDetectorStatus = exports.ChangeDetectorStatus;
exports.CHANGE_DETECTION_STRATEGY_VALUES = [ChangeDetectionStrategy.OnPush, ChangeDetectionStrategy.Default];
exports.CHANGE_DETECTOR_STATUS_VALUES = [ChangeDetectorStatus.CheckOnce, ChangeDetectorStatus.Checked, ChangeDetectorStatus.CheckAlways, ChangeDetectorStatus.Detached, ChangeDetectorStatus.Errored, ChangeDetectorStatus.Destroyed];
function isDefaultChangeDetectionStrategy(changeDetectionStrategy) {
  return lang_1.isBlank(changeDetectionStrategy) || changeDetectionStrategy === ChangeDetectionStrategy.Default;
}
exports.isDefaultChangeDetectionStrategy = isDefaultChangeDetectionStrategy;
