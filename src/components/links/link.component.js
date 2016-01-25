'use strict';

import React from 'react';

/******************************************************************************/

export default class Link extends React.Component {

  constructor () {
    super ();
    //  todo: bind event handler
  }

  handleClick () {
    if (this.props.action || this.props.id) {
      console.log (`action=${this.props.action} id=${this.props.id}`);
      //      E.bus.dispatch (this, this.props.action || this.props.id);
    }
  }

  render () {
    const {children, state, href} = this.props;
    const disabled = state.get ('disabled');
    const text = state.get ('text');
    const style = [...this.styles];

    if (disabled) {
      // todo: use disabled style
    }

    return (
      <div>
        <a
          href={href}
          style={style}
          disabled={disabled}
          onClick={this.handleClick} >
          {text}
          {children}
        </a>
      </div>
    );
  }
}

/******************************************************************************/
