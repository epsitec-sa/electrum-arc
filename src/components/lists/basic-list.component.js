'use strict';

import React from 'react';

/******************************************************************************/

export default class BasicList extends React.Component {

  render () {
    const {state, theme} = this.props;
    const keys = state.keys;
    const template = this.props.template || <div>Missing template</div>;
    return (
      <ul style={this.styles}>
        {keys.map (key => template (state.select (key), theme))}
      </ul>
    );
  }
}

/******************************************************************************/
