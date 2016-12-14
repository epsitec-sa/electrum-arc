'use strict';

import React from 'react';
import {TripBox, TripTicket, TripTickets, DragCab} from '../../all-components.js';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class Trip extends React.Component {

  constructor (props) {
    super (props);
  }

  renderTrip (data, margin, content) {
    return (
      <DragCab
        drag-handle   = 'tickets'
        direction     = 'vertical'
        color         = {this.props.theme.palette.dragAndDropHover}
        thickness     = {this.props.theme.shapes.dragAndDropThickness}
        radius        = {this.props.theme.shapes.dragAndDropThickness}
        mode          = 'corner-top-left'
        id            = {data.id}
        owner-id      = {data.OwnerId}
        margin-bottom = {margin}
        {...this.link ()}>
        {content ()}
      </DragCab>
    );
  }

  render () {
    const kind = this.read ('kind');
    const data = this.read ('data');

    if (kind === 'trip-box') {
      const m = Unit.parse (this.props.theme.shapes.tripBoxBottomMargin).value;
      return this.renderTrip (data, m, () => (<TripBox data={data} {...this.link ()} />));
    } else if (kind === 'trip-tickets') {
      return this.renderTrip (data, 2, () => (<TripTickets data={data} {...this.link ()} />));
    } else if (kind === 'trip-ticket') {
      return this.renderTrip (data, 2, () => (<TripTicket data={data} type={data.Type} {...this.link ()} />));
    } else {
      throw new Error (`Trip component contains invalid kind: ${kind}`);
    }
  }
}

/******************************************************************************/
