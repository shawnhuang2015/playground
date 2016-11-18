/* */ 
"use strict";
var core_1 = require('@angular/core');
var dom_adapter_1 = require('../dom/dom_adapter');
var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;
var SAFE_SRCSET_PATTERN = /^(?:(?:https?|file):|[^&:/?#]*(?:[/?#]|$))/gi;
var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i;
function sanitizeUrl(url) {
  url = String(url);
  if (url.match(SAFE_URL_PATTERN) || url.match(DATA_URL_PATTERN))
    return url;
  if (core_1.isDevMode()) {
    dom_adapter_1.getDOM().log("WARNING: sanitizing unsafe URL value " + url + " (see http://g.co/ng/security#xss)");
  }
  return 'unsafe:' + url;
}
exports.sanitizeUrl = sanitizeUrl;
function sanitizeSrcset(srcset) {
  srcset = String(srcset);
  return srcset.split(',').map(function(srcset) {
    return sanitizeUrl(srcset.trim());
  }).join(', ');
}
exports.sanitizeSrcset = sanitizeSrcset;
