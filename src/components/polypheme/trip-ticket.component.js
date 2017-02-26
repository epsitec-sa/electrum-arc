'use strict';

import React from 'react';

import {Ticket, Container, Label, Separator, Badge, Gauge} from '../../all-components.js';
import {ColorManipulator} from 'electrum';
import {ColorHelpers} from 'electrum-theme';
import {Unit} from 'electrum-theme';
import Converters from './converters';
import TicketHelpers from './ticket-helpers.js';
import ReducerData from '../polypheme/reducer-data.js';

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

  // Return the hud glyph displayed at top right corner.
  // If the ticket is selected, displays a large "v" on a blue background.
  getHudGlyph (data, ticket) {
    if (!this.props.hasHeLeft || this.props.isDragged) {
      const selected = ReducerData.ask (data, {type: 'IS_TICKET_SELECTED', id: ticket.id});
      return selected ? 'check' : null;
    }
    return null;
  }

  getPeriod (startTime, endTime) {
    const s = Converters.getDisplayedTime (startTime);
    const e = Converters.getDisplayedTime (endTime);
    if (s === e) {
      return s;
    } else {
      return `${s} — ${e}`;
    }
  }

  //  Update state.link to all tickets linked.
  //  By example, pick and drop to a trip, or 4 tickets if has transit.
  setLinkToAll (link) {
    const ticket     = this.read ('ticket');
    const metaTicket = this.read ('metaTicket');
    const missionId  = metaTicket ? metaTicket.MissionId : ticket.MissionId;
    if (missionId) {
      for (var tripTicket of window.document.tripTickets) {
        const t = tripTicket.read ('ticket');
        const u = tripTicket.read ('metaTicket');
        const m = u ? u.MissionId : t.MissionId;
        if (missionId === m) {
          tripTicket.setLink (link);
        }
      }
    }
  }

  mouseOver () {
    if (!this.props.isDragged) {
      this.setHover (true);
      this.setLinkToAll (true);
    }
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

  renderShortNote (note) {
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

  renderShortNotes (notes) {
    if (!notes) {
      return null;
    } else {
      let line = [];
      for (var note of notes) {
        line.push (this.renderShortNote (note));
      }
      return line;
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

  renderMeetingPoint (meetingPoint, border, index) {
    if (meetingPoint) {
      const directionGlyph = TicketHelpers.getDirectionGlyph (this.props.theme, meetingPoint.Type);
      const dimmedSize     = this.props.theme.shapes.ticketDimmedSize;

      return (
        <Container kind='thin-row' border={border} grow='1' {...this.link ()} >
          <Container kind='thin-row' width='120px' {...this.link ()} >
            <Label text={this.getPeriod (meetingPoint.StartPlanedTime, meetingPoint.EndPlanedTime)}
              font-weight='bold' wrap='no' {...this.link ()} />
          </Container>
          <Container kind='thin-row' width='20px' {...this.link ()} >
            <Label glyph={directionGlyph.glyph} glyph-color={directionGlyph.color} {...this.link ()} />
          </Container>
          <Container kind='thin-row' grow='1' width='0px' {...this.link ()} >
            <Label text={meetingPoint.ShortDescription} wrap='no' {...this.link ()} />
          </Container>
          <Container kind='thin-row' width='50px' {...this.link ()} >
            <Label text={meetingPoint.Zone} text-transform='uppercase' wrap='no' font-size={dimmedSize} {...this.link ()} />
          </Container>
          <Container kind='thin-row' width='80px' {...this.link ()} >
            <Label grow='1' {...this.link ()} />
            {this.renderShortNotes (meetingPoint.Notes)}
          </Container>
        </Container>
      );
    } else {
      return (
        <Container kind='thin-row' border={border} grow='1' {...this.link ()} >
        </Container>
      );
    }
  }

  renderMeetingPoints (meetingPoints) {
    const result = [];
    let index = 0;
    for (var i = 0; i < meetingPoints.length; i++) {
      const meetingPoint = meetingPoints[i];
      const border = i < meetingPoints.length - 1 ? 'bottom' : null;
      result.push (this.renderMeetingPoint (meetingPoint, border, index++));
    }
    return result;
  }

  renderTripBoxContent (metaTicket) {
    const dimmedColor = this.props.theme.palette.ticketDimmed;
    const dimmedSize  = this.props.theme.shapes.ticketDimmedSize;

    return (
      <Container kind='row' grow='1' {...this.link ()} >
        <Container kind='thin-column' border='right' width='10px' {...this.link ()} >
          <Gauge value={metaTicket.Urgency} {...this.link ()} />
        </Container>
        <Container kind='thin-column' border='right' grow='1' {...this.link ()} >
          {this.renderMeetingPoints (metaTicket.MeetingPoints, 'bottom')}
        </Container>
        <Container kind='thin-column' border='right' width='110px' {...this.link ()} >
          <Container kind='thin-row' grow='1' {...this.link ()} >
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Label glyph='cube' glyph-color={dimmedColor} {...this.link ()} />
            </Container>
            <Container kind='thin-row' grow='3' {...this.link ()} >
              <Label text={TicketHelpers.getPackageCount (metaTicket)} justify='right' grow='1' wrap='no' {...this.link ()} />
            </Container>
          </Container>
          <Container kind='thin-row' grow='1' {...this.link ()} >
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Label text='total' font-size={dimmedSize} text-color={dimmedColor} {...this.link ()} />
            </Container>
            <Container kind='thin-row' grow='3' {...this.link ()} >
              <Label text={metaTicket.Weight} justify='right' grow='1' wrap='no' {...this.link ()} />
            </Container>
          </Container>
        </Container>
        <Container kind='thin-column' width='90px' {...this.link ()} >
          <Container kind='thin-row' grow='1' {...this.link ()} >
            <Label text={metaTicket.NetPrice} justify='right' grow='1' wrap='no' {...this.link ()} />
          </Container>
          <Container kind='thin-row' grow='1' {...this.link ()} >
            <Container kind='thin-row' grow='2' {...this.link ()} >
            </Container>
            <Container kind='thin-row' grow='3' {...this.link ()} >
              <Label grow='1' {...this.link ()} />
              {this.renderShortNotes (metaTicket.Notes)}
            </Container>
          </Container>
        </Container>
      </Container>
    );
  }

  renderCompactedContent (ticket, directionGlyph, delivered) {
    let topTime, bottomTime;
    if (delivered) {
      topTime    = ticket.MeetingPoint.RealisedTime;
      bottomTime = null;
    } else {
      topTime    = ticket.MeetingPoint.StartPlanedTime;
      bottomTime = ticket.MeetingPoint.EndPlanedTime;
    }
    return (
      <Container kind='ticket-column' grow='1' {...this.link ()} >
        {this.renderWarning (ticket.Warning)}
        <Container kind='ticket-row' margin-bottom='-10px' {...this.link ()} >
          <Label text={Converters.getDisplayedTime (topTime)} font-weight='bold' width='50px' {...this.link ()} />
          <Label glyph={directionGlyph.glyph} glyph-color={directionGlyph.color} width='25px' {...this.link ()} />
          <Label text={ticket.MeetingPoint.ShortDescription} font-weight='bold' wrap='no' grow='1' {...this.link ()} />
        </Container>
        <Container kind='ticket-row' {...this.link ()} >
          <Label text={Converters.getDisplayedTime (bottomTime)} font-weight='bold' width='50px' {...this.link ()} />
          <Label text='' width='25px' {...this.link ()} />
          <Label glyph='cube' spacing='compact' {...this.link ()} />
          <Label text={TicketHelpers.getPackageCount (ticket)} grow='1' {...this.link ()} />
          {this.renderNoteGlyphs (ticket.MeetingPoint.Notes)}
        </Container>
      </Container>
    );
  }

  renderExtendedContent (ticket, directionGlyph, delivered) {
    let topTime;
    if (delivered) {
      topTime = ticket.MeetingPoint.RealisedTime;
    } else {
      topTime = ticket.MeetingPoint.StartPlanedTime;
    }
    return (
      <Container kind='ticket-column' grow='1' {...this.link ()} >
        {this.renderWarning (ticket.Warning)}
        <Container kind='ticket-row' {...this.link ()} >
          <Label text={Converters.getDisplayedTime (topTime)} font-weight='bold' width='50px' {...this.link ()} />
          <Label glyph={directionGlyph.glyph} glyph-color={directionGlyph.color} width='25px' {...this.link ()} />
          <Label text={ticket.MeetingPoint.ShortDescription} font-weight='bold' wrap='no' grow='1' {...this.link ()} />
        </Container>
        {this.renderLine ('building', ticket.MeetingPoint.LongDescription)}
        {this.renderLine ('map-marker', ticket.MeetingPoint.Zone)}
        {this.renderNotes (ticket.MeetingPoint.Notes)}
        {this.renderLine ('cube', TicketHelpers.getPackageDescription (ticket))}
        {this.renderLine ('money', ticket.MeetingPoint.NetPrice)}
        {this.renderLine ('info-circle', TicketHelpers.getStatusDescription (ticket))}
        {this.renderNotes (ticket.MeetingPoint.Notes)}
      </Container>
    );
  }

  renderMetaTicket (metaTicket) {
    const data              = this.read ('data');
    const parentKind        = this.read ('kind');
    const noDrag            = this.read ('no-drag');
    const verticalSpacing   = this.read ('vertical-spacing');
    const horizontalSpacing = this.read ('horizontal-spacing');
    const selected          = this.read ('selected');
    const isDragged         = this.props.isDragged;
    const hasHeLeft         = this.props.hasHeLeft;

    const cursor    = (noDrag === 'true') ? 'default' : 'move';
    const delivered = false;
    const hatch     = false;
    const extended  = false;
    const kind      = 'thin';
    const width     = null;
    const height    = Unit.multiply (this.props.theme.shapes.tripBoxHeight, metaTicket.MeetingPoints.length);

    let color = this.props.theme.palette.ticketBackground;
    if (metaTicket.Flash === 'true' && !isDragged) {
      color = this.props.theme.palette.ticketFlashBackground;
    }
    if (delivered) {
      color = this.props.theme.palette.ticketDeliveredBackground;
    }
    if (metaTicket.Warning && !isDragged) {
      color = this.props.theme.palette.ticketWarningBackground;
    }
    if (this.getHover () && !isDragged) {
      color = ColorManipulator.emphasize (color, 0.1);
    }
    if (selected === 'true' && !isDragged) {
      color = ColorManipulator.emphasize (color, 0.3);
    }
    if (hasHeLeft && !isDragged) {
      color = this.props.theme.palette.ticketDragAndDropShadow;
    }

    return (
      <Ticket
        width              = {width}
        height             = {height}
        vertical-spacing   = {verticalSpacing}
        horizontal-spacing = {horizontalSpacing}
        color              = {color}
        kind               = {kind}
        hatch              = {hatch}
        cursor             = {cursor}
        hide-content       = {hasHeLeft && !isDragged ? 'true' : 'false'}
        mouse-over         = {() => this.mouseOver ()}
        mouse-out          = {() => this.mouseOut ()}
        {...this.link ()} >
        {this.renderTripBoxContent (metaTicket)}
      </Ticket>
    );
  }

  renderTicketContent (ticket, extended, delivered) {
    const directionGlyph = TicketHelpers.getDirectionGlyph (this.props.theme, ticket.Type);

    if (extended) {
      return this.renderExtendedContent (ticket, directionGlyph, delivered);
    } else {
      return this.renderCompactedContent (ticket, directionGlyph, delivered);
    }
  }

  renderTicket (ticket) {
    const data              = this.read ('data');
    const parentKind        = this.read ('kind');
    const shape             = this.read ('shape');
    const noDrag            = this.read ('no-drag');
    const verticalSpacing   = this.read ('vertical-spacing');
    const horizontalSpacing = this.read ('horizontal-spacing');
    const selected          = this.read ('selected');
    const isDragged         = this.props.isDragged;
    const hasHeLeft         = this.props.hasHeLeft;

    const cursor    = (noDrag === 'true') ? 'default' : 'move';
    const delivered = ticket.Status === 'delivered';
    const hatch     = (ticket.Status === 'dispatched' || delivered) ? 'true' : 'false';
    const extended  = ReducerData.ask (data, {type: 'IS_TICKET_EXTENDED', id: ticket.id});
    let kind, width, height;
    if (parentKind === 'trip-box') {
      kind   = 'thin';
      width  = null;
      height = this.props.theme.shapes.tripBoxHeight;
    } else if (parentKind === 'trip-backlog') {
      kind   = 'rect';
      width  = this.props.theme.shapes.tripTicketWidth;
      height = null;
    } else {
      kind   = extended ? 'rect' : 'ticket';
      width  = this.props.theme.shapes.tripTicketWidth;
      height = extended ? null : (ticket.Warning ? '90px' : '60px');
    }

    let color = this.props.theme.palette.ticketBackground;
    if (ticket.Flash === 'true' && !isDragged) {
      color = this.props.theme.palette.ticketFlashBackground;
    }
    if (delivered) {
      color = this.props.theme.palette.ticketDeliveredBackground;
    }
    if (ticket.Warning && !isDragged) {
      color = this.props.theme.palette.ticketWarningBackground;
    }
    if (this.getHover () && !isDragged) {
      color = ColorManipulator.emphasize (color, 0.1);
    }
    if (selected === 'true' && !isDragged) {
      color = ColorManipulator.emphasize (color, 0.3);
    }
    if (hasHeLeft && !isDragged) {
      color = this.props.theme.palette.ticketDragAndDropShadow;
    }

    let hoverShape = null;
    if (this.getLink () && !isDragged && !hasHeLeft) {
      if (ticket.Type.startsWith ('pick')) {
        hoverShape = 'first';
      } else if (ticket.Type.startsWith ('drop')) {
        hoverShape = 'last';
      } else {
        hoverShape = 'normal';
      }
    }

    return (
      <Ticket
        width              = {width}
        height             = {height}
        vertical-spacing   = {verticalSpacing}
        horizontal-spacing = {horizontalSpacing}
        color              = {color}
        background-text    = {this.getBackgroundText (ticket)}
        kind               = {kind}
        shape              = {shape}
        hover-shape        = {hoverShape}
        hatch              = {hatch}
        cursor             = {cursor}
        hud-glyph          = {this.getHudGlyph (data, ticket)}
        hide-content       = {hasHeLeft && !isDragged ? 'true' : 'false'}
        mouse-over         = {() => this.mouseOver ()}
        mouse-out          = {() => this.mouseOut ()}
        {...this.link ()} >
        {this.renderTicketContent (ticket, extended, delivered)}
      </Ticket>
    );
  }

  render () {
    const ticket     = this.read ('ticket');
    const metaTicket = this.read ('metaTicket');
    if (ticket) {
      return this.renderTicket (ticket);
    } else if (metaTicket) {
      return this.renderMetaTicket (metaTicket);
    }
  }
}

/******************************************************************************/
