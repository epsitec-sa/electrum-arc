'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  propTypes: {
    'z-index': React.PropTypes.int,
    autoLockScrolling: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      autoLockScrolling: true,
      'z-index': 9,
    };
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
      left: 0,
      backgroundColor: E.colors.lightBlack,
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
      zIndex: this.props['z-index']
    }];
  },

  render: function () {
    var A          = require ('arc');
    var Transition = A.Transition;

    return (
      <Transition transition="overlay">
        <div
          key={'overlay'}
          ref="overlay"
          onClick={this.props.onClick}
          onTouchEnd={this.props.onClick}
          style={this.getOverlayStyles ()} />
      </Transition>
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

};

/*****************************************************************************/
