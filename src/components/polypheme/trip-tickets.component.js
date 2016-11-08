'use strict';

import React from 'react';

import {TripTicket, Container, Button} from '../../all-components.js';
import {ColorHelpers} from 'electrum-theme';

/******************************************************************************/

export default class TripTickets extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const width  = '220px';
    const height = '164px';  // '82px' * 2
    const data   = this.read ('data');
    const tripId = this.read ('trip-id');

    const ticketIdPick = tripId + '-pick';
    const ticketIdDrop = tripId + '-drop';

    const pick = data.Pick;
    const drop = data.Drop;

    return (
      <Container kind='column' min-width={width} min-height={height} position='relative' {...this.link ()} >
        <TripTicket data={pick} ticket-id={ticketIdPick} trip-id={tripId} kind='footer' {...this.link ()} />
        <TripTicket data={drop} ticket-id={ticketIdDrop} trip-id={tripId} kind='header' {...this.link ()} />
        <Button glyph='scissors' flip='horizontal' border='none' position='absolute'
          width='32px' height='32px' right='0px' top='calc(50% - 16px)' {...this.link ()} />
      </Container>
    );
  }
}

/******************************************************************************/
