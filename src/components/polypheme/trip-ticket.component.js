'use strict';

import React from 'react';

import {Ticket, Container, Label} from '../../all-components.js';
import {ColorHelpers} from 'electrum-theme';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class TripTicket extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      extended: false,
      selected: false,
    };
  }

  getExtended () {
    return this.state.extended;
  }

  setExtended (value) {
    this.setState ( {
      extended: value
    });
  }

  getSelected () {
    return this.state.selected;
  }

  setSelected (value) {
    this.setState ( {
      selected: value
    });
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

  mouseClick () {
    this.setExtended (!this.getExtended ());
  }

  mouseCtrlClick () {
    this.setSelected (!this.getSelected ());
  }

  computeHeight (text) {
    const count = text.split ('\\n').length + 1;
    return Unit.multiply ('20px', count);
  }

  render () {
    const width    = '250px';
    // const selected = this.read ('Selected');
    const extended = this.getExtended ();
    const selected = this.getSelected () ? 'true' : 'false';
    const kind     = this.read ('kind');
    const data     = this.read ('data');
    const color    = data.Color;
    const type     = data.Type;
    const noDrag   = data.NoDrag;
    const ticketId = this.read ('ticket-id');
    const tripId   = this.read ('trip-id');

    if (!data || !data.Trip || typeof data.Trip.Pick === 'undefined' || typeof data.Trip.Drop === 'undefined') {
      throw new Error ('TripTicket without data');
    } else {
      const trip           = (type === 'pick') ? data.Trip.Pick : data.Trip.Drop;
      const time           = trip.Time;
      const description    = extended ? trip.Details : trip.Description;
      const directionGlyph = (type === 'pick') ? 'circle' : 'square';
      const directionColor = ColorHelpers.GetMarkColor (this.theme, type);
      const glyphs         = trip.Glyphs;
      const height         = Unit.add (this.computeHeight (description), '20px');
      const marginBottom   = extended ? null : '-10px';
      const hatch          = (trip.Type === 'transit') ? 'true' : 'false';
      const cursor         = (noDrag === 'true') ? null : 'move';

      return (
        <Ticket width={width} height={height} selected={selected} kind={kind} subkind={type} color={color}
          drag-handle='TripTicket' no-drag={noDrag} cursor={cursor} hatch={hatch}
          ticket-id={ticketId} trip-id={tripId}
          onMouseClick={() => this.mouseClick ()}
          onMouseCtrlClick={() => this.mouseCtrlClick ()}
          {...this.link ()} >
          <Container kind='ticket-column' grow='1' {...this.link ()} >
            <Container kind='ticket-row' margin-bottom={marginBottom} {...this.link ()} >
              <Label text={this.getTime (time)} font-weight='bold' width='50px' {...this.link ()} />
              <Label glyph={directionGlyph} glyph-color={directionColor} width='25px' {...this.link ()} />
              <Label text={description} font-weight='bold' wrap='no' grow='1' {...this.link ()} />
            </Container>
            <Container kind='ticket-row' {...this.link ()} >
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
