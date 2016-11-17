'use strict';

import React from 'react';

import {TripTicket, Container, Button} from '../../all-components.js';
import {ColorHelpers} from 'electrum-theme';

/******************************************************************************/

export default class TripTickets extends React.Component {

  constructor (props) {
    super (props);
  }

  getTripTicket (data, tripId, type) {
    const ticketId = tripId + '.' + type;  // by example: 'd1.drop'
    const kind = (type === 'pick') ? 'footer' : 'header';
    const d = {};
    for (var x in data) {
      d[x] = data[x];  // copy d <- data
    }
    d.Type = type;
    return (
      <TripTicket kind={kind} data={d} ticket-type='trip-tickets' ticket-id={ticketId} trip-id={tripId}
        {...this.link ()} />
    );
  }

  render () {
    const width  = '250px';
    const height = '116px';
    const data   = this.read ('data');
    const tripId = this.read ('trip-id');

    return (
      <Container kind='column' min-width={width} min-height={height} position='relative' {...this.link ()} >
        {this.getTripTicket (data, tripId, 'pick')}
        {this.getTripTicket (data, tripId, 'drop')}
      </Container>
    );
  }
}

/******************************************************************************/
