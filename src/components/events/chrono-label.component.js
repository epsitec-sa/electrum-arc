'use strict';

import React from 'react';
import {Label} from '../../all-components.js';

/******************************************************************************/

export default class ChronoLabel extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover: false,
    };
  }

  getHover () {
    return this.state.hover;
  }

  setHover (value) {
    this.setState ( {
      hover: value
    });
  }

  get styleProps () {
    return {
      lineWidth:  this.read ('lineWidth'),
      glyphWidth: this.read ('glyphWidth'),
    };
  }

  mouseOver () {
    this.setHover (true);
    const mouseOver = this.read ('mouseOver');
    if (mouseOver) {
      const event = this.read ('event');
      mouseOver (event);
    }
  }

  mouseOut () {
    this.setHover (false);
    const mouseOut = this.read ('mouseOut');
    if (mouseOut) {
      const event = this.read ('event');
      mouseOut (event);
    }
  }

  /******************************************************************************/

  renderTooltip (text) {
    if (this.getHover () && text) {
      const style = this.mergeStyles ('tooltip');
      return (
        <div style={style} key='tooltip'>
          <Label index='2' text={text} grow='1' wrap='no' {...this.link ()} />
        </div>
      );
    } else {
      return null;
    }
  }

  renderGlyph (glyph, index) {
    if (glyph.Glyph.startsWith ('bookmark-')) {
      const color = glyph.Glyph.substring (9);
      return (
        <Label index={index} glyph='bookmark' glyph-color={color} spacing='compact' {...this.link ()} />
      );
    } else {
      return (
        <Label index={index} glyph={glyph.Glyph} glyph-color={glyph.Color} spacing='compact' {...this.link ()} />
      );
    }
  }

  renderGlyphs (note) {
    const result = [];
    let index = 0;
    for (var glyph of note.Glyphs) {
      result.push (this.renderGlyph (glyph, index++));
    }
    return result;
  }

  render () {
    const index = this.read ('index');
    const note  = this.read ('note');

    const text = note.Content;

    const lineStyle   = this.mergeStyles ('line');
    const glyphsStyle = this.mergeStyles ('glyphs');
    const frontStyle  = this.mergeStyles ('front');

    return (
      <div style={lineStyle} key={index}>
        <div style={glyphsStyle} key='glyphs'>
          {this.renderGlyphs (note)}
        </div>
        <Label index='1' text={text} grow='1' wrap='no' {...this.link ()} />
        {this.renderTooltip (text)}
        <div
          key         = 'front'
          style       = {frontStyle}
          onMouseOver = {() => this.mouseOver ()}
          onMouseOut  = {() => this.mouseOut ()}
          />
      </div>
    );
  }
}

/******************************************************************************/
