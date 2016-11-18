/* */ 
var util = require('../../util');
var Group = require('./Group');
function BackgroundGroup(groupId, data, itemSet) {
  Group.call(this, groupId, data, itemSet);
  this.width = 0;
  this.height = 0;
  this.top = 0;
  this.left = 0;
}
BackgroundGroup.prototype = Object.create(Group.prototype);
BackgroundGroup.prototype.redraw = function(range, margin, restack) {
  var resized = false;
  this.visibleItems = this._updateVisibleItems(this.orderedItems, this.visibleItems, range);
  this.width = this.dom.background.offsetWidth;
  this.dom.background.style.height = '0';
  for (var i = 0,
      ii = this.visibleItems.length; i < ii; i++) {
    var item = this.visibleItems[i];
    item.repositionY(margin);
  }
  return resized;
};
BackgroundGroup.prototype.show = function() {
  if (!this.dom.background.parentNode) {
    this.itemSet.dom.background.appendChild(this.dom.background);
  }
};
module.exports = BackgroundGroup;
