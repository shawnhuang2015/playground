/* */ 
"use strict";
var lang_1 = require('./facade/lang');
var TextAst = (function() {
  function TextAst(value, ngContentIndex, sourceSpan) {
    this.value = value;
    this.ngContentIndex = ngContentIndex;
    this.sourceSpan = sourceSpan;
  }
  TextAst.prototype.visit = function(visitor, context) {
    return visitor.visitText(this, context);
  };
  return TextAst;
}());
exports.TextAst = TextAst;
var BoundTextAst = (function() {
  function BoundTextAst(value, ngContentIndex, sourceSpan) {
    this.value = value;
    this.ngContentIndex = ngContentIndex;
    this.sourceSpan = sourceSpan;
  }
  BoundTextAst.prototype.visit = function(visitor, context) {
    return visitor.visitBoundText(this, context);
  };
  return BoundTextAst;
}());
exports.BoundTextAst = BoundTextAst;
var AttrAst = (function() {
  function AttrAst(name, value, sourceSpan) {
    this.name = name;
    this.value = value;
    this.sourceSpan = sourceSpan;
  }
  AttrAst.prototype.visit = function(visitor, context) {
    return visitor.visitAttr(this, context);
  };
  return AttrAst;
}());
exports.AttrAst = AttrAst;
var BoundElementPropertyAst = (function() {
  function BoundElementPropertyAst(name, type, securityContext, value, unit, sourceSpan) {
    this.name = name;
    this.type = type;
    this.securityContext = securityContext;
    this.value = value;
    this.unit = unit;
    this.sourceSpan = sourceSpan;
  }
  BoundElementPropertyAst.prototype.visit = function(visitor, context) {
    return visitor.visitElementProperty(this, context);
  };
  return BoundElementPropertyAst;
}());
exports.BoundElementPropertyAst = BoundElementPropertyAst;
var BoundEventAst = (function() {
  function BoundEventAst(name, target, handler, sourceSpan) {
    this.name = name;
    this.target = target;
    this.handler = handler;
    this.sourceSpan = sourceSpan;
  }
  BoundEventAst.prototype.visit = function(visitor, context) {
    return visitor.visitEvent(this, context);
  };
  Object.defineProperty(BoundEventAst.prototype, "fullName", {
    get: function() {
      if (lang_1.isPresent(this.target)) {
        return this.target + ":" + this.name;
      } else {
        return this.name;
      }
    },
    enumerable: true,
    configurable: true
  });
  return BoundEventAst;
}());
exports.BoundEventAst = BoundEventAst;
var ReferenceAst = (function() {
  function ReferenceAst(name, value, sourceSpan) {
    this.name = name;
    this.value = value;
    this.sourceSpan = sourceSpan;
  }
  ReferenceAst.prototype.visit = function(visitor, context) {
    return visitor.visitReference(this, context);
  };
  return ReferenceAst;
}());
exports.ReferenceAst = ReferenceAst;
var VariableAst = (function() {
  function VariableAst(name, value, sourceSpan) {
    this.name = name;
    this.value = value;
    this.sourceSpan = sourceSpan;
  }
  VariableAst.prototype.visit = function(visitor, context) {
    return visitor.visitVariable(this, context);
  };
  return VariableAst;
}());
exports.VariableAst = VariableAst;
var ElementAst = (function() {
  function ElementAst(name, attrs, inputs, outputs, references, directives, providers, hasViewContainer, children, ngContentIndex, sourceSpan) {
    this.name = name;
    this.attrs = attrs;
    this.inputs = inputs;
    this.outputs = outputs;
    this.references = references;
    this.directives = directives;
    this.providers = providers;
    this.hasViewContainer = hasViewContainer;
    this.children = children;
    this.ngContentIndex = ngContentIndex;
    this.sourceSpan = sourceSpan;
  }
  ElementAst.prototype.visit = function(visitor, context) {
    return visitor.visitElement(this, context);
  };
  return ElementAst;
}());
exports.ElementAst = ElementAst;
var EmbeddedTemplateAst = (function() {
  function EmbeddedTemplateAst(attrs, outputs, references, variables, directives, providers, hasViewContainer, children, ngContentIndex, sourceSpan) {
    this.attrs = attrs;
    this.outputs = outputs;
    this.references = references;
    this.variables = variables;
    this.directives = directives;
    this.providers = providers;
    this.hasViewContainer = hasViewContainer;
    this.children = children;
    this.ngContentIndex = ngContentIndex;
    this.sourceSpan = sourceSpan;
  }
  EmbeddedTemplateAst.prototype.visit = function(visitor, context) {
    return visitor.visitEmbeddedTemplate(this, context);
  };
  return EmbeddedTemplateAst;
}());
exports.EmbeddedTemplateAst = EmbeddedTemplateAst;
var BoundDirectivePropertyAst = (function() {
  function BoundDirectivePropertyAst(directiveName, templateName, value, sourceSpan) {
    this.directiveName = directiveName;
    this.templateName = templateName;
    this.value = value;
    this.sourceSpan = sourceSpan;
  }
  BoundDirectivePropertyAst.prototype.visit = function(visitor, context) {
    return visitor.visitDirectiveProperty(this, context);
  };
  return BoundDirectivePropertyAst;
}());
exports.BoundDirectivePropertyAst = BoundDirectivePropertyAst;
var DirectiveAst = (function() {
  function DirectiveAst(directive, inputs, hostProperties, hostEvents, sourceSpan) {
    this.directive = directive;
    this.inputs = inputs;
    this.hostProperties = hostProperties;
    this.hostEvents = hostEvents;
    this.sourceSpan = sourceSpan;
  }
  DirectiveAst.prototype.visit = function(visitor, context) {
    return visitor.visitDirective(this, context);
  };
  return DirectiveAst;
}());
exports.DirectiveAst = DirectiveAst;
var ProviderAst = (function() {
  function ProviderAst(token, multiProvider, eager, providers, providerType, sourceSpan) {
    this.token = token;
    this.multiProvider = multiProvider;
    this.eager = eager;
    this.providers = providers;
    this.providerType = providerType;
    this.sourceSpan = sourceSpan;
  }
  ProviderAst.prototype.visit = function(visitor, context) {
    return null;
  };
  return ProviderAst;
}());
exports.ProviderAst = ProviderAst;
(function(ProviderAstType) {
  ProviderAstType[ProviderAstType["PublicService"] = 0] = "PublicService";
  ProviderAstType[ProviderAstType["PrivateService"] = 1] = "PrivateService";
  ProviderAstType[ProviderAstType["Component"] = 2] = "Component";
  ProviderAstType[ProviderAstType["Directive"] = 3] = "Directive";
  ProviderAstType[ProviderAstType["Builtin"] = 4] = "Builtin";
})(exports.ProviderAstType || (exports.ProviderAstType = {}));
var ProviderAstType = exports.ProviderAstType;
var NgContentAst = (function() {
  function NgContentAst(index, ngContentIndex, sourceSpan) {
    this.index = index;
    this.ngContentIndex = ngContentIndex;
    this.sourceSpan = sourceSpan;
  }
  NgContentAst.prototype.visit = function(visitor, context) {
    return visitor.visitNgContent(this, context);
  };
  return NgContentAst;
}());
exports.NgContentAst = NgContentAst;
(function(PropertyBindingType) {
  PropertyBindingType[PropertyBindingType["Property"] = 0] = "Property";
  PropertyBindingType[PropertyBindingType["Attribute"] = 1] = "Attribute";
  PropertyBindingType[PropertyBindingType["Class"] = 2] = "Class";
  PropertyBindingType[PropertyBindingType["Style"] = 3] = "Style";
  PropertyBindingType[PropertyBindingType["Animation"] = 4] = "Animation";
})(exports.PropertyBindingType || (exports.PropertyBindingType = {}));
var PropertyBindingType = exports.PropertyBindingType;
function templateVisitAll(visitor, asts, context) {
  if (context === void 0) {
    context = null;
  }
  var result = [];
  asts.forEach(function(ast) {
    var astResult = ast.visit(visitor, context);
    if (lang_1.isPresent(astResult)) {
      result.push(astResult);
    }
  });
  return result;
}
exports.templateVisitAll = templateVisitAll;
