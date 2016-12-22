'use strict';

import React from 'react';

import {Ticket, Container, Label, Separator} from '../../all-components.js';
import {ColorHelpers} from 'electrum-theme';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class TripTicket extends React.Component {

  constructor (props) {
    super (props);
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
    } else if (time && time.length === 8) {
      // If format '12:45:30', extract 'hh:mm'.
      let h = time.substring (0, 2);
      let m = time.substring (3, 5);
      time = h + ':' + m;
    }
    return time;
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

  getDirectionGlyph (type) {
    const transit = type.endsWith ('-transit');
    if (type.startsWith ('pick')) {
      return transit ? 'plus-square-o' : 'plus-square';
    } else if (type.startsWith ('drop')) {
      return transit ? 'minus-square-o' : 'minus-square';
    } else {
      throw new Error (`Unknown type ${type}`);
    }
  }

  renderLine (glyph, text, index) {
    if (!text) {
      return null;
    } else {
      let color = null;
      if (glyph.startsWith ('bookmark-')) {
        color = glyph.substring (9);
        glyph = 'bookmark';
      }
      return (
        <Container key={index} kind='ticket-row' {...this.link ()} >
          <Label width='15px' {...this.link ()} />
          <Label glyph={glyph} glyph-color={color} width='35px' {...this.link ()} />
          <Label text={text} font-size={this.props.theme.shapes.ticketExtendedTextSize}
            wrap='yes' grow='1' {...this.link ()} />
        </Container>
      );
    }
  }

  renderWarning (text) {
    if (!text) {
      return null;
    } else {
      return (
        <Container kind='column' {...this.link ()} >
          <Container kind='row' {...this.link ()} >
            <Label kind='ticket-warning' text={text} font-style='italic' wrap='no' grow='1' {...this.link ()} />
          </Container>
          <Separator kind='ticket-warning' {...this.link ()} />
        </Container>
      );
    }
  }

  renderNote (note, index) {
    let glyph = null;
    if (note.Glyphs.length >= 1) {
      glyph = note.Glyphs[0].Glyph;  // only first glyph !
    }
    return this.renderLine (glyph, note.Content, index);
  }

  renderNotes (notes) {
    if (!notes) {
      return null;
    } else {
      let line = [];
      let index = 0;
      for (var note of notes) {
        line.push (this.renderNote (note, index++));
      }
      return line;
    }
  }

  renderCompacted () {
    const width    = this.props.theme.shapes.tripTicketWidth;
    const shape    = this.read ('shape');
    const ticket   = this.read ('ticket');
    const noDrag   = this.read ('no-drag');
    const selected = this.read ('selected');
    const type     = ticket.Type;

    const trip           = type.startsWith ('pick') ? ticket.Trip.Pick : ticket.Trip.Drop;
    const time           = trip.PlanedTime;
    const directionGlyph = this.getDirectionGlyph (type);
    const directionColor = ColorHelpers.GetMarkColor (this.props.theme, type);
    const notes          = trip.Notes;
    const height         = ticket.Warning ? '90px' : '60px';
    const marginBottom   = '-10px';
    const cursor         = (noDrag === 'true') ? null : 'move';
    const hudGlyph       = (ticket.Selected === 'true') ? 'check' : null;

    return (
      <Ticket width={width} height={height}
        kind='ticket' shape={shape} cursor={cursor} selected={selected}
        hud-glyph={hudGlyph} mission-id={ticket.Trip.MissionId}
        status={ticket.Status} flash={ticket.Flash} warning={ticket.Warning} type={ticket.Type}
        isDragged={this.props.isDragged} hasHeLeft={this.props.hasHeLeft} {...this.link ()} >
        <Container kind='ticket-column' grow='1' {...this.link ()} >
          {this.renderWarning (ticket.Warning)}
          <Container kind='ticket-row' margin-bottom={marginBottom} {...this.link ()} >
            <Label text={this.getTime (time)} font-weight='bold' width='50px' {...this.link ()} />
            <Label glyph={directionGlyph} glyph-color={directionColor} width='25px' {...this.link ()} />
            <Label text={trip.ShortDescription} font-weight='bold' wrap='no' grow='1' {...this.link ()} />
          </Container>
          <Container kind='ticket-row' {...this.link ()} >
            <Label text='' width='75px' {...this.link ()} />
            <Label glyph='cube' spacing='compact' {...this.link ()} />
            <Label text={this.getPackageCount (ticket)} grow='1' {...this.link ()} />
            {this.renderNoteGlyphs (notes)}
          </Container>
        </Container>
      </Ticket>
    );
  }

  renderExtended () {
    const width    = this.props.theme.shapes.tripTicketWidth;
    const shape    = this.read ('shape');
    const ticket   = this.read ('ticket');
    const noDrag   = this.read ('no-drag');
    const selected = this.read ('selected');
    const type     = ticket.Type;

    const trip           = type.startsWith ('pick') ? ticket.Trip.Pick : ticket.Trip.Drop;
    const time           = trip.PlanedTime;
    const directionGlyph = this.getDirectionGlyph (type);
    const directionColor = ColorHelpers.GetMarkColor (this.props.theme, type);
    const marginBottom   = null;
    const cursor         = (noDrag === 'true') ? null : 'move';
    const hudGlyph       = (ticket.Selected === 'true') ? 'check' : null;

    return (
      <Ticket width={width}
        kind='rect' shape={shape} cursor={cursor} selected={selected}
        hud-glyph={hudGlyph} mission-id={ticket.Trip.MissionId}
        status={ticket.Status} flash={ticket.Flash} warning={ticket.Warning} type={ticket.Type}
        isDragged={this.props.isDragged} hasHeLeft={this.props.hasHeLeft} {...this.link ()} >
        <Container kind='ticket-column' grow='1' {...this.link ()} >
          {this.renderWarning (ticket.Warning)}
          <Container kind='ticket-row' margin-bottom={marginBottom} {...this.link ()} >
            <Label text={this.getTime (time)} font-weight='bold' width='50px' {...this.link ()} />
            <Label glyph={directionGlyph} glyph-color={directionColor} width='25px' {...this.link ()} />
            <Label text={trip.ShortDescription} font-weight='bold' wrap='no' grow='1' {...this.link ()} />
          </Container>
          {this.renderLine ('building', trip.LongDescription)}
          {this.renderLine ('map-marker', trip.Zone)}
          {this.renderNotes (trip.Notes)}
          {this.renderLine ('cube', this.packageDescription (ticket))}
          {this.renderLine ('money', ticket.Trip.Price)}
          {this.renderNotes (ticket.Trip.Notes)}
        </Container>
      </Ticket>
    );
  }

  render () {
    const ticket = this.read ('ticket');
    if (ticket.Extended === 'true') {
      return this.renderExtended ();
    } else {
      return this.renderCompacted ();
    }
  }
}

/******************************************************************************/
