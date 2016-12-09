'use strict';

import React from 'react';

import {Unit} from 'electrum-theme';
import {Ticket, Container, Label, Button, Gauge} from '../../all-components.js';
import {ColorHelpers} from 'electrum-theme';

/******************************************************************************/

export default class TripBox extends React.Component {

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

  getTime (time) {
    if (time && time.length === 33) {
      // If format '2016-11-30T17:45:03.9052723+01:00', extract 'hh:mm'.
      let h = time.substring (11, 13);
      let m = time.substring (14, 16);
      time = h + ':' + m;
    }
    return time;
  }

  getPackageCount (data) {
    return data.Trip.Packages.length + 'x';
  }

  render () {
    const height   = this.props.theme.shapes.tripBoxHeight;
    const data     = this.read ('data');
    const noDrag   = 'false';

    const cursor = (noDrag === 'true') ? null : 'move';

    const directionColorPick = ColorHelpers.GetMarkColor (this.props.theme, 'pick');
    const directionColorDrop = ColorHelpers.GetMarkColor (this.props.theme, 'drop');

    if (!data || !data.Trip || typeof data.Trip.Pick === 'undefined' || typeof data.Trip.Drop === 'undefined') {
      throw new Error (`TripBox component without data`);
    } else {
      const dimmedColor = this.props.theme.palette.ticketDimmed;
      const dimmedSize  = this.props.theme.shapes.ticketDimmedSize;

      return (
        <Ticket kind='thin' drag-handle='tickets' no-drag={noDrag}
          height={height} margin-bottom='10px' cursor={cursor} grow='1'
          data={data} {...this.link ()} >
          <Container kind='thin-column' border='right' width='10px' {...this.link ()} >
            <Gauge value={data.Trip.Urgency} {...this.link ()} />
          </Container>
          <Container kind='thin-column' border='right' grow='1' {...this.link ()} >
            <Container kind='thin-row' border='bottom' grow='1' {...this.link ()} >
              <Container kind='thin-row' width='50px' {...this.link ()} >
                <Label text={this.getTime (data.Trip.Pick.PlanedTime)} font-weight='bold' wrap='no' {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='20px' {...this.link ()} >
                <Label glyph='plus-square' z-index={0} glyph-color={directionColorPick} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label text={data.Trip.Pick.ShortDescription} wrap='no' {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='50px' {...this.link ()} >
                <Label text={data.Trip.Pick.Zone} text-transform='uppercase' wrap='no' font-size={dimmedSize} {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='80px' {...this.link ()} >
                <Label grow='1' {...this.link ()} />
                {this.renderNotes (data.Trip.Pick.Notes)}
              </Container>
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' width='50px' {...this.link ()} >
                <Label text={this.getTime (data.Trip.Drop.PlanedTime)} font-weight='bold' wrap='no' {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='20px' {...this.link ()} >
                <Label glyph='minus-square' z-index={0} glyph-color={directionColorDrop} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label text={data.Trip.Drop.ShortDescription} wrap='no' {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='50px' {...this.link ()} >
                <Label text={data.Trip.Drop.Zone} text-transform='uppercase' wrap='no' font-size={dimmedSize} {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='80px' {...this.link ()} >
                <Label grow='1' {...this.link ()} />
                {this.renderNotes (data.Trip.Drop.Notes)}
              </Container>
            </Container>
          </Container>
          <Container kind='thin-column' border='right' width='110px' {...this.link ()} >
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label glyph='cube' glyph-color={dimmedColor} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label text={this.getPackageCount (data)} justify='right' grow='1' wrap='no' {...this.link ()} />
              </Container>
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label text='total' font-size={dimmedSize} text-color={dimmedColor} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label text={data.Trip.Weight} justify='right' grow='1' wrap='no' {...this.link ()} />
              </Container>
            </Container>
          </Container>
          <Container kind='thin-column' width='90px' {...this.link ()} >
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Label text={data.Trip.Price} justify='right' grow='1' wrap='no' {...this.link ()} />
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='2' {...this.link ()} >
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label grow='1' {...this.link ()} />
                {this.renderNotes (data.Trip.Notes)}
              </Container>
            </Container>
          </Container>
        </Ticket>
      );
    }
  }
}

/******************************************************************************/
