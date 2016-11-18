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
      zIndex:        this.read ('z-index'),
    };
  }

  getLines (lines) {
    const array = [];
    const textStyle  = this.mergeStyles ('text');
    let keyIndex = 0;
    lines.map (
      line => {
        const htmlText = (
          <div key={keyIndex++} style={textStyle}>{line}</div>
        );
        array.push (htmlText);
      }
    );
    return array;
  }

  getText (index, lines) {
    const linesStyle = this.mergeStyles ('lines');
    return (
      <div key={index} style={linesStyle}>
        {this.getLines (lines).map ((comp) => comp)}
      </div>
    );
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputText    = this.read ('text');
    const inputGlyph   = this.read ('glyph');
    const inputRotate  = this.read ('rotate');
    const inputFlip    = this.read ('flip');
    const inputSpin    = this.read ('spin');
    const inputTooltip = this.read ('tooltip');
    const inputMarquee = this.read ('marquee');

    const boxStyle   = this.mergeStyles ('box');
    const glyphStyle = this.mergeStyles ('glyph');
    const textStyle  = this.mergeStyles ('text');

    let htmlText = () => null;
    if (inputText) {
      if (typeof inputText === 'string') {
        const lines = inputText.split ('\\n');
        if (lines.length < 2) {
          htmlText = (index) => (
            <div key={index} style={textStyle}>
              {inputText}
            </div>
          );
        } else {
          htmlText = (index) => this.getText (index, lines);
        }
      } else {
        htmlText = (index) => (
          <div key={index} style={textStyle}>
            {inputText}
          </div>
        );
      }
    }

    const renderSpin = inputSpin ? 'fa-spin' : '';
    const htmlGlyph = (index) => (
      <i key={index}
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
          return [htmlGlyph (0), htmlText (1)];
        } else {
          return [htmlGlyph (0)];
        }
      } else {
        return [htmlText (0)];
      }
    };

    if (inputMarquee === 'true') {
      return (
        <marquee
          onClick  = {this.onClick}
          disabled = {disabled}
          style    = {boxStyle}
          title    = {inputTooltip}
        >
          {layout ().map ((comp) => comp)}
          {this.props.children}
        </marquee>
      );
    } else {
      return (
        <div
          onClick  = {this.onClick}
          disabled = {disabled}
          style    = {boxStyle}
          title    = {inputTooltip}
        >
          {layout ().map ((comp) => comp)}
          {this.props.children}
        </div>
      );
    }
  }
}

/******************************************************************************/
