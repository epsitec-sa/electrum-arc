'use strict';

import React from 'react';
import {Action, ColorManipulator} from 'electrum';
import {Unit} from 'electrum-theme';

import {
  RichButton,
  TextField
} from 'electrum-arc';

const {fade, darken, lighten} = ColorManipulator;

/******************************************************************************/

export default class GlyphTxtField extends React.Component {

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
    const {state, theme, glyph, value, grow, spacing} = this.props;
    const disabled = Action.isDisabled (state);
    const inputGlyph   = glyph   || state.get ('glyph');
    const inputValue   = value   || state.get ('value');
    var   inputGrow    = grow    || state.get ('grow');
    const inputSpacing = spacing || state.get ('spacing');

    if (!inputGrow) {
      inputGrow = 1;
    }

    var boxStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'flex-start',
      alignItems:      'center',
      flexGrow:        inputGrow,
      border:          '1px solid ' + lighten (theme.palette.dark, 0.5),
      backgroundColor: lighten (theme.palette.light, 0.5),
      padding:         '0px',
      marginTop:       '0px',
      marginLeft:      '0px',
      marginBottom:    '0px',
      marginRight:     '0px',
    };
    var fieldStyle = {
      flexGrow:        1,
      width:           '50px',
      height:          theme.shapes.lineHeight,
      border:          'none',
      padding:         '10px',
      margin:          '0px',
    };

    if (inputSpacing === 'overlap') {
      boxStyle.marginRight = '-1px';
    } else if (inputSpacing === 'large') {
      boxStyle.marginRight = theme.shapes.lineSpacing;
    }

    return (
      <span
        disabled={disabled}
        style={boxStyle}
        >
        <RichButton/>
        <TextField/>
      </span>
    );
  }
}

/******************************************************************************/
