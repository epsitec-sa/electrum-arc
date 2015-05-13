'use strict';
var E          = require ('e');

var components = {
  Button:        require ('./components/buttons/Button/Button.jsx'),
  Checkbox:      require ('./components/forms/options/Checkbox/Checkbox.jsx'),
  Label:         require ('./components/texts/Label/Label.jsx'),
  PasswordField: require ('./components/forms/fields/PasswordField/PasswordField.jsx'),
  TextField:     require ('./components/forms/fields/TextField/TextField.jsx'),
  List:          require ('./components/collections/List/List.jsx')
};


Object.keys (components).forEach (function (type) {
  var component = components[type];
  component.type = type;
  module.exports[type] = E.createClass (component);
});
