'use strict';

import React from 'react';
import {Container} from '../../all-components.js';

/******************************************************************************/

export default class View extends React.Component {

  constructor (props) {
    super (props);
  }

  isVisible () {
    const router = this.read ('router');
    const route  = this.read ('route');
    if (window.document.routers.has (router)) {
      return router.getActive () === route;
    } else {
      return false;
    }
  }

  render () {
    if (this.isVisible ()) {
      const {state} = this.props;
      const kind   = this.read ('kind');

      return (
        <Container kind={kind} {...this.link ()}>
          {this.props.children}
        </Container>
      );
    } else {
      return null;
    }
  }
}

/******************************************************************************/
