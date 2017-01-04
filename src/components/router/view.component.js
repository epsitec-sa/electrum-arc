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
    console.log ('View.isVisible');
    const router = this.read ('router');
    const route  = this.read ('route');
    if (window.document.routers && window.document.routers.has (router)) {
      const r = window.document.routers.get (router);
      return r.active === route;
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
      const {state} = this.props;
      const kind = this.read ('kind');

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
