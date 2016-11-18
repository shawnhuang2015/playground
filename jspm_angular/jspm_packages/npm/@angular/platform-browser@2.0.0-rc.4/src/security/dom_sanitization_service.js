/* */ 
"use strict";
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require('@angular/core');
var core_private_1 = require('../../core_private');
exports.SecurityContext = core_private_1.SecurityContext;
var html_sanitizer_1 = require('./html_sanitizer');
var style_sanitizer_1 = require('./style_sanitizer');
var url_sanitizer_1 = require('./url_sanitizer');
var DomSanitizationService = (function() {
  function DomSanitizationService() {}
  return DomSanitizationService;
}());
exports.DomSanitizationService = DomSanitizationService;
var DomSanitizationServiceImpl = (function(_super) {
  __extends(DomSanitizationServiceImpl, _super);
  function DomSanitizationServiceImpl() {
    _super.apply(this, arguments);
  }
  DomSanitizationServiceImpl.prototype.sanitize = function(ctx, value) {
    if (value == null)
      return null;
    switch (ctx) {
      case core_private_1.SecurityContext.NONE:
        return value;
      case core_private_1.SecurityContext.HTML:
        if (value instanceof SafeHtmlImpl)
          return value.changingThisBreaksApplicationSecurity;
        this.checkNotSafeValue(value, 'HTML');
        return html_sanitizer_1.sanitizeHtml(String(value));
      case core_private_1.SecurityContext.STYLE:
        if (value instanceof SafeStyleImpl)
          return value.changingThisBreaksApplicationSecurity;
        this.checkNotSafeValue(value, 'Style');
        return style_sanitizer_1.sanitizeStyle(value);
      case core_private_1.SecurityContext.SCRIPT:
        if (value instanceof SafeScriptImpl)
          return value.changingThisBreaksApplicationSecurity;
        this.checkNotSafeValue(value, 'Script');
        throw new Error('unsafe value used in a script context');
      case core_private_1.SecurityContext.URL:
        if (value instanceof SafeUrlImpl)
          return value.changingThisBreaksApplicationSecurity;
        this.checkNotSafeValue(value, 'URL');
        return url_sanitizer_1.sanitizeUrl(String(value));
      case core_private_1.SecurityContext.RESOURCE_URL:
        if (value instanceof SafeResourceUrlImpl) {
          return value.changingThisBreaksApplicationSecurity;
        }
        this.checkNotSafeValue(value, 'ResourceURL');
        throw new Error('unsafe value used in a resource URL context (see http://g.co/ng/security#xss)');
      default:
        throw new Error("Unexpected SecurityContext " + ctx + " (see http://g.co/ng/security#xss)");
    }
  };
  DomSanitizationServiceImpl.prototype.checkNotSafeValue = function(value, expectedType) {
    if (value instanceof SafeValueImpl) {
      throw new Error(("Required a safe " + expectedType + ", got a " + value.getTypeName() + " ") + "(see http://g.co/ng/security#xss)");
    }
  };
  DomSanitizationServiceImpl.prototype.bypassSecurityTrustHtml = function(value) {
    return new SafeHtmlImpl(value);
  };
  DomSanitizationServiceImpl.prototype.bypassSecurityTrustStyle = function(value) {
    return new SafeStyleImpl(value);
  };
  DomSanitizationServiceImpl.prototype.bypassSecurityTrustScript = function(value) {
    return new SafeScriptImpl(value);
  };
  DomSanitizationServiceImpl.prototype.bypassSecurityTrustUrl = function(value) {
    return new SafeUrlImpl(value);
  };
  DomSanitizationServiceImpl.prototype.bypassSecurityTrustResourceUrl = function(value) {
    return new SafeResourceUrlImpl(value);
  };
  DomSanitizationServiceImpl.decorators = [{type: core_1.Injectable}];
  return DomSanitizationServiceImpl;
}(DomSanitizationService));
exports.DomSanitizationServiceImpl = DomSanitizationServiceImpl;
var SafeValueImpl = (function() {
  function SafeValueImpl(changingThisBreaksApplicationSecurity) {
    this.changingThisBreaksApplicationSecurity = changingThisBreaksApplicationSecurity;
  }
  SafeValueImpl.prototype.toString = function() {
    return ("SafeValue must use [property]=binding: " + this.changingThisBreaksApplicationSecurity) + " (see http://g.co/ng/security#xss)";
  };
  return SafeValueImpl;
}());
var SafeHtmlImpl = (function(_super) {
  __extends(SafeHtmlImpl, _super);
  function SafeHtmlImpl() {
    _super.apply(this, arguments);
  }
  SafeHtmlImpl.prototype.getTypeName = function() {
    return 'HTML';
  };
  return SafeHtmlImpl;
}(SafeValueImpl));
var SafeStyleImpl = (function(_super) {
  __extends(SafeStyleImpl, _super);
  function SafeStyleImpl() {
    _super.apply(this, arguments);
  }
  SafeStyleImpl.prototype.getTypeName = function() {
    return 'Style';
  };
  return SafeStyleImpl;
}(SafeValueImpl));
var SafeScriptImpl = (function(_super) {
  __extends(SafeScriptImpl, _super);
  function SafeScriptImpl() {
    _super.apply(this, arguments);
  }
  SafeScriptImpl.prototype.getTypeName = function() {
    return 'Script';
  };
  return SafeScriptImpl;
}(SafeValueImpl));
var SafeUrlImpl = (function(_super) {
  __extends(SafeUrlImpl, _super);
  function SafeUrlImpl() {
    _super.apply(this, arguments);
  }
  SafeUrlImpl.prototype.getTypeName = function() {
    return 'URL';
  };
  return SafeUrlImpl;
}(SafeValueImpl));
var SafeResourceUrlImpl = (function(_super) {
  __extends(SafeResourceUrlImpl, _super);
  function SafeResourceUrlImpl() {
    _super.apply(this, arguments);
  }
  SafeResourceUrlImpl.prototype.getTypeName = function() {
    return 'ResourceURL';
  };
  return SafeResourceUrlImpl;
}(SafeValueImpl));
