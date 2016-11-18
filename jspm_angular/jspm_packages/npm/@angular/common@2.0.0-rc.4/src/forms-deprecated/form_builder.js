/* */ 
"use strict";
var core_1 = require('@angular/core');
var collection_1 = require('../facade/collection');
var lang_1 = require('../facade/lang');
var model_1 = require('./model');
var FormBuilder = (function() {
  function FormBuilder() {}
  FormBuilder.prototype.group = function(controlsConfig, extra) {
    if (extra === void 0) {
      extra = null;
    }
    var controls = this._reduceControls(controlsConfig);
    var optionals = (lang_1.isPresent(extra) ? collection_1.StringMapWrapper.get(extra, 'optionals') : null);
    var validator = lang_1.isPresent(extra) ? collection_1.StringMapWrapper.get(extra, 'validator') : null;
    var asyncValidator = lang_1.isPresent(extra) ? collection_1.StringMapWrapper.get(extra, 'asyncValidator') : null;
    return new model_1.ControlGroup(controls, optionals, validator, asyncValidator);
  };
  FormBuilder.prototype.control = function(value, validator, asyncValidator) {
    if (validator === void 0) {
      validator = null;
    }
    if (asyncValidator === void 0) {
      asyncValidator = null;
    }
    return new model_1.Control(value, validator, asyncValidator);
  };
  FormBuilder.prototype.array = function(controlsConfig, validator, asyncValidator) {
    var _this = this;
    if (validator === void 0) {
      validator = null;
    }
    if (asyncValidator === void 0) {
      asyncValidator = null;
    }
    var controls = controlsConfig.map(function(c) {
      return _this._createControl(c);
    });
    return new model_1.ControlArray(controls, validator, asyncValidator);
  };
  FormBuilder.prototype._reduceControls = function(controlsConfig) {
    var _this = this;
    var controls = {};
    collection_1.StringMapWrapper.forEach(controlsConfig, function(controlConfig, controlName) {
      controls[controlName] = _this._createControl(controlConfig);
    });
    return controls;
  };
  FormBuilder.prototype._createControl = function(controlConfig) {
    if (controlConfig instanceof model_1.Control || controlConfig instanceof model_1.ControlGroup || controlConfig instanceof model_1.ControlArray) {
      return controlConfig;
    } else if (lang_1.isArray(controlConfig)) {
      var value = controlConfig[0];
      var validator = controlConfig.length > 1 ? controlConfig[1] : null;
      var asyncValidator = controlConfig.length > 2 ? controlConfig[2] : null;
      return this.control(value, validator, asyncValidator);
    } else {
      return this.control(controlConfig);
    }
  };
  FormBuilder.decorators = [{type: core_1.Injectable}];
  return FormBuilder;
}());
exports.FormBuilder = FormBuilder;
