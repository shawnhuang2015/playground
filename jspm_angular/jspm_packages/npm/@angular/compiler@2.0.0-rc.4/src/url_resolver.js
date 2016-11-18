/* */ 
"use strict";
var core_1 = require('@angular/core');
var lang_1 = require('./facade/lang');
var _ASSET_SCHEME = 'asset:';
function createUrlResolverWithoutPackagePrefix() {
  return new UrlResolver();
}
exports.createUrlResolverWithoutPackagePrefix = createUrlResolverWithoutPackagePrefix;
function createOfflineCompileUrlResolver() {
  return new UrlResolver(_ASSET_SCHEME);
}
exports.createOfflineCompileUrlResolver = createOfflineCompileUrlResolver;
exports.DEFAULT_PACKAGE_URL_PROVIDER = {
  provide: core_1.PACKAGE_ROOT_URL,
  useValue: '/'
};
var UrlResolver = (function() {
  function UrlResolver(_packagePrefix) {
    if (_packagePrefix === void 0) {
      _packagePrefix = null;
    }
    this._packagePrefix = _packagePrefix;
  }
  UrlResolver.prototype.resolve = function(baseUrl, url) {
    var resolvedUrl = url;
    if (lang_1.isPresent(baseUrl) && baseUrl.length > 0) {
      resolvedUrl = _resolveUrl(baseUrl, resolvedUrl);
    }
    var resolvedParts = _split(resolvedUrl);
    var prefix = this._packagePrefix;
    if (lang_1.isPresent(prefix) && lang_1.isPresent(resolvedParts) && resolvedParts[_ComponentIndex.Scheme] == 'package') {
      var path = resolvedParts[_ComponentIndex.Path];
      if (this._packagePrefix === _ASSET_SCHEME) {
        var pathSegements = path.split(/\//);
        resolvedUrl = "asset:" + pathSegements[0] + "/lib/" + pathSegements.slice(1).join('/');
      } else {
        prefix = lang_1.StringWrapper.stripRight(prefix, '/');
        path = lang_1.StringWrapper.stripLeft(path, '/');
        return prefix + "/" + path;
      }
    }
    return resolvedUrl;
  };
  UrlResolver.decorators = [{type: core_1.Injectable}];
  UrlResolver.ctorParameters = [{
    type: undefined,
    decorators: [{
      type: core_1.Inject,
      args: [core_1.PACKAGE_ROOT_URL]
    }]
  }];
  return UrlResolver;
}());
exports.UrlResolver = UrlResolver;
function getUrlScheme(url) {
  var match = _split(url);
  return (match && match[_ComponentIndex.Scheme]) || '';
}
exports.getUrlScheme = getUrlScheme;
function _buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
  var out = [];
  if (lang_1.isPresent(opt_scheme)) {
    out.push(opt_scheme + ':');
  }
  if (lang_1.isPresent(opt_domain)) {
    out.push('//');
    if (lang_1.isPresent(opt_userInfo)) {
      out.push(opt_userInfo + '@');
    }
    out.push(opt_domain);
    if (lang_1.isPresent(opt_port)) {
      out.push(':' + opt_port);
    }
  }
  if (lang_1.isPresent(opt_path)) {
    out.push(opt_path);
  }
  if (lang_1.isPresent(opt_queryData)) {
    out.push('?' + opt_queryData);
  }
  if (lang_1.isPresent(opt_fragment)) {
    out.push('#' + opt_fragment);
  }
  return out.join('');
}
var _splitRe = lang_1.RegExpWrapper.create('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
var _ComponentIndex;
(function(_ComponentIndex) {
  _ComponentIndex[_ComponentIndex["Scheme"] = 1] = "Scheme";
  _ComponentIndex[_ComponentIndex["UserInfo"] = 2] = "UserInfo";
  _ComponentIndex[_ComponentIndex["Domain"] = 3] = "Domain";
  _ComponentIndex[_ComponentIndex["Port"] = 4] = "Port";
  _ComponentIndex[_ComponentIndex["Path"] = 5] = "Path";
  _ComponentIndex[_ComponentIndex["QueryData"] = 6] = "QueryData";
  _ComponentIndex[_ComponentIndex["Fragment"] = 7] = "Fragment";
})(_ComponentIndex || (_ComponentIndex = {}));
function _split(uri) {
  return lang_1.RegExpWrapper.firstMatch(_splitRe, uri);
}
function _removeDotSegments(path) {
  if (path == '/')
    return '/';
  var leadingSlash = path[0] == '/' ? '/' : '';
  var trailingSlash = path[path.length - 1] === '/' ? '/' : '';
  var segments = path.split('/');
  var out = [];
  var up = 0;
  for (var pos = 0; pos < segments.length; pos++) {
    var segment = segments[pos];
    switch (segment) {
      case '':
      case '.':
        break;
      case '..':
        if (out.length > 0) {
          out.pop();
        } else {
          up++;
        }
        break;
      default:
        out.push(segment);
    }
  }
  if (leadingSlash == '') {
    while (up-- > 0) {
      out.unshift('..');
    }
    if (out.length === 0)
      out.push('.');
  }
  return leadingSlash + out.join('/') + trailingSlash;
}
function _joinAndCanonicalizePath(parts) {
  var path = parts[_ComponentIndex.Path];
  path = lang_1.isBlank(path) ? '' : _removeDotSegments(path);
  parts[_ComponentIndex.Path] = path;
  return _buildFromEncodedParts(parts[_ComponentIndex.Scheme], parts[_ComponentIndex.UserInfo], parts[_ComponentIndex.Domain], parts[_ComponentIndex.Port], path, parts[_ComponentIndex.QueryData], parts[_ComponentIndex.Fragment]);
}
function _resolveUrl(base, url) {
  var parts = _split(encodeURI(url));
  var baseParts = _split(base);
  if (lang_1.isPresent(parts[_ComponentIndex.Scheme])) {
    return _joinAndCanonicalizePath(parts);
  } else {
    parts[_ComponentIndex.Scheme] = baseParts[_ComponentIndex.Scheme];
  }
  for (var i = _ComponentIndex.Scheme; i <= _ComponentIndex.Port; i++) {
    if (lang_1.isBlank(parts[i])) {
      parts[i] = baseParts[i];
    }
  }
  if (parts[_ComponentIndex.Path][0] == '/') {
    return _joinAndCanonicalizePath(parts);
  }
  var path = baseParts[_ComponentIndex.Path];
  if (lang_1.isBlank(path))
    path = '/';
  var index = path.lastIndexOf('/');
  path = path.substring(0, index + 1) + parts[_ComponentIndex.Path];
  parts[_ComponentIndex.Path] = path;
  return _joinAndCanonicalizePath(parts);
}
