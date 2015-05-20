'use strict';

var React = require ('react');
var E     = require ('e');
var Box   = require ('../Box/Box.jsx');
/*****************************************************************************/

module.exports = E.createClass({

  render: function () {
    var text      = E.getText (this);
    var style     = require ('./FlexBox.styles.js');
    var disabled  = E.getState (this, s => s.disabled);
    var self      = this;
    var _setFlexItem = function (item, index) {

      if (typeof item.type === 'function') {
        if (self.props.space) {
          if (!self.props.space[index]) {
            console.warn ('Your Flexbox cannot apply space to item', item.props.id);
          } else {
            console.log ('Flexify %s with a flex of %s',item.props.id, self.props.space[index]);
            return React.addons.cloneWithProps(item, {
              container: 'flexbox',
              boxstyle: {
                flex: self.props.space[index],
                backgroundColor: '#' + index * 10 + 'EA' + self.props.space[index] * 20
              }
            });
          }
        }
        console.log ('@@@@@', self.props.boxstyle);
        return React.addons.cloneWithProps(item, {
          container: 'flexbox',
          boxstyle: self.props.boxstyle
        });

      } else {
        console.log ('Skipping ', item.type);
        return item;
      }
    };

    var flexItems = React.Children.map (this.props.children, _setFlexItem);
    return (
      <Box container={this.props.container} boxstyle={this.props.boxstyle}>
        <div style={[
             style.base,
             style.direction[this.props.direction],
             style.wrap[this.props.wrap],
             style.justify[this.props.justify],
             style['align-items'][this.props['align-items']]
        ]}>
          {flexItems}
        </div>
      </Box>
    );
  }
});

/*****************************************************************************/
