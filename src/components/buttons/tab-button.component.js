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
    const {state, theme, text, active} = this.props;
    const disabled = Action.isDisabled (state);
    const inputText   = text   || state.get ('text');
    const inputActive = active || state.get ('active');

    var boxStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'flex-start',
      alignItems:      'center',
      padding:         '0px',
      marginTop:       '0px',
      marginLeft:      '0px',
      marginBottom:    '0px',
      marginRight:     '0px',
    };

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
