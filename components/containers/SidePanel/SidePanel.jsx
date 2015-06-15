'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  propTypes: {
    side: React.PropTypes.string,
    onDismiss: React.PropTypes.func,
    repositionOnUpdate: React.PropTypes.bool,
    modal: React.PropTypes.bool,
    'z-index': React.PropTypes.int
  },

  getDefaultProps: function () {
    return {
      'z-index': 10,
      side: 'left'
    };
  },

  componentDidMount: function () {
    this.refs.dialogOverlay.preventScrolling ();
  },

  componentDidUpdate: function () {

  },

  getContainerStyles: function () {
    var styles = [{
      position: 'fixed',
      overflow: 'hidden',
      zIndex: this.props['z-index'],
      width: E.spacing.desktopKeylineIncrement * 6,
      height: '100%',
      color: E.palette.textColor,
      top: 0,
      left: 0
    }];
    
    if (this.props.side !== 'left') {
      styles.push ({
        left: 'auto',
        right: '0'
      });
    }

    return styles;
  },

  getContentStyles: function () {
    return [{
      overflowY: 'auto',
      overflowX: 'hidden',
      height: '100%'
    }];
  },

  render: function  () {
    var A          = require ('arc');
    var Paper      = A.Paper;
    var Overlay    = A.Overlay;
    var Transition = A.Transition;
    var containerStyles  = this.getContainerStyles ();
    var contentStyles    = this.getContentStyles ();

    if (this.props.boxstyle) {
      contentStyles.push (this.props.boxstyle);
    }

    return (
      <Transition transition="leftPanel">
        <Overlay
          ref="dialogOverlay"
          z-index={this.props['z-index']}
          autoLockScrolling={false}
          onClick={this._handleClick}
        />
        <Paper
            key="content"
            ref="dialogWindow"
            boxstyle={containerStyles}
            zDepth={4}
          >
          <div style={contentStyles}>
            {this.props.children}
          </div>
        </Paper>
      </Transition>
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
