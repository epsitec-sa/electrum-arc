'use strict';

import React from 'react';
import {Action, ColorManipulator} from 'electrum';
import {Unit} from 'electrum-theme';
import {Button, TextField, Calendar} from 'electrum-arc';

const {fade, darken, lighten} = ColorManipulator;

/******************************************************************************/

export default class TextFieldCombo extends React.Component {

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
      comboGlyph: this.read ('combo-glyph'),
      value:      this.read ('value'),
      hintText:   this.read ('hint-text'),
      grow:       this.read ('grow'),
      spacing:    this.read ('spacing'),
    };
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputGlyph    = this.read ('combo-glyph');
    const inputValue    = this.read ('value');
    const inputHintText = this.read ('hint-text');
    const inputCalendar = this.read ('calendar');

    const boxStyle      = this.mergeStyles ('box');
    const comboBoxStyle = this.mergeStyles ('comboBox');

    let htmlCalendar = null;
    if (inputCalendar === 'true') {
      htmlCalendar = (
        <div style={comboBoxStyle}>
          <Calendar date={Date.now ()} {...this.link ()} />
        </div>
      );
    }

    return (
      <span
        disabled = {disabled}
        style    = {boxStyle}
        >
        <TextField
          value    = {inputValue}
          hintText = {inputHintText}
          spacing  = 'overlap'
          {...this.link ()}
        />
        <Button
          id    = 'combo'
          glyph = {inputGlyph}
          {...this.link ()}
          />
        {htmlCalendar}
      </span>
    );
  }
}

/******************************************************************************/
