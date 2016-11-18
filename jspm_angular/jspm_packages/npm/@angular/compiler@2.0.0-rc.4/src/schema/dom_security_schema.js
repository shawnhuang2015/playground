/* */ 
"use strict";
var core_private_1 = require('../../core_private');
exports.SECURITY_SCHEMA = {};
function registerContext(ctx, specs) {
  for (var _i = 0,
      specs_1 = specs; _i < specs_1.length; _i++) {
    var spec = specs_1[_i];
    exports.SECURITY_SCHEMA[spec.toLowerCase()] = ctx;
  }
}
registerContext(core_private_1.SecurityContext.HTML, ['iframe|srcdoc', '*|innerHTML', '*|outerHTML']);
registerContext(core_private_1.SecurityContext.STYLE, ['*|style']);
registerContext(core_private_1.SecurityContext.URL, ['*|formAction', 'area|href', 'area|ping', 'audio|src', 'a|href', 'a|ping', 'blockquote|cite', 'body|background', 'del|cite', 'form|action', 'img|src', 'img|srcset', 'input|src', 'ins|cite', 'q|cite', 'source|src', 'source|srcset', 'video|poster', 'video|src']);
registerContext(core_private_1.SecurityContext.RESOURCE_URL, ['applet|code', 'applet|codebase', 'base|href', 'embed|src', 'frame|src', 'head|profile', 'html|manifest', 'iframe|src', 'link|href', 'media|src', 'object|codebase', 'object|data', 'script|src', 'track|src']);
