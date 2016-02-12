'use strict';

import React from 'react';
import {Action} from 'electrum';

/******************************************************************************/

export default class Link extends React.Component {

  constructor () {
    super ();
    //  todo: bind event handler
  }

  onClick () {
    if (this.props.action || this.props.id) {
      console.log (`action=${this.props.action} id=${this.props.id}`);
      //      E.bus.dispatch (this, this.props.action || this.props.id);
    }
  }

  render () {
    const {children, state, href} = this.props;
    const disabled = Action.isDisabled (state);
    const text = state.get ('text') || (children ? null : '<missing>');
    const attr = {};

    if (href) {
      // Only add href attribute if href exists, or else React will produce
      // an <a href="">...</a> element, which is clickable.
      attr.href = href;
    }

    if (disabled) {
      attr.style = this.styles.with ('disabled');
      attr.disabled = 'disabled';
    } else {
      attr.style = this.styles;
      attr.onClick = this.onClick;
    }

    return (
      <a {...attr}>{text}{children}</a>
    );
  }
}

/******************************************************************************/
