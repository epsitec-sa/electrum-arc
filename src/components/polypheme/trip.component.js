'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {TripBox, TripTicket, TripTickets} from '../../all-components.js';

/******************************************************************************/

export default class Trip extends React.Component {

  constructor (props) {
    super (props);
  }

  componentDidMount () {
    const data = this.read ('data');
    const ticketId = data.ticketId;
    const tripId   = data.tripId;
    if (ticketId && tripId) {
      if (!window.document.trips) {
        window.document.trips = {};
      }
      if (!window.document.trips[tripId]) {
        window.document.trips[tripId] = new Map ();
      }
      window.document.trips[tripId].set (ticketId, this);
    }
  }

  componentWillUnmount () {
    const data = this.read ('data');
    const ticketId = data.ticketId;
    const tripId   = data.tripId;
    if (ticketId && tripId) {
      if (!window.document.trips) {
        throw new Error (`Fatal error during Trip.componentWillUnmount with tripId=${tripId} (#1)`);
      }
      if (!window.document.trips[tripId]) {
        throw new Error (`Fatal error during Trip.componentWillUnmount tripId=${tripId} (#2)`);
      }
      window.document.trips[tripId].delete (ticketId);
    }
  }

  render () {
    const kind = this.read ('kind');
    const data = this.read ('data');

    if (kind === 'trip-box') {
      return (
        <TripBox data={data} {...this.link ()} />
      );
    } else if (kind === 'trip-tickets') {
      return (
        <TripTickets data={data} {...this.link ()} />
      );
    } else if (kind === 'trip-ticket') {
      return (
        <TripTicket data={data} {...this.link ()} />
      );
    } else {
      throw new Error (`Trip component contains invalid kind: ${kind}`);
    }
  }
}

/******************************************************************************/
