'use strict';

var React    = require ('react/addons');
var E        = require ('e');
var velocity = require ('velocity-animate');

/*****************************************************************************/

module.exports = {

  propTypes: {
    transition: React.PropTypes.string
  },

  getTransition: function () {
    var transition        = E.transitions[this.props.transition];
    var defaultTransition = E.transitions.defaultTransition;
    return transition || defaultTransition;
  },

  componentWillAppear: function (done) {
    var node       = this.getDOMNode ();
    var transition = this.getTransition ();
    this._animate (node, transition.enter, transition.duration, done);
	},

  componentWillEnter: function (done) {
    var node       = this.getDOMNode ();
    var transition = this.getTransition ();
    this._animate (node, transition.enter, transition.duration, done);
	},

  componentWillLeave: function (done) {
    var node       = this.getDOMNode ();
    var transition = this.getTransition ();
    this._animate (node, transition.leave, transition.duration, done);
  },

  _animate: function (node, transition, duration, done) {
    var backup  = this._backupStyles;
    var restore = this._restoreStyles;
    velocity(
      node,
      transition,
      {
        duration: duration,
        complete: function (elements) {
          restore (elements, done);
        },
        begin: function (elements) {
          backup (elements);
        }
      }
    );
  },

  _styles: {},

  _restoreStyles: function (elements, done) {
    var styles = this._styles;
    elements.forEach (function (el, index) {
      el.style.zIndex = styles[index];
    });
    done ();
  },

  _backupStyles: function (elements) {
    this._styles = {};
    var styles   = this._styles;
    elements.forEach (function (el, index) {
      styles[index] = el.style.zIndex;
    });
  },

  render: function () {
    return React.Children.only (this.props.children);
  }

};

/*****************************************************************************/
