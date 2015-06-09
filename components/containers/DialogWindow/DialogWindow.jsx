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

  getInitialState: function() {
    return {
      open: this.props.open || false
    };
  },

  componentDidMount: function() {
    this._positionDialog();
    if (this.props.open) {
      this.refs.dialogOverlay.preventScrolling();
      this._onShow ();
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    this._positionDialog ();
  },

  render: function  () {
    var A          = require ('arc');
    var Paper      = A.Paper;
    var Overlay    = A.Overlay;

    var windowStyle = [{
      position: 'fixed',
      boxSizing: 'border-box',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)',
      zIndex: this.props['z-index'],
      top: 0,
      left: -10000,
      width: '100%',
      height: '100%',
      transition: E.transitions.easeOut ('0ms', 'left', '450ms'),
      color: E.palette.textColor
    }];

    var windowOpen = {
      left: 2,
      transition: E.transitions.easeOut ('0ms', 'left', '0ms')
    };

    var contentStyle = [{
      boxSizing: 'border-box',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)',
      transition: E.transitions.easeOut (),
      position: 'relative',
      width: '50%',
      minWidth: (E.spacing.desktopKeylineIncrement * 4),
      maxWidth: (E.spacing.desktopKeylineIncrement * 12),
      margin: '0 auto',
      zIndex: this.props['z-index'] + 2,
      background: E.palette.canvasColor,
      opacity: 0
    }];

    var contentOpen = {
      opacity: 1,
      top: 0,
      transform: 'translate3d(0, ' + E.spacing.desktopKeylineIncrement + 'px, 0)'
    };

    if (this.state.open) {
      windowStyle.push (windowOpen);
      contentStyle.push (contentOpen);
    }

    if (this.props.boxstyle) {
      contentStyle = contentStyle.concat (this.props.boxstyle);
    }


    return (
      <div ref="container" style={windowStyle}>
        <Paper
          ref="dialogWindow"
          boxstyle={contentStyle}
          zDepth={4}
        >
          {this.props.children}
        </Paper>
        <Overlay
          ref="dialogOverlay"
          z-index={this.props['z-index'] + 1}
          show={this.state.open}
          autoLockScrolling={false}
          onClick={this._handleClick}
        />
      </div>
    );
  },

  isOpen: function() {
    return this.state.open;
  },

  dismiss: function() {
    this.refs.dialogOverlay.allowScrolling();
    this.setState ({ open: false });
    this._onDismiss ();
  },

  show: function() {
    this.refs.dialogOverlay.preventScrolling ();
    this.setState({ open: true });
    this._onShow ();
  },

  _positionDialog: function() {
    var container = React.findDOMNode (this.refs.container);
    var dialogWindow = React.findDOMNode (this.refs.dialogWindow);
    var containerHeight = container.offsetHeight;
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
    E.bus.dispatch (this, 'Dismiss');
    if (this.props.onDismiss) {
      this.props.onDismiss ();
    }
  },

  _handleClick: function () {
    if (!this.props.modal) {
      this.dismiss ();
      if (this.props.onClickAway) {
        this.props.onClickAway ();
      }
    }
  },

  _handleWindowKeyUp: function (e) {
    if (!this.props.modal && e.keyCode == 27 ) { //ESC
      this.dismiss ();
    }
  }

};

/*****************************************************************************/
