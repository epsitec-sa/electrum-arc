import React from 'react';
import {Action} from 'electrum';

/******************************************************************************/

export default class Link extends React.Component {
  get isDisabled () {
    const {state} = this.props;
    return Action.isDisabled (state);
  }

  get styleProps () {
    return {
      disabled: this.isDisabled
    };
  }

  render () {
    const {children, href} = this.props;
    const text = this.read ('text') || (children ? null : '<missing>');
    const attr = {
      style: this.getStyles ('style1')
    };

    if (href) {
      // Only add href attribute if href exists, or else React will produce
      // an <a href="">...</a> element, which is clickable.
      attr.href = href;
    }

    if (this.isDisabled) {
      attr.disabled = 'disabled';
    } else {
      attr.onClick = this.onClick;
    }

    return (
      <a {...attr}>{text}{children}</a>
    );
  }
}

/******************************************************************************/
