/* */ 
"use strict";
var decorators_1 = require('../util/decorators');
var metadata_1 = require('./metadata');
exports.Inject = decorators_1.makeParamDecorator(metadata_1.InjectMetadata);
exports.Optional = decorators_1.makeParamDecorator(metadata_1.OptionalMetadata);
exports.Injectable = decorators_1.makeDecorator(metadata_1.InjectableMetadata);
exports.Self = decorators_1.makeParamDecorator(metadata_1.SelfMetadata);
exports.Host = decorators_1.makeParamDecorator(metadata_1.HostMetadata);
exports.SkipSelf = decorators_1.makeParamDecorator(metadata_1.SkipSelfMetadata);
