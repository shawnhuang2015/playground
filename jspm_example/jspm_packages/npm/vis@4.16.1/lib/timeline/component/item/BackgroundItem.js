/* */ 
var Hammer = require('../../../module/hammer');
var Item = require('./Item');
var BackgroundGroup = require('../BackgroundGroup');
var RangeItem = require('./RangeItem');
function BackgroundItem(data, conversion, options) {
  this.props = {content: {width: 0}};
  this.overflow = false;
  if (data) {
    if (data.start == undefined) {
      throw new Error('Property "start" missing in item ' + data.id);
    }
    if (data.end == undefined) {
      throw new Error('Property "end" missing in item ' + data.id);
    }
  }
  Item.call(this, data, conversion, options);
}
BackgroundItem.prototype = new Item(null, null, null);
BackgroundItem.prototype.baseClassName = 'vis-item vis-background';
BackgroundItem.prototype.stack = false;
BackgroundItem.prototype.isVisible = function(range) {
  return (this.data.start < range.end) && (this.data.end > range.start);
};
BackgroundItem.prototype.redraw = function() {
  var dom = this.dom;
  if (!dom) {
    this.dom = {};
    dom = this.dom;
    dom.box = document.createElement('div');
    dom.frame = document.createElement('div');
    dom.frame.className = 'vis-item-overflow';
    dom.box.appendChild(dom.frame);
    dom.content = document.createElement('div');
    dom.content.className = 'vis-item-content';
    dom.frame.appendChild(dom.content);
    this.dirty = true;
  }
  if (!this.parent) {
    throw new Error('Cannot redraw item: no parent attached');
  }
  if (!dom.box.parentNode) {
    var background = this.parent.dom.background;
    if (!background) {
      throw new Error('Cannot redraw item: parent has no background container element');
    }
    background.appendChild(dom.box);
  }
  this.displayed = true;
  if (this.dirty) {
    this._updateContents(this.dom.content);
    this._updateTitle(this.dom.content);
    this._updateDataAttributes(this.dom.content);
    this._updateStyle(this.dom.box);
    var className = (this.data.className ? (' ' + this.data.className) : '') + (this.selected ? ' vis-selected' : '');
    dom.box.className = this.baseClassName + className;
    this.overflow = window.getComputedStyle(dom.content).overflow !== 'hidden';
    this.props.content.width = this.dom.content.offsetWidth;
    this.height = 0;
    this.dirty = false;
  }
};
BackgroundItem.prototype.show = RangeItem.prototype.show;
BackgroundItem.prototype.hide = RangeItem.prototype.hide;
BackgroundItem.prototype.repositionX = RangeItem.prototype.repositionX;
BackgroundItem.prototype.repositionY = function(margin) {
  var onTop = this.options.orientation.item === 'top';
  this.dom.content.style.top = onTop ? '' : '0';
  this.dom.content.style.bottom = onTop ? '0' : '';
  var height;
  if (this.data.subgroup !== undefined) {
    var itemSubgroup = this.data.subgroup;
    var subgroups = this.parent.subgroups;
    var subgroupIndex = subgroups[itemSubgroup].index;
    if (onTop == true) {
      height = this.parent.subgroups[itemSubgroup].height + margin.item.vertical;
      height += subgroupIndex == 0 ? margin.axis - 0.5 * margin.item.vertical : 0;
      var newTop = this.parent.top;
      for (var subgroup in subgroups) {
        if (subgroups.hasOwnProperty(subgroup)) {
          if (subgroups[subgroup].visible == true && subgroups[subgroup].index < subgroupIndex) {
            newTop += subgroups[subgroup].height + margin.item.vertical;
          }
        }
      }
      newTop += subgroupIndex != 0 ? margin.axis - 0.5 * margin.item.vertical : 0;
      this.dom.box.style.top = newTop + 'px';
      this.dom.box.style.bottom = '';
    } else {
      var newTop = this.parent.top;
      var totalHeight = 0;
      for (var subgroup in subgroups) {
        if (subgroups.hasOwnProperty(subgroup)) {
          if (subgroups[subgroup].visible == true) {
            var newHeight = subgroups[subgroup].height + margin.item.vertical;
            totalHeight += newHeight;
            if (subgroups[subgroup].index > subgroupIndex) {
              newTop += newHeight;
            }
          }
        }
      }
      height = this.parent.subgroups[itemSubgroup].height + margin.item.vertical;
      this.dom.box.style.top = (this.parent.height - totalHeight + newTop) + 'px';
      this.dom.box.style.bottom = '';
    }
  } else {
    if (this.parent instanceof BackgroundGroup) {
      height = Math.max(this.parent.height, this.parent.itemSet.body.domProps.center.height, this.parent.itemSet.body.domProps.centerContainer.height);
      this.dom.box.style.top = onTop ? '0' : '';
      this.dom.box.style.bottom = onTop ? '' : '0';
    } else {
      height = this.parent.height;
      this.dom.box.style.top = this.parent.top + 'px';
      this.dom.box.style.bottom = '';
    }
  }
  this.dom.box.style.height = height + 'px';
};
module.exports = BackgroundItem;
