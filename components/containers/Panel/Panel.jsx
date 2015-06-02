'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  theme: require ('./Panel.styles.js'),

  render: function () {
    var text     = E.getText (this);
    var style    = E.getStyle (this);
    var disabled = E.getState (this, s => s.disabled);

    var zIndex   = this.props['z-index'] || 0;
    var panelW   = this.props.width || '100%';
    var panelH   = this.props.height || '100%';
    var panelPos = this.props.position || 'absolute';

    style.push ({
      zIndex: zIndex,
      width: panelW,
      height: panelH,
      position: panelPos
    });

    style = style.concat (this.props.boxstyle);

    return (
      <div style={style}>
        {this.props.children}
      </div>
    );
  }
}

/*****************************************************************************/
