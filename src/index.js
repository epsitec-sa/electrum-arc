'use strict';

var E          = require ('e');
var components = {};
var instances  = {};
var req        = require.context ('./components/', true, /\.jsx$/);
var files      = req.keys ();

files.forEach (function (file) {
  var componentId   = req.resolve (file);
  var component     = __webpack_require__ (componentId); // jshint ignore:line
  var matches       = file.match (/([^\/\\]+)\.jsx$/);
  var componentType = matches[1];
  components[componentType] = component;
});

Object.keys (components).forEach (function (type) {
  var component = components[type];
  instances[type] = E.createClass (type, component);
});

instances.eventHandlers = require ('./event-handlers.js');
module.exports          = instances;
