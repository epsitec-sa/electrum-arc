'use strict';

import React from 'react';

import {Ticket, Container, Label} from '../../all-components.js';
import {ColorHelpers} from 'electrum-theme';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class TripTicket extends React.Component {

  constructor (props) {
    super (props);
  }

  getExtended () {
    const data = this.read ('data');
    return data.Extended === 'true';
  }

  setExtended (value) {
    const data = this.read ('data');
    data.Extended = value ? 'true' : 'false';
    this.forceUpdate ();
  }

  getSelected () {
    const data = this.read ('data');
    return data.Selected === 'true';
  }

  setSelected (value) {
    const data = this.read ('data');
    data.Selected = value ? 'true' : 'false';
    this.forceUpdate ();
  }

  getHatch () {
    const data = this.read ('data');
    return data.Status === 'dispatched';
  }

  setHatch (value) {
    const data = this.read ('data');
    data.Status = value ? 'dispatched' : 'pre-dispatched';
    this.forceUpdate ();
  }

  mouseClick (event) {
    if (event.ctrlKey || event.metaKey) {  // select/deselect ?
      this.setSelected (!this.getSelected ());
    } else if (event.altKey) {  // dispatched/undispatched ?
      this.setHatch (!this.getHatch ());
    } else {  // compected/extended ?
      this.setExtended (!this.getExtended ());
    }
  }

  renderGlyph (glyph) {
    if (glyph.startsWith ('bookmark-')) {
      const color = glyph.substring (9);
      return (
        <Label glyph='bookmark' glyph-color={color} z-index={0}
          spacing='compact' {...this.link ()} />
      );
    } else {
      return (
        <Label glyph={glyph} z-index={0}
          spacing='compact' {...this.link ()} />
      );
    }
  }

  renderNoteGlyph (note) {
    if (!note || !note.Glyphs) {
      return null;
    } else {
      let line = [];
      for (var glyph of note.Glyphs) {
        if (glyph.Glyph) {
          line.push (this.renderGlyph (glyph.Glyph));
        }
      }
      return line;
    }
  }

  renderNoteGlyphs (notes) {
    if (!notes) {
      return null;
    } else {
      let line = [];
      for (var note of notes) {
        line.push (this.renderNoteGlyph (note));
      }
      return line;
    }
  }

  getTime (time) {
    if (time && time.length === 33) {
      // If format '2016-11-30T17:45:03.9052723+01:00', extract 'hh:mm'.
      let h = time.substring (11, 13);
      let m = time.substring (14, 16);
      time = h + ':' + m;
    }
    return time;
  }

  computeHeight (text) {
    const count = text.split ('\\n').length + 1;
    return Unit.multiply ('20px', count);
  }

  getPackageCount (ticket) {
    return ticket.Trip.Packages.length + 'x';
  }

  packageDescription (ticket) {
    let desc = this.getPackageCount (ticket);
    if (ticket.Trip.Weight) {
      desc += ` — ${ticket.Trip.Weight}`;
    }
    if (ticket.Trip.Product) {
      desc += ` — ${ticket.Trip.Product}`;
    }
    return desc;
  }

  getDirectionGlyph (trip, type) {
    return (type === 'pick') ?
    ((trip.Type === 'transit') ? 'plus-square-o'  : 'plus-square') :
    ((trip.Type === 'transit') ? 'minus-square-o' : 'minus-square');
  }

  renderLine (glyph, text) {
    if (!text) {
      return null;
    } else {
      let color = null;
      if (glyph.startsWith ('bookmark-')) {
        color = glyph.substring (9);
        glyph = 'bookmark';
      }
      return (
        <Container kind='ticket-row' {...this.link ()} >
          <Label width='15px' {...this.link ()} />
          <Label glyph={glyph} glyph-color={color} width='35px' {...this.link ()} />
          <Label text={text} font-size={this.props.theme.shapes.ticketExtendedTextSize}
            wrap='yes' grow='1' {...this.link ()} />
        </Container>
      );
    }
  }

  renderNote (note) {
    let glyph = null;
    if (note.Glyphs.length >= 1) {
      glyph = note.Glyphs[0].Glyph;  // only first glyph !
    }
    return this.renderLine (glyph, note.Content);
  }

  renderNotes (notes) {
    if (!notes) {
      return null;
    } else {
      let line = [];
      for (var note of notes) {
        line.push (this.renderNote (note));
      }
      return line;
    }
  }

  renderCompacted () {
    const width     = this.props.theme.shapes.tripTicketWidth;
    const selected  = this.getSelected () ? 'true' : 'false';
    const hatch     = this.getHatch () ? 'true' : 'false';
    const shape     = this.read ('shape');
    const data      = this.read ('data');
    const type      = this.read ('type');
    const noDrag    = 'false';

    const trip           = (type === 'pick') ? data.Trip.Pick : data.Trip.Drop;
    const time           = trip.PlanedTime;
    const directionGlyph = this.getDirectionGlyph (trip, type);
    const directionColor = ColorHelpers.GetMarkColor (this.props.theme, type);
    const notes          = trip.Notes;
    const height         = Unit.add (this.computeHeight (trip.ShortDescription), '20px');
    const marginBottom   = '-10px';
    const cursor         = (noDrag === 'true') ? null : 'move';

    return (
      <Ticket width={width} height={height} selected={selected}
        kind='ticket' shape={shape} type={type}
        drag-handle='TripTicket' no-drag={noDrag} cursor={cursor} hatch={hatch}
        data={data} onMouseClick={(e) => this.mouseClick (e)}
        {...this.link ()} >
        <Container kind='ticket-column' grow='1' {...this.link ()} >
          <Container kind='ticket-row' margin-bottom={marginBottom} {...this.link ()} >
            <Label text={this.getTime (time)} font-weight='bold' width='50px' {...this.link ()} />
            <Label glyph={directionGlyph} glyph-color={directionColor} width='25px' {...this.link ()} />
            <Label text={trip.ShortDescription} font-weight='bold' wrap='no' grow='1' {...this.link ()} />
          </Container>
          <Container kind='ticket-row' {...this.link ()} >
            <Label text='' width='75px' {...this.link ()} />
            <Label glyph='cube' spacing='compact' {...this.link ()} />
            <Label text={this.getPackageCount (data)} grow='1' {...this.link ()} />
            {this.renderNoteGlyphs (notes)}
          </Container>
        </Container>
      </Ticket>
    );
  }

  renderExtended () {
    const width     = this.props.theme.shapes.tripTicketWidth;
    const selected  = this.getSelected () ? 'true' : 'false';
    const hatch     = this.getHatch () ? 'true' : 'false';
    const shape     = this.read ('shape');
    const data      = this.read ('data');
    const type      = this.read ('type');
    const noDrag    = 'false';

    const trip           = (type === 'pick') ? data.Trip.Pick : data.Trip.Drop;
    const time           = trip.PlanedTime;
    const directionGlyph = this.getDirectionGlyph (trip, type);
    const directionColor = ColorHelpers.GetMarkColor (this.props.theme, type);
    const notes          = trip.Notes;
    const height         = Unit.add (this.computeHeight (trip.ShortDescription), '20px');
    const marginBottom   = null;
    const cursor         = (noDrag === 'true') ? null : 'move';

    return (
      <Ticket width={width} selected={selected}
        kind='rect' shape={shape} type={type}
        drag-handle='TripTicket' no-drag={noDrag} cursor={cursor} hatch={hatch}
        data={data} onMouseClick={(e) => this.mouseClick (e)}
        {...this.link ()} >
        <Container kind='ticket-column' grow='1' {...this.link ()} >
          <Container kind='ticket-row' margin-bottom={marginBottom} {...this.link ()} >
            <Label text={this.getTime (time)} font-weight='bold' width='50px' {...this.link ()} />
            <Label glyph={directionGlyph} glyph-color={directionColor} width='25px' {...this.link ()} />
            <Label text={trip.ShortDescription} font-weight='bold' wrap='no' grow='1' {...this.link ()} />
          </Container>
          {this.renderLine ('building', trip.LongDescription)}
          {this.renderLine ('map-marker', trip.Zone)}
          {this.renderNotes (trip.Notes)}
          {this.renderLine ('cube', this.packageDescription (data))}
          {this.renderLine ('money', data.Trip.Price)}
          {this.renderNotes (data.Trip.Notes)}
        </Container>
      </Ticket>
    );
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
