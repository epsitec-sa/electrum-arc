'use strict';

import React from 'react';

/******************************************************************************/

export default class Label extends React.Component {
  render () {
    return (
      <div style={this.props.boxstyle}>
        <label id={this.props.id} style={this.styles}>
          {this.read ()}
          {this.props.children}
        </label>
      </div>
    );
  }
}

/******************************************************************************/
