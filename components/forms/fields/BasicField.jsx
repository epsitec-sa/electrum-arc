'use strict';
var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  theme: require ('./BasicField.styles.js'),

  render: function () {
    var eventHandlers = require ('arc').eventHandlers;
    var placeholder   = this.props.placeholder || '...';
    var style     = E.getStyle (this);
    var value     = E.getValue (this);
    var disabled  = E.getState (this, s => s.disabled);
    var fieldType = this.props.type || 'text';

    return (
      <div style={this.props.boxstyle}>
        <input
          onChange={ev => eventHandlers.handleChange (this, ev)}
          onFocus={ev => eventHandlers.handleFocus (this, ev)}
          onKeyDown={ev => eventHandlers.handleKeyDown (this, ev)}
          onKeyUp={ev => eventHandlers.handleKeyUp (this, ev)}
          onSelect={ev => eventHandlers.handleSelect (this, ev)}
          style={style}
          type={fieldType}
          id={this.props.id}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          maxLength={this.props['max-length']}>
        </input>
      </div>
    );
  }

};

/*****************************************************************************/
