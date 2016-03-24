'use strict';

import React from 'react';
import {Action} from 'electrum';
import {AutoComplete as MUIAutoComplete} from 'material-ui';
/******************************************************************************/

export default class AutoComplete extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIAutoComplete
        disabled={disabled}
        id={this.props.id}
        anchorOrigin={this.props.anchorOrigin || this.read ('anchorOrigin')}
        animated={this.props.animated || this.read ('animated')}
        disableFocusRipple={this.props.disableFocusRipple || this.read ('disableFocusRipple')}
        errorText={this.props.errorText || this.read ('errorText')}
        filter={this.props.filter || this.read ('filter')}
        floatingLabelText={this.props.floatingLabelText || this.read ('floatingLabelText')}
        fullWidth={this.props.fullWidth || this.read ('fullWidth')}
        hintText={this.props.hintText || this.read ('hintText')}
        menuCloseDelay={this.props.menuCloseDelay || this.read ('menuCloseDelay')}
        open={this.props.open || this.read ('open')}
        searchText={this.props.searchText || this.read ('searchText')}
        targetOrigin={this.props.targetOrigin || this.read ('targetOrigin')}
        touchTapCloseDelay={this.props.touchTapCloseDelay || this.read ('touchTapCloseDelay')}
        triggerUpdateOnFocus={this.props.triggerUpdateOnFocus || this.read ('triggerUpdateOnFocus')}
        {...this.props}
        >
        {this.props.children}
      </MUIAutoComplete>
    );
  }
}

/******************************************************************************/
