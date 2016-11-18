/* */ 
(function(process) {
  "use strict";
  var collection_1 = require('../facade/collection');
  var lang_1 = require('../facade/lang');
  var html_ast_1 = require('../html_ast');
  var interpolation_config_1 = require('../interpolation_config');
  var message_1 = require('./message');
  var shared_1 = require('./shared');
  var ExtractionResult = (function() {
    function ExtractionResult(messages, errors) {
      this.messages = messages;
      this.errors = errors;
    }
    return ExtractionResult;
  }());
  exports.ExtractionResult = ExtractionResult;
  function removeDuplicates(messages) {
    var uniq = {};
    messages.forEach(function(m) {
      if (!collection_1.StringMapWrapper.contains(uniq, message_1.id(m))) {
        uniq[message_1.id(m)] = m;
      }
    });
    return collection_1.StringMapWrapper.values(uniq);
  }
  exports.removeDuplicates = removeDuplicates;
  var MessageExtractor = (function() {
    function MessageExtractor(_htmlParser, _parser, _implicitTags, _implicitAttrs) {
      this._htmlParser = _htmlParser;
      this._parser = _parser;
      this._implicitTags = _implicitTags;
      this._implicitAttrs = _implicitAttrs;
    }
    MessageExtractor.prototype.extract = function(template, sourceUrl, interpolationConfig) {
      if (interpolationConfig === void 0) {
        interpolationConfig = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG;
      }
      this._messages = [];
      this._errors = [];
      var res = this._htmlParser.parse(template, sourceUrl, true);
      if (res.errors.length == 0) {
        this._recurse(res.rootNodes, interpolationConfig);
      }
      return new ExtractionResult(this._messages, this._errors.concat(res.errors));
    };
    MessageExtractor.prototype._extractMessagesFromPart = function(part, interpolationConfig) {
      if (part.hasI18n) {
        this._messages.push(part.createMessage(this._parser, interpolationConfig));
        this._recurseToExtractMessagesFromAttributes(part.children, interpolationConfig);
      } else {
        this._recurse(part.children, interpolationConfig);
      }
      if (lang_1.isPresent(part.rootElement)) {
        this._extractMessagesFromAttributes(part.rootElement, interpolationConfig);
      }
    };
    MessageExtractor.prototype._recurse = function(nodes, interpolationConfig) {
      var _this = this;
      if (lang_1.isPresent(nodes)) {
        var parts = shared_1.partition(nodes, this._errors, this._implicitTags);
        parts.forEach(function(part) {
          return _this._extractMessagesFromPart(part, interpolationConfig);
        });
      }
    };
    MessageExtractor.prototype._recurseToExtractMessagesFromAttributes = function(nodes, interpolationConfig) {
      var _this = this;
      nodes.forEach(function(n) {
        if (n instanceof html_ast_1.HtmlElementAst) {
          _this._extractMessagesFromAttributes(n, interpolationConfig);
          _this._recurseToExtractMessagesFromAttributes(n.children, interpolationConfig);
        }
      });
    };
    MessageExtractor.prototype._extractMessagesFromAttributes = function(p, interpolationConfig) {
      var _this = this;
      var transAttrs = lang_1.isPresent(this._implicitAttrs[p.name]) ? this._implicitAttrs[p.name] : [];
      var explicitAttrs = [];
      p.attrs.filter(function(attr) {
        return attr.name.startsWith(shared_1.I18N_ATTR_PREFIX);
      }).forEach(function(attr) {
        try {
          explicitAttrs.push(attr.name.substring(shared_1.I18N_ATTR_PREFIX.length));
          _this._messages.push(shared_1.messageFromI18nAttribute(_this._parser, interpolationConfig, p, attr));
        } catch (e) {
          if (e instanceof shared_1.I18nError) {
            _this._errors.push(e);
          } else {
            throw e;
          }
        }
      });
      p.attrs.filter(function(attr) {
        return !attr.name.startsWith(shared_1.I18N_ATTR_PREFIX);
      }).filter(function(attr) {
        return explicitAttrs.indexOf(attr.name) == -1;
      }).filter(function(attr) {
        return transAttrs.indexOf(attr.name) > -1;
      }).forEach(function(attr) {
        return _this._messages.push(shared_1.messageFromAttribute(_this._parser, interpolationConfig, attr));
      });
    };
    return MessageExtractor;
  }());
  exports.MessageExtractor = MessageExtractor;
})(require('process'));
