'use strict';

import React from 'react';
import {Action} from 'electrum';

import {Label} from '../../../all-components.js';

/******************************************************************************/

export default class Box extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      text:    this.read ('text'),
      glyph:   this.read ('glyph'),
      grow:    this.read ('grow'),
      kind:    this.read ('kind'),
      width:   this.read ('width'),
      spacing: this.read ('spacing'),
    };
  }

  getLines (text) {
    const array = [];
    text.split ('\\n').map (
      line => {
        const htmlText = (
          <Label kind='compact' text={line} {...this.link ()} />
        );
        array.push (htmlText);
      }
    );
    return array;
  }

  getText (text) {
    const stackStyle = {
      display:       'flex',
      flexDirection: 'column',
    };
    const layout = () => {
      return this.getLines (text);
    };
    return (
      <span style={stackStyle}>
        {layout ().map ((comp) => comp)}
      </span>
    );
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputText   = this.read ('text');
    const inputGlyph  = this.read ('glyph');
    const inputRotate = this.read ('rotate');
    const inputFlip   = this.read ('flip');
    const inputSpin   = this.read ('spin');

    const boxStyle   = this.mergeStyles ('box');
    const glyphStyle = this.mergeStyles ('glyph');

    const htmlText = this.getText (inputText);

    const renderSpin = inputSpin ? 'fa-spin' : '';
    const htmlGlyph = (
      <i key='icon'
        style={glyphStyle}
        className={`fa
        fa-${inputGlyph}
        fa-rotate-${inputRotate}
        fa-flip-${inputFlip}
        ${renderSpin}`}
      />
    );

    const layout = () => {
      if (inputGlyph) {
        if (inputText) {
          return [htmlGlyph, htmlText];
        } else {
          return [htmlGlyph];
        }
      } else {
        return [htmlText];
      }
    };

    return (
      <div
        onClick={this.onClick}
        disabled={disabled}
        style={boxStyle}
        {...this.props}
      >
        {layout ().map ((comp) => comp)}
      </div>
    );
  }
}

/******************************************************************************/
