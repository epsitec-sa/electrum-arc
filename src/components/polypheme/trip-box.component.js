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

  renderGlyph (glyph, description, keyIndex) {
    if (glyph.startsWith ('bookmark-')) {
      const color = glyph.substring (9);
      return (
        <Label key={keyIndex} glyph='bookmark' glyph-color={color} z-index={0}
          spacing='compact' {...this.link ()} />
      );
    } else {
      return (
        <Label key={keyIndex} glyph={glyph} z-index={0}
          spacing='compact' {...this.link ()} />
      );
    }
  }

  renderGlyphs (glyphs) {
    if (!glyphs) {
      return null;
    } else {
      let line = [];
      let keyIndex = 0;
      glyphs.forEach (glyph => {
        if (glyph && glyph.value && glyph.value.Glyph) {
          line.push (this.renderGlyph (glyph.value.Glyph, glyph.value.Description, keyIndex++));
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

  getZone (data) {
    if (data && data.Name) {
      return data.Name;
    } else {
      return null;
    }
  }

  render () {
    const height   = this.props.theme.shapes.tripBoxHeight;
    const selected = this.read ('Selected');
    const data     = this.read ('data');
    const color    = data.Color;
    const noDrag   = data.NoDrag;

    const cursor = (noDrag === 'true') ? null : 'move';

    const directionColorPick = ColorHelpers.GetMarkColor (this.props.theme, 'pick');
    const directionColorDrop = ColorHelpers.GetMarkColor (this.props.theme, 'drop');

    if (!data || !data.Trip || typeof data.Trip.Pick === 'undefined' || typeof data.Trip.Drop === 'undefined') {
      throw new Error (`TripBox component without data`);
    } else {
      const dimmedColor = this.props.theme.palette.ticketDimmed;
      const dimmedSize  = this.props.theme.shapes.ticketDimmedSize;

      return (
        <Ticket kind='thin' drag-handle='TripTicket' no-drag={noDrag}
          height={height} margin-bottom='10px'
          selected={selected} color={color} cursor={cursor} grow='1'
          data={data} ticket-type='trip-box' {...this.link ()} >
          <Container kind='thin-column' border='right' width='10px' {...this.link ()} >
            <Gauge value={data.Trip.Urgency} {...this.link ()} />
          </Container>
          <Container kind='thin-column' border='right' grow='1' {...this.link ()} >
            <Container kind='thin-row' border='bottom' grow='1' {...this.link ()} >
              <Container kind='thin-row' width='50px' {...this.link ()} >
                <Label text={this.getTime (data.Trip.Pick.Time)} font-weight='bold' wrap='no' {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='20px' {...this.link ()} >
                <Label glyph='plus-square' z-index={0} glyph-color={directionColorPick} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label text={data.Trip.Pick.Description} wrap='no' {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='50px' {...this.link ()} >
                <Label text={this.getZone (data.Trip.Pick.Zone)} text-transform='uppercase' wrap='no' font-size={dimmedSize} {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='80px' {...this.link ()} >
                <Label grow='1' {...this.link ()} />
                {this.renderGlyphs (data.Trip.Pick.Glyphs)}
              </Container>
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' width='50px' {...this.link ()} >
                <Label text={this.getTime (data.Trip.Drop.Time)} font-weight='bold' wrap='no' {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='20px' {...this.link ()} >
                <Label glyph='minus-square' z-index={0} glyph-color={directionColorDrop} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label text={data.Trip.Drop.Description} wrap='no' {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='50px' {...this.link ()} >
                <Label text={this.getZone (data.Trip.Drop.Zone)} text-transform='uppercase' wrap='no' font-size={dimmedSize} {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='80px' {...this.link ()} >
                <Label grow='1' {...this.link ()} />
                {this.renderGlyphs (data.Trip.Drop.Glyphs)}
              </Container>
            </Container>
          </Container>
          <Container kind='thin-column' border='right' width='110px' {...this.link ()} >
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label glyph='cube' glyph-color={dimmedColor} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label text={data.Trip.Count} justify='right' grow='1' wrap='no' {...this.link ()} />
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
          <Container kind='thin-column' width='110px' {...this.link ()} >
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='2' {...this.link ()} >
                <Label text='CHF' font-size={dimmedSize} text-color={dimmedColor} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label text={data.Trip.Price} justify='right' grow='1' wrap='no' {...this.link ()} />
              </Container>
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='2' {...this.link ()} >
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label grow='1' {...this.link ()} />
                {this.renderGlyphs (data.Trip.Glyphs)}
              </Container>
            </Container>
          </Container>
        </Ticket>
      );
    }
  }
}

/******************************************************************************/
