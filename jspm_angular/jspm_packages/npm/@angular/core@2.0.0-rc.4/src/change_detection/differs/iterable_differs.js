/* */ 
"use strict";
var di_1 = require('../../di');
var collection_1 = require('../../facade/collection');
var exceptions_1 = require('../../facade/exceptions');
var lang_1 = require('../../facade/lang');
var IterableDiffers = (function() {
  function IterableDiffers(factories) {
    this.factories = factories;
  }
  IterableDiffers.create = function(factories, parent) {
    if (lang_1.isPresent(parent)) {
      var copied = collection_1.ListWrapper.clone(parent.factories);
      factories = factories.concat(copied);
      return new IterableDiffers(factories);
    } else {
      return new IterableDiffers(factories);
    }
  };
  IterableDiffers.extend = function(factories) {
    return new di_1.Provider(IterableDiffers, {
      useFactory: function(parent) {
        if (lang_1.isBlank(parent)) {
          throw new exceptions_1.BaseException('Cannot extend IterableDiffers without a parent injector');
        }
        return IterableDiffers.create(factories, parent);
      },
      deps: [[IterableDiffers, new di_1.SkipSelfMetadata(), new di_1.OptionalMetadata()]]
    });
  };
  IterableDiffers.prototype.find = function(iterable) {
    var factory = this.factories.find(function(f) {
      return f.supports(iterable);
    });
    if (lang_1.isPresent(factory)) {
      return factory;
    } else {
      throw new exceptions_1.BaseException("Cannot find a differ supporting object '" + iterable + "' of type '" + lang_1.getTypeNameForDebugging(iterable) + "'");
    }
  };
  return IterableDiffers;
}());
exports.IterableDiffers = IterableDiffers;
