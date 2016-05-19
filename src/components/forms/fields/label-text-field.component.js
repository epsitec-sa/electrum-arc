'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Button, TextField} from 'electrum-arc';

/******************************************************************************/

export default class LabelTextField extends React.Component {

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

  get styleProps () {
    return {
      labelGlyph: this.read ('label-glyph'),
      labelText:  this.read ('label-text'),
      labelWidth: this.read ('label-width'),
      fieldWidth: this.read ('field-width'),
      value:      this.read ('value'),
      hintText:   this.read ('hint-text'),
      grow:       this.read ('grow'),
      spacing:    this.read ('spacing'),
    };
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputLabelGlyph = this.read ('label-glyph');
    const inputLabelText  = this.read ('label-text');
    const inputLabelWidth = this.read ('label-width');
    const inputFieldWidth = this.read ('field-width');
    const inputValue      = this.read ('value');
    const inputHintText   = this.read ('hint-text');

    let boxStyle = this.mergeStyles ('box');

    return (
      <span
        disabled={disabled}
        style={boxStyle}
        >
        <Button
          glyph   = {inputLabelGlyph}
          text    = {inputLabelText}
          width   = {inputLabelWidth}
          kind    = 'label'
          justify = 'left'
          spacing = 'overlap'
          {...this.link ()}
        />
        <TextField
          width    = {inputFieldWidth}
          value    = {inputValue}
          hintText = {inputHintText}
          {...this.link ()}
        />
      </span>
    );
  }
}

/******************************************************************************/
