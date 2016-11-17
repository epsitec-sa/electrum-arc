'use strict';

import React from 'react';

import {Unit} from 'electrum-theme';
import {Container, Label, Button} from '../../all-components.js';
import {ColorHelpers} from 'electrum-theme';

/******************************************************************************/

export default class TripBox extends React.Component {

  constructor (props) {
    super (props);
  }

  getGlyph (glyph, keyIndex) {
    if (glyph.startsWith ('bookmark-')) {
      const color = glyph.substring (9);
      return (
        <Label key={keyIndex} glyph='bookmark' glyph-color={color} spacing='compact' {...this.link ()} />
      );
    } else {
      return (
        <Label key={keyIndex} glyph={glyph} spacing='compact' {...this.link ()} />
      );
    }
  }

  getGlyphs (glyphs) {
    if (!glyphs) {
      return null;
    } else {
      let line = [];
      let keyIndex = 0;
      glyphs.forEach (glyph => {
        if (glyph && glyph.value && glyph.value.Glyph) {
          line.push (this.getGlyph (glyph.value.Glyph, keyIndex++));
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
    const height   = '70px';
    const selected = this.read ('Selected');
    const data     = this.read ('data');
    const color    = data.Color;
    const noDrag   = data.NoDrag;
    const tripId   = this.read ('trip-id');
    const ticketId = this.read ('ticket-id');

    const cursor = (noDrag === 'true') ? null : 'move';

    const directionColorPick = ColorHelpers.GetMarkColor (this.props.theme, 'pick');
    const directionColorDrop = ColorHelpers.GetMarkColor (this.props.theme, 'drop');

    if (!data || !data.Trip || typeof data.Trip.Pick === 'undefined' || typeof data.Trip.Drop === 'undefined') {
      return (
        <Container kind='thin-main' drag-handle='TripTicket' no-drag={noDrag} height={height} selected={selected} color={color} grow='1' {...this.link ()} >
        </Container>
      );
    } else {
      const dimmedColor = '#bbb';
      const dimmedSize  = '75%';

      return (
        <Container kind='thin-main' drag-handle='TripTicket' no-drag={noDrag}
          min-height={height} max-height={height} margin-bottom='10px'
          selected={selected} color={color} cursor={cursor} grow='1'
          ticket-type='trip-box' ticket-id={ticketId} trip-id={tripId}
          {...this.link ()} >
          <Container kind='thin-column' border='right' grow='1' {...this.link ()} >
            <Container kind='thin-row' border='bottom' grow='1' {...this.link ()} >
              <Container kind='thin-row' width='50px' {...this.link ()} >
                <Label text={this.getTime (data.Trip.Pick.Time)} font-weight='bold' wrap='no' {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='20px' {...this.link ()} >
                <Label glyph='circle' glyph-color={directionColorPick} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label text={data.Trip.Pick.Description} wrap='no' {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='50px' {...this.link ()} >
                <Label text={this.getZone (data.Trip.Pick.Zone)} text-transform='uppercase' wrap='no' font-size={dimmedSize} {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='80px' {...this.link ()} >
                <Label grow='1' {...this.link ()} />
                {this.getGlyphs (data.Trip.Pick.Glyphs)}
              </Container>
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' width='50px' {...this.link ()} >
                <Label text={this.getTime (data.Trip.Drop.Time)} font-weight='bold' wrap='no' {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='20px' {...this.link ()} >
                <Label glyph='square' glyph-color={directionColorDrop} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label text={data.Trip.Drop.Description} wrap='no' {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='50px' {...this.link ()} >
                <Label text={this.getZone (data.Trip.Drop.Zone)} text-transform='uppercase' wrap='no' font-size={dimmedSize} {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='80px' {...this.link ()} >
                <Label grow='1' {...this.link ()} />
                {this.getGlyphs (data.Trip.Drop.Glyphs)}
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
                {this.getGlyphs (data.Trip.PriceGlyphs)}
              </Container>
            </Container>
          </Container>
          <Button kind='thin-right' glyph='caret-right' width='24px' no-drag='true' cursor='default' {...this.link ()} />
        </Container>
      );
    }
  }
}

/******************************************************************************/
