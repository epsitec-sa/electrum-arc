'use strict';

import React from 'react';
import {E} from 'electrum';

const Paper = E.components.Paper;
const Overlay = E.components.Overlay;

/*****************************************************************************/

module.exports = {

  propTypes: {
    side: React.PropTypes.string,
    onDismiss: React.PropTypes.func,
    repositionOnUpdate: React.PropTypes.bool,
    modal: React.PropTypes.bool,
    size: React.PropTypes.number,
    'z-index': React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      'z-index': 10,
      side: 'left',
      overlay: false,
      size: E.spacing.desktopKeylineIncrement * 4
    };
  },

  componentDidMount: function () {
    if (this.props.modal) {
      this.refs.dialogOverlay.preventScrolling ();
    }
  },

  componentDidUpdate: function () {

  },

  getContainerStyles: function () {
    var styles = [{
      position: 'fixed',
      zIndex: this.props['z-index'],
      color: E.palette.textColor
    }];

    switch (this.props.side) {
    case 'right': styles.push ({
        height: '100%',
        top: 0,
        left: 'auto',
        right: '0',
        minWidth: this.props.size,
        maxWidth: '80%',
      });
    break;
    case 'top':
      styles.push ({
        width: '100%',
        top: 0,
        left: 0,
        minHeight: this.props.size,
        maxHeight: '80%',
      });
    break;
    case 'bottom': styles.push ({
        width: '100%',
        bottom: 0,
        left: 0,
        minHeight: this.props.size,
        maxHeight: '80%',
      });
    break;
    case 'left': styles.push ({
        height: '100%',
        top: 0,
        left: 0,
        minWidth: this.props.size,
        maxWidth: '80%',
      });
    break;
    default: styles.push ({
        height: '100%',
        top: 0,
        left: 0,
        minWidth: this.props.size,
        maxWidth: '80%',
      });
    }

    return styles;
  },

  getContentStyles: function () {
    return [{
      height: '100%',
      width: '100%',
      paddingRight: '10px'
    }];
  },

  render: function () {
    var containerStyles  = this.getContainerStyles ();
    var contentStyles    = this.getContentStyles ();

    return (
      <div>
        {this.props.overlay && <Overlay
          ref='dialogOverlay'
          z-index={this.props['z-index']}
          autoLockScrolling={false}
          onClick={this._handleClick}
        />}
        <Paper
            key='content'
            ref='dialogWindow'
            boxstyle={containerStyles}
            zDepth={4}
          >
          <div style={contentStyles}>
            {this.props.children}
          </div>
        </Paper>
      </div>
    );
  },

  dismiss: function () {
    this._onDismiss ();
    this.refs.dialogOverlay.allowScrolling ();
    E.bus.dispatch (this, 'Dismiss');
  },

  _onDismiss: function () {
    if (this.props.onDismiss) {
      this.props.onDismiss ();
    }
  },

  _handleClick: function () {
    if (!this.props.modal) {
      this.dismiss ();
    }
  },

  _handleWindowKeyUp: function (e) {
    if (!this.props.modal && e.keyCode === 27 ) { //ESC
      this.dismiss ();
    }
  }

};

/*****************************************************************************/
