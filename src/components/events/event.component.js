'use strict';

import React from 'react';
import {ColorManipulator} from 'electrum';
import Converters from '../polypheme/converters';

import {
  Ticket,
  Container,
  Label
} from '../../all-components.js';

/******************************************************************************/

export default class Event extends React.Component {

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

  mouseOver () {
    this.setHover (true);
  }

  mouseOut () {
    this.setHover (false);
  }

  render () {
    const event = this.read ('event');
    const note = event.Note;
    let glyph = null;
    if (note.Glyphs && note.Glyphs.length > 0) {
      glyph = note.Glyphs[0].Glyph;
    }

    let color = this.props.theme.palette.eventColumnBackground;
    if (this.getHover ()) {
      color = ColorManipulator.emphasize (color, 0.1);
    }

    return (
      <Ticket
        kind             = 'rect'
        vertical-spacing = {this.props.theme.shapes.eventSeparator}
        color            = {color}
        mouse-over       = {() => this.mouseOver ()}
        mouse-out        = {() => this.mouseOut ()}
        {...this.link ()} >
        <Container kind='ticket-column' grow='1' {...this.link ()} >
          <Container kind='ticket-row' {...this.link ()} >
            <Label text={Converters.getDisplayedTime (event.FromTime)} width='50px' {...this.link ()} />
            <Label glyph={glyph} width='35px' {...this.link ()} />
            <Label text={note.Content} wrap='yes' grow='1' {...this.link ()} />
          </Container>
        </Container>
      </Ticket>
    );
  }
}

/******************************************************************************/