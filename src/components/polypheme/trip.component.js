'use strict';

import React from 'react';
import {TripBox, TripTicket, TripTickets, DragCab} from '../../all-components.js';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class Trip extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const kind = this.read ('kind');
    const data = this.read ('data');

    if (kind === 'trip-box') {
      const m = Unit.parse (this.props.theme.shapes.tripBoxBottomMargin).value;
      return (
        <DragCab drag-handle='tickets' id={data.id} owner-id={data.OwnerId} margin-bottom={m} {...this.link ()}>
          <TripBox data={data} {...this.link ()} />
        </DragCab>
      );
    } else if (kind === 'trip-tickets') {
      return (
        <DragCab drag-handle='tickets' id={data.id} owner-id={data.OwnerId} margin-bottom={2} {...this.link ()}>
          <TripTickets data={data} {...this.link ()} />
        </DragCab>
      );
    } else if (kind === 'trip-ticket') {
      return (
        <DragCab drag-handle='tickets' id={data.id} owner-id={data.OwnerId} margin-bottom={2} {...this.link ()}>
          <TripTicket data={data} type={data.Type} {...this.link ()} />
        </DragCab>
      );
    } else {
      throw new Error (`Trip component contains invalid kind: ${kind}`);
    }
  }
}

/******************************************************************************/
