'use strict';

import React from 'react';
import {TripBox, TripTicket, TripTickets, DragCab} from '../../all-components.js';

/******************************************************************************/

export default class Trip extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const kind = this.read ('kind');
    const data = this.read ('data');

    if (kind === 'trip-box') {
      return (
        <DragCab drag-handle='tickets' id={data.id} owner-id={data.OwnerId} {...this.link ()}>
          <TripBox data={data} {...this.link ()} />
        </DragCab>
      );
    } else if (kind === 'trip-tickets') {
      return (
        <DragCab drag-handle='tickets' id={data.id} owner-id={data.OwnerId} {...this.link ()}>
          <TripTickets data={data} {...this.link ()} />
        </DragCab>
      );
    } else if (kind === 'trip-ticket') {
      return (
        <DragCab drag-handle='tickets' id={data.id} owner-id={data.OwnerId} {...this.link ()}>
          <TripTicket data={data} type={data.Type} {...this.link ()} />
        </DragCab>
      );
    } else {
      throw new Error (`Trip component contains invalid kind: ${kind}`);
    }
  }
}

/******************************************************************************/
