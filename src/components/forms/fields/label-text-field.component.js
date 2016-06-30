'use strict';

import React from 'react';
import {Action} from 'electrum';

// Note: to make 'npm test' happy, don't use import from 'electrum-arc':

// import {Button, TextField} from 'electrum-arc';
import {Button, TextField} from '../../../all-components.js';

/******************************************************************************/

export default class LabelTextField extends React.Component {

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
    const {state, id} = this.props;
    const disabled = Action.isDisabled (state);
    const inputShape      = this.read ('shape');
    const inputLabelGlyph = this.read ('label-glyph');
    const inputLabelText  = this.read ('label-text');
    const inputLabelWidth = this.read ('label-width');
    const inputFieldWidth = this.read ('field-width');
    const inputValue      = this.read ('value');
    const inputHintText   = this.read ('hint-text');
    const inputFilterKeys = this.props['filter-keys'];

    const boxStyle = this.mergeStyles ('box');

    const buttonShape    = (inputShape === 'rounded') ? 'left-rounded'  : null;
    const textFieldShape = (inputShape === 'rounded') ? 'right-rounded' : null;

    return (
      <span
        disabled={disabled}
        style={boxStyle}
        >
        <Button
          glyph       = {inputLabelGlyph}
          text        = {inputLabelText}
          width       = {inputLabelWidth}
          shape       = {buttonShape}
          kind        = 'label'
          justify     = 'left'
          spacing     = 'overlap'
          {...this.link ()}
        />
        <TextField
          id          = {id}
          width       = {inputFieldWidth}
          value       = {inputValue}
          hint-text   = {inputHintText}
          filter-keys = {inputFilterKeys}
          shape       = {textFieldShape}
          {...this.link ()}
        />
      </span>
    );
  }
}

/******************************************************************************/
