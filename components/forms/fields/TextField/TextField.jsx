'use strict';

var E             = require ('e');
var React         = require ('react');
var eventHandlers = require ('../event-handlers.js');

/*****************************************************************************/

module.exports = {

  render: function () {

    var labelText = E.getText (this);
    var placeholder = this.props.placeholder || '...';
    var style = E.getStyle (this, require ('./TextField.styles.js'));
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
          type="text"
          id={this.props.id}
          placeholder={placeholder}
          disabled={disabled}
          value={value} />
      </label>
    );
  }
};

/*****************************************************************************/
