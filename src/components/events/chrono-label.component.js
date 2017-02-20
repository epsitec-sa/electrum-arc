'use strict';

import React from 'react';
import {Label} from '../../all-components.js';

/******************************************************************************/

export default class ChronoLabel extends React.Component {

  constructor (props) {
    super (props);
  }

  /******************************************************************************/

  renderGlyph (glyph) {
    if (glyph.startsWith ('bookmark-')) {
      const color = glyph.substring (9);
      return (
        <Label glyph='bookmark' glyph-color={color} spacing='compact' {...this.link ()} />
      );
    } else {
      return (
        <Label glyph={glyph} spacing='compact' {...this.link ()} />
      );
    }
  }

  renderGlyphs (note) {
    const result = [];
    for (var glyph of note.Glyphs) {
      result.push (this.renderGlyph (glyph.Glyph));
    }
    return result;
  }

  render () {
    const note = this.read ('note');

    const text = note.Content;

    const lineStyle   = this.mergeStyles ('line');
    const glyphsStyle = this.mergeStyles ('glyphs');

    return (
      <div style={lineStyle}>
        <div style={glyphsStyle}>
          {this.renderGlyphs (note)}
        </div>
        <Label text={text} grow='1' wrap='no' {...this.link ()} />
      </div>
    );
  }
}

/******************************************************************************/
