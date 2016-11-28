'use strict';

import React from 'react';

import {TripTicket, Container} from '../../all-components.js';

/******************************************************************************/

export default class TripTickets extends React.Component {

  constructor (props) {
    super (props);
  }

  renderTripTicket (data, tripId, type) {
    const ticketId = tripId + '.' + type;  // by example: 'd1.drop'
    const shape = (type === 'pick') ? 'footer' : 'header';
    const d = {};
    for (var x in data) {
      d[x] = data[x];  // copy d <- data
    }
    d.Type = type;
    return (
      <TripTicket shape={shape} data={d} ticket-type='trip-tickets' ticket-id={ticketId} trip-id={tripId}
        {...this.link ()} />
    );
  }

  render () {
    const width    = this.props.theme.shapes.tripTicketWidth;
    const height   = this.props.theme.shapes.tripTicketsHeight;
    const data     = this.read ('data');
    const ticketId = data.ticketId;
    const tripId   = data.tripId;

    return (
      <Container kind='column' min-width={width} min-height={height} position='relative'
        ticket-type='trip-tickets' ticket-id={ticketId} trip-id={tripId}
        {...this.link ()} >
        {this.renderTripTicket (data, tripId, 'pick')}
        {this.renderTripTicket (data, tripId, 'drop')}
      </Container>
    );
  }
}

/******************************************************************************/
