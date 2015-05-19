'use strict';

var eventHandlers = require ('../event-handlers.js');

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = E.createClass({

  render: function () {
    var placeholder = this.props.placeholder || '...';
    var style     = require ('./TextField.styles.js');
    var value     = E.getValue (this);
    var disabled  = E.getState (this, s => s.disabled);

    return (
      <div style={style.container[this.props.layout]}>
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
      </div>
    );
  }
});

/*****************************************************************************/
