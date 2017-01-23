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

  onMyFocus (e) {
    this.setReadonly (false);
  }

  onMyBlur (e) {
    this.setReadonly (true);
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const id             = this.read ('id');
    const type           = this.read ('type');
    const shape          = this.read ('shape');
    const labelGlyph     = this.read ('label-glyph');
    const labelText      = this.read ('label-text');
    const labelWidth     = this.read ('label-width');
    const fieldWidth     = this.read ('field-width');
    const value          = this.read ('value');
    const updateStrategy = this.read ('updateStrategy');
    const selectedValue  = this.read ('selected-value');
    const hintText       = this.read ('hint-text');
    const rows           = this.read ('rows');
    const readonly       = this.read ('readonly');
    const filterKeys     = this.props['filter-keys'];
    const tabIndex       = this.props['tab-index'];

    const autoReadonly = this.getReadonly () && selectedValue && selectedValue !== '';
    const displayValue = autoReadonly ? selectedValue : value;
    const visibleReadonly = readonly ? readonly : (autoReadonly ? 'true' : 'false');

    const boxStyle = this.mergeStyles ('box');

    const s = shape ? shape : 'smooth';
    const buttonShapes = {
      smooth:  'left-smooth',
      rounded: 'left-rounded',
    };
    const textFieldShapes = {
      smooth:  'right-smooth',
      rounded: 'right-rounded',
    };
    const buttonShape    = buttonShapes[s];
    const textFieldShape = textFieldShapes[s];

    return (
      <span
        disabled={disabled}
        style={boxStyle}
        >
        <Button
          glyph       = {labelGlyph}
          text        = {labelText}
          width       = {labelWidth}
          shape       = {buttonShape}
          kind        = 'label'
          justify     = 'left'
          spacing     = 'overlap'
          {...this.link ()}
        />
        <TextField
          id             = {id}
          type           = {type}
          width          = {fieldWidth}
          updateStrategy = {updateStrategy}
          value          = {displayValue}
          hint-text      = {hintText}
          filter-keys    = {filterKeys}
          shape          = {textFieldShape}
          tab-index      = {tabIndex}
          rows           = {rows}
          readonly       = {visibleReadonly}
          onChange       = {e => this.onMyChange (e)}
          onFocus        = {e => this.onMyFocus (e)}
          onBlur         = {e => this.onMyBlur (e)}
          {...this.link ()}
        />
      </span>
    );
  }
}

/******************************************************************************/
