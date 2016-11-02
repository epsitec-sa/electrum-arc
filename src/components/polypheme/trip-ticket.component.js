'use strict';

import React from 'react';

import {Ticket, Container, Label} from '../../all-components.js';
import {ColorHelpers} from 'electrum-theme';

/******************************************************************************/

export default class TripTicket extends React.Component {

  constructor (props) {
    super (props);
  }

  getGlyph (glyph, indexKey) {
    if (glyph.startsWith ('bookmark-')) {
      const color = glyph.substring (9);
      return (
        <Label key={indexKey} glyph='bookmark' glyph-color={color} spacing='compact' {...this.link ()} />
      );
    } else {
      return (
        <Label key={indexKey} glyph={glyph} spacing='compact' {...this.link ()} />
      );
    }
  }

  getGlyphs (glyphs) {
    if (!glyphs) {
      return null;
    } else {
      let line = [];
      let indexKey = 0;
      glyphs.forEach (glyph => {
        if (glyph && glyph.value && glyph.value.Glyph) {
          line.push (this.getGlyph (glyph.value.Glyph, indexKey++));
        }
      });
      return line;
    }
  }

  getTime (time) {
    if (time && time.length === 19) {
      // If format '2016-03-31T14:30:00', extract 'hh:mm'.
      let h = time.substring (11, 13);
      let m = time.substring (14, 16);
      time = h + ':' + m;
    }
    return time;
  }

  render () {
    const width    = '220px';
    const height   = '82px';
    const selected = this.read ('Selected');
    const kind     = this.read ('kind');
    const data     = this.read ('data');
    const color    = data.Color;
    const type     = data.Type;
    const noDrag   = data.NoDrag;

    const cursor = (noDrag === 'true') ? null : 'move';

    if (!data || !data.Trip || typeof data.Trip.Pick === 'undefined' || typeof data.Trip.Drop === 'undefined') {
      return (
        <Ticket width={width} height={height} selected={selected} color={color}
          drag-handle='TripTicket' no-drag={noDrag} cursor={cursor} {...this.link ()} >
        </Ticket>
      );
    } else {
      const pickWeight     = (type === 'pick') ? 'bold' : 'normal';
      const dropWeight     = (type === 'drop') ? 'bold' : 'normal';
      // const directionGlyph = (type === 'pick') ? 'upload' : 'download';
      const directionGlyph = (type === 'pick') ? 'dot-circle-o' : 'check-circle';
      const directionColor = ColorHelpers.GetMarkColor (this.theme, (type === 'pick') ? 'primary' : 'success');
      const glyphs         = (type === 'pick') ? data.Trip.Pick.Glyphs : data.Trip.Drop.Glyphs;

      return (
        <Ticket width={width} height={height} selected={selected} kind={kind} olor={color}
          drag-handle='TripTicket' no-drag={noDrag} cursor={cursor} {...this.link ()} >
          <Container kind='column' grow='1' {...this.link ()} >
            <Label text={this.getTime (data.Trip.Pick.Time)} font-weight={pickWeight} {...this.link ()} />
            <Label text={this.getTime (data.Trip.Drop.Time)} font-weight={dropWeight} {...this.link ()} />
            <Label glyph={directionGlyph} glyph-color={directionColor} {...this.link ()} />
          </Container>
          <Container kind='column' grow='3' {...this.link ()} >
            <Label text={data.Trip.Pick.Description} font-weight={pickWeight} {...this.link ()} />
            <Label text={data.Trip.Drop.Description} font-weight={dropWeight} {...this.link ()} />
            <Container kind='row' {...this.link ()} >
              <Label glyph='cube' spacing='compact' {...this.link ()} />
              <Label text={data.Trip.Count} grow='1' {...this.link ()} />
              {this.getGlyphs (glyphs)}
            </Container>
          </Container>
        </Ticket>
      );
    }
  }
}

/******************************************************************************/
