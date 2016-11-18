/* */ 
var Point3d = require('./Point3d');
function Camera() {
  this.armLocation = new Point3d();
  this.armRotation = {};
  this.armRotation.horizontal = 0;
  this.armRotation.vertical = 0;
  this.armLength = 1.7;
  this.cameraLocation = new Point3d();
  this.cameraRotation = new Point3d(0.5 * Math.PI, 0, 0);
  this.calculateCameraOrientation();
}
Camera.prototype.setArmLocation = function(x, y, z) {
  this.armLocation.x = x;
  this.armLocation.y = y;
  this.armLocation.z = z;
  this.calculateCameraOrientation();
};
Camera.prototype.setArmRotation = function(horizontal, vertical) {
  if (horizontal !== undefined) {
    this.armRotation.horizontal = horizontal;
  }
  if (vertical !== undefined) {
    this.armRotation.vertical = vertical;
    if (this.armRotation.vertical < 0)
      this.armRotation.vertical = 0;
    if (this.armRotation.vertical > 0.5 * Math.PI)
      this.armRotation.vertical = 0.5 * Math.PI;
  }
  if (horizontal !== undefined || vertical !== undefined) {
    this.calculateCameraOrientation();
  }
};
Camera.prototype.getArmRotation = function() {
  var rot = {};
  rot.horizontal = this.armRotation.horizontal;
  rot.vertical = this.armRotation.vertical;
  return rot;
};
Camera.prototype.setArmLength = function(length) {
  if (length === undefined)
    return;
  this.armLength = length;
  if (this.armLength < 0.71)
    this.armLength = 0.71;
  if (this.armLength > 5.0)
    this.armLength = 5.0;
  this.calculateCameraOrientation();
};
Camera.prototype.getArmLength = function() {
  return this.armLength;
};
Camera.prototype.getCameraLocation = function() {
  return this.cameraLocation;
};
Camera.prototype.getCameraRotation = function() {
  return this.cameraRotation;
};
Camera.prototype.calculateCameraOrientation = function() {
  this.cameraLocation.x = this.armLocation.x - this.armLength * Math.sin(this.armRotation.horizontal) * Math.cos(this.armRotation.vertical);
  this.cameraLocation.y = this.armLocation.y - this.armLength * Math.cos(this.armRotation.horizontal) * Math.cos(this.armRotation.vertical);
  this.cameraLocation.z = this.armLocation.z + this.armLength * Math.sin(this.armRotation.vertical);
  this.cameraRotation.x = Math.PI / 2 - this.armRotation.vertical;
  this.cameraRotation.y = 0;
  this.cameraRotation.z = -this.armRotation.horizontal;
};
module.exports = Camera;
