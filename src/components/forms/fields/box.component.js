'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Unit} from 'electrum-theme';

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
    const textStyle  = this.mergeStyles ('text');

    const lines = inputText.split ('<br/>');
    const stackStyle = {
      display:       'flex',
      flexDirection: 'column',
    };
    let htmlText;
    if (lines.length === 2) {
      htmlText = (
        <span style={stackStyle}>
          <Label kind='compact' text={lines[0]} {...this.link ()} />
          <Label kind='compact' text={lines[1]} {...this.link ()} />
        </span>
      );
    } else if (lines.length === 3) {
      htmlText = (
        <span style={stackStyle}>
          <Label kind='compact' text={lines[0]} {...this.link ()} />
          <Label kind='compact' text={lines[1]} {...this.link ()} />
          <Label kind='compact' text={lines[2]} {...this.link ()} />
        </span>
      );
    } else if (lines.length === 4) {
      htmlText = (
        <span style={stackStyle}>
          <Label kind='compact' text={lines[0]} {...this.link ()} />
          <Label kind='compact' text={lines[1]} {...this.link ()} />
          <Label kind='compact' text={lines[2]} {...this.link ()} />
          <Label kind='compact' text={lines[3]} {...this.link ()} />
        </span>
      );
    } else {
      htmlText = (
        <Label text={lines[0]} style={textStyle} {...this.link ()} />
      );
    }

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
