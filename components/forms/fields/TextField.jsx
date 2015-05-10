'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = E.createClass({

  render: function () {

    var labelText = E.getText (this);
    var placeholder = this.props.placeholder || '...';
    var style = E.getStyle (this, require ('./TextField.styles.js'));
    var value = E.getValue (this);
    var disabled = E.getState (this, s => s.disabled);

    return (
      <label style={style.label}>
        {labelText}
        <input style={style.input}
          type="text"
          id={this.props.id}
          placeholder={placeholder}
          disabled={disabled}
          value={value} />
      </label>
    );
  }
});

/*****************************************************************************/
