'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = E.createClass({

  render: function () {
    var text      = E.getText (this);
    var style     = require ('./FlexBox.styles.js');
    var disabled  = E.getState (this, s => s.disabled);
    var self      = this;
    var _setFlexItem = function (item, index) {

      if (typeof item.type === 'function') {
        // space array available on flexbox
        if (self.props.space) {
          if (!self.props.space[index]) {
            console.warn ('Your Flexbox cannot apply space to item', item.props.id);
          } else {
            console.log ('%s receive a flex of %s',item.props.id, self.props.space[index]);
            return React.addons.cloneWithProps(item, {
              boxstyle: {
                flex: self.props.space[index]
              }
            });
          }
        }

        // split on first child with inherited splitter value
        if (self.props.split && index === 0) {
          console.log ('Splitter set:', self.props.split);
          return React.addons.cloneWithProps(item, {
            boxstyle: {
              flexGrow: '0',
              flexShrink: '1',
              flexBasis: self.props.split
            }
          });
        }

        //
        console.log ('Inherit...');
        return React.addons.cloneWithProps(item, {
          splitter: self.props.splitter,
          boxstyle: {
            flexGrow: '0',
            flexShrink: '1',
            flexBasis: 'auto'
          }
        });

      } else {
        console.log ('Skipping ', item.type);
        return item;
      }
    };

    var flexItems = React.Children.map (this.props.children, _setFlexItem);
    return (
        <div style={[
             style.base,
             style.direction[this.props.direction],
             style.wrap[this.props.wrap],
             style.justify[this.props.justify],
             style['align-items'][this.props['align-items']]
        ]}>
          {flexItems}
        </div>
    );
  }
});

/*****************************************************************************/
