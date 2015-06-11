'use strict';

var React    = require ('react/addons');
var E        = require ('e');
var Velocity = require ('velocity-animate');
/*****************************************************************************/

module.exports = {

  propTypes: {
    transition: React.PropTypes.shape ({
      duration: React.PropTypes.int,
      enter: React.PropTypes.any,
      leave: React.PropTypes.any
    })
  },

  getTransition: function() {
    var defaultTransition = E.transitions.defaultTransition;
    return this.props.transition || defaultTransition;
  },

  componentWillAppear: function (done) {
    var node = this.getDOMNode ();
    var transition = this.getTransition ();
    console.log ('T_:', transition.enter);
    Velocity (
      node,
      transition.enter,
      {
        duration: transition.duration,
        complete: done
      }
    );
	},

  componentWillEnter: function (done) {
    var node = this.getDOMNode ();
    var transition = this.getTransition ();
    console.log ('T_:', transition.enter);
    Velocity (
      node,
      transition.enter,
      {
        duration: transition.duration,
        complete: done
      }
    );
	},

  componentWillLeave: function (done) {
    var node = this.getDOMNode ();
    var transition = this.getTransition ();
    console.log ('T_:', transition.leave);
    Velocity(
      node,
      transition.leave,
      {
        duration: transition.duration,
        complete: done
      }
    );
  },

  render: function () {
    return React.Children.only (this.props.children);
  }
}

/*****************************************************************************/
