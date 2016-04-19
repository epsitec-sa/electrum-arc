'use strict';

import React from 'react';
import {Action} from 'electrum';
import {ListItem as MUIListItem} from 'material-ui';
/******************************************************************************/

export default class MuListItem extends React.Component {

  constructor (props) {
    super (props);
  }

  // TODO: Pourquoi est-ce que le code ci-dessous ne fonctionne pas ???
  // render () {
  //   const {state} = this.props.state;
  //   const disabled = Action.isDisabled (state);
  //   return (
  //     <MUIListItem
  //       onTouchTap={this.onClick}
  //       label={this.props.label || this.read ('label')}
  //       autoGenerateNestedIndicator={this.props.autoGenerateNestedIndicator || this.read ('autoGenerateNestedIndicator')}
  //       disableKeyboardFocus={this.props.disableKeyboardFocus || this.read ('disableKeyboardFocus')}
  //       disabled={disabled}
  //       initiallyOpen={this.props.initiallyOpen || this.read ('initiallyOpen')}
  //       insetChildren={this.props.insetChildren || this.read ('insetChildren')}
  //       leftCheckbox={this.props.leftCheckbox || this.read ('leftCheckbox')}
  //       leftIcon={this.props.leftIcon || this.read ('leftIcon')}
  //       primaryText={this.props.primaryText || this.read ('primaryText')}
  //       primaryTogglesNestedList={this.props.primaryTogglesNestedList || this.read ('primaryTogglesNestedList')}
  //       rightIcon={this.props.rightIcon || this.read ('rightIcon')}
  //       secondaryText={this.props.secondaryText || this.read ('secondaryText')}
  //       secondaryTextLines={this.props.secondaryTextLines || this.read ('secondaryTextLines')}
  //       {...this.props}
  //       >
  //       {this.props.children}
  //     </MUIListItem>
  //   );
  // }

  render () {
    const disabled = Action.isDisabled (this.props.state);
    return (
      <MUIListItem
        onTouchTap={this.onClick}
        disabled={disabled}
        {...this.props}
        >
        {this.props.children}
      </MUIListItem>
    );
  }
}
/******************************************************************************/
