'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  propTypes: {
    onDismiss: React.PropTypes.func,
    repositionOnUpdate: React.PropTypes.bool,
    modal: React.PropTypes.bool,
    'z-index': React.PropTypes.int
  },

  getDefaultProps: function () {
    return {
      repositionOnUpdate: true,
      modal: false,
      'z-index': 10
    };
  },

  componentDidMount: function () {
    this._positionDialog ();
    this.refs.dialogOverlay.preventScrolling ();
  },

  componentDidUpdate: function (prevProps, prevState) {
    this._positionDialog ();
  },

  getContainerStyles: function () {
    return [{
      position: 'fixed',
      boxSizing: 'border-box',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)',
      zIndex: this.props['z-index'],
      top: 0,
      width: '100%',
      height: '100%',
      color: E.palette.textColor
    }];
  },

  getContentStyles: function () {
    return [{
      boxSizing: 'border-box',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)',
      position: 'relative',
      width: '50%',
      minWidth: (E.spacing.desktopKeylineIncrement * 4),
      maxWidth: (E.spacing.desktopKeylineIncrement * 12),
      margin: '0 auto',
      zIndex: this.props['z-index'] + 2,
      background: E.palette.canvasColor,
    }];
  },

  render: function  () {
    var A          = require ('arc');
    var TGroup     = A.TransitionGroup;
    var Paper      = A.Paper;
    var Overlay    = A.Overlay;
    var containerStyles  = this.getContainerStyles ();
    var contentStyles    = this.getContentStyles ();

    if (this.props.boxstyle) {
      contentStyles.push (this.props.boxstyle);
    }

    return (
      <div ref="container" style={containerStyles}>
        <Paper
            key="content"
            ref="dialogWindow"
            boxstyle={contentStyles}
            zDepth={4}
          >
          {this.props.children}
        </Paper>
        <Overlay
          ref="dialogOverlay"
          z-index={this.props['z-index'] + 1}
          autoLockScrolling={false}
          onClick={this._handleClick}
        />
      </div>
    );
  },

  dismiss: function () {
    this._onDismiss ();
    this.refs.dialogOverlay.allowScrolling ();
    E.bus.dispatch (this, 'Dismiss');
  },

  _positionDialog: function() {
    var container          = React.findDOMNode (this.refs.container);
    var dialogWindow       = React.findDOMNode (this.refs.dialogWindow);
    var containerHeight    = container.offsetHeight;
    var dialogWindowHeight = dialogWindow.offsetHeight;

    //Reset the height in case the window was resized.
    dialogWindow.style.height = '';

    var paddingTop = Math.max (((containerHeight - dialogWindowHeight) / 2) - 64, 0);

    //Vertically center the dialog window, but make sure it doesn't
    //transition to that position.
    if (this.props.repositionOnUpdate || !container.style.paddingTop) {
      container.style.paddingTop = paddingTop + 'px';
    }

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
    if (!this.props.modal && e.keyCode == 27 ) { //ESC
      this.dismiss ();
    }
  }

};

/*****************************************************************************/
