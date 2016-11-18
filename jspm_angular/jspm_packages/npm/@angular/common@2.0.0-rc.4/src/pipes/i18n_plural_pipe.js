/* */ 
"use strict";
var core_1 = require('@angular/core');
var lang_1 = require('../facade/lang');
var localization_1 = require('../localization');
var invalid_pipe_argument_exception_1 = require('./invalid_pipe_argument_exception');
var _INTERPOLATION_REGEXP = /#/g;
var I18nPluralPipe = (function() {
  function I18nPluralPipe(_localization) {
    this._localization = _localization;
  }
  I18nPluralPipe.prototype.transform = function(value, pluralMap) {
    if (lang_1.isBlank(value))
      return '';
    if (!lang_1.isStringMap(pluralMap)) {
      throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(I18nPluralPipe, pluralMap);
    }
    var key = localization_1.getPluralCategory(value, Object.getOwnPropertyNames(pluralMap), this._localization);
    return lang_1.StringWrapper.replaceAll(pluralMap[key], _INTERPOLATION_REGEXP, value.toString());
  };
  I18nPluralPipe.decorators = [{
    type: core_1.Pipe,
    args: [{
      name: 'i18nPlural',
      pure: true
    }]
  }];
  I18nPluralPipe.ctorParameters = [{type: localization_1.NgLocalization}];
  return I18nPluralPipe;
}());
exports.I18nPluralPipe = I18nPluralPipe;
