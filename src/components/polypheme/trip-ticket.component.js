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
      hatch:    false,
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

  getHatch () {
    return this.state.hatch;
  }

  setHatch (value) {
    this.setState ( {
      hatch: value
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

  mouseClick (event) {
    if (event.ctrlKey) {
      this.setSelected (!this.getSelected ());
    } else if (event.altKey) {
      this.setHatch (!this.getHatch ());
    } else {
      this.setExtended (!this.getExtended ());
    }
  }

  computeHeight (text) {
    const count = text.split ('\\n').length + 1;
    return Unit.multiply ('20px', count);
  }

  getDirectionGlyph (trip, type) {
    return (type === 'pick') ?
    ((trip.Type === 'transit') ? 'circle-o' : 'circle') :
    ((trip.Type === 'transit') ? 'square-o' : 'square');
  }

  renderLine (glyph, text) {
    let color = null;
    if (glyph.startsWith ('bookmark-')) {
      color = glyph.substring (9);
      glyph = 'bookmark';
    }
    return (
      <Container kind='ticket-row' {...this.link ()} >
        <Label glyph={glyph} glyph-color={color} width='25px' {...this.link ()} />
        <Label text={text} wrap='yes' grow='1' {...this.link ()} />
      </Container>
    );
  }

  renderNotes (trip) {
    const glyphs = trip.Glyphs;
    if (!glyphs) {
      return null;
    } else {
      let lines = [];
      glyphs.forEach (glyph => {
        if (glyph && glyph.value && glyph.value.Glyph) {
          lines.push (this.renderLine (glyph.value.Glyph, glyph.value.Description,));
        }
      });
      return lines;
    }
  }

  renderCompacted () {
    const width    = '250px';
    // const selected = this.read ('Selected');
    const selected = this.getSelected ();
    const hatch    = this.getHatch ();
    const kind     = this.read ('kind');
    const data     = this.read ('data');
    const color    = data.Color;
    const type     = data.Type ? data.Type : 'xxx';
    const noDrag   = data.NoDrag;
    const ticketId = this.read ('ticket-id');
    const tripId   = this.read ('trip-id');

    if (!data || !data.Trip || typeof data.Trip.Pick === 'undefined' || typeof data.Trip.Drop === 'undefined') {
      throw new Error ('TripTicket without data');
    } else {
      const trip           = (type === 'pick') ? data.Trip.Pick : data.Trip.Drop;
      const time           = trip.Time;
      const directionGlyph = this.getDirectionGlyph (trip, type);
      const directionColor = ColorHelpers.GetMarkColor (this.props.theme, type);
      const glyphs         = trip.Glyphs;
      const height         = Unit.add (this.computeHeight (trip.Description), '20px');
      const marginBottom   = '-10px';
      const cursor         = (noDrag === 'true') ? null : 'move';

      return (
        <Ticket width={width} height={height} selected={selected ? 'true' : 'false'}
          kind={kind} subkind={type} color={color}
          drag-handle='TripTicket' no-drag={noDrag} cursor={cursor} hatch={hatch ? 'true' : 'false'}
          ticket-type='trip-ticket' ticket-id={ticketId} trip-id={tripId} extended='false'
          onMouseClick={(e) => this.mouseClick (e)}
          {...this.link ()} >
          <Container kind='ticket-column' grow='1' {...this.link ()} >
            <Container kind='ticket-row' margin-bottom={marginBottom} {...this.link ()} >
              <Label text={this.getTime (time)} font-weight='bold' width='50px' {...this.link ()} />
              <Label glyph={directionGlyph} glyph-color={directionColor} width='25px' {...this.link ()} />
              <Label text={trip.Description} font-weight='bold' wrap='no' grow='1' {...this.link ()} />
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

  renderExtended () {
    const width    = '250px';
    // const selected = this.read ('Selected');
    const selected = this.getSelected ();
    const hatch    = this.getHatch ();
    const kind     = this.read ('kind');
    const data     = this.read ('data');
    const color    = data.Color;
    const type     = data.Type ? data.Type : 'xxx';
    const noDrag   = data.NoDrag;
    const ticketId = this.read ('ticket-id');
    const tripId   = this.read ('trip-id');

    if (!data || !data.Trip || typeof data.Trip.Pick === 'undefined' || typeof data.Trip.Drop === 'undefined') {
      throw new Error ('TripTicket without data');
    } else {
      const trip           = (type === 'pick') ? data.Trip.Pick : data.Trip.Drop;
      const time           = trip.Time;
      const directionGlyph = this.getDirectionGlyph (trip, type);
      const directionColor = ColorHelpers.GetMarkColor (this.props.theme, type);
      const glyphs         = trip.Glyphs;
      const height         = Unit.add (this.computeHeight (trip.Description), '20px');
      const marginBottom   = null;
      const cursor         = (noDrag === 'true') ? null : 'move';

      return (
        <Ticket width={width} height={height} selected={selected ? 'true' : 'false'}
          kind={kind} subkind={type} color={color}
          drag-handle='TripTicket' no-drag={noDrag} cursor={cursor} hatch={hatch ? 'true' : 'false'}
          ticket-type='trip-ticket' ticket-id={ticketId} trip-id={tripId} extended='true'
          onMouseClick={(e) => this.mouseClick (e)}
          {...this.link ()} >
          <Container kind='ticket-column' grow='1' {...this.link ()} >
            <Container kind='ticket-row' margin-bottom={marginBottom} {...this.link ()} >
              <Label text={this.getTime (time)} font-weight='bold' width='50px' {...this.link ()} />
              <Label glyph={directionGlyph} glyph-color={directionColor} width='25px' {...this.link ()} />
              <Label text={trip.Description} font-weight='bold' wrap='no' grow='1' {...this.link ()} />
            </Container>
            {this.renderLine ('building', trip.Details)}
            {this.renderNotes (trip)}
            {this.renderLine ('cube', data.Trip.Count)}
          </Container>
        </Ticket>
      );
    }
  }

  render () {
    if (this.getExtended ()) {
      return this.renderExtended ();
    } else {
      return this.renderCompacted ();
    }
  }
}

/******************************************************************************/
