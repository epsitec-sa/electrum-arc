'use strict';

import React from 'react';
import {ColorManipulator} from 'electrum';
import Converters from '../polypheme/converters';

import {
  Container,
  Label
} from '../../all-components.js';

/******************************************************************************/

export default class Chrono extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover: false,
    };
  }

  get styleProps () {
    return {
      height: this.read ('height'),
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

  mouseOver () {
    this.setHover (true);
  }

  mouseOut () {
    this.setHover (false);
  }

  getTooltip (event) {
    const f = Converters.getDisplayedTime (event.FromTime);
    const t = Converters.getDisplayedTime (event.ToTime);
    const n = event.Note.Content ? event.Note.Content : '-';
    return f + ' ' + t + ' ' + n;
  }

  render () {
    const event = this.read ('event');

    const note = event.Note;
    let glyph = null;
    if (note.Glyphs && note.Glyphs.length > 0) {
      glyph = note.Glyphs[0].Glyph;
    }

    const style = this.mergeStyles (this.getHover () ? 'hover' : 'base');

    return (
      <div
        style       = {style}
        title       = {this.getTooltip (event)}
        onMouseOver = {() => this.mouseOver ()}
        onMouseOut  = {() => this.mouseOut ()}
        {...this.link ()} >
        <Container kind='ticket-column' grow='1' {...this.link ()} >
          <Container kind='ticket-row' {...this.link ()} >
            <Label text={Converters.getDisplayedTime (event.FromTime)} width='50px' {...this.link ()} />
            <Label glyph={glyph} width='30px' {...this.link ()} />
          </Container>
          <Container kind='ticket-row' {...this.link ()} >
            <Label text={note.Content} wrap='break-word' grow='1' {...this.link ()} />
          </Container>
          <Container kind='ticket-row' {...this.link ()} >
            <Label text={Converters.getDisplayedTime (event.ToTime)} width='50px' {...this.link ()} />
          </Container>
        </Container>
      </div>
    );
  }
}

/******************************************************************************/
