'use strict';

import React from 'react';

/******************************************************************************/

export default class AppCanvas extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    return (
      <div style={this.styles}>
        {this.props.children}
      </div>
    );
  }
}

/******************************************************************************/
