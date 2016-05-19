'use strict';

import React from 'react';
import {Action, ColorManipulator} from 'electrum';
import {Unit} from 'electrum-theme';
import {Button} from 'electrum-arc';

const {fade, darken, lighten} = ColorManipulator;

/******************************************************************************/

export default class TabButton extends React.Component {

  constructor (props) {
    super (props);
  }

  onKeyDown (e) {
    const {id, state} = this.props;
    console.log (`onKeyDown: ${id}, ${state.generation} value=${e.target.value}`);
  }

  onKeyUp (e) {
    const {id, state} = this.props;
    console.log (`onKeyUp: ${id}, ${state.generation} value=${e.target.value}`);
  }

  onChange (e) {
    const {id, state} = this.props;
    console.log (`onChange: ${id}, ${state.generation} value=${e.target.value}`);
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputText   = this.read ('text');
    const inputActive = this.read ('active');

    const boxStyle = this.mergeStyles ('box');

    return (
      <span
        disabled={disabled}
        style={boxStyle}
        >
        <Button
          kind    ='view-tab'
          text    = {inputText}
          spacing = 'overlap'
          active  = {inputActive}
          {...this.link ()}
        />
        <Button
          kind    = 'view-tab'
          glyph   = 'close'
          spacing = 'tiny'
          active  = {inputActive}
          {...this.link ()}
        />
      </span>
    );
  }
}

/******************************************************************************/
