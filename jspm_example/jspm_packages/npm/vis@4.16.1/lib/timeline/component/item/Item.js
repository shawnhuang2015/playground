/* */ 
var Hammer = require('../../../module/hammer');
var util = require('../../../util');
function Item(data, conversion, options) {
  this.id = null;
  this.parent = null;
  this.data = data;
  this.dom = null;
  this.conversion = conversion || {};
  this.options = options || {};
  this.selected = false;
  this.displayed = false;
  this.dirty = true;
  this.top = null;
  this.right = null;
  this.left = null;
  this.width = null;
  this.height = null;
  this.editable = null;
  if (this.data && this.data.hasOwnProperty('editable') && typeof this.data.editable === 'boolean') {
    this.editable = data.editable;
  }
}
Item.prototype.stack = true;
Item.prototype.select = function() {
  this.selected = true;
  this.dirty = true;
  if (this.displayed)
    this.redraw();
};
Item.prototype.unselect = function() {
  this.selected = false;
  this.dirty = true;
  if (this.displayed)
    this.redraw();
};
Item.prototype.setData = function(data) {
  var groupChanged = data.group != undefined && this.data.group != data.group;
  if (groupChanged) {
    this.parent.itemSet._moveToGroup(this, data.group);
  }
  if (data.hasOwnProperty('editable') && typeof data.editable === 'boolean') {
    this.editable = data.editable;
  }
  this.data = data;
  this.dirty = true;
  if (this.displayed)
    this.redraw();
};
Item.prototype.setParent = function(parent) {
  if (this.displayed) {
    this.hide();
    this.parent = parent;
    if (this.parent) {
      this.show();
    }
  } else {
    this.parent = parent;
  }
};
Item.prototype.isVisible = function(range) {
  return false;
};
Item.prototype.show = function() {
  return false;
};
Item.prototype.hide = function() {
  return false;
};
Item.prototype.redraw = function() {};
Item.prototype.repositionX = function() {};
Item.prototype.repositionY = function() {};
Item.prototype._repaintDeleteButton = function(anchor) {
  var editable = (this.options.editable.remove || this.data.editable === true) && this.data.editable !== false;
  if (this.selected && editable && !this.dom.deleteButton) {
    var me = this;
    var deleteButton = document.createElement('div');
    if (this.options.rtl) {
      deleteButton.className = 'vis-delete-rtl';
    } else {
      deleteButton.className = 'vis-delete';
    }
    deleteButton.title = 'Delete this item';
    new Hammer(deleteButton).on('tap', function(event) {
      event.stopPropagation();
      me.parent.removeFromDataSet(me);
    });
    anchor.appendChild(deleteButton);
    this.dom.deleteButton = deleteButton;
  } else if (!this.selected && this.dom.deleteButton) {
    if (this.dom.deleteButton.parentNode) {
      this.dom.deleteButton.parentNode.removeChild(this.dom.deleteButton);
    }
    this.dom.deleteButton = null;
  }
};
Item.prototype._updateContents = function(element) {
  var content;
  if (this.options.template) {
    var itemData = this.parent.itemSet.itemsData.get(this.id);
    content = this.options.template(itemData);
  } else {
    content = this.data.content;
  }
  var changed = this._contentToString(this.content) !== this._contentToString(content);
  if (changed) {
    if (content instanceof Element) {
      element.innerHTML = '';
      element.appendChild(content);
    } else if (content != undefined) {
      element.innerHTML = content;
    } else {
      if (!(this.data.type == 'background' && this.data.content === undefined)) {
        throw new Error('Property "content" missing in item ' + this.id);
      }
    }
    this.content = content;
  }
};
Item.prototype._updateTitle = function(element) {
  if (this.data.title != null) {
    element.title = this.data.title || '';
  } else {
    element.removeAttribute('vis-title');
  }
};
Item.prototype._updateDataAttributes = function(element) {
  if (this.options.dataAttributes && this.options.dataAttributes.length > 0) {
    var attributes = [];
    if (Array.isArray(this.options.dataAttributes)) {
      attributes = this.options.dataAttributes;
    } else if (this.options.dataAttributes == 'all') {
      attributes = Object.keys(this.data);
    } else {
      return;
    }
    for (var i = 0; i < attributes.length; i++) {
      var name = attributes[i];
      var value = this.data[name];
      if (value != null) {
        element.setAttribute('data-' + name, value);
      } else {
        element.removeAttribute('data-' + name);
      }
    }
  }
};
Item.prototype._updateStyle = function(element) {
  if (this.style) {
    util.removeCssText(element, this.style);
    this.style = null;
  }
  if (this.data.style) {
    util.addCssText(element, this.data.style);
    this.style = this.data.style;
  }
};
Item.prototype._contentToString = function(content) {
  if (typeof content === 'string')
    return content;
  if (content && 'outerHTML' in content)
    return content.outerHTML;
  return content;
};
Item.prototype.getWidthLeft = function() {
  return 0;
};
Item.prototype.getWidthRight = function() {
  return 0;
};
module.exports = Item;
