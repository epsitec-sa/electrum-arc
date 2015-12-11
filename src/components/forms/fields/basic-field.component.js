'use strict';

import React from 'react';

/******************************************************************************/

export default class BasicField extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    return (
      <input
        onChange={this.onChange}
        onFocus={this.onFocus}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onSelect={this.onSelect}
        style={this.styles}
        type={this.props.type}
        id={this.props.id}
        key='input'
        placeholder={this.props.placeholder}
        disabled={this.props.disabled} // refactor this
        value={this.read ()}
        maxLength={this.props.maxLength}
        />
    );
  }
}

/******************************************************************************/
