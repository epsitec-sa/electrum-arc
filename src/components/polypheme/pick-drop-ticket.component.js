'use strict';

import React from 'react';

import {Ticket, Container, Label} from '../../all-components.js';

/******************************************************************************/

export default class PickDropTicket extends React.Component {

  constructor (props) {
    super (props);
  }

  getGlyph (glyph) {
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

  getGlyphs (glyphs) {
    if (glyphs === null) {
      return null;
    } else if (typeof (glyphs) === 'string') {
      return this.getGlyph (glyphs);
    } else {
      let line = [];
      glyphs.forEach (glyph => {
        line.push (this.getGlyph (glyph));
      });
      return line;
    }
  }

  render () {
    const width  = this.read ('width');
    const height = this.read ('height');
    const data   = this.read ('data');

    const pickWeight = (data.type === 'pick') ? 'bold' : 'normal';
    const dropWeight = (data.type === 'drop') ? 'bold' : 'normal';
    const direction  = (data.type === 'pick') ? 'upload' : 'download';

    return (
      <Ticket width={width} height={height} {...this.link ()} >
        <Container kind='column' grow='1' {...this.link ()} >
          <Label text={data.pickTime} font-weight={pickWeight} {...this.link ()} />
          <Label text={data.dropTime} font-weight={dropWeight} {...this.link ()} />
          <Label glyph={direction} {...this.link ()} />
        </Container>
        <Container kind='column' grow='3' {...this.link ()} >
          <Label text={data.pickDesc} font-weight={pickWeight} {...this.link ()} />
          <Label text={data.dropDesc} font-weight={dropWeight} {...this.link ()} />
          <Container kind='row' {...this.link ()} >
            <Label glyph='cube' spacing='compact' {...this.link ()} />
            <Label text={data.count + 'x'} grow='1' {...this.link ()} />
            {this.getGlyphs (data.glyphs)}
          </Container>
        </Container>
      </Ticket>
    );
  }
}

/******************************************************************************/
