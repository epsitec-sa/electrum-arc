'use strict';

import React from 'react';
import {Button} from '../../all-components.js';

/******************************************************************************/

export default class Route extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props;

    return (
      <Button kind='container' {...this.props} {...this.link ()}>
        {this.props.children}
      </Button>
    );
  }
}

/******************************************************************************/
