'use strict';

import React from 'react';

/******************************************************************************/

export default class AppCanvas extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const appStyle = this.mergeStyles ('app');
    return (
      <div style={appStyle}>
        {this.props.children}
      </div>
    );
  }
}

/******************************************************************************/
