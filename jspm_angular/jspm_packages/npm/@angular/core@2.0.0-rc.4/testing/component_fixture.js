/* */ 
"use strict";
var index_1 = require('../index');
var async_1 = require('../src/facade/async');
var exceptions_1 = require('../src/facade/exceptions');
var lang_1 = require('../src/facade/lang');
var ComponentFixture = (function() {
  function ComponentFixture(componentRef, ngZone, autoDetect) {
    var _this = this;
    this._isStable = true;
    this._completer = null;
    this._onUnstableSubscription = null;
    this._onStableSubscription = null;
    this._onMicrotaskEmptySubscription = null;
    this._onErrorSubscription = null;
    this.changeDetectorRef = componentRef.changeDetectorRef;
    this.elementRef = componentRef.location;
    this.debugElement = index_1.getDebugNode(this.elementRef.nativeElement);
    this.componentInstance = componentRef.instance;
    this.nativeElement = this.elementRef.nativeElement;
    this.componentRef = componentRef;
    this.ngZone = ngZone;
    this._autoDetect = autoDetect;
    if (ngZone != null) {
      this._onUnstableSubscription = async_1.ObservableWrapper.subscribe(ngZone.onUnstable, function(_) {
        _this._isStable = false;
      });
      this._onMicrotaskEmptySubscription = async_1.ObservableWrapper.subscribe(ngZone.onMicrotaskEmpty, function(_) {
        if (_this._autoDetect) {
          _this.detectChanges(true);
        }
      });
      this._onStableSubscription = async_1.ObservableWrapper.subscribe(ngZone.onStable, function(_) {
        _this._isStable = true;
        lang_1.scheduleMicroTask(function() {
          if (!_this.ngZone.hasPendingMacrotasks) {
            if (_this._completer != null) {
              _this._completer.resolve(true);
              _this._completer = null;
            }
          }
        });
      });
      this._onErrorSubscription = async_1.ObservableWrapper.subscribe(ngZone.onError, function(error) {
        throw error.error;
      });
    }
  }
  ComponentFixture.prototype._tick = function(checkNoChanges) {
    this.changeDetectorRef.detectChanges();
    if (checkNoChanges) {
      this.checkNoChanges();
    }
  };
  ComponentFixture.prototype.detectChanges = function(checkNoChanges) {
    var _this = this;
    if (checkNoChanges === void 0) {
      checkNoChanges = true;
    }
    if (this.ngZone != null) {
      this.ngZone.run(function() {
        _this._tick(checkNoChanges);
      });
    } else {
      this._tick(checkNoChanges);
    }
  };
  ComponentFixture.prototype.checkNoChanges = function() {
    this.changeDetectorRef.checkNoChanges();
  };
  ComponentFixture.prototype.autoDetectChanges = function(autoDetect) {
    if (autoDetect === void 0) {
      autoDetect = true;
    }
    if (this.ngZone == null) {
      throw new exceptions_1.BaseException('Cannot call autoDetectChanges when ComponentFixtureNoNgZone is set');
    }
    this._autoDetect = autoDetect;
    this.detectChanges();
  };
  ComponentFixture.prototype.isStable = function() {
    return this._isStable && !this.ngZone.hasPendingMacrotasks;
  };
  ComponentFixture.prototype.whenStable = function() {
    if (this.isStable()) {
      return async_1.PromiseWrapper.resolve(false);
    } else if (this._completer !== null) {
      return this._completer.promise;
    } else {
      this._completer = new async_1.PromiseCompleter();
      return this._completer.promise;
    }
  };
  ComponentFixture.prototype.destroy = function() {
    this.componentRef.destroy();
    if (this._onUnstableSubscription != null) {
      async_1.ObservableWrapper.dispose(this._onUnstableSubscription);
      this._onUnstableSubscription = null;
    }
    if (this._onStableSubscription != null) {
      async_1.ObservableWrapper.dispose(this._onStableSubscription);
      this._onStableSubscription = null;
    }
    if (this._onMicrotaskEmptySubscription != null) {
      async_1.ObservableWrapper.dispose(this._onMicrotaskEmptySubscription);
      this._onMicrotaskEmptySubscription = null;
    }
    if (this._onErrorSubscription != null) {
      async_1.ObservableWrapper.dispose(this._onErrorSubscription);
      this._onErrorSubscription = null;
    }
  };
  return ComponentFixture;
}());
exports.ComponentFixture = ComponentFixture;
