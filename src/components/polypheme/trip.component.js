'use strict';

import React from 'react';
import {TripBox, TripTicket, TripTickets} from '../../all-components.js';

/******************************************************************************/

export default class Trip extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      kind: this.read ('kind'),
    };
  }

  getKind () {
    return this.state.kind;
  }

  setKind (value) {
    this.setState ( {
      kind: value
    });
  }

  render () {
    const kind     = this.getKind ();
    const data     = this.read ('data');
    const tripId   = this.read ('trip-id');
    const ticketId = this.read ('ticket-id');
    const selected = this.read ('selected');

    if (kind === 'trip-box') {
      return (
        <TripBox Selected={selected} data={data} trip-component={this} {...this.link ()} />
      );
    } else if (kind === 'trip-tickets') {
      return (
        <TripTickets data={data} trip-id={tripId} trip-component={this} {...this.link ()} />
      );
    } else if (kind === 'trip-ticket') {
      return (
        <TripTicket data={data} ticket-id={ticketId} trip-id={tripId} trip-component={this} {...this.link ()} />
      );
    } else {
      throw new Error (`Trip component contains invalid kind: ${kind}`);
    }
  }
}

/******************************************************************************/
