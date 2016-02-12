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
    const text = state.get ('text') || '<missing>';

    if (disabled) {
      <div>
        <a
          style={this.styles.with ('disabled')}
          disabled='disabled' >
          {text}
          {children}
        </a>
      </div>;
    } else {
      return (
        <div>
          <a
            href={href}
            style={this.styles}
            onClick={this.onClick} >
            {text}
            {children}
          </a>
        </div>
      );
    }
  }
}

/******************************************************************************/
