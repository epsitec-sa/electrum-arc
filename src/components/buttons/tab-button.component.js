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

  get styleProps () {
    return {
      kind: this.read ('kind'),
    };
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
    const inputKind   = this.read ('kind');
    const inputText   = this.read ('text');
    const inputActive = this.read ('active');

    const boxStyle = this.mergeStyles ('box');

    let buttonKind = 'view-tab';
    let textGrow   = null;

    if (inputKind === 'task') {
      buttonKind = 'task-tab';
      textGrow   = '1';
    }

    return (
      <span
        disabled={disabled}
        style={boxStyle}
        >
        <Button
          kind    = {buttonKind}
          grow    = {textGrow}
          text    = {inputText}
          spacing = 'overlap'
          active  = {inputActive}
          {...this.link ()}
        />
        <Button
          kind    = {buttonKind}
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
