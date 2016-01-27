'use strict';

import React from 'react';

/******************************************************************************/

function getZDepthShadows (zDepth) {
  var shadows = [
    '',
    '0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)',
    '0 3px 10px rgba(0, 0, 0, 0.16), 0 3px 10px rgba(0, 0, 0, 0.23)',
    '0 10px 30px rgba(0, 0, 0, 0.19), 0 6px 10px rgba(0, 0, 0, 0.23)',
    '0 14px 45px rgba(0, 0, 0, 0.25), 0 10px 18px rgba(0, 0, 0, 0.22)',
    '0 19px 60px rgba(0, 0, 0, 0.30), 0 15px 20px rgba(0, 0, 0, 0.22)'
  ];

  return shadows[zDepth];
}


export default class Paper extends React.Component {

  constructor () {
    super ();
    //  todo: bind event handler
  }

  onClick (evt) {
    if (this.props.action || this.props.id) {
      //  todo...
    }
  }

  get paperShadowStyle () {
    return {
      boxShadow: getZDepthShadows (this.props.zDepth)
    };
  }

  render () {
    var style = [...this.styles, this.paperShadowStyle];
    return (
      <div
        style={style}
        onClick={this.onClick}
        onTouchEnd={this.onClick} >
        {this.props.children}
      </div>
    );
  }
}

/******************************************************************************/

Paper.defaultProps = {
  rounded: true,
  zDepth: 1,
  transitionEnabled: true,
  zIndex: 10
};

/******************************************************************************/
