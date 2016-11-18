/* */ 
var Hammer = require('../../../module/hammer');
var Item = require('./Item');
function RangeItem(data, conversion, options) {
  this.props = {content: {width: 0}};
  this.overflow = false;
  this.options = options;
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
RangeItem.prototype = new Item(null, null, null);
RangeItem.prototype.baseClassName = 'vis-item vis-range';
RangeItem.prototype.isVisible = function(range) {
  return (this.data.start < range.end) && (this.data.end > range.start);
};
RangeItem.prototype.redraw = function() {
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
    dom.box['timeline-item'] = this;
    this.dirty = true;
  }
  if (!this.parent) {
    throw new Error('Cannot redraw item: no parent attached');
  }
  if (!dom.box.parentNode) {
    var foreground = this.parent.dom.foreground;
    if (!foreground) {
      throw new Error('Cannot redraw item: parent has no foreground container element');
    }
    foreground.appendChild(dom.box);
  }
  this.displayed = true;
  if (this.dirty) {
    this._updateContents(this.dom.content);
    this._updateTitle(this.dom.box);
    this._updateDataAttributes(this.dom.box);
    this._updateStyle(this.dom.box);
    var editable = (this.options.editable.updateTime || this.options.editable.updateGroup || this.editable === true) && this.editable !== false;
    var className = (this.data.className ? (' ' + this.data.className) : '') + (this.selected ? ' vis-selected' : '') + (editable ? ' vis-editable' : ' vis-readonly');
    dom.box.className = this.baseClassName + className;
    this.overflow = window.getComputedStyle(dom.frame).overflow !== 'hidden';
    this.dom.content.style.maxWidth = 'none';
    this.props.content.width = this.dom.content.offsetWidth;
    this.height = this.dom.box.offsetHeight;
    this.dom.content.style.maxWidth = '';
    this.dirty = false;
  }
  this._repaintDeleteButton(dom.box);
  this._repaintDragLeft();
  this._repaintDragRight();
};
RangeItem.prototype.show = function() {
  if (!this.displayed) {
    this.redraw();
  }
};
RangeItem.prototype.hide = function() {
  if (this.displayed) {
    var box = this.dom.box;
    if (box.parentNode) {
      box.parentNode.removeChild(box);
    }
    this.displayed = false;
  }
};
RangeItem.prototype.repositionX = function(limitSize) {
  var parentWidth = this.parent.width;
  var start = this.conversion.toScreen(this.data.start);
  var end = this.conversion.toScreen(this.data.end);
  var contentStartPosition;
  var contentWidth;
  if (limitSize === undefined || limitSize === true) {
    if (start < -parentWidth) {
      start = -parentWidth;
    }
    if (end > 2 * parentWidth) {
      end = 2 * parentWidth;
    }
  }
  var boxWidth = Math.max(end - start, 1);
  if (this.overflow) {
    if (this.options.rtl) {
      this.right = start;
    } else {
      this.left = start;
    }
    this.width = boxWidth + this.props.content.width;
    contentWidth = this.props.content.width;
  } else {
    if (this.options.rtl) {
      this.right = start;
    } else {
      this.left = start;
    }
    this.width = boxWidth;
    contentWidth = Math.min(end - start, this.props.content.width);
  }
  if (this.options.rtl) {
    this.dom.box.style.right = this.right + 'px';
  } else {
    this.dom.box.style.left = this.left + 'px';
  }
  this.dom.box.style.width = boxWidth + 'px';
  switch (this.options.align) {
    case 'left':
      if (this.options.rtl) {
        this.dom.content.style.right = '0';
      } else {
        this.dom.content.style.left = '0';
      }
      break;
    case 'right':
      if (this.options.rtl) {
        this.dom.content.style.right = Math.max((boxWidth - contentWidth), 0) + 'px';
      } else {
        this.dom.content.style.left = Math.max((boxWidth - contentWidth), 0) + 'px';
      }
      break;
    case 'center':
      if (this.options.rtl) {
        this.dom.content.style.right = Math.max((boxWidth - contentWidth) / 2, 0) + 'px';
      } else {
        this.dom.content.style.left = Math.max((boxWidth - contentWidth) / 2, 0) + 'px';
      }
      break;
    default:
      if (this.overflow) {
        if (end > 0) {
          contentStartPosition = Math.max(-start, 0);
        } else {
          contentStartPosition = -contentWidth;
        }
      } else {
        if (start < 0) {
          contentStartPosition = -start;
        } else {
          contentStartPosition = 0;
        }
      }
      if (this.options.rtl) {
        this.dom.content.style.right = contentStartPosition + 'px';
      } else {
        this.dom.content.style.left = contentStartPosition + 'px';
      }
  }
};
RangeItem.prototype.repositionY = function() {
  var orientation = this.options.orientation.item;
  var box = this.dom.box;
  if (orientation == 'top') {
    box.style.top = this.top + 'px';
  } else {
    box.style.top = (this.parent.height - this.top - this.height) + 'px';
  }
};
RangeItem.prototype._repaintDragLeft = function() {
  if (this.selected && this.options.editable.updateTime && !this.dom.dragLeft) {
    var dragLeft = document.createElement('div');
    dragLeft.className = 'vis-drag-left';
    dragLeft.dragLeftItem = this;
    this.dom.box.appendChild(dragLeft);
    this.dom.dragLeft = dragLeft;
  } else if (!this.selected && this.dom.dragLeft) {
    if (this.dom.dragLeft.parentNode) {
      this.dom.dragLeft.parentNode.removeChild(this.dom.dragLeft);
    }
    this.dom.dragLeft = null;
  }
};
RangeItem.prototype._repaintDragRight = function() {
  if (this.selected && this.options.editable.updateTime && !this.dom.dragRight) {
    var dragRight = document.createElement('div');
    dragRight.className = 'vis-drag-right';
    dragRight.dragRightItem = this;
    this.dom.box.appendChild(dragRight);
    this.dom.dragRight = dragRight;
  } else if (!this.selected && this.dom.dragRight) {
    if (this.dom.dragRight.parentNode) {
      this.dom.dragRight.parentNode.removeChild(this.dom.dragRight);
    }
    this.dom.dragRight = null;
  }
};
module.exports = RangeItem;
