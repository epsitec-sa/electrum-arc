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
    const height   = '68px';
    const selected = this.read ('Selected');
    const kind     = this.read ('kind');
    const data     = this.read ('data');
    const color    = data.Color;
    const type     = data.Type;
    const noDrag   = data.NoDrag;
    const ticketId = this.read ('ticket-id');
    const tripId   = this.read ('trip-id');

    const cursor = (noDrag === 'true') ? null : 'move';

    if (!data || !data.Trip || typeof data.Trip.Pick === 'undefined' || typeof data.Trip.Drop === 'undefined') {
      return (
        <Ticket width={width} height={height} selected={selected} color={color}
          drag-handle='TripTicket' no-drag={noDrag} cursor={cursor} ticket-id={ticketId} trip-id={tripId} {...this.link ()} >
        </Ticket>
      );
    } else {
      const time           = (type === 'pick') ? data.Trip.Pick.Time : data.Trip.Drop.Time;
      const description    = (type === 'pick') ? data.Trip.Pick.Description : data.Trip.Drop.Description;
      const directionGlyph = (type === 'pick') ? 'chevron-circle-up' : 'chevron-circle-down';
      const directionColor = ColorHelpers.GetMarkColor (this.theme, type);
      const glyphs         = (type === 'pick') ? data.Trip.Pick.Glyphs : data.Trip.Drop.Glyphs;

      return (
        <Ticket width={width} height={height} selected={selected} kind={kind} color={color}
          drag-handle='TripTicket' no-drag={noDrag} cursor={cursor} ticket-id={ticketId} trip-id={tripId} {...this.link ()} >
          <Container kind='ticket-column' grow='1' {...this.link ()} >
            <Container kind='ticket-row' grow='1' {...this.link ()} >
              <Label text={this.getTime (time)} font-weight='bold' width='50px' {...this.link ()} />
              <Label glyph={directionGlyph} glyph-color={directionColor} width='25px' {...this.link ()} />
              <Label text={description} font-weight='bold' wrap='no' grow='1' {...this.link ()} />
            </Container>
            <Container kind='ticket-row' grow='1' {...this.link ()} >
              <Label text='' width='75px' {...this.link ()} />
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
