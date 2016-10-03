'use strict';

import React from 'react';

import {Unit} from 'electrum-theme';
import {Container, Label, Button} from '../../all-components.js';

/******************************************************************************/

export default class TripBox extends React.Component {

  constructor (props) {
    super (props);
  }

  getGlyph (glyph) {
    const g = glyph.Glyph;
    if (g.startsWith ('bookmark-')) {
      const color = g.substring (9);
      return (
        <Label glyph='bookmark' glyph-color={color} spacing='compact' {...this.link ()} />
      );
    } else {
      return (
        <Label glyph={g} spacing='compact' {...this.link ()} />
      );
    }
  }

  getGlyphs (glyphs) {
    if (!glyphs) {
      return null;
    } else {
      let line = [];
      glyphs.forEach (glyph => {
        line.push (this.getGlyph (glyph));
      });
      return line;
    }
  }

  render () {
    const height   = '70px';
    const selected = this.read ('selected');
    const color    = this.read ('color');
    const data     = this.read ('data');

    if (!data || typeof data.Pick === 'undefined' || typeof data.Drop === 'undefined') {
      return (
        <Container kind='thin-main' height={height} selected={selected} color={color} grow='1' {...this.link ()} >
        </Container>
      );
    } else {
      const dimmedColor = '#bbb';
      const dimmedSize  = '75%';

      return (
        <Container kind='thin-main' height={height} selected={selected} color={color} grow='1' {...this.link ()} >
          <Button kind='thin-left' glyph='arrows-alt' width='24px' {...this.link ()} />
          <Container kind='thin-column' border='right' grow='4' {...this.link ()} >
            <Container kind='thin-row' border='bottom' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label text={data.Pick.Time} font-weight='bold' {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='20px' {...this.link ()} >
                <Label glyph='upload' glyph-color={dimmedColor} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label text={data.Pick.Description} wrap='no' {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label text={data.Pick.Zone} text-transform='uppercase' wrap='no' font-size={dimmedSize} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label grow='1' {...this.link ()} />
                {this.getGlyphs (data.Pick.Glyphs)}
              </Container>
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label text={data.Drop.Time} font-weight='bold' {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='20px' {...this.link ()} >
                <Label glyph='download' glyph-color={dimmedColor} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label text={data.Drop.Description} wrap='no' {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label text={data.Drop.Zone} text-transform='uppercase' wrap='no' font-size={dimmedSize} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label grow='1' {...this.link ()} />
                {this.getGlyphs (data.Drop.Glyphs)}
              </Container>
            </Container>
          </Container>
          <Container kind='thin-column' border='right' grow='1' {...this.link ()} >
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='2' {...this.link ()} >
                <Label glyph='cube' glyph-color={dimmedColor} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label text={data.Count} wrap='no' {...this.link ()} />
              </Container>
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='2' {...this.link ()} >
                <Label text='total' font-size={dimmedSize} text-color={dimmedColor} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label text={data.Weight} wrap='no' {...this.link ()} />
              </Container>
            </Container>
          </Container>
          <Container kind='thin-column' grow='1' {...this.link ()} >
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='2' {...this.link ()} >
                <Label text='CHF' font-size={dimmedSize} text-color={dimmedColor} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label text={data.Price} wrap='no' {...this.link ()} />
              </Container>
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='2' {...this.link ()} >
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label grow='1' {...this.link ()} />
                {this.getGlyphs (data.PriceGlyphs)}
              </Container>
            </Container>
          </Container>
          <Button kind='thin-right' glyph='caret-right' width='24px' {...this.link ()} />
        </Container>
      );
    }
  }
}

/******************************************************************************/
