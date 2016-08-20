'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Container, Label} from 'electrum-arc';

/******************************************************************************/

export default class FlyingBalloon extends React.Component {

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
    const inputPrimaryText   = this.read ('primary-text');
    const inputSecondaryText = this.read ('secondary-text');

    const boxStyle = this.mergeStyles ('box');

    return (
      <span
        disabled = {disabled}
        style    = {boxStyle}
        >
        <Container
          kind = 'flying-balloon'
          {...this.link ()}
          >
          <Label text={inputPrimaryText}   kind='flying-balloon' {...this.link ()} />
          <Label text={inputSecondaryText} kind='flying-balloon' {...this.link ()} />
        </Container>
      </span>
    );
  }
}

/******************************************************************************/
