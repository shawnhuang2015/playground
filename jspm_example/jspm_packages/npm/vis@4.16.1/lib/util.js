/* */ 
var moment = require('./module/moment');
var uuid = require('./module/uuid');
exports.isNumber = function(object) {
  return (object instanceof Number || typeof object == 'number');
};
exports.recursiveDOMDelete = function(DOMobject) {
  if (DOMobject) {
    while (DOMobject.hasChildNodes() === true) {
      exports.recursiveDOMDelete(DOMobject.firstChild);
      DOMobject.removeChild(DOMobject.firstChild);
    }
  }
};
exports.giveRange = function(min, max, total, value) {
  if (max == min) {
    return 0.5;
  } else {
    var scale = 1 / (max - min);
    return Math.max(0, (value - min) * scale);
  }
};
exports.isString = function(object) {
  return (object instanceof String || typeof object == 'string');
};
exports.isDate = function(object) {
  if (object instanceof Date) {
    return true;
  } else if (exports.isString(object)) {
    var match = ASPDateRegex.exec(object);
    if (match) {
      return true;
    } else if (!isNaN(Date.parse(object))) {
      return true;
    }
  }
  return false;
};
exports.randomUUID = function() {
  return uuid.v4();
};
exports.assignAllKeys = function(obj, value) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] !== 'object') {
        obj[prop] = value;
      }
    }
  }
};
exports.fillIfDefined = function(a, b, allowDeletion = false) {
  for (var prop in a) {
    if (b[prop] !== undefined) {
      if (typeof b[prop] !== 'object') {
        if ((b[prop] === undefined || b[prop] === null) && a[prop] !== undefined && allowDeletion === true) {
          delete a[prop];
        } else {
          a[prop] = b[prop];
        }
      } else {
        if (typeof a[prop] === 'object') {
          exports.fillIfDefined(a[prop], b[prop], allowDeletion);
        }
      }
    }
  }
};
exports.protoExtend = function(a, b) {
  for (var i = 1; i < arguments.length; i++) {
    var other = arguments[i];
    for (var prop in other) {
      a[prop] = other[prop];
    }
  }
  return a;
};
exports.extend = function(a, b) {
  for (var i = 1; i < arguments.length; i++) {
    var other = arguments[i];
    for (var prop in other) {
      if (other.hasOwnProperty(prop)) {
        a[prop] = other[prop];
      }
    }
  }
  return a;
};
exports.selectiveExtend = function(props, a, b) {
  if (!Array.isArray(props)) {
    throw new Error('Array with property names expected as first argument');
  }
  for (var i = 2; i < arguments.length; i++) {
    var other = arguments[i];
    for (var p = 0; p < props.length; p++) {
      var prop = props[p];
      if (other.hasOwnProperty(prop)) {
        a[prop] = other[prop];
      }
    }
  }
  return a;
};
exports.selectiveDeepExtend = function(props, a, b, allowDeletion = false) {
  if (Array.isArray(b)) {
    throw new TypeError('Arrays are not supported by deepExtend');
  }
  for (var i = 2; i < arguments.length; i++) {
    var other = arguments[i];
    for (var p = 0; p < props.length; p++) {
      var prop = props[p];
      if (other.hasOwnProperty(prop)) {
        if (b[prop] && b[prop].constructor === Object) {
          if (a[prop] === undefined) {
            a[prop] = {};
          }
          if (a[prop].constructor === Object) {
            exports.deepExtend(a[prop], b[prop], false, allowDeletion);
          } else {
            if ((b[prop] === null) && a[prop] !== undefined && allowDeletion === true) {
              delete a[prop];
            } else {
              a[prop] = b[prop];
            }
          }
        } else if (Array.isArray(b[prop])) {
          throw new TypeError('Arrays are not supported by deepExtend');
        } else {
          if ((b[prop] === null) && a[prop] !== undefined && allowDeletion === true) {
            delete a[prop];
          } else {
            a[prop] = b[prop];
          }
        }
      }
    }
  }
  return a;
};
exports.selectiveNotDeepExtend = function(props, a, b, allowDeletion = false) {
  if (Array.isArray(b)) {
    throw new TypeError('Arrays are not supported by deepExtend');
  }
  for (var prop in b) {
    if (b.hasOwnProperty(prop)) {
      if (props.indexOf(prop) == -1) {
        if (b[prop] && b[prop].constructor === Object) {
          if (a[prop] === undefined) {
            a[prop] = {};
          }
          if (a[prop].constructor === Object) {
            exports.deepExtend(a[prop], b[prop]);
          } else {
            if ((b[prop] === null) && a[prop] !== undefined && allowDeletion === true) {
              delete a[prop];
            } else {
              a[prop] = b[prop];
            }
          }
        } else if (Array.isArray(b[prop])) {
          a[prop] = [];
          for (let i = 0; i < b[prop].length; i++) {
            a[prop].push(b[prop][i]);
          }
        } else {
          if ((b[prop] === null) && a[prop] !== undefined && allowDeletion === true) {
            delete a[prop];
          } else {
            a[prop] = b[prop];
          }
        }
      }
    }
  }
  return a;
};
exports.deepExtend = function(a, b, protoExtend, allowDeletion) {
  for (var prop in b) {
    if (b.hasOwnProperty(prop) || protoExtend === true) {
      if (b[prop] && b[prop].constructor === Object) {
        if (a[prop] === undefined) {
          a[prop] = {};
        }
        if (a[prop].constructor === Object) {
          exports.deepExtend(a[prop], b[prop], protoExtend);
        } else {
          if ((b[prop] === null) && a[prop] !== undefined && allowDeletion === true) {
            delete a[prop];
          } else {
            a[prop] = b[prop];
          }
        }
      } else if (Array.isArray(b[prop])) {
        a[prop] = [];
        for (let i = 0; i < b[prop].length; i++) {
          a[prop].push(b[prop][i]);
        }
      } else {
        if ((b[prop] === null) && a[prop] !== undefined && allowDeletion === true) {
          delete a[prop];
        } else {
          a[prop] = b[prop];
        }
      }
    }
  }
  return a;
};
exports.equalArray = function(a, b) {
  if (a.length != b.length)
    return false;
  for (var i = 0,
      len = a.length; i < len; i++) {
    if (a[i] != b[i])
      return false;
  }
  return true;
};
exports.convert = function(object, type) {
  var match;
  if (object === undefined) {
    return undefined;
  }
  if (object === null) {
    return null;
  }
  if (!type) {
    return object;
  }
  if (!(typeof type === 'string') && !(type instanceof String)) {
    throw new Error('Type must be a string');
  }
  switch (type) {
    case 'boolean':
    case 'Boolean':
      return Boolean(object);
    case 'number':
    case 'Number':
      return Number(object.valueOf());
    case 'string':
    case 'String':
      return String(object);
    case 'Date':
      if (exports.isNumber(object)) {
        return new Date(object);
      }
      if (object instanceof Date) {
        return new Date(object.valueOf());
      } else if (moment.isMoment(object)) {
        return new Date(object.valueOf());
      }
      if (exports.isString(object)) {
        match = ASPDateRegex.exec(object);
        if (match) {
          return new Date(Number(match[1]));
        } else {
          return moment(object).toDate();
        }
      } else {
        throw new Error('Cannot convert object of type ' + exports.getType(object) + ' to type Date');
      }
    case 'Moment':
      if (exports.isNumber(object)) {
        return moment(object);
      }
      if (object instanceof Date) {
        return moment(object.valueOf());
      } else if (moment.isMoment(object)) {
        return moment(object);
      }
      if (exports.isString(object)) {
        match = ASPDateRegex.exec(object);
        if (match) {
          return moment(Number(match[1]));
        } else {
          return moment(object);
        }
      } else {
        throw new Error('Cannot convert object of type ' + exports.getType(object) + ' to type Date');
      }
    case 'ISODate':
      if (exports.isNumber(object)) {
        return new Date(object);
      } else if (object instanceof Date) {
        return object.toISOString();
      } else if (moment.isMoment(object)) {
        return object.toDate().toISOString();
      } else if (exports.isString(object)) {
        match = ASPDateRegex.exec(object);
        if (match) {
          return new Date(Number(match[1])).toISOString();
        } else {
          return new Date(object).toISOString();
        }
      } else {
        throw new Error('Cannot convert object of type ' + exports.getType(object) + ' to type ISODate');
      }
    case 'ASPDate':
      if (exports.isNumber(object)) {
        return '/Date(' + object + ')/';
      } else if (object instanceof Date) {
        return '/Date(' + object.valueOf() + ')/';
      } else if (exports.isString(object)) {
        match = ASPDateRegex.exec(object);
        var value;
        if (match) {
          value = new Date(Number(match[1])).valueOf();
        } else {
          value = new Date(object).valueOf();
        }
        return '/Date(' + value + ')/';
      } else {
        throw new Error('Cannot convert object of type ' + exports.getType(object) + ' to type ASPDate');
      }
    default:
      throw new Error('Unknown type "' + type + '"');
  }
};
var ASPDateRegex = /^\/?Date\((\-?\d+)/i;
exports.getType = function(object) {
  var type = typeof object;
  if (type == 'object') {
    if (object === null) {
      return 'null';
    }
    if (object instanceof Boolean) {
      return 'Boolean';
    }
    if (object instanceof Number) {
      return 'Number';
    }
    if (object instanceof String) {
      return 'String';
    }
    if (Array.isArray(object)) {
      return 'Array';
    }
    if (object instanceof Date) {
      return 'Date';
    }
    return 'Object';
  } else if (type == 'number') {
    return 'Number';
  } else if (type == 'boolean') {
    return 'Boolean';
  } else if (type == 'string') {
    return 'String';
  } else if (type === undefined) {
    return 'undefined';
  }
  return type;
};
exports.copyAndExtendArray = function(arr, newValue) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    newArr.push(arr[i]);
  }
  newArr.push(newValue);
  return newArr;
};
exports.copyArray = function(arr) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    newArr.push(arr[i]);
  }
  return newArr;
};
exports.getAbsoluteLeft = function(elem) {
  return elem.getBoundingClientRect().left;
};
exports.getAbsoluteRight = function(elem) {
  return elem.getBoundingClientRect().right;
};
exports.getAbsoluteTop = function(elem) {
  return elem.getBoundingClientRect().top;
};
exports.addClassName = function(elem, className) {
  var classes = elem.className.split(' ');
  if (classes.indexOf(className) == -1) {
    classes.push(className);
    elem.className = classes.join(' ');
  }
};
exports.removeClassName = function(elem, className) {
  var classes = elem.className.split(' ');
  var index = classes.indexOf(className);
  if (index != -1) {
    classes.splice(index, 1);
    elem.className = classes.join(' ');
  }
};
exports.forEach = function(object, callback) {
  var i,
      len;
  if (Array.isArray(object)) {
    for (i = 0, len = object.length; i < len; i++) {
      callback(object[i], i, object);
    }
  } else {
    for (i in object) {
      if (object.hasOwnProperty(i)) {
        callback(object[i], i, object);
      }
    }
  }
};
exports.toArray = function(object) {
  var array = [];
  for (var prop in object) {
    if (object.hasOwnProperty(prop))
      array.push(object[prop]);
  }
  return array;
};
exports.updateProperty = function(object, key, value) {
  if (object[key] !== value) {
    object[key] = value;
    return true;
  } else {
    return false;
  }
};
exports.throttle = function(fn, wait) {
  var timeout = null;
  var needExecution = false;
  return function throttled() {
    if (!timeout) {
      needExecution = false;
      fn();
      timeout = setTimeout(function() {
        timeout = null;
        if (needExecution) {
          throttled();
        }
      }, wait);
    } else {
      needExecution = true;
    }
  };
};
exports.addEventListener = function(element, action, listener, useCapture) {
  if (element.addEventListener) {
    if (useCapture === undefined)
      useCapture = false;
    if (action === "mousewheel" && navigator.userAgent.indexOf("Firefox") >= 0) {
      action = "DOMMouseScroll";
    }
    element.addEventListener(action, listener, useCapture);
  } else {
    element.attachEvent("on" + action, listener);
  }
};
exports.removeEventListener = function(element, action, listener, useCapture) {
  if (element.removeEventListener) {
    if (useCapture === undefined)
      useCapture = false;
    if (action === "mousewheel" && navigator.userAgent.indexOf("Firefox") >= 0) {
      action = "DOMMouseScroll";
    }
    element.removeEventListener(action, listener, useCapture);
  } else {
    element.detachEvent("on" + action, listener);
  }
};
exports.preventDefault = function(event) {
  if (!event)
    event = window.event;
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
};
exports.getTarget = function(event) {
  if (!event) {
    event = window.event;
  }
  var target;
  if (event.target) {
    target = event.target;
  } else if (event.srcElement) {
    target = event.srcElement;
  }
  if (target.nodeType != undefined && target.nodeType == 3) {
    target = target.parentNode;
  }
  return target;
};
exports.hasParent = function(element, parent) {
  var e = element;
  while (e) {
    if (e === parent) {
      return true;
    }
    e = e.parentNode;
  }
  return false;
};
exports.option = {};
exports.option.asBoolean = function(value, defaultValue) {
  if (typeof value == 'function') {
    value = value();
  }
  if (value != null) {
    return (value != false);
  }
  return defaultValue || null;
};
exports.option.asNumber = function(value, defaultValue) {
  if (typeof value == 'function') {
    value = value();
  }
  if (value != null) {
    return Number(value) || defaultValue || null;
  }
  return defaultValue || null;
};
exports.option.asString = function(value, defaultValue) {
  if (typeof value == 'function') {
    value = value();
  }
  if (value != null) {
    return String(value);
  }
  return defaultValue || null;
};
exports.option.asSize = function(value, defaultValue) {
  if (typeof value == 'function') {
    value = value();
  }
  if (exports.isString(value)) {
    return value;
  } else if (exports.isNumber(value)) {
    return value + 'px';
  } else {
    return defaultValue || null;
  }
};
exports.option.asElement = function(value, defaultValue) {
  if (typeof value == 'function') {
    value = value();
  }
  return value || defaultValue || null;
};
exports.hexToRGB = function(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};
exports.overrideOpacity = function(color, opacity) {
  if (color.indexOf("rgba") != -1) {
    return color;
  } else if (color.indexOf("rgb") != -1) {
    var rgb = color.substr(color.indexOf("(") + 1).replace(")", "").split(",");
    return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + opacity + ")";
  } else {
    var rgb = exports.hexToRGB(color);
    if (rgb == null) {
      return color;
    } else {
      return "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + opacity + ")";
    }
  }
};
exports.RGBToHex = function(red, green, blue) {
  return "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
};
exports.parseColor = function(color) {
  var c;
  if (exports.isString(color) === true) {
    if (exports.isValidRGB(color) === true) {
      var rgb = color.substr(4).substr(0, color.length - 5).split(',').map(function(value) {
        return parseInt(value);
      });
      color = exports.RGBToHex(rgb[0], rgb[1], rgb[2]);
    }
    if (exports.isValidHex(color) === true) {
      var hsv = exports.hexToHSV(color);
      var lighterColorHSV = {
        h: hsv.h,
        s: hsv.s * 0.8,
        v: Math.min(1, hsv.v * 1.02)
      };
      var darkerColorHSV = {
        h: hsv.h,
        s: Math.min(1, hsv.s * 1.25),
        v: hsv.v * 0.8
      };
      var darkerColorHex = exports.HSVToHex(darkerColorHSV.h, darkerColorHSV.s, darkerColorHSV.v);
      var lighterColorHex = exports.HSVToHex(lighterColorHSV.h, lighterColorHSV.s, lighterColorHSV.v);
      c = {
        background: color,
        border: darkerColorHex,
        highlight: {
          background: lighterColorHex,
          border: darkerColorHex
        },
        hover: {
          background: lighterColorHex,
          border: darkerColorHex
        }
      };
    } else {
      c = {
        background: color,
        border: color,
        highlight: {
          background: color,
          border: color
        },
        hover: {
          background: color,
          border: color
        }
      };
    }
  } else {
    c = {};
    c.background = color.background || undefined;
    c.border = color.border || undefined;
    if (exports.isString(color.highlight)) {
      c.highlight = {
        border: color.highlight,
        background: color.highlight
      };
    } else {
      c.highlight = {};
      c.highlight.background = color.highlight && color.highlight.background || undefined;
      c.highlight.border = color.highlight && color.highlight.border || undefined;
    }
    if (exports.isString(color.hover)) {
      c.hover = {
        border: color.hover,
        background: color.hover
      };
    } else {
      c.hover = {};
      c.hover.background = color.hover && color.hover.background || undefined;
      c.hover.border = color.hover && color.hover.border || undefined;
    }
  }
  return c;
};
exports.RGBToHSV = function(red, green, blue) {
  red = red / 255;
  green = green / 255;
  blue = blue / 255;
  var minRGB = Math.min(red, Math.min(green, blue));
  var maxRGB = Math.max(red, Math.max(green, blue));
  if (minRGB == maxRGB) {
    return {
      h: 0,
      s: 0,
      v: minRGB
    };
  }
  var d = (red == minRGB) ? green - blue : ((blue == minRGB) ? red - green : blue - red);
  var h = (red == minRGB) ? 3 : ((blue == minRGB) ? 1 : 5);
  var hue = 60 * (h - d / (maxRGB - minRGB)) / 360;
  var saturation = (maxRGB - minRGB) / maxRGB;
  var value = maxRGB;
  return {
    h: hue,
    s: saturation,
    v: value
  };
};
var cssUtil = {
  split: function(cssText) {
    var styles = {};
    cssText.split(';').forEach(function(style) {
      if (style.trim() != '') {
        var parts = style.split(':');
        var key = parts[0].trim();
        var value = parts[1].trim();
        styles[key] = value;
      }
    });
    return styles;
  },
  join: function(styles) {
    return Object.keys(styles).map(function(key) {
      return key + ': ' + styles[key];
    }).join('; ');
  }
};
exports.addCssText = function(element, cssText) {
  var currentStyles = cssUtil.split(element.style.cssText);
  var newStyles = cssUtil.split(cssText);
  var styles = exports.extend(currentStyles, newStyles);
  element.style.cssText = cssUtil.join(styles);
};
exports.removeCssText = function(element, cssText) {
  var styles = cssUtil.split(element.style.cssText);
  var removeStyles = cssUtil.split(cssText);
  for (var key in removeStyles) {
    if (removeStyles.hasOwnProperty(key)) {
      delete styles[key];
    }
  }
  element.style.cssText = cssUtil.join(styles);
};
exports.HSVToRGB = function(h, s, v) {
  var r,
      g,
      b;
  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v, g = t, b = p;
      break;
    case 1:
      r = q, g = v, b = p;
      break;
    case 2:
      r = p, g = v, b = t;
      break;
    case 3:
      r = p, g = q, b = v;
      break;
    case 4:
      r = t, g = p, b = v;
      break;
    case 5:
      r = v, g = p, b = q;
      break;
  }
  return {
    r: Math.floor(r * 255),
    g: Math.floor(g * 255),
    b: Math.floor(b * 255)
  };
};
exports.HSVToHex = function(h, s, v) {
  var rgb = exports.HSVToRGB(h, s, v);
  return exports.RGBToHex(rgb.r, rgb.g, rgb.b);
};
exports.hexToHSV = function(hex) {
  var rgb = exports.hexToRGB(hex);
  return exports.RGBToHSV(rgb.r, rgb.g, rgb.b);
};
exports.isValidHex = function(hex) {
  var isOk = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
  return isOk;
};
exports.isValidRGB = function(rgb) {
  rgb = rgb.replace(" ", "");
  var isOk = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/i.test(rgb);
  return isOk;
};
exports.isValidRGBA = function(rgba) {
  rgba = rgba.replace(" ", "");
  var isOk = /rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(.{1,3})\)/i.test(rgba);
  return isOk;
};
exports.selectiveBridgeObject = function(fields, referenceObject) {
  if (typeof referenceObject == "object") {
    var objectTo = Object.create(referenceObject);
    for (var i = 0; i < fields.length; i++) {
      if (referenceObject.hasOwnProperty(fields[i])) {
        if (typeof referenceObject[fields[i]] == "object") {
          objectTo[fields[i]] = exports.bridgeObject(referenceObject[fields[i]]);
        }
      }
    }
    return objectTo;
  } else {
    return null;
  }
};
exports.bridgeObject = function(referenceObject) {
  if (typeof referenceObject == "object") {
    var objectTo = Object.create(referenceObject);
    for (var i in referenceObject) {
      if (referenceObject.hasOwnProperty(i)) {
        if (typeof referenceObject[i] == "object") {
          objectTo[i] = exports.bridgeObject(referenceObject[i]);
        }
      }
    }
    return objectTo;
  } else {
    return null;
  }
};
exports.insertSort = function(a, compare) {
  for (var i = 0; i < a.length; i++) {
    var k = a[i];
    for (var j = i; j > 0 && compare(k, a[j - 1]) < 0; j--) {
      a[j] = a[j - 1];
    }
    a[j] = k;
  }
  return a;
};
exports.mergeOptions = function(mergeTarget, options, option, allowDeletion = false, globalOptions = {}) {
  if (options[option] === null) {
    mergeTarget[option] = Object.create(globalOptions[option]);
  } else {
    if (options[option] !== undefined) {
      if (typeof options[option] === 'boolean') {
        mergeTarget[option].enabled = options[option];
      } else {
        if (options[option].enabled === undefined) {
          mergeTarget[option].enabled = true;
        }
        for (var prop in options[option]) {
          if (options[option].hasOwnProperty(prop)) {
            mergeTarget[option][prop] = options[option][prop];
          }
        }
      }
    }
  }
};
exports.binarySearchCustom = function(orderedItems, comparator, field, field2) {
  var maxIterations = 10000;
  var iteration = 0;
  var low = 0;
  var high = orderedItems.length - 1;
  while (low <= high && iteration < maxIterations) {
    var middle = Math.floor((low + high) / 2);
    var item = orderedItems[middle];
    var value = (field2 === undefined) ? item[field] : item[field][field2];
    var searchResult = comparator(value);
    if (searchResult == 0) {
      return middle;
    } else if (searchResult == -1) {
      low = middle + 1;
    } else {
      high = middle - 1;
    }
    iteration++;
  }
  return -1;
};
exports.binarySearchValue = function(orderedItems, target, field, sidePreference, comparator) {
  var maxIterations = 10000;
  var iteration = 0;
  var low = 0;
  var high = orderedItems.length - 1;
  var prevValue,
      value,
      nextValue,
      middle;
  var comparator = comparator != undefined ? comparator : function(a, b) {
    return a == b ? 0 : a < b ? -1 : 1;
  };
  while (low <= high && iteration < maxIterations) {
    middle = Math.floor(0.5 * (high + low));
    prevValue = orderedItems[Math.max(0, middle - 1)][field];
    value = orderedItems[middle][field];
    nextValue = orderedItems[Math.min(orderedItems.length - 1, middle + 1)][field];
    if (comparator(value, target) == 0) {
      return middle;
    } else if (comparator(prevValue, target) < 0 && comparator(value, target) > 0) {
      return sidePreference == 'before' ? Math.max(0, middle - 1) : middle;
    } else if (comparator(value, target) < 0 && comparator(nextValue, target) > 0) {
      return sidePreference == 'before' ? middle : Math.min(orderedItems.length - 1, middle + 1);
    } else {
      if (comparator(value, target) < 0) {
        low = middle + 1;
      } else {
        high = middle - 1;
      }
    }
    iteration++;
  }
  return -1;
};
exports.easingFunctions = {
  linear: function(t) {
    return t;
  },
  easeInQuad: function(t) {
    return t * t;
  },
  easeOutQuad: function(t) {
    return t * (2 - t);
  },
  easeInOutQuad: function(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  easeInCubic: function(t) {
    return t * t * t;
  },
  easeOutCubic: function(t) {
    return (--t) * t * t + 1;
  },
  easeInOutCubic: function(t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  easeInQuart: function(t) {
    return t * t * t * t;
  },
  easeOutQuart: function(t) {
    return 1 - (--t) * t * t * t;
  },
  easeInOutQuart: function(t) {
    return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
  },
  easeInQuint: function(t) {
    return t * t * t * t * t;
  },
  easeOutQuint: function(t) {
    return 1 + (--t) * t * t * t * t;
  },
  easeInOutQuint: function(t) {
    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
  }
};
