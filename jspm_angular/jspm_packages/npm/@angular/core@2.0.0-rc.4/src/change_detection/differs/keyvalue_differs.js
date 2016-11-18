/* */ 
"use strict";
var di_1 = require('../../di');
var collection_1 = require('../../facade/collection');
var exceptions_1 = require('../../facade/exceptions');
var lang_1 = require('../../facade/lang');
var KeyValueDiffers = (function() {
  function KeyValueDiffers(factories) {
    this.factories = factories;
  }
  KeyValueDiffers.create = function(factories, parent) {
    if (lang_1.isPresent(parent)) {
      var copied = collection_1.ListWrapper.clone(parent.factories);
      factories = factories.concat(copied);
      return new KeyValueDiffers(factories);
    } else {
      return new KeyValueDiffers(factories);
    }
  };
  KeyValueDiffers.extend = function(factories) {
    return new di_1.Provider(KeyValueDiffers, {
      useFactory: function(parent) {
        if (lang_1.isBlank(parent)) {
          throw new exceptions_1.BaseException('Cannot extend KeyValueDiffers without a parent injector');
        }
        return KeyValueDiffers.create(factories, parent);
      },
      deps: [[KeyValueDiffers, new di_1.SkipSelfMetadata(), new di_1.OptionalMetadata()]]
    });
  };
  KeyValueDiffers.prototype.find = function(kv) {
    var factory = this.factories.find(function(f) {
      return f.supports(kv);
    });
    if (lang_1.isPresent(factory)) {
      return factory;
    } else {
      throw new exceptions_1.BaseException("Cannot find a differ supporting object '" + kv + "'");
    }
  };
  return KeyValueDiffers;
}());
exports.KeyValueDiffers = KeyValueDiffers;
