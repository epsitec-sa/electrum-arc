'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = E.createClass({

  handleChange: function (event) {
    E.setValue (this, event.target.checked ? 'on' : 'off');
  },

  render: function () {

    var labelText = E.getText (this);
    var style = E.getStyle (this, require ('./Checkbox.styles.js'));
    var value = E.getValue (this);
    var checked  = value === 'on';
    var disabled = E.getState (this, s => s.disabled);

    return (
      <label style={style.label}>
        {labelText}
        <input style={style.input}
          type="checkbox"
          id={this.props.id}
          disabled={disabled}
          checked={checked}
          ohchange={this.handleChange} />
      </label>
    );
  }
});

/*****************************************************************************/
