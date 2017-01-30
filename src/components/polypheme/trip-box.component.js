'use strict';

import React from 'react';

import {Unit} from 'electrum-theme';
import {AgnosticTicket, Container, Label, Button, Gauge} from '../../all-components.js';
import {ColorHelpers} from 'electrum-theme';
import reducerDragAndDrop from './reducer-drag-and-drop.js';
import {getDisplayedTime, getPackageCount} from './converters';
import {isSelected, isFlash, getDirectionGlyph} from './ticket-helpers.js';

/******************************************************************************/

export default class TripBox extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover: false,
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

  // Return the hud glyph displayed at top right corner.
  // If the ticket is selected, displays a large "v" on a blue background.
  getHudGlyph (data, ticket) {
    if (!this.props.hasHeLeft || this.props.isDragged) {
      return (isSelected (data, ticket.id)) ? 'check' : null;
    }
    return null;
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

  renderNote (note) {
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

  render () {
    const ticket = this.read ('ticket');
    if (!ticket || !ticket.Trip || typeof ticket.Trip.Pick === 'undefined' || typeof ticket.Trip.Drop === 'undefined') {
      throw new Error (`TripBox component without data`);
    }

    const data      = this.read ('data');
    const selected  = this.read ('selected');
    const height    = this.props.theme.shapes.tripBoxHeight;
    const isDragged = this.props.isDragged;
    const hasHeLeft = this.props.hasHeLeft;

    const cursor             = 'move';
    const directionGlyphPick = getDirectionGlyph (this.props.theme, 'pick');
    const directionGlyphDrop = getDirectionGlyph (this.props.theme, 'drop');
    const dimmedColor        = this.props.theme.palette.ticketDimmed;
    const dimmedSize         = this.props.theme.shapes.ticketDimmedSize;

    let color = this.props.theme.palette.ticketBackground;
    if (ticket.Flash === 'true' && !isDragged) {
      color = this.props.theme.palette.ticketFlashBackground;
    }
    if (ticket.Status === 'delivered') {
      color = this.props.theme.palette.ticketDeliveredBackground;
    }
    if (ticket.Warning && !isDragged) {
      color = this.props.theme.palette.ticketWarningBackground;
    }
    if (this.getHover () && !isDragged) {
      color = emphasize (color, 0.1);
    }
    if (selected === 'true' && !isDragged) {
      color = emphasize (color, 0.3);
    }
    if (hasHeLeft && !isDragged) {
      color = this.props.theme.palette.ticketDragAndDropShadow;
    }

    return (
      <AgnosticTicket
        kind       = 'thin'
        height     = {height}
        color      = {color}
        cursor     = {cursor}
        grow       = '1'
        hud-glyph  = {this.getHudGlyph (data, ticket)}
        {...this.link ()} >
        <Container kind='thin-column' border='right' width='10px' {...this.link ()} >
          <Gauge value={ticket.Trip.Urgency} {...this.link ()} />
        </Container>
        <Container kind='thin-column' border='right' grow='1' {...this.link ()} >
          <Container kind='thin-row' border='bottom' grow='1' {...this.link ()} >
            <Container kind='thin-row' width='50px' {...this.link ()} >
              <Label text={getDisplayedTime (ticket.Trip.Pick.PlanedTime)} font-weight='bold' wrap='no'
                {...this.link ()} />
            </Container>
            <Container kind='thin-row' width='20px' {...this.link ()} >
              <Label glyph={directionGlyphPick.glyph} glyph-color={directionGlyphPick.color} {...this.link ()} />
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Label text={ticket.Trip.Pick.ShortDescription} wrap='no' {...this.link ()} />
            </Container>
            <Container kind='thin-row' width='50px' {...this.link ()} >
              <Label text={ticket.Trip.Pick.Zone} text-transform='uppercase' wrap='no' font-size={dimmedSize} {...this.link ()} />
            </Container>
            <Container kind='thin-row' width='80px' {...this.link ()} >
              <Label grow='1' {...this.link ()} />
              {this.renderNotes (ticket.Trip.Pick.Notes)}
            </Container>
          </Container>
          <Container kind='thin-row' grow='1' {...this.link ()} >
            <Container kind='thin-row' width='50px' {...this.link ()} >
              <Label text={getDisplayedTime (ticket.Trip.Drop.PlanedTime)} font-weight='bold' wrap='no'
                {...this.link ()} />
            </Container>
            <Container kind='thin-row' width='20px' {...this.link ()} >
              <Label glyph={directionGlyphDrop.glyph} glyph-color={directionGlyphDrop.color} {...this.link ()} />
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Label text={ticket.Trip.Drop.ShortDescription} wrap='no' {...this.link ()} />
            </Container>
            <Container kind='thin-row' width='50px' {...this.link ()} >
              <Label text={ticket.Trip.Drop.Zone} text-transform='uppercase' wrap='no' font-size={dimmedSize} {...this.link ()} />
            </Container>
            <Container kind='thin-row' width='80px' {...this.link ()} >
              <Label grow='1' {...this.link ()} />
              {this.renderNotes (ticket.Trip.Drop.Notes)}
            </Container>
          </Container>
        </Container>
        <Container kind='thin-column' border='right' width='110px' {...this.link ()} >
          <Container kind='thin-row' grow='1' {...this.link ()} >
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Label glyph='cube' glyph-color={dimmedColor} {...this.link ()} />
            </Container>
            <Container kind='thin-row' grow='3' {...this.link ()} >
              <Label text={getPackageCount (ticket.Trip.Packages.length)} justify='right' grow='1' wrap='no' {...this.link ()} />
            </Container>
          </Container>
          <Container kind='thin-row' grow='1' {...this.link ()} >
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Label text='total' font-size={dimmedSize} text-color={dimmedColor} {...this.link ()} />
            </Container>
            <Container kind='thin-row' grow='3' {...this.link ()} >
              <Label text={ticket.Trip.Weight} justify='right' grow='1' wrap='no' {...this.link ()} />
            </Container>
          </Container>
        </Container>
        <Container kind='thin-column' width='90px' {...this.link ()} >
          <Container kind='thin-row' grow='1' {...this.link ()} >
            <Label text={ticket.Trip.Price} justify='right' grow='1' wrap='no' {...this.link ()} />
          </Container>
          <Container kind='thin-row' grow='1' {...this.link ()} >
            <Container kind='thin-row' grow='2' {...this.link ()} >
            </Container>
            <Container kind='thin-row' grow='3' {...this.link ()} >
              <Label grow='1' {...this.link ()} />
              {this.renderNotes (ticket.Trip.Notes)}
            </Container>
          </Container>
        </Container>
      </AgnosticTicket>
    );
  }
}

/******************************************************************************/
