'use strict';

import React from 'react';

import {TripTicket, Container, Button} from '../../all-components.js';
import {ColorHelpers} from 'electrum-theme';

/******************************************************************************/

export default class TripTickets extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const width    = '220px';
    const height   = '164px';  // '82px' * 2
    const data     = this.read ('data');

    const pick = data.Pick;
    const drop = data.Drop;

    pick.TicketId = data.Pick.Trip.TicketId;
    drop.TicketId = data.Drop.Trip.TicketId;
    pick.TripId   = data.Pick.Trip.TripId;
    drop.TripId   = data.Drop.Trip.TripId;

    return (
      <Container kind='column' min-width={width} min-height={height} position='relative' {...this.link ()} >
        <TripTicket data={pick} kind='footer' {...this.link ()} />
        <TripTicket data={drop} kind='header' {...this.link ()} />
        <Button glyph='scissors' flip='horizontal' border='none' position='absolute'
          width='32px' height='32px' right='0px' top='calc(50% - 16px)' {...this.link ()} />
      </Container>
    );
  }
}

/******************************************************************************/
