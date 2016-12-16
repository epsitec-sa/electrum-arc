'use strict';

import React from 'react';
import {TripBox, TripTicket, DragCab} from '../../all-components.js';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class Trip extends React.Component {

  constructor (props) {
    super (props);
  }

  renderTrip (data, noDrag, margin, content) {
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
        no-drag       = {noDrag}
        margin-bottom = {margin}
        {...this.link ()}>
        {content ()}
      </DragCab>
    );
  }

  render () {
    const kind = this.read ('kind');
    const data = this.read ('data');
    const noDrag = (data.Status === 'dispatched') ? 'true' : null;

    if (kind === 'trip-box') {
      const m = Unit.parse (this.props.theme.shapes.tripBoxBottomMargin).value;
      return this.renderTrip (data, noDrag, m, () => (<TripBox data={data} {...this.link ()} />));
    } else if (kind === 'trip-ticket') {
      return this.renderTrip (data, noDrag, 2, () => (<TripTicket data={data}
        no-drag={noDrag} type={data.Type} shape={data.Shape} {...this.link ()} />));
    } else {
      throw new Error (`Trip component contains invalid kind: ${kind}`);
    }
  }
}

/******************************************************************************/
