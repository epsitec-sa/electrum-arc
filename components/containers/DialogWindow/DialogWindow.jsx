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

  getContentTransitionStyles: function () {
    return  {
      appear: {
        // ... component is about to enter, timing is key
        transition: E.transitions.easeOut (),
        opacity: 0
      },
      appearActive: {
        // ... component has been painted, how will animate?
        transform: 'translate3d(0, ' + E.spacing.desktopKeylineIncrement + 'px, 0)',
        opacity: 1
      },
      enter: {
        transition: E.transitions.easeOut (),
        opacity: 0
      },
      enterActive: {
        transform: 'translate3d(0, ' + E.spacing.desktopKeylineIncrement + 'px, 0)',
        opacity: 1
      },
      leave: {
        transform: 'translate3d(0, ' + E.spacing.desktopKeylineIncrement + 'px, 0)',
        opacity: 1
      },
      leaveActive: {
        transition: E.transitions.easeOut (),
        opacity: 0
      }
    };
  },

  render: function  () {
    var A          = require ('arc');
    var TGroup     = A.TransitionGroup;
    var Paper      = A.Paper;
    var Overlay    = A.Overlay;

    var containerStyles  = this.getContainerStyles ();
    var contentStyles    = this.getContentStyles ();
    var contentTransitionStyles = this.getContentTransitionStyles ();


    if (this.props.boxstyle) {
      contentStyles.push (this.props.boxstyle);
    }

    return (
      <div ref="container" style={containerStyles}>
        <TGroup component="div" >
          <Paper
            key="content"
            ref="dialogWindow"
            transitionStyles={contentTransitionStyles}
            boxstyle={contentStyles}
            zDepth={4}
          >
            {this.props.children}
          </Paper>
        </TGroup>
        <Overlay
          key={'overlay'}
          ref="dialogOverlay"
          z-index={this.props['z-index'] + 1}
          autoLockScrolling={false}
          onClick={this._handleClick}
        />
      </div>
    );
  },

  dismiss: function() {
    this.refs.dialogOverlay.allowScrolling();
    this._onDismiss ();
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
