'use strict';

import React from 'react';

import {TripBox, TripTicket, TripTickets} from '../../all-components.js';

/******************************************************************************/

export default class Trip extends React.Component {

  render () {
    const kind     = this.read ('kind');
    const data     = this.read ('data');
    const tripId   = this.read ('trip-id');
    const ticketId = this.read ('ticket-id');
    const selected = this.read ('selected');

    if (kind === 'trip-box') {
      return (
        <TripBox Selected={selected} data={data} {...this.link ()} />
      );
    } else if (kind === 'trip-tickets') {
      return (
        <TripTickets data={data} trip-id={tripId} {...this.link ()} />
      );
    } else if (kind === 'trip-ticket') {
      return (
        <TripTicket data={data} ticket-id={ticketId} trip-id={tripId} {...this.link ()} />
      );
    } else {
      throw new Error (`Trip, invalid kind: ${kind}`);
    }
  }
}

/******************************************************************************/
