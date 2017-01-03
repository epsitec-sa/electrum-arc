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
    const mouseDown = this.read ('mouse-down');
    console.log ('Route.render');

    return (
      <Button kind='container' {...this.props} mouse-down={mouseDown} {...this.link ()}>
        {this.props.children}
      </Button>
    );
  }
}

/******************************************************************************/
