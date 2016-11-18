/* */ 
var Item = require('./Item');
var util = require('../../../util');
function BoxItem(data, conversion, options) {
  this.props = {
    dot: {
      width: 0,
      height: 0
    },
    line: {
      width: 0,
      height: 0
    }
  };
  this.options = options;
  if (data) {
    if (data.start == undefined) {
      throw new Error('Property "start" missing in item ' + data);
    }
  }
  Item.call(this, data, conversion, options);
}
BoxItem.prototype = new Item(null, null, null);
BoxItem.prototype.isVisible = function(range) {
  var interval = (range.end - range.start) / 4;
  return (this.data.start > range.start - interval) && (this.data.start < range.end + interval);
};
BoxItem.prototype.redraw = function() {
  var dom = this.dom;
  if (!dom) {
    this.dom = {};
    dom = this.dom;
    dom.box = document.createElement('DIV');
    dom.content = document.createElement('DIV');
    dom.content.className = 'vis-item-content';
    dom.box.appendChild(dom.content);
    dom.line = document.createElement('DIV');
    dom.line.className = 'vis-line';
    dom.dot = document.createElement('DIV');
    dom.dot.className = 'vis-dot';
    dom.box['timeline-item'] = this;
    this.dirty = true;
  }
  if (!this.parent) {
    throw new Error('Cannot redraw item: no parent attached');
  }
  if (!dom.box.parentNode) {
    var foreground = this.parent.dom.foreground;
    if (!foreground)
      throw new Error('Cannot redraw item: parent has no foreground container element');
    foreground.appendChild(dom.box);
  }
  if (!dom.line.parentNode) {
    var background = this.parent.dom.background;
    if (!background)
      throw new Error('Cannot redraw item: parent has no background container element');
    background.appendChild(dom.line);
  }
  if (!dom.dot.parentNode) {
    var axis = this.parent.dom.axis;
    if (!background)
      throw new Error('Cannot redraw item: parent has no axis container element');
    axis.appendChild(dom.dot);
  }
  this.displayed = true;
  if (this.dirty) {
    this._updateContents(this.dom.content);
    this._updateTitle(this.dom.box);
    this._updateDataAttributes(this.dom.box);
    this._updateStyle(this.dom.box);
    var editable = (this.options.editable.updateTime || this.options.editable.updateGroup || this.editable === true) && this.editable !== false;
    var className = (this.data.className ? ' ' + this.data.className : '') + (this.selected ? ' vis-selected' : '') + (editable ? ' vis-editable' : ' vis-readonly');
    dom.box.className = 'vis-item vis-box' + className;
    dom.line.className = 'vis-item vis-line' + className;
    dom.dot.className = 'vis-item vis-dot' + className;
    this.props.dot.height = dom.dot.offsetHeight;
    this.props.dot.width = dom.dot.offsetWidth;
    this.props.line.width = dom.line.offsetWidth;
    this.width = dom.box.offsetWidth;
    this.height = dom.box.offsetHeight;
    this.dirty = false;
  }
  this._repaintDeleteButton(dom.box);
};
BoxItem.prototype.show = function() {
  if (!this.displayed) {
    this.redraw();
  }
};
BoxItem.prototype.hide = function() {
  if (this.displayed) {
    var dom = this.dom;
    if (dom.box.parentNode)
      dom.box.parentNode.removeChild(dom.box);
    if (dom.line.parentNode)
      dom.line.parentNode.removeChild(dom.line);
    if (dom.dot.parentNode)
      dom.dot.parentNode.removeChild(dom.dot);
    this.displayed = false;
  }
};
BoxItem.prototype.repositionX = function() {
  var start = this.conversion.toScreen(this.data.start);
  var align = this.options.align;
  if (align == 'right') {
    if (this.options.rtl) {
      this.right = start - this.width;
      this.dom.box.style.right = this.right + 'px';
      this.dom.line.style.right = (start - this.props.line.width) + 'px';
      this.dom.dot.style.right = (start - this.props.line.width / 2 - this.props.dot.width / 2) + 'px';
    } else {
      this.left = start - this.width;
      this.dom.box.style.left = this.left + 'px';
      this.dom.line.style.left = (start - this.props.line.width) + 'px';
      this.dom.dot.style.left = (start - this.props.line.width / 2 - this.props.dot.width / 2) + 'px';
    }
  } else if (align == 'left') {
    if (this.options.rtl) {
      this.right = start;
      this.dom.box.style.right = this.right + 'px';
      this.dom.line.style.right = start + 'px';
      this.dom.dot.style.right = (start + this.props.line.width / 2 - this.props.dot.width / 2) + 'px';
    } else {
      this.left = start;
      this.dom.box.style.left = this.left + 'px';
      this.dom.line.style.left = start + 'px';
      this.dom.dot.style.left = (start + this.props.line.width / 2 - this.props.dot.width / 2) + 'px';
    }
  } else {
    if (this.options.rtl) {
      this.right = start - this.width / 2;
      this.dom.box.style.right = this.right + 'px';
      this.dom.line.style.right = (start - this.props.line.width) + 'px';
      this.dom.dot.style.right = (start - this.props.dot.width / 2) + 'px';
    } else {
      this.left = start - this.width / 2;
      this.dom.box.style.left = this.left + 'px';
      this.dom.line.style.left = (start - this.props.line.width / 2) + 'px';
      this.dom.dot.style.left = (start - this.props.dot.width / 2) + 'px';
    }
  }
};
BoxItem.prototype.repositionY = function() {
  var orientation = this.options.orientation.item;
  var box = this.dom.box;
  var line = this.dom.line;
  var dot = this.dom.dot;
  if (orientation == 'top') {
    box.style.top = (this.top || 0) + 'px';
    line.style.top = '0';
    line.style.height = (this.parent.top + this.top + 1) + 'px';
    line.style.bottom = '';
  } else {
    var itemSetHeight = this.parent.itemSet.props.height;
    var lineHeight = itemSetHeight - this.parent.top - this.parent.height + this.top;
    box.style.top = (this.parent.height - this.top - this.height || 0) + 'px';
    line.style.top = (itemSetHeight - lineHeight) + 'px';
    line.style.bottom = '0';
  }
  dot.style.top = (-this.props.dot.height / 2) + 'px';
};
BoxItem.prototype.getWidthLeft = function() {
  return this.width / 2;
};
BoxItem.prototype.getWidthRight = function() {
  return this.width / 2;
};
module.exports = BoxItem;
