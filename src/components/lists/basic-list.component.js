'use strict';

import React from 'react';

/******************************************************************************/

export default class BasicList extends React.Component {

  render () {
    const {state: keys} = this.props;

    return (
      <div>
        {keys.map (key => <span {...this.link (key)} />)}
      </div>
    );
  }
}

/******************************************************************************/
