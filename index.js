'use strict';
var E          = require ('e');
var React      = require ('react');  //  keep this, so that it is in eval's context
var components = {};
var instances  = {};
var req        = require.context ('./components/', true, /\.jsx$/);
var files      = req.keys ();
files.forEach (function (file) {
  var componentId   = req.resolve (file);
  var component     = __webpack_require__ (componentId); // jshint ignore:line
  var matches       = file.match (/([^\/\\]+)\.jsx$/);
  var componentType = matches[1];
  component.webpackId = componentId;
  components[componentType] = component;
});

Object.keys (components).forEach (function (type) {
  var component  = components[type];
  var realRender = component.render;
  component.render = function () {
    console.log ('!INJECT ARC COMPONENTS!');
    var injection = '';
    var res       = null;
    injection += React.justToMakeSureThisDoesNotGetOptimizedAway ||
                 E.justToMakeSureThisDoesNotGetOptimizedAway ||
                '';
    Object.keys (components).forEach (function (type) {
      var component = components[type];
      injection += 'var ' + type + ' =  __webpack_require__ (' + component.webpackId + ');\n';
    });
    injection += 'var render = ' + realRender + ';\n';
    injection += 'res    = render.call (this);\n';
    eval (injection); // jshint ignore:line
    return res;
  };
});

Object.keys (components).forEach (function (type) {
  var component = components[type];
  instances[type] = E.createClass (type, component);
});

module.exports = instances;
