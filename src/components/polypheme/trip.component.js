'use strict';

import React from 'react';
import {TripBox, TripTicket, DragCab} from '../../all-components.js';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class Trip extends React.Component {

  constructor (props) {
    super (props);
  }

  renderTrip (ticket, data, noDrag, margin, content) {
    return (
      <DragCab
        drag-handle   = 'tickets'
        direction     = 'vertical'
        color         = {this.props.theme.palette.dragAndDropHover}
        thickness     = {this.props.theme.shapes.dragAndDropThickness}
        radius        = {this.props.theme.shapes.dragAndDropThickness}
        mode          = 'corner-top-left'
        data          = {data}
        id            = {ticket.id}
        no-drag       = {noDrag}
        margin-bottom = {margin}
        {...this.link ()}>
        {content ()}
      </DragCab>
    );
  }

  render () {
    const kind   = this.read ('kind');
    const ticket = this.read ('ticket');
    const data   = this.read ('data');
    const noDrag = (ticket.Status === 'dispatched') ? 'true' : null;

    if (kind === 'trip-box') {
      const m = Unit.parse (this.props.theme.shapes.tripBoxBottomMargin).value;
      return this.renderTrip (ticket, data, noDrag, m, () => (<TripBox ticket={ticket} {...this.link ()} />));
    } else if (kind === 'trip-ticket') {
      return this.renderTrip (ticket, data, noDrag, 2, () => (<TripTicket ticket={ticket}
        no-drag={noDrag} type={ticket.Type} shape={ticket.Shape} {...this.link ()} />));
    } else {
      throw new Error (`Trip component contains invalid kind: ${kind}`);
    }
  }
}

/******************************************************************************/
