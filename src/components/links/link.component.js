'use strict';

import React from 'react';
import {Action} from 'electrum';

/******************************************************************************/

export default class Link extends React.Component {
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
