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
    if (glyph.startsWith ('bookmark-')) {
      const color = glyph.substring (9);
      return (
        <Label glyph='bookmark' glyph-color={color} spacing='compact' {...this.link ()} />
      );
    } else {
      return (
        <Label glyph={glyph} spacing='compact' {...this.link ()} />
      );
    }
  }

  getGlyphs (glyphs) {
    if (glyphs === null) {
      return null;
    } else if (typeof (glyphs) === 'string') {
      return this.getGlyph (glyphs);
    } else {
      let line = [];
      glyphs.forEach (glyph => {
        line.push (this.getGlyph (glyph));
      });
      return line;
    }
  }

  render () {
    const width    = this.read ('width');
    const height   = this.read ('height');
    const selected = this.read ('selected');
    const color    = this.read ('color');
    const data     = this.read ('data');

    const h = height ? height : '70px';

    if (!data || typeof data.pick === 'undefined' || typeof data.drop === 'undefined') {
      return (
        <Container kind='thin-main' width={width} height={h} grow='1' {...this.link ()} >
        </Container>
      );
    } else {
      const dimmedColor = '#bbb';
      const dimmedSize  = '75%';

      return (
        <Container kind='thin-main' width={width} height={h} grow='1' selected={selected} color={color} {...this.link ()} >
          <Button kind='thin-left' glyph='arrows-alt' width='24px' {...this.link ()} />
          <Container kind='thin-column' border='right' grow='4' {...this.link ()} >
            <Container kind='thin-row' border='bottom' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label text={data.pick.time} font-weight='bold' {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='20px' {...this.link ()} >
                <Label glyph='upload' glyph-color={dimmedColor} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label text={data.pick.desc} wrap='no' {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label text={data.pick.zone} text-transform='uppercase' wrap='no' font-size={dimmedSize} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label grow='1' {...this.link ()} />
                {this.getGlyphs (data.pick.glyphs)}
              </Container>
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label text={data.drop.time} font-weight='bold' {...this.link ()} />
              </Container>
              <Container kind='thin-row' width='20px' {...this.link ()} >
                <Label glyph='download' glyph-color={dimmedColor} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label text={data.drop.desc} wrap='no' {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label text={data.drop.zone} text-transform='uppercase' wrap='no' font-size={dimmedSize} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='1' {...this.link ()} >
                <Label grow='1' {...this.link ()} />
                {this.getGlyphs (data.drop.glyphs)}
              </Container>
            </Container>
          </Container>
          <Container kind='thin-column' border='right' grow='1' {...this.link ()} >
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='2' {...this.link ()} >
                <Label glyph='cube' glyph-color={dimmedColor} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label text={data.count} wrap='no' {...this.link ()} />
              </Container>
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='2' {...this.link ()} >
                <Label text='total' font-size={dimmedSize} text-color={dimmedColor} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label text={data.weight} wrap='no' {...this.link ()} />
              </Container>
            </Container>
          </Container>
          <Container kind='thin-column' grow='1' {...this.link ()} >
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='2' {...this.link ()} >
                <Label text='CHF' font-size={dimmedSize} text-color={dimmedColor} {...this.link ()} />
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label text={data.price} wrap='no' {...this.link ()} />
              </Container>
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Container kind='thin-row' grow='2' {...this.link ()} >
              </Container>
              <Container kind='thin-row' grow='3' {...this.link ()} >
                <Label grow='1' {...this.link ()} />
                {this.getGlyphs (data.priceGlyphs)}
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
