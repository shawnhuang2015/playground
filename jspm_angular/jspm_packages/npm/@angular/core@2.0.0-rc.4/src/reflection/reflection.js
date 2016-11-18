/* */ 
"use strict";
var reflection_capabilities_1 = require('./reflection_capabilities');
var reflector_1 = require('./reflector');
var reflector_2 = require('./reflector');
exports.ReflectionInfo = reflector_2.ReflectionInfo;
exports.Reflector = reflector_2.Reflector;
exports.reflector = new reflector_1.Reflector(new reflection_capabilities_1.ReflectionCapabilities());
