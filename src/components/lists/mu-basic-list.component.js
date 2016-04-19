'use strict';

import React from 'react';
import {Action} from 'electrum';
import {List as MUIList} from 'material-ui';

/******************************************************************************/

export default class MuBasicList extends React.Component {

  render () {
    const {state, theme} = this.props;
    const disabled = Action.isDisabled (this.props.state);
    const keys = state.keys;
    const missingTemplate = () => {
      return (
        <div>Missing template</div>
      );
    };
    const template = this.props.template || missingTemplate;

    return (
      <MUIList disabled={disabled} {...this.props} data-collection>
        {keys.map (key => template (state.select (key), theme))}
        {this.props.children}
      </MUIList>
    );
  }
}
