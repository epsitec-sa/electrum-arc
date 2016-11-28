'use strict';

import React from 'react';

import {Ticket, Container, Label, Button} from '../../all-components.js';

/******************************************************************************/

export default class MessengerTicket extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const width    = this.props.theme.shapes.tripTicketWidth;
    const height   = this.props.theme.shapes.messengerHeight;
    const selected = this.read ('Selected');
    let   color    = this.read ('Color');
    const data     = this.read ('data');
    const noDrag   = data.NoDrag;

    const cursor = (noDrag === 'true') ? null : 'ew-resize';

    if (!color) {
      color = 'selected';
    }

    if (!data || typeof data.Name === 'undefined') {
      throw new Error ('MessengerTicket without data');
    } else {
      return (
        <Ticket kind='ticket' shape='header' width={width} height={height} selected={selected} color={color}
          drag-handle='MessengerTicket' no-drag={noDrag} cursor={cursor}
          data={data} {...this.link ()} >
          <Container kind='column' grow='2' {...this.link ()} >
            <Button glyph={data.Photo.Glyph} kind='identity' {...this.link ()} />
          </Container>
          <Container kind='column' grow='1' {...this.link ()} >
            <Label glyph={data.Transportation.Glyph} glyph-size='150%' {...this.link ()} />
          </Container>
          <Container kind='column' grow='3' {...this.link ()} >
            <Label text={data.Name} text-color='#fff' {...this.link ()} />
            <Label text={data.Total} font-weight='bold' text-color='#fff' {...this.link ()} />
          </Container>
        </Ticket>
      );
    }
  }
}

/******************************************************************************/
