'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  theme: require ('./Paper.styles.js'),

  propTypes: {
    circle: React.PropTypes.bool,
    rounded: React.PropTypes.bool,
    zDepth: React.PropTypes.oneOf([0,1,2,3,4,5]),
    transitionEnabled: React.PropTypes.bool,
    'z-index': React.PropTypes.int
  },

  getDefaultProps: function() {
    return {
      rounded: true,
      zDepth: 1,
      transitionEnabled: true,
      'z-index': 1000
    };
  },

  handleClick: function (evt) {
    if (this.props.action || this.props.id) {
      E.bus.dispatch (this, this.props.action || this.props.id);  
    }
  },

  getZDepthShadows: function(zDepth) {
    var shadows = [
      '',
      '0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)',
      '0 3px 10px rgba(0, 0, 0, 0.16), 0 3px 10px rgba(0, 0, 0, 0.23)',
      '0 10px 30px rgba(0, 0, 0, 0.19), 0 6px 10px rgba(0, 0, 0, 0.23)',
      '0 14px 45px rgba(0, 0, 0, 0.25), 0 10px 18px rgba(0, 0, 0, 0.22)',
      '0 19px 60px rgba(0, 0, 0, 0.30), 0 15px 20px rgba(0, 0, 0, 0.22)'
    ];

    return shadows[zDepth];
  },

  getPaperShadowStyle: function () {
    return {
      boxShadow: this.getZDepthShadows(this.props.zDepth)
    };
  },

  render: function () {

    var style    = E.getStyle (this);

    style.push (this.getPaperShadowStyle ());
    style = style.concat (this.props.boxstyle);
    return (
      <div style={style} onClick={this.handleClick}>
        {this.props.children}
      </div>
    );
  }

};

/*****************************************************************************/
