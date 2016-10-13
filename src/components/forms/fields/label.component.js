'use strict';

import React from 'react';
import {Action} from 'electrum';

/******************************************************************************/

export default class Label extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      text:          this.read ('text'),
      glyph:         this.read ('glyph'),
      grow:          this.read ('grow'),
      kind:          this.read ('kind'),
      justify:       this.read ('justify'),
      width:         this.read ('width'),
      spacing:       this.read ('spacing'),
      wrap:          this.read ('wrap'),
      vpos:          this.read ('vpos'),
      glyphColor:    this.read ('glyph-color'),
      glyphSize:     this.read ('glyph-size'),
      textColor:     this.read ('text-color'),
      textTransform: this.read ('text-transform'),
      fontWeight:    this.read ('font-weight'),
      fontSize:      this.read ('font-size'),
      bottomSpacing: this.read ('bottom-spacing'),
    };
  }

  getLines (lines) {
    const array = [];
    const textStyle  = this.mergeStyles ('text');
    lines.map (
      line => {
        const htmlText = (
          <div style={textStyle}>{line}</div>
        );
        array.push (htmlText);
      }
    );
    return array;
  }

  getText (lines) {
    const linesStyle = this.mergeStyles ('lines');
    return (
      <div style={linesStyle}>
        {this.getLines (lines).map ((comp) => comp)}
      </div>
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
    const inputGrow   = this.read ('grow');

    const boxStyle   = this.mergeStyles ('box');
    const glyphStyle = this.mergeStyles ('glyph');
    const textStyle  = this.mergeStyles ('text');

    let  htmlText = null;
    if (inputText) {
      if (typeof inputText === 'string') {
        const lines = inputText.split ('\\n');
        if (lines.length < 2) {
          htmlText = (
            <div key='text' style={textStyle}>
              {inputText}
            </div>
          );
        } else {
          htmlText = this.getText (lines);
        }
      } else {
        htmlText = (
          <div key='text' style={textStyle}>
            {inputText}
          </div>
        );
      }
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
      >
        {layout ().map ((comp) => comp)}
        {this.props.children}
      </div>
    );
  }
}

/******************************************************************************/
