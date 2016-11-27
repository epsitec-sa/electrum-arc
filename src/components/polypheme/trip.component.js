'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {TripBox, TripTicket, TripTickets} from '../../all-components.js';

/******************************************************************************/

export default class Trip extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      kind:    this.read ('kind'),
      warning: false,
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

  getWarning () {
    return this.state.warning;
  }

  setWarning (value) {
    this.setState ( {
      warning: value
    });
  }

  componentDidMount () {
    const inputTicketId = this.read ('ticket-id');
    const inputTripId   = this.read ('trip-id');
    if (inputTicketId && inputTripId) {
      if (!window.document.trips) {
        window.document.trips = {};
      }
      if (!window.document.trips[inputTripId]) {
        window.document.trips[inputTripId] = new Map ();
      }
      window.document.trips[inputTripId].set (inputTicketId, this);
    }
  }

  componentWillUnmount () {
    const inputTicketId = this.read ('ticket-id');
    const inputTripId   = this.read ('trip-id');
    if (inputTicketId && inputTripId) {
      if (!window.document.trips) {
        throw new Error (`Fatal error during Trip.componentWillUnmount with tripId=${inputTripId} (#1)`);
      }
      if (!window.document.trips[inputTripId]) {
        throw new Error (`Fatal error during Trip.componentWillUnmount tripId=${inputTripId} (#2)`);
      }
      window.document.trips[inputTripId].delete (inputTicketId);
    }
  }

  updateWarningPair (tripId, brotherId, check) {
    window.document.trips[tripId].forEach ((value, key, map) => {
      const node = ReactDOM.findDOMNode (value);
      if (node.dataset.ticketId === brotherId) {  // brother founded ?
        const warning = check (node);  // check if true or false
        this.setWarning (warning);   // set master
        value.setWarning (warning);  // set brother
        return;
      }
    });
  }

  //  Set state.warning to true if pick is under the drop, or reverse.
  //  Set always a pair of Trips (master and brother).
  updateWarning () {
    const ticketId  = this.read ('ticket-id');  // by example 'd1.pick'
    const tripId    = this.read ('trip-id');    // by example 'd'
    const node = ReactDOM.findDOMNode (this);
    if (ticketId.endsWith ('.pick')) {
      const brotherId = ticketId.substring (0, ticketId.length - 5) + '.drop';  // by example 'd1.drop'
      this.updateWarningPair (tripId, brotherId, brother => {
        return node.dataset.messenger === brother.dataset.messenger &&
          node.offsetTop > brother.offsetTop;  // true if pick is under drop
      });
    } else if (ticketId.endsWith ('.drop')) {
      const brotherId = ticketId.substring (0, ticketId.length - 5) + '.pick';  // by example 'd1.pick'
      this.updateWarningPair (tripId, brotherId, brother => {
        return node.dataset.messenger === brother.dataset.messenger &&
          node.offsetTop < brother.offsetTop;  // true if drop is over pick
      });
    }
  }

  render () {
    const kind      = this.getKind ();
    const warning   = this.getWarning ();
    const data      = this.read ('data');
    const tripId    = this.read ('trip-id');
    const ticketId  = this.read ('ticket-id');
    const messenger = this.read ('messenger');

    if (kind === 'trip-box') {
      return (
        <TripBox data={data} ticket-id={ticketId} trip-id={tripId}
          {...this.link ()} />
      );
    } else if (kind === 'trip-tickets') {
      return (
        <TripTickets data={data} ticket-id={ticketId} trip-id={tripId}
          {...this.link ()} />
      );
    } else if (kind === 'trip-ticket') {
      return (
        <TripTicket data={data} ticket-id={ticketId} trip-id={tripId}
          warning={warning} messenger={messenger} {...this.link ()} />
      );
    } else {
      throw new Error (`Trip component contains invalid kind: ${kind}`);
    }
  }
}

/******************************************************************************/
