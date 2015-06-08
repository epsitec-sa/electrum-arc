'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  propTypes: {
    show: React.PropTypes.bool,
    'z-index': React.PropTypes.int,
    autoLockScrolling: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      autoLockScrolling: true,
      'z-index': 9,
    };
  },

  componentDidUpdate: function() {
    if (this.props.autoLockScrolling) {
      (this.props.show) ? this._preventScrolling() : this._allowScrolling();
    }
  },

  render: function () {
    var style = [{
      position: 'fixed',
      height: '100%',
      width: '100%',
      top: 0,
      left: '-100%',
      opacity: 0,
      backgroundColor: E.colors.lightBlack,
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
      zIndex: this.props['z-index'],
      willChange: 'opacity',
      transform: 'translateZ(0)',
      transition: E.transitions.easeOut ('0ms', 'left', '400ms') + ',' +
                  E.transitions.easeOut ('400ms', 'opacity')
    }];

    var showStyle = {
      left: 0,
      opacity: 1,
      transition: E.transitions.easeOut ('0ms', 'left') + ',' +
                  E.transitions.easeOut ('400ms', 'opacity')
    }

    if (this.props.show) {
      style.push (showStyle);
    }
    console.log ('Overlay @' + this.props['z-index']);
    return (
      <div onClick={this.props.onClick} style={style} />
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
