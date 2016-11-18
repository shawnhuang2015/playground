/* */ 
var DataView = require('../DataView');
function Filter(data, column, graph) {
  this.data = data;
  this.column = column;
  this.graph = graph;
  this.index = undefined;
  this.value = undefined;
  this.values = graph.getDistinctValues(data.get(), this.column);
  this.values.sort(function(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
  });
  if (this.values.length > 0) {
    this.selectValue(0);
  }
  this.dataPoints = [];
  this.loaded = false;
  this.onLoadCallback = undefined;
  if (graph.animationPreload) {
    this.loaded = false;
    this.loadInBackground();
  } else {
    this.loaded = true;
  }
}
;
Filter.prototype.isLoaded = function() {
  return this.loaded;
};
Filter.prototype.getLoadedProgress = function() {
  var len = this.values.length;
  var i = 0;
  while (this.dataPoints[i]) {
    i++;
  }
  return Math.round(i / len * 100);
};
Filter.prototype.getLabel = function() {
  return this.graph.filterLabel;
};
Filter.prototype.getColumn = function() {
  return this.column;
};
Filter.prototype.getSelectedValue = function() {
  if (this.index === undefined)
    return undefined;
  return this.values[this.index];
};
Filter.prototype.getValues = function() {
  return this.values;
};
Filter.prototype.getValue = function(index) {
  if (index >= this.values.length)
    throw 'Error: index out of range';
  return this.values[index];
};
Filter.prototype._getDataPoints = function(index) {
  if (index === undefined)
    index = this.index;
  if (index === undefined)
    return [];
  var dataPoints;
  if (this.dataPoints[index]) {
    dataPoints = this.dataPoints[index];
  } else {
    var f = {};
    f.column = this.column;
    f.value = this.values[index];
    var dataView = new DataView(this.data, {filter: function(item) {
        return (item[f.column] == f.value);
      }}).get();
    dataPoints = this.graph._getDataPoints(dataView);
    this.dataPoints[index] = dataPoints;
  }
  return dataPoints;
};
Filter.prototype.setOnLoadCallback = function(callback) {
  this.onLoadCallback = callback;
};
Filter.prototype.selectValue = function(index) {
  if (index >= this.values.length)
    throw 'Error: index out of range';
  this.index = index;
  this.value = this.values[index];
};
Filter.prototype.loadInBackground = function(index) {
  if (index === undefined)
    index = 0;
  var frame = this.graph.frame;
  if (index < this.values.length) {
    var dataPointsTemp = this._getDataPoints(index);
    if (frame.progress === undefined) {
      frame.progress = document.createElement('DIV');
      frame.progress.style.position = 'absolute';
      frame.progress.style.color = 'gray';
      frame.appendChild(frame.progress);
    }
    var progress = this.getLoadedProgress();
    frame.progress.innerHTML = 'Loading animation... ' + progress + '%';
    frame.progress.style.bottom = 60 + 'px';
    frame.progress.style.left = 10 + 'px';
    var me = this;
    setTimeout(function() {
      me.loadInBackground(index + 1);
    }, 10);
    this.loaded = false;
  } else {
    this.loaded = true;
    if (frame.progress !== undefined) {
      frame.removeChild(frame.progress);
      frame.progress = undefined;
    }
    if (this.onLoadCallback)
      this.onLoadCallback();
  }
};
module.exports = Filter;
