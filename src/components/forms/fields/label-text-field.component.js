'use strict';

import React from 'react';
import {Action} from 'electrum';

// Note: to make 'npm test' happy, don't use import from 'electrum-arc':

// import {Button, TextField} from 'electrum-arc';
import {Button, TextField} from '../../../all-components.js';

/******************************************************************************/

export default class LabelTextField extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      readonly: true,
    };
    this.comboLocation = null;
  }

  getReadonly () {
    return this.state.readonly;
  }

  setReadonly (value) {
    this.setState ( {
      readonly: value
    });
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

  onMyChange (e) {
    const onChange = this.read ('onChange');
    if (onChange) {
      onChange (e);
    }
  }

  onMyFocus () {
    this.setReadonly (false);
  }

  onMyBlur () {
    this.setReadonly (true);
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const id                 = this.read ('id');
    const inputType          = this.read ('type');
    const inputShape         = this.read ('shape');
    const inputLabelGlyph    = this.read ('label-glyph');
    const inputLabelText     = this.read ('label-text');
    const inputLabelWidth    = this.read ('label-width');
    const inputFieldWidth    = this.read ('field-width');
    const inputValue         = this.read ('value');
    const inputSelectedValue = this.read ('selected-value');
    const inputHintText      = this.read ('hint-text');
    const inputRows          = this.read ('rows');
    const inputFilterKeys    = this.props['filter-keys'];
    const inputTabIndex      = this.props['tab-index'];

    const readonly = this.getReadonly () && inputSelectedValue && inputSelectedValue !== '';
    const displayValue = readonly ? inputSelectedValue : inputValue;

    const boxStyle = this.mergeStyles ('box');

    const shape = inputShape ? inputShape : 'smooth';
    const buttonShapes = {
      smooth:  'left-smooth',
      rounded: 'left-rounded',
    };
    const textFieldShapes = {
      smooth:  'right-smooth',
      rounded: 'right-rounded',
    };
    const buttonShape    = buttonShapes[shape];
    const textFieldShape = textFieldShapes[shape];

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
          type        = {inputType}
          width       = {inputFieldWidth}
          value       = {displayValue}
          hint-text   = {inputHintText}
          filter-keys = {inputFilterKeys}
          shape       = {textFieldShape}
          tab-index   = {inputTabIndex}
          rows        = {inputRows}
          readonly    = {readonly ? 'true' : 'false'}
          onChange    = {e => this.onMyChange (e)}
          onFocus     = {e => this.onMyFocus (e)}
          onBlur      = {e => this.onMyBlur (e)}
          {...this.link ()}
        />
      </span>
    );
  }
}

/******************************************************************************/
