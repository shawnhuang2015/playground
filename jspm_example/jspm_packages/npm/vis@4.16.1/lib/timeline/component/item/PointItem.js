/* */ 
var Item = require('./Item');
function PointItem(data, conversion, options) {
  this.props = {
    dot: {
      top: 0,
      width: 0,
      height: 0
    },
    content: {
      height: 0,
      marginLeft: 0,
      marginRight: 0
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
PointItem.prototype = new Item(null, null, null);
PointItem.prototype.isVisible = function(range) {
  var interval = (range.end - range.start) / 4;
  return (this.data.start > range.start - interval) && (this.data.start < range.end + interval);
};
PointItem.prototype.redraw = function() {
  var dom = this.dom;
  if (!dom) {
    this.dom = {};
    dom = this.dom;
    dom.point = document.createElement('div');
    dom.content = document.createElement('div');
    dom.content.className = 'vis-item-content';
    dom.point.appendChild(dom.content);
    dom.dot = document.createElement('div');
    dom.point.appendChild(dom.dot);
    dom.point['timeline-item'] = this;
    this.dirty = true;
  }
  if (!this.parent) {
    throw new Error('Cannot redraw item: no parent attached');
  }
  if (!dom.point.parentNode) {
    var foreground = this.parent.dom.foreground;
    if (!foreground) {
      throw new Error('Cannot redraw item: parent has no foreground container element');
    }
    foreground.appendChild(dom.point);
  }
  this.displayed = true;
  if (this.dirty) {
    this._updateContents(this.dom.content);
    this._updateTitle(this.dom.point);
    this._updateDataAttributes(this.dom.point);
    this._updateStyle(this.dom.point);
    var editable = (this.options.editable.updateTime || this.options.editable.updateGroup || this.editable === true) && this.editable !== false;
    var className = (this.data.className ? ' ' + this.data.className : '') + (this.selected ? ' vis-selected' : '') + (editable ? ' vis-editable' : ' vis-readonly');
    dom.point.className = 'vis-item vis-point' + className;
    dom.dot.className = 'vis-item vis-dot' + className;
    this.props.dot.width = dom.dot.offsetWidth;
    this.props.dot.height = dom.dot.offsetHeight;
    this.props.content.height = dom.content.offsetHeight;
    if (this.options.rtl) {
      dom.content.style.marginRight = 2 * this.props.dot.width + 'px';
    } else {
      dom.content.style.marginLeft = 2 * this.props.dot.width + 'px';
    }
    this.width = dom.point.offsetWidth;
    this.height = dom.point.offsetHeight;
    dom.dot.style.top = ((this.height - this.props.dot.height) / 2) + 'px';
    if (this.options.rtl) {
      dom.dot.style.right = (this.props.dot.width / 2) + 'px';
    } else {
      dom.dot.style.left = (this.props.dot.width / 2) + 'px';
    }
    this.dirty = false;
  }
  this._repaintDeleteButton(dom.point);
};
PointItem.prototype.show = function() {
  if (!this.displayed) {
    this.redraw();
  }
};
PointItem.prototype.hide = function() {
  if (this.displayed) {
    if (this.dom.point.parentNode) {
      this.dom.point.parentNode.removeChild(this.dom.point);
    }
    this.displayed = false;
  }
};
PointItem.prototype.repositionX = function() {
  var start = this.conversion.toScreen(this.data.start);
  if (this.options.rtl) {
    this.right = start - this.props.dot.width;
    this.dom.point.style.right = this.right + 'px';
  } else {
    this.left = start - this.props.dot.width;
    this.dom.point.style.left = this.left + 'px';
  }
};
PointItem.prototype.repositionY = function() {
  var orientation = this.options.orientation.item;
  var point = this.dom.point;
  if (orientation == 'top') {
    point.style.top = this.top + 'px';
  } else {
    point.style.top = (this.parent.height - this.top - this.height) + 'px';
  }
};
PointItem.prototype.getWidthLeft = function() {
  return this.props.dot.width;
};
PointItem.prototype.getWidthRight = function() {
  return this.props.dot.width;
};
module.exports = PointItem;
