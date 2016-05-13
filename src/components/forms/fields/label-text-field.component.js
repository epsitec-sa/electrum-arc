'use strict';

import React from 'react';
import {Action, ColorManipulator} from 'electrum';
import {Unit} from 'electrum-theme';
import {Button, TextField} from 'electrum-arc';

const {fade, darken, lighten} = ColorManipulator;

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

  render () {
    const {state, theme, labelGlyph, labelText, labelWidth, fieldWidth, value, hintText, grow, spacing} = this.props;
    const disabled = Action.isDisabled (state);
    const inputLabelGlyph = labelGlyph || state.get ('labelGlyph');
    const inputLabelText  = labelText  || state.get ('labelText');
    const inputLabelWidth = labelWidth || state.get ('labelWidth');
    const inputFieldWidth = fieldWidth || state.get ('fieldWidth');
    const inputValue      = value      || state.get ('value');
    const inputHintText   = hintText   || state.get ('hintText');
    var   inputGrow       = grow       || state.get ('grow');
    const inputSpacing    = spacing    || state.get ('spacing');

    const m = Unit.multiply (theme.shapes.containerMargin, 0.5);

    if (!inputGrow) {
      inputGrow = 1;
    }

    var boxStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'flex-start',
      alignItems:      'center',
      flexGrow:        inputGrow,
      padding:         '0px',
      marginTop:       '0px',
      marginLeft:      '0px',
      marginBottom:    '0px',
      marginRight:     '0px',
    };

    if (inputSpacing === 'overlap') {
      boxStyle.marginRight = '-1px';
    } else if (inputSpacing === 'large') {
      boxStyle.marginRight = m;
    }

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
