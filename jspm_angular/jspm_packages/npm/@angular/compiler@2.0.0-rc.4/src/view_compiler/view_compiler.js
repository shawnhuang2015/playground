/* */ 
"use strict";
var core_1 = require('@angular/core');
var animation_compiler_1 = require('../animation/animation_compiler');
var config_1 = require('../config');
var compile_element_1 = require('./compile_element');
var compile_view_1 = require('./compile_view');
var view_binder_1 = require('./view_binder');
var view_builder_1 = require('./view_builder');
var view_builder_2 = require('./view_builder');
exports.ComponentFactoryDependency = view_builder_2.ComponentFactoryDependency;
exports.ViewFactoryDependency = view_builder_2.ViewFactoryDependency;
var ViewCompileResult = (function() {
  function ViewCompileResult(statements, viewFactoryVar, dependencies) {
    this.statements = statements;
    this.viewFactoryVar = viewFactoryVar;
    this.dependencies = dependencies;
  }
  return ViewCompileResult;
}());
exports.ViewCompileResult = ViewCompileResult;
var ViewCompiler = (function() {
  function ViewCompiler(_genConfig) {
    this._genConfig = _genConfig;
    this._animationCompiler = new animation_compiler_1.AnimationCompiler();
  }
  ViewCompiler.prototype.compileComponent = function(component, template, styles, pipes) {
    var dependencies = [];
    var compiledAnimations = this._animationCompiler.compileComponent(component);
    var statements = [];
    compiledAnimations.map(function(entry) {
      statements.push(entry.statesMapStatement);
      statements.push(entry.fnStatement);
    });
    var view = new compile_view_1.CompileView(component, this._genConfig, pipes, styles, compiledAnimations, 0, compile_element_1.CompileElement.createNull(), []);
    view_builder_1.buildView(view, template, dependencies);
    view_binder_1.bindView(view, template);
    view_builder_1.finishView(view, statements);
    return new ViewCompileResult(statements, view.viewFactory.name, dependencies);
  };
  ViewCompiler.decorators = [{type: core_1.Injectable}];
  ViewCompiler.ctorParameters = [{type: config_1.CompilerConfig}];
  return ViewCompiler;
}());
exports.ViewCompiler = ViewCompiler;
