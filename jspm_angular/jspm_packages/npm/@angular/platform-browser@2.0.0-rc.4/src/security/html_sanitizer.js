/* */ 
"use strict";
var core_1 = require('@angular/core');
var dom_adapter_1 = require('../dom/dom_adapter');
var url_sanitizer_1 = require('./url_sanitizer');
var inertElement = null;
var DOM = null;
function getInertElement() {
  if (inertElement)
    return inertElement;
  DOM = dom_adapter_1.getDOM();
  var templateEl = DOM.createElement('template');
  if ('content' in templateEl)
    return templateEl;
  var doc = DOM.createHtmlDocument();
  inertElement = DOM.querySelector(doc, 'body');
  if (inertElement == null) {
    var html = DOM.createElement('html', doc);
    inertElement = DOM.createElement('body', doc);
    DOM.appendChild(html, inertElement);
    DOM.appendChild(doc, html);
  }
  return inertElement;
}
function tagSet(tags) {
  var res = {};
  for (var _i = 0,
      _a = tags.split(','); _i < _a.length; _i++) {
    var t = _a[_i];
    res[t.toLowerCase()] = true;
  }
  return res;
}
function merge() {
  var sets = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    sets[_i - 0] = arguments[_i];
  }
  var res = {};
  for (var _a = 0,
      sets_1 = sets; _a < sets_1.length; _a++) {
    var s = sets_1[_a];
    for (var v in s) {
      if (s.hasOwnProperty(v))
        res[v] = true;
    }
  }
  return res;
}
var VOID_ELEMENTS = tagSet('area,br,col,hr,img,wbr');
var OPTIONAL_END_TAG_BLOCK_ELEMENTS = tagSet('colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr');
var OPTIONAL_END_TAG_INLINE_ELEMENTS = tagSet('rp,rt');
var OPTIONAL_END_TAG_ELEMENTS = merge(OPTIONAL_END_TAG_INLINE_ELEMENTS, OPTIONAL_END_TAG_BLOCK_ELEMENTS);
var BLOCK_ELEMENTS = merge(OPTIONAL_END_TAG_BLOCK_ELEMENTS, tagSet('address,article,' + 'aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,' + 'h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul'));
var INLINE_ELEMENTS = merge(OPTIONAL_END_TAG_INLINE_ELEMENTS, tagSet('a,abbr,acronym,audio,b,' + 'bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,' + 'samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video'));
var VALID_ELEMENTS = merge(VOID_ELEMENTS, BLOCK_ELEMENTS, INLINE_ELEMENTS, OPTIONAL_END_TAG_ELEMENTS);
var URI_ATTRS = tagSet('background,cite,href,itemtype,longdesc,poster,src,xlink:href');
var SRCSET_ATTRS = tagSet('srcset');
var HTML_ATTRS = tagSet('abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,' + 'compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,' + 'ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,' + 'scope,scrolling,shape,size,sizes,span,srclang,start,summary,tabindex,target,title,translate,type,usemap,' + 'valign,value,vspace,width');
var VALID_ATTRS = merge(URI_ATTRS, SRCSET_ATTRS, HTML_ATTRS);
var SanitizingHtmlSerializer = (function() {
  function SanitizingHtmlSerializer() {
    this.buf = [];
  }
  SanitizingHtmlSerializer.prototype.sanitizeChildren = function(el) {
    var current = el.firstChild;
    while (current) {
      if (DOM.isElementNode(current)) {
        this.startElement(current);
      } else if (DOM.isTextNode(current)) {
        this.chars(DOM.nodeValue(current));
      }
      if (DOM.firstChild(current)) {
        current = DOM.firstChild(current);
        continue;
      }
      while (current) {
        if (DOM.isElementNode(current)) {
          this.endElement(DOM.nodeName(current).toLowerCase());
        }
        if (DOM.nextSibling(current)) {
          current = DOM.nextSibling(current);
          break;
        }
        current = DOM.parentElement(current);
      }
    }
    return this.buf.join('');
  };
  SanitizingHtmlSerializer.prototype.startElement = function(element) {
    var _this = this;
    var tagName = DOM.nodeName(element).toLowerCase();
    tagName = tagName.toLowerCase();
    if (VALID_ELEMENTS.hasOwnProperty(tagName)) {
      this.buf.push('<');
      this.buf.push(tagName);
      DOM.attributeMap(element).forEach(function(value, attrName) {
        var lower = attrName.toLowerCase();
        if (!VALID_ATTRS.hasOwnProperty(lower))
          return;
        if (URI_ATTRS[lower])
          value = url_sanitizer_1.sanitizeUrl(value);
        if (SRCSET_ATTRS[lower])
          value = url_sanitizer_1.sanitizeSrcset(value);
        _this.buf.push(' ');
        _this.buf.push(attrName);
        _this.buf.push('="');
        _this.buf.push(encodeEntities(value));
        _this.buf.push('"');
      });
      this.buf.push('>');
    }
  };
  SanitizingHtmlSerializer.prototype.endElement = function(tagName) {
    tagName = tagName.toLowerCase();
    if (VALID_ELEMENTS.hasOwnProperty(tagName) && !VOID_ELEMENTS.hasOwnProperty(tagName)) {
      this.buf.push('</');
      this.buf.push(tagName);
      this.buf.push('>');
    }
  };
  SanitizingHtmlSerializer.prototype.chars = function(chars) {
    this.buf.push(encodeEntities(chars));
  };
  return SanitizingHtmlSerializer;
}());
var SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
var NON_ALPHANUMERIC_REGEXP = /([^\#-~ |!])/g;
function encodeEntities(value) {
  return value.replace(/&/g, '&amp;').replace(SURROGATE_PAIR_REGEXP, function(match) {
    var hi = match.charCodeAt(0);
    var low = match.charCodeAt(1);
    return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
  }).replace(NON_ALPHANUMERIC_REGEXP, function(match) {
    return '&#' + match.charCodeAt(0) + ';';
  }).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function stripCustomNsAttrs(el) {
  DOM.attributeMap(el).forEach(function(_, attrName) {
    if (attrName === 'xmlns:ns1' || attrName.indexOf('ns1:') === 0) {
      DOM.removeAttribute(el, attrName);
    }
  });
  for (var _i = 0,
      _a = DOM.childNodesAsList(el); _i < _a.length; _i++) {
    var n = _a[_i];
    if (DOM.isElementNode(n))
      stripCustomNsAttrs(n);
  }
}
function sanitizeHtml(unsafeHtmlInput) {
  try {
    var containerEl = getInertElement();
    var unsafeHtml = unsafeHtmlInput ? String(unsafeHtmlInput) : '';
    var mXSSAttempts = 5;
    var parsedHtml = unsafeHtml;
    do {
      if (mXSSAttempts === 0) {
        throw new Error('Failed to sanitize html because the input is unstable');
      }
      mXSSAttempts--;
      unsafeHtml = parsedHtml;
      DOM.setInnerHTML(containerEl, unsafeHtml);
      if (DOM.defaultDoc().documentMode) {
        stripCustomNsAttrs(containerEl);
      }
      parsedHtml = DOM.getInnerHTML(containerEl);
    } while (unsafeHtml !== parsedHtml);
    var sanitizer = new SanitizingHtmlSerializer();
    var safeHtml = sanitizer.sanitizeChildren(DOM.getTemplateContent(containerEl) || containerEl);
    var parent_1 = DOM.getTemplateContent(containerEl) || containerEl;
    for (var _i = 0,
        _a = DOM.childNodesAsList(parent_1); _i < _a.length; _i++) {
      var child = _a[_i];
      DOM.removeChild(parent_1, child);
    }
    if (core_1.isDevMode() && safeHtml !== unsafeHtmlInput) {
      DOM.log('WARNING: sanitizing HTML stripped some content (see http://g.co/ng/security#xss).');
    }
    return safeHtml;
  } catch (e) {
    inertElement = null;
    throw e;
  }
}
exports.sanitizeHtml = sanitizeHtml;
