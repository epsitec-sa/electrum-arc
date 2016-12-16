'use strict';

import React from 'react';

import {Ticket, Container, Label, Button} from '../../all-components.js';

/******************************************************************************/

export default class MessengerTicket extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const width  = this.props.theme.shapes.tripTicketWidth;
    const height = this.props.theme.shapes.messengerHeight;
    const data   = this.read ('data');

    const photo = (data.Messenger && data.Messenger.Photo && data.Messenger.Photo.Glyph) ?
      data.Messenger.Photo.Glyph :
      'user';
    const name = (data.Messenger && data.Messenger.Name) ?
      data.Messenger.Name :
      'A définir';

    return (
      <Ticket kind='ticket' shape='header' width={width} height={height} color='selected'
        drag-handle='messengers' no-drag='false' cursor='ew-resize'
        data={data} {...this.link ()} >
        <Container kind='column' grow='2' {...this.link ()} >
          <Button glyph={photo} kind='identity' {...this.link ()} />
        </Container>
        <Container kind='column' grow='1' {...this.link ()} >
          <Label glyph={data.Transport} glyph-size='150%' {...this.link ()} />
        </Container>
        <Container kind='column' grow='3' {...this.link ()} >
          <Label text={name} text-color='#fff' {...this.link ()} />
          <Label text={data.Revenue} font-weight='bold' text-color='#fff' {...this.link ()} />
        </Container>
      </Ticket>
    );
  }
}

/******************************************************************************/
