'use strict';

var eventHandlers = require ('./event-handlers.js');

var React = require ('react');
var E     = require ('e');
var Box   = require ('../../layouts/Box/Box.jsx');

/*****************************************************************************/

module.exports = E.createClass({

  render: function () {
    var placeholder = this.props.placeholder || '...';
    var style     = require ('./BasicField.styles.js');
    var value     = E.getValue (this);
    var disabled  = E.getState (this, s => s.disabled);
    var fieldType = this.props.type || 'text';

    return (
      <Box container={this.props.container} boxstyle={this.props.boxstyle}>
        <input
          onChange={ev => eventHandlers.handleChange (this, ev)}
          onFocus={ev => eventHandlers.handleFocus (this, ev)}
          onKeyDown={ev => eventHandlers.handleKeyDown (this, ev)}
          onKeyUp={ev => eventHandlers.handleKeyUp (this, ev)}
          onSelect={ev => eventHandlers.handleSelect (this, ev)}
          style={style.base}
          type={fieldType}
          id={this.props.id}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          maxLength={this.props['max-length']}>
        </input>
      </Box>
    );
  }
});

/*****************************************************************************/
