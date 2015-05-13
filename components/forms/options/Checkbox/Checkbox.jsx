'use strict';

var E          = require ('e');
var React      = require ('react');
/*****************************************************************************/
module.exports = {

  handleChange: function (event) {
    event.stopPropagation ();
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
        <input style={style.input}
          type="checkbox"
          id={this.props.id}
          disabled={disabled}
          checked={checked}
          onChange={this.handleChange} />
        {labelText}
      </label>
    );
  }
};

/*****************************************************************************/
