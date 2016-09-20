'use strict';

import React from 'react';

import {Container, Label} from '../../all-components.js';

/******************************************************************************/

export default class RunBox extends React.Component {

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
    const width  = this.read ('width');
    const height = this.read ('height');
    const data   = this.read ('data');

    return (
      <Container kind='thin-main' width={width} height='70px' grow='1' selected={data.selected} color={data.color} {...this.link ()} >
        <Container kind='thin-center' border='right' width='20px' {...this.link ()} >
          <Label kind='center-to-box' glyph='arrows-alt' {...this.link ()} />
        </Container>
        <Container kind='thin-column' border='right' grow='4' {...this.link ()} >
          <Container kind='thin-row' border='bottom' grow='1' {...this.link ()} >
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Label text={data.pickTime} font-weight='bold' {...this.link ()} />
            </Container>
            <Container kind='thin-row' width='20px' {...this.link ()} >
              <Label glyph='upload' {...this.link ()} />
            </Container>
            <Container kind='thin-row' grow='3' {...this.link ()} >
              <Label text={data.pickDesc} wrap='no' {...this.link ()} />
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Label text={data.pickZone} text-transform='uppercase' wrap='no' font-size='75%' {...this.link ()} />
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Label grow='1' {...this.link ()} />
              {this.getGlyphs (data.pickGlyphs)}
            </Container>
          </Container>
          <Container kind='thin-row' grow='1' {...this.link ()} >
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Label text={data.dropTime} font-weight='bold' {...this.link ()} />
            </Container>
            <Container kind='thin-row' width='20px' {...this.link ()} >
              <Label glyph='download' {...this.link ()} />
            </Container>
            <Container kind='thin-row' grow='3' {...this.link ()} >
              <Label text={data.dropDesc} wrap='no' {...this.link ()} />
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Label text={data.dropZone} text-transform='uppercase' wrap='no' font-size='75%' {...this.link ()} />
            </Container>
            <Container kind='thin-row' grow='1' {...this.link ()} >
              <Label grow='1' {...this.link ()} />
              {this.getGlyphs (data.dropGlyphs)}
            </Container>
          </Container>
        </Container>
        <Container kind='thin-column' border='right' grow='1' {...this.link ()} >
          <Container kind='thin-row' grow='1' {...this.link ()} >
            <Container kind='thin-row' grow='2' {...this.link ()} >
              <Label glyph='cube' glyph-color='#ccc' {...this.link ()} />
            </Container>
            <Container kind='thin-row' grow='3' {...this.link ()} >
              <Label text={data.count} wrap='no' {...this.link ()} />
            </Container>
          </Container>
          <Container kind='thin-row' grow='1' {...this.link ()} >
            <Container kind='thin-row' grow='2' {...this.link ()} >
              <Label text='total' font-size='75%' text-color='#ccc' {...this.link ()} />
            </Container>
            <Container kind='thin-row' grow='3' {...this.link ()} >
              <Label text={data.weight} wrap='no' {...this.link ()} />
            </Container>
          </Container>
        </Container>
        <Container kind='thin-column' border='right' grow='1' {...this.link ()} >
          <Container kind='thin-row' grow='1' {...this.link ()} >
            <Container kind='thin-row' grow='2' {...this.link ()} >
              <Label text='CHF' font-size='75%' text-color='#ccc' {...this.link ()} />
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
        <Container kind='thin-center' width='20px' {...this.link ()} >
          <Label kind='center-to-box' glyph='caret-right' {...this.link ()} />
        </Container>
      </Container>
    );
  }
}

/******************************************************************************/
