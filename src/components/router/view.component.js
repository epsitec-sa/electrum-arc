'use strict';

import React from 'react';
import {Container} from '../../all-components.js';

/******************************************************************************/

export default class View extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      visible: false,
    };
    this.router = null;
    this.route  = null;
  }

  getVisible () {
    return this.state.visible;
  }

  setVisible (value) {
    this.setState ( {
      visible: value
    });
  }

  isVisible () {
    if (window.document.routers && window.document.routers.has (this.router)) {
      const r = window.document.routers.get (this.router);
      return r.active === this.route;
    } else {
      return false;
    }
  }

  componentDidMount () {
    this.router = this.read ('router');
    this.route  = this.read ('route');
    if (!this.router || !this.route) {
      throw new Error ('View has not router or route');
    }
    if (!window.document.views) {
      window.document.views = [];
    }
    window.document.views.push (this);
    this.setVisible (this.isVisible ());
  }

  componentWillUnmount () {
    const index = window.document.views.indexOf (this);
    if (index !== -1) {
      window.document.views.splice (index, 1);
    }
  }

  render () {
    if (this.getVisible ()) {
      return (
        <Container {...this.props} {...this.link ()}>
          {this.props.children}
        </Container>
      );
    } else {
      return null;
    }
  }
}

/******************************************************************************/
