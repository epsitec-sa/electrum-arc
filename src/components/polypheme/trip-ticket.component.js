'use strict';

import React from 'react';

import {Ticket, Container, Label} from '../../all-components.js';

/******************************************************************************/

export default class TripTicket extends React.Component {

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
    const width    = '220px';
    const height   = '90px';
    const selected = this.read ('selected');
    const color    = this.read ('color');
    const type     = this.read ('type');
    const data     = this.read ('data');

    console.dir (data);
    if (!data || typeof data.Pick === 'undefined' || typeof data.Drop === 'undefined') {
      return (
        <Ticket width={width} height={height} selected={selected} color={color} {...this.link ()} >
        </Ticket>
      );
    } else {
      const pickWeight = (type === 'pick') ? 'bold' : 'normal';
      const dropWeight = (type === 'drop') ? 'bold' : 'normal';
      const direction  = (type === 'pick') ? 'upload' : 'download';

      return (
        <Ticket width={width} height={height} selected={selected} color={color} {...this.link ()} >
          <Container kind='column' grow='1' {...this.link ()} >
            <Label text={data.Pick.Time} font-weight={pickWeight} {...this.link ()} />
            <Label text={data.Drop.Time} font-weight={dropWeight} {...this.link ()} />
            <Label glyph={direction} {...this.link ()} />
          </Container>
          <Container kind='column' grow='3' {...this.link ()} >
            <Label text={data.Pick.Desc} font-weight={pickWeight} {...this.link ()} />
            <Label text={data.Drop.Desc} font-weight={dropWeight} {...this.link ()} />
            <Container kind='row' {...this.link ()} >
              <Label glyph='cube' spacing='compact' {...this.link ()} />
              <Label text={data.Count + 'x'} grow='1' {...this.link ()} />
              {this.getGlyphs (data.Glyphs)}
            </Container>
          </Container>
        </Ticket>
      );
    }
  }
}

/******************************************************************************/
