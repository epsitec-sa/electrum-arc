'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = E.createClass ('CheckboxField', {

  theme:  require ('./CheckboxField.styles.js'),

  handleChange: function (event) {
    event.stopPropagation ();
    E.setValue (this, event.target.checked ? 'on' : 'off');
  },

  render: function () {
    var style = E.getStyle (this);
    var value = E.getValue (this);
    var checked  = value === 'on';
    var disabled = E.getState (this, s => s.disabled);

    return (
      <div style={this.props.boxstyle}>
          <input style={style}
            type="checkbox"
            id={this.props.id}
            disabled={disabled}
            checked={checked}
            onChange={this.handleChange} />
      </div>
    );
  }
});

/*****************************************************************************/
