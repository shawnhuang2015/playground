/* */ 
"use strict";
var dom_adapter_1 = require('../dom/dom_adapter');
var Title = (function() {
  function Title() {}
  Title.prototype.getTitle = function() {
    return dom_adapter_1.getDOM().getTitle();
  };
  Title.prototype.setTitle = function(newTitle) {
    dom_adapter_1.getDOM().setTitle(newTitle);
  };
  return Title;
}());
exports.Title = Title;
