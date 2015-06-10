'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  propTypes: {
    'z-index': React.PropTypes.int,
    autoLockScrolling: React.PropTypes.bool
  },

  getInitialState: function() {
    return {display: true};
  },

  getDefaultProps: function () {
    return {
      autoLockScrolling: true,
      'z-index': 9,
    };
  },

  componentWillUnmount: function () {
    console.log ('Unmount overlay...');
  },

  close: function () {
    console.log ('Closing overlay...');
    this.allowScrolling ();
    this.setState ({display: false});
  },

  componentDidUpdate: function () {
    if (this.props.autoLockScrolling) {
      this._preventScrolling ();
    }
  },

  getOverlayStyles: function () {
    return [{
      position: 'fixed',
      height: '100%',
      width: '100%',
      top: 0,
      backgroundColor: E.colors.lightBlack,
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
      zIndex: this.props['z-index']
    }];
  },

  getOverlayTransitionStyles: function () {
    return  {
      appear: {
        left: '-100%',
        opacity: 0,
        willChange: 'opacity',
        transform: 'translateZ(0)',
        transition: E.transitions.easeOut ('0ms', 'left', '400ms') + ',' +
                    E.transitions.easeOut ('400ms', 'opacity')
      },
      appearActive: {
        left: 0,
        opacity: 1,
        transition: E.transitions.easeOut ('0ms', 'left') + ',' +
                    E.transitions.easeOut ('400ms', 'opacity')
      },
      enter: {
      },
      enterActive: {
      },
      leave: {
        left: 0,
        opacity: 1,
        transition: E.transitions.easeOut ('0ms', 'left') + ',' +
                    E.transitions.easeOut ('400ms', 'opacity')
      },
      leaveActive: {
        left: '-100%',
        opacity: 0,
        willChange: 'opacity',
        transform: 'translateZ(0)',
        transition: E.transitions.easeOut ('0ms', 'left', '400ms') + ',' +
                    E.transitions.easeOut ('400ms', 'opacity')
      }
    };
  },

  render: function () {
    var A          = require ('arc');
    var TGroup     = A.TransitionGroup;

    return (
      <TGroup component="div">
        {this.state.display &&
          <div
            key={'overlay'}
            ref="overlay"
            transitionEnd={this.props.whenClosed}
            transitionStyles={this.getOverlayTransitionStyles ()}
            onClick={this.props.onClick}
            style={this.getOverlayStyles ()} />
        }
      </TGroup>
    );
  },

  preventScrolling: function() {
    if (!this.props.autoLockScrolling) {
      this._preventScrolling ();
    }
  },

  allowScrolling: function() {
    if (!this.props.autoLockScrolling) {
      this._allowScrolling ();
    }
  },

  _preventScrolling: function() {
    var body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'hidden';
  },

  _allowScrolling: function() {
    var body = document.getElementsByTagName('body')[0];
    body.style.overflow = '';
  }

}

/*****************************************************************************/
