'use strict';

var eventHandlers = require ('../event-handlers.js');

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  render: function () {

    var labelText = E.getText (this);
    var placeholder = this.props.placeholder;
    var style = E.getStyle (this, require ('./PasswordField.styles.js'));
    var value = E.getValue (this);
    var disabled = E.getState (this, s => s.disabled);

    return (
      <label style={style.label}>
        {labelText}
        <input
          onChange={ev => eventHandlers.handleChange (this, ev)}
          onFocus={ev => eventHandlers.handleFocus (this, ev)}
          onKeyDown={ev => eventHandlers.handleKeyDown (this, ev)}
          onKeyUp={ev => eventHandlers.handleKeyUp (this, ev)}
          onSelect={ev => eventHandlers.handleSelect (this, ev)}
          style={style.input}
          type="password"
          id={this.props.id}
          placeholder={placeholder}
          disabled={disabled}
          value={value} />
      </label>
    );
  }
};

/*****************************************************************************/
