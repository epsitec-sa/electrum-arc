'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Button, TextField, SimpleTextField} from '../../../all-components.js';

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
    this.onChange (e);
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

  renderButton () {
    const shape      = this.read ('shape');
    const labelGlyph = this.read ('label-glyph');
    const labelText  = this.read ('label-text');
    const labelWidth = this.read ('label-width');

    const s = shape ? shape : 'smooth';
    const buttonShapes = {
      smooth:  'left-smooth',
      rounded: 'left-rounded',
    };
    const buttonShape = buttonShapes[s];

    return (
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
    );
  }

  renderInput () {
    const id             = this.read ('id');
    const type           = this.read ('type');
    const shape          = this.read ('shape');
    const fieldWidth     = this.read ('field-width');
    const value          = this.read ('value');
    const selectedValue  = this.read ('selected-value');
    const hintText       = this.read ('hint-text');
    const rows           = this.read ('rows');
    const readonly       = this.read ('readonly');
    const filterKeys     = this.props['filter-keys'];
    const updateStrategy = this.read ('updateStrategy');
    const tabIndex       = this.props['tab-index'];

    const autoReadonly = this.getReadonly () && selectedValue && selectedValue !== '';
    const displayValue = autoReadonly ? selectedValue : value;
    const visibleReadonly = readonly ? readonly : (autoReadonly ? 'true' : 'false');

    const s = shape ? shape : 'smooth';
    const textFieldShapes = {
      smooth:  'right-smooth',
      rounded: 'right-rounded',
    };
    const textFieldShape = textFieldShapes[s];

    if (updateStrategy) {
      return (
        <SimpleTextField
          id             = {id}
          type           = {type}
          width          = {fieldWidth}
          value          = {displayValue}
          hint-text      = {hintText}
          filter-keys    = {filterKeys}
          shape          = {textFieldShape}
          tab-index      = {tabIndex}
          rows           = {rows}
          readonly       = {visibleReadonly}
          updateStrategy = {updateStrategy}
          onChange       = {e => this.onMyChange (e)}
          onFocus        = {e => this.onMyFocus (e)}
          onBlur         = {e => this.onMyBlur (e)}
          {...this.link ()}
        />
      );
    } else {
      return (
        <TextField
          id          = {id}
          type        = {type}
          width       = {fieldWidth}
          value       = {displayValue}
          hint-text   = {hintText}
          filter-keys = {filterKeys}
          shape       = {textFieldShape}
          tab-index   = {tabIndex}
          rows        = {rows}
          readonly    = {visibleReadonly}
          onFocus     = {e => this.onMyFocus (e)}
          onBlur      = {e => this.onMyBlur (e)}
          {...this.link ()}
        />
      );
    }
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    const boxStyle = this.mergeStyles ('box');

    return (
      <span
        disabled = {disabled}
        style    = {boxStyle}
        >
        {this.renderButton ()}
        {this.renderInput ()}
      </span>
    );
  }
}

/******************************************************************************/
