'use strict';

import React from 'react';

import {Ticket, Container, Label, Button} from '../../all-components.js';

/******************************************************************************/

export default class MessengerTicket extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const width    = this.read ('width');
    const height   = this.read ('height');
    const selected = this.read ('selected');
    const color    = this.read ('color');
    const data     = this.read ('data');

    if (!data || typeof data.name === 'undefined') {
      return (
        <Ticket kind='header' width={width} height={height} selected={selected} color={color} {...this.link ()} >
        </Ticket>
      );
    } else {
      return (
        <Ticket kind='header' width={width} height={height} selected={selected} color={color} {...this.link ()} >
          <Container kind='column' grow='2' {...this.link ()} >
            <Button glyph={data.photo} kind='identity' {...this.link ()} />
          </Container>
          <Container kind='column' grow='1' {...this.link ()} >
            <Label glyph={data.transportation} glyph-size='150%' {...this.link ()} />
          </Container>
          <Container kind='column' grow='3' {...this.link ()} >
            <Label text={data.name} font-weight='bold' text-color='#fff' {...this.link ()} />
            <Label text={data.total} font-weight='bold' text-color='#fff' {...this.link ()} />
          </Container>
        </Ticket>
      );
    }
  }
}

/******************************************************************************/
