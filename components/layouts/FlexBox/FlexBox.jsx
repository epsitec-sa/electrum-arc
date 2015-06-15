'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  theme: require ('./FlexBox.styles.js'),

  render: function () {
    var splitter  = this.props.splitter;
    var self      = this;
    var _setFlexItem = function (item, index) {
      var itemId   = '<' + item.type.displayName + ' id="' + item.props.id + '">';

      //Verify if child has a splitter
      if (item.props.splitter) {
        splitter = item.props.splitter;
      }

      if (typeof item.type === 'function') {
        // React comp.
        if (self.props.space) {
          // space array available on flexbox ?
          if (!self.props.space[index]) {
            console.warn ('Your Flexbox cannot apply space to ', itemId);
          } else {
            //- console.log ('%s receive a basis of %s', itemId, self.props.space[index]);
            return React.addons.cloneWithProps(item, {
              splitter: splitter,
              boxstyle: {
                flexGrow: '0',
                flexShrink: '0',
                flexBasis: self.props.space[index]
              }
            });
          }
        }

        // split on first child with inherited splitter value
        if (self.props.split && index === 0) {
          //- console.log ('%s receive a basis of %s', itemId,  self.props.split);
          return React.addons.cloneWithProps(item, {
            boxstyle: {
              flexGrow: '0',
              flexShrink: '0',
              flexBasis: self.props.split
            }
          });
        }

        //
        //- console.log ('%s receive default flex', itemId);
        return React.addons.cloneWithProps(item, {
          splitter: splitter,
          boxstyle: {
            flexGrow: '0',
            flexShrink: '1',
            flexBasis: 'auto'
          }
        });

      } else {
        // Native html comp.
        return item;
      }
    };

    var flexItems = React.Children.map (this.props.children, _setFlexItem);
    var style     = E.getStyle (this);
    var tweaks    = require ('./FlexBox.tweaks.js');
    style.push (tweaks.base);
    style.push (tweaks.direction[this.props.direction]);
    style.push (tweaks.wrap[this.props.wrap]);
    style.push (tweaks.justify[this.props.justify]);
    style.push (tweaks['align-items'][this.props['align-items']]);
    style = style.concat (this.props.boxstyle);

    return (
        <div style={style}>
          {flexItems}
        </div>
    );
  }

};

/*****************************************************************************/
