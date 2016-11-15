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
    const width  = '250px';
    const height = '116px';
    const data   = this.read ('data');
    const tripId = this.read ('trip-id');

    const ticketIdPick = tripId + '-pick';
    const ticketIdDrop = tripId + '-drop';

    const dataPick = {
      Type: 'pick',
      Trip: data,
    };
    const dataDrop = {
      Type: 'drop',
      Trip: data,
    };

    return (
      <Container kind='column' min-width={width} min-height={height} position='relative' {...this.link ()} >
        <TripTicket data={dataPick} ticket-id={ticketIdPick} trip-id={tripId} kind='footer' {...this.link ()} />
        <TripTicket data={dataDrop} ticket-id={ticketIdDrop} trip-id={tripId} kind='header' {...this.link ()} />
      </Container>
    );
  }
}

/******************************************************************************/
