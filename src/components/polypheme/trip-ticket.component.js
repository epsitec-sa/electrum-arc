'use strict';

import React from 'react';

import {Ticket, Container, Label} from '../../all-components.js';

/******************************************************************************/

export default class TripTicket extends React.Component {

  constructor (props) {
    super (props);
  }

  getGlyph (glyph) {
    const g = glyph.Glyph;
    if (g.startsWith ('bookmark-')) {
      const color = g.substring (9);
      return (
        <Label glyph='bookmark' glyph-color={color} spacing='compact' {...this.link ()} />
      );
    } else {
      return (
        <Label glyph={g} spacing='compact' {...this.link ()} />
      );
    }
  }

  getGlyphs (glyphs) {
    if (!glyphs) {
      return null;
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

    if (!data || !data.Trip || typeof data.Trip.Pick === 'undefined' || typeof data.Trip.Drop === 'undefined') {
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
            <Label text={data.Trip.Pick.Time} font-weight={pickWeight} {...this.link ()} />
            <Label text={data.Trip.Drop.Time} font-weight={dropWeight} {...this.link ()} />
            <Label glyph={direction} {...this.link ()} />
          </Container>
          <Container kind='column' grow='3' {...this.link ()} >
            <Label text={data.Trip.Pick.Desc} font-weight={pickWeight} {...this.link ()} />
            <Label text={data.Trip.Drop.Desc} font-weight={dropWeight} {...this.link ()} />
            <Container kind='row' {...this.link ()} >
              <Label glyph='cube' spacing='compact' {...this.link ()} />
              <Label text={data.Trip.Count + 'x'} grow='1' {...this.link ()} />
              {this.getGlyphs (data.Trip.Glyphs)}
            </Container>
          </Container>
        </Ticket>
      );
    }
  }
}

/******************************************************************************/
