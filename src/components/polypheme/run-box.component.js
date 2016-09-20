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
      <Container kind='thin-main' width={width} height={height} selected={data.selected} color={data.color} {...this.link ()} >
        <Container kind='thin-column' width='32px' {...this.link ()} >
          <Label glyph='arrows-alt' {...this.link ()} />
        </Container>
        <Container kind='thin-column' grow='4' {...this.link ()} >
          <Container kind='thin-row' grow='1' {...this.link ()} >
            <Container kind='thin-column' subkind='borderless' grow='1' {...this.link ()} >
              <Label text={data.pickTime} font-weight='bold' {...this.link ()} />
            </Container>
            <Container kind='thin-column' subkind='borderless' width='32px' {...this.link ()} >
              <Label glyph='upload' {...this.link ()} />
            </Container>
            <Container kind='thin-column' subkind='borderless' grow='3' {...this.link ()} >
              <Label text={data.pickDesc} {...this.link ()} />
            </Container>
            <Container kind='thin-column' subkind='borderless' grow='1' {...this.link ()} >
              <Label text={data.pickZone} {...this.link ()} />
            </Container>
            <Container kind='thin-column' subkind='borderless' grow='1' {...this.link ()} >
              {this.getGlyphs (data.pickGlyphs)}
            </Container>
          </Container>
          <Container kind='thin-row' grow='1' {...this.link ()} >
            <Container kind='thin-column' subkind='borderless' grow='1' {...this.link ()} >
              <Label text={data.dropTime} font-weight='bold' {...this.link ()} />
            </Container>
            <Container kind='thin-column' subkind='borderless' width='32px' {...this.link ()} >
              <Label glyph='download' {...this.link ()} />
            </Container>
            <Container kind='thin-column' subkind='borderless' grow='3' {...this.link ()} >
              <Label text={data.dropDesc} {...this.link ()} />
            </Container>
            <Container kind='thin-column' subkind='borderless' grow='1' {...this.link ()} >
              <Label text={data.dropZone} {...this.link ()} />
            </Container>
            <Container kind='thin-column' subkind='borderless' grow='1' {...this.link ()} >
              {this.getGlyphs (data.dropGlyphs)}
            </Container>
          </Container>
        </Container>
        <Container kind='thin-column' grow='1' {...this.link ()} >
          <Container kind='thin-row' subkind='borderless' grow='1' {...this.link ()} >
            <Container kind='thin-column' subkind='borderless' grow='2' {...this.link ()} >
              <Label glyph='cube' {...this.link ()} />
            </Container>
            <Container kind='thin-column' subkind='borderless' grow='3' {...this.link ()} >
              <Label text={data.count} {...this.link ()} />
            </Container>
          </Container>
          <Container kind='thin-row' subkind='borderless' grow='1' {...this.link ()} >
            <Container kind='thin-column' subkind='borderless' grow='2' {...this.link ()} >
              <Label text='total' {...this.link ()} />
            </Container>
            <Container kind='thin-column' subkind='borderless' grow='3' {...this.link ()} >
              <Label text={data.weight} {...this.link ()} />
            </Container>
          </Container>
        </Container>
        <Container kind='thin-column' grow='1' {...this.link ()} >
          <Container kind='thin-row' subkind='borderless' grow='1' {...this.link ()} >
            <Container kind='thin-column' subkind='borderless' grow='2' {...this.link ()} >
              <Label text='frs' {...this.link ()} />
            </Container>
            <Container kind='thin-column' subkind='borderless' grow='3' {...this.link ()} >
              <Label text={data.price} {...this.link ()} />
            </Container>
          </Container>
          <Container kind='thin-row' subkind='borderless' grow='1' {...this.link ()} >
            <Container kind='thin-column' subkind='borderless' grow='2' {...this.link ()} >
            </Container>
            <Container kind='thin-column' subkind='borderless' grow='3' {...this.link ()} >
              {this.getGlyphs (data.priceGlyphs)}
            </Container>
          </Container>
        </Container>
        <Container kind='thin-column' width='32px' {...this.link ()} >
          <Label glyph='caret-right' {...this.link ()} />
        </Container>
      </Container>
    );
  }
}

/******************************************************************************/
