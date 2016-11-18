/* */ 
"use strict";
var core_1 = require('@angular/core');
var dom_adapter_1 = require('../dom/dom_adapter');
var url_sanitizer_1 = require('./url_sanitizer');
var VALUES = '[-,."\'%_!# a-zA-Z0-9]+';
var TRANSFORMATION_FNS = '(?:matrix|translate|scale|rotate|skew|perspective)(?:X|Y|3d)?';
var COLOR_FNS = '(?:rgb|hsl)a?';
var FN_ARGS = '\\([-0-9.%, a-zA-Z]+\\)';
var SAFE_STYLE_VALUE = new RegExp("^(" + VALUES + "|(?:" + TRANSFORMATION_FNS + "|" + COLOR_FNS + ")" + FN_ARGS + ")$", 'g');
var URL_RE = /^url\(([^)]+)\)$/;
function hasBalancedQuotes(value) {
  var outsideSingle = true;
  var outsideDouble = true;
  for (var i = 0; i < value.length; i++) {
    var c = value.charAt(i);
    if (c === '\'' && outsideDouble) {
      outsideSingle = !outsideSingle;
    } else if (c === '"' && outsideSingle) {
      outsideDouble = !outsideDouble;
    }
  }
  return outsideSingle && outsideDouble;
}
function sanitizeStyle(value) {
  value = String(value).trim();
  if (!value)
    return '';
  var urlMatch = URL_RE.exec(value);
  if ((urlMatch && url_sanitizer_1.sanitizeUrl(urlMatch[1]) === urlMatch[1]) || value.match(SAFE_STYLE_VALUE) && hasBalancedQuotes(value)) {
    return value;
  }
  if (core_1.isDevMode()) {
    dom_adapter_1.getDOM().log("WARNING: sanitizing unsafe style value " + value + " (see http://g.co/ng/security#xss).");
  }
  return 'unsafe';
}
exports.sanitizeStyle = sanitizeStyle;
