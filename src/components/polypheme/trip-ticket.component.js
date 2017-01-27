'use strict';

import React from 'react';

import {Ticket, AgnosticTicket, Container, Label, Separator, Badge} from '../../all-components.js';
import {ColorManipulator} from 'electrum';
import {ColorHelpers} from 'electrum-theme';
import {Unit} from 'electrum-theme';
import reducerDragAndDrop from '../polypheme/reducer-drag-and-drop.js';
import {getDisplayedTime, getPackageCount} from './converters';
import {isSelected, isExtended, isFlash, getDirectionGlyph, getPackageDescription, getStatusDescription} from './ticket-helpers.js';

const {emphasize} = ColorManipulator;

/******************************************************************************/

export default class TripTicket extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover: false,
      link:  false,
    };
  }

  getHover () {
    return this.state.hover;
  }

  setHover (value) {
    this.setState ( {
      hover: value
    });
  }

  getLink () {
    return this.state.link;
  }

  setLink (value) {
    this.setState ( {
      link: value
    });
  }

  componentDidMount () {
    if (!window.document.tripTickets) {
      window.document.tripTickets = [];
    }
    window.document.tripTickets.push (this);
  }

  componentWillUnmount () {
    const index = window.document.tripTickets.indexOf (this);
    if (index !== -1) {
      window.document.tripTickets.splice (index, 1);
    }
  }

  getBackgroundText (ticket) {
    if (this.getLink ()) {
      return ticket.Order + 1;  // display 1..4 (for pick, drop-transit, pick-transit and drop)
    } else {
      return null;
    }
  }

  getHudGlyph (data, ticket) {
    return isSelected (data, ticket.id) ? 'check' : null;
  }

  //  Update state.link to all tickets linked.
  //  By example, pick and drop to a trip, or 4 tickets if has transit.
  setLinkToAll (link) {
    const thisTicket = this.read ('ticket');
    const missionId = thisTicket.Trip.MissionId;
    if (missionId) {
      for (var i = 0, len = window.document.tripTickets.length; i < len; i++) {
        const tripTicket = window.document.tripTickets[i];
        const otherTicket = tripTicket.read ('ticket');
        const m = otherTicket.Trip.MissionId;
        if (missionId === m) {
          tripTicket.setLink (link);
        }
      }
    }
  }

  mouseOver () {
    this.setHover (true);
    this.setLinkToAll (true);
  }

  mouseOut () {
    this.setHover (false);
    this.setLinkToAll (false);
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
    const data     = this.read ('data');
    const shape    = this.read ('shape');
    const ticket   = this.read ('ticket');
    const noDrag   = this.read ('no-drag');
    const selected = this.read ('selected');
    const type     = ticket.Type;

    const trip           = type.startsWith ('pick') ? ticket.Trip.Pick : ticket.Trip.Drop;
    const planedTime     = trip.PlanedTime;
    const realisedTime   = trip.RealisedTime;
    const directionGlyph = getDirectionGlyph (this.props.theme, type);
    const notes          = trip.Notes;
    const height         = ticket.Warning ? '90px' : '60px';
    const marginBottom   = '-10px';
    const cursor         = (noDrag === 'true') ? 'default' : 'move';
    const hudGlyph       = this.getHudGlyph (data, ticket);
    const flash          = isFlash (data, ticket.id) ? 'true' : 'false';

    return (
      <Ticket
        width           = {width}
        height          = {height}
        background-text = {this.getBackgroundText (ticket)}
        link-changing   = {value => this.setLink (value)}
        kind            = 'ticket'
        shape           = {shape}
        cursor          = {cursor}
        selected        = {selected}
        hud-glyph       = {hudGlyph}
        mission-id      = {ticket.Trip.MissionId}
        status          = {ticket.Status}
        flash           = {flash}
        warning         = {ticket.Warning}
        type            = {ticket.Type}
        isDragged       = {this.props.isDragged}
        hasHeLeft       = {this.props.hasHeLeft}
        {...this.link ()} >
        <Container kind='ticket-column' grow='1' {...this.link ()} >
          {this.renderWarning (ticket.Warning)}
          <Container kind='ticket-row' margin-bottom={marginBottom} {...this.link ()} >
            <Label text={getDisplayedTime (planedTime)} font-weight='bold' width='50px' {...this.link ()} />
            <Label glyph={directionGlyph.glyph} glyph-color={directionGlyph.color} width='25px' {...this.link ()} />
            <Label text={trip.ShortDescription} font-weight='bold' wrap='no' grow='1' {...this.link ()} />
          </Container>
          <Container kind='ticket-row' {...this.link ()} >
            <Label text={getDisplayedTime (realisedTime)} font-weight='normal' width='50px' {...this.link ()} />
            <Label text='' width='25px' {...this.link ()} />
            <Label glyph='cube' spacing='compact' {...this.link ()} />
            <Label text={getPackageCount (ticket.Trip.Packages.length)} grow='1' {...this.link ()} />
            {this.renderNoteGlyphs (notes)}
          </Container>
        </Container>
      </Ticket>
    );
  }

  renderCompacted2 () {
    const width    = this.props.theme.shapes.tripTicketWidth;
    const data     = this.read ('data');
    const shape    = this.read ('shape');
    const ticket   = this.read ('ticket');
    const noDrag   = this.read ('no-drag');
    const selected = this.read ('selected');
    const type     = ticket.Type;

    const trip           = type.startsWith ('pick') ? ticket.Trip.Pick : ticket.Trip.Drop;
    const planedTime     = trip.PlanedTime;
    const realisedTime   = trip.RealisedTime;
    const directionGlyph = getDirectionGlyph (this.props.theme, type);
    const notes          = trip.Notes;
    const height         = ticket.Warning ? '90px' : '60px';
    const marginBottom   = '-10px';
    const cursor         = (noDrag === 'true') ? 'default' : 'move';
    const hudGlyph       = this.getHudGlyph (data, ticket);
    const flash          = isFlash (data, ticket.id) ? 'true' : 'false';

    let color = this.props.theme.palette.ticketBackground;
    let hoverShape = null;

    if (ticket.Status === 'delivered') {
      color = this.props.theme.palette.ticketDeliveredBackground;
    }
    if (this.getHover ()) {
      color = emphasize (color, 0.1);
    }
    if (this.getLink ()) {
      if (ticket.Type.startsWith ('pick')) {
        hoverShape = 'first';
      } else {
        hoverShape = 'last';
      }
    }

    const hatch = (ticket.Status === 'dispatched' || ticket.Status === 'delivered') ? 'true' : 'false';

    return (
      <AgnosticTicket
        width           = {width}
        height          = {height}
        color           = {color}
        background-text = {this.getBackgroundText (ticket)}
        kind            = 'ticket'
        shape           = {shape}
        hatch           = {hatch}
        hover-shape     = {hoverShape}
        cursor          = {cursor}
        hud-glyph       = {hudGlyph}
        mouse-over      = {() => this.mouseOver ()}
        mouse-out       = {() => this.mouseOut ()}
        {...this.link ()} >
        <Container kind='ticket-column' grow='1' {...this.link ()} >
          {this.renderWarning (ticket.Warning)}
          <Container kind='ticket-row' margin-bottom={marginBottom} {...this.link ()} >
            <Label text={getDisplayedTime (planedTime)} font-weight='bold' width='50px' {...this.link ()} />
            <Label glyph={directionGlyph.glyph} glyph-color={directionGlyph.color} width='25px' {...this.link ()} />
            <Label text={trip.ShortDescription} font-weight='bold' wrap='no' grow='1' {...this.link ()} />
          </Container>
          <Container kind='ticket-row' {...this.link ()} >
            <Label text={getDisplayedTime (realisedTime)} font-weight='normal' width='50px' {...this.link ()} />
            <Label text='' width='25px' {...this.link ()} />
            <Label glyph='cube' spacing='compact' {...this.link ()} />
            <Label text={getPackageCount (ticket.Trip.Packages.length)} grow='1' {...this.link ()} />
            {this.renderNoteGlyphs (notes)}
          </Container>
        </Container>
      </AgnosticTicket>
    );
  }

  renderExtended () {
    const width    = this.props.theme.shapes.tripTicketWidth;
    const data     = this.read ('data');
    const shape    = this.read ('shape');
    const ticket   = this.read ('ticket');
    const noDrag   = this.read ('no-drag');
    const selected = this.read ('selected');
    const type     = ticket.Type;

    const trip           = type.startsWith ('pick') ? ticket.Trip.Pick : ticket.Trip.Drop;
    const planedTime     = trip.PlanedTime;
    const directionGlyph = getDirectionGlyph (this.props.theme, type);
    const marginBottom   = null;
    const cursor         = (noDrag === 'true') ? 'default' : 'move';
    const hudGlyph       = this.getHudGlyph (data, ticket);
    const flash          = isFlash (data, ticket.id) ? 'true' : 'false';

    return (
      <Ticket
        width           = {width}
        background-text = {this.getBackgroundText (ticket)}
        link-changing   = {value => this.setLink (value)}
        kind            = 'rect'
        shape           = {shape}
        cursor          = {cursor}
        selected        = {selected}
        hud-glyph       = {hudGlyph}
        mission-id      = {ticket.Trip.MissionId}
        status          = {ticket.Status}
        flash           = {flash}
        warning         = {ticket.Warning}
        type            = {ticket.Type}
        isDragged       = {this.props.isDragged}
        hasHeLeft       = {this.props.hasHeLeft}
        {...this.link ()} >
        <Container kind='ticket-column' grow='1' {...this.link ()} >
          {this.renderWarning (ticket.Warning)}
          <Container kind='ticket-row' margin-bottom={marginBottom} {...this.link ()} >
            <Label text={getDisplayedTime (planedTime)} font-weight='bold' width='50px' {...this.link ()} />
            <Label glyph={directionGlyph.glyph} glyph-color={directionGlyph.color} width='25px' {...this.link ()} />
            <Label text={trip.ShortDescription} font-weight='bold' wrap='no' grow='1' {...this.link ()} />
          </Container>
          {this.renderLine ('building', trip.LongDescription)}
          {this.renderLine ('map-marker', trip.Zone)}
          {this.renderNotes (trip.Notes)}
          {this.renderLine ('cube', getPackageDescription (ticket))}
          {this.renderLine ('money', ticket.Trip.Price)}
          {this.renderLine ('info-circle', getStatusDescription (ticket))}
          {this.renderNotes (ticket.Trip.Notes)}
        </Container>
      </Ticket>
    );
  }

  render () {
    const data   = this.read ('data');
    const ticket = this.read ('ticket');
    if (isExtended (data, ticket.id)) {
      return this.renderExtended ();
    } else {
      return this.renderCompacted2 ();
    }
  }
}

/******************************************************************************/
