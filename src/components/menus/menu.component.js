'use strict';

import React from 'react';
import {Action} from 'electrum';

import {Button} from '../../all-components.js';

/******************************************************************************/

export default class Menu extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      width: this.read ('width'),
    };
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    const boxStyle = this.mergeStyles ('box');

    return (
      <div
        disabled={disabled}
        style={boxStyle}
        {...this.props}
      >
        <Button text='coucou' {...this.link ()} />
        <Button text='tralala' {...this.link ()} />
        <Button text='youpie' {...this.link ()} />
      </div>
    );
  }
}

/******************************************************************************/
