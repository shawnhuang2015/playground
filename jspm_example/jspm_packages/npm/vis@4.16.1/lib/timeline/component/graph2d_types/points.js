/* */ 
var DOMutil = require('../../../DOMutil');
function Points(groupId, options) {}
Points.draw = function(dataset, group, framework, offset) {
  offset = offset || 0;
  var callback = getCallback(framework, group);
  for (var i = 0; i < dataset.length; i++) {
    if (!callback) {
      DOMutil.drawPoint(dataset[i].screen_x + offset, dataset[i].screen_y, getGroupTemplate(group), framework.svgElements, framework.svg, dataset[i].label);
    } else {
      var callbackResult = callback(dataset[i], group);
      if (callbackResult === true || typeof callbackResult === 'object') {
        DOMutil.drawPoint(dataset[i].screen_x + offset, dataset[i].screen_y, getGroupTemplate(group, callbackResult), framework.svgElements, framework.svg, dataset[i].label);
      }
    }
  }
};
Points.drawIcon = function(group, x, y, iconWidth, iconHeight, framework) {
  var fillHeight = iconHeight * 0.5;
  var path,
      fillPath;
  var outline = DOMutil.getSVGElement("rect", framework.svgElements, framework.svg);
  outline.setAttributeNS(null, "x", x);
  outline.setAttributeNS(null, "y", y - fillHeight);
  outline.setAttributeNS(null, "width", iconWidth);
  outline.setAttributeNS(null, "height", 2 * fillHeight);
  outline.setAttributeNS(null, "class", "vis-outline");
  DOMutil.drawPoint(x + 0.5 * iconWidth, y, getGroupTemplate(group), framework.svgElements, framework.svg);
};
function getGroupTemplate(group, callbackResult) {
  callbackResult = (typeof callbackResult === 'undefined') ? {} : callbackResult;
  return {
    style: callbackResult.style || group.options.drawPoints.style,
    styles: callbackResult.styles || group.options.drawPoints.styles,
    size: callbackResult.size || group.options.drawPoints.size,
    className: callbackResult.className || group.className
  };
}
function getCallback(framework, group) {
  var callback = undefined;
  if (framework.options && framework.options.drawPoints && framework.options.drawPoints.onRender && typeof framework.options.drawPoints.onRender == 'function') {
    callback = framework.options.drawPoints.onRender;
  }
  if (group.group.options && group.group.options.drawPoints && group.group.options.drawPoints.onRender && typeof group.group.options.drawPoints.onRender == 'function') {
    callback = group.group.options.drawPoints.onRender;
  }
  return callback;
}
module.exports = Points;
