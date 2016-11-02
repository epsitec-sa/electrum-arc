'use strict';

import React from 'react';

import {TripTicket, Container} from '../../all-components.js';
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

    return (
      <Container kind='column' min-width={width} min-height={height} {...this.link ()} >
        <TripTicket data={pick} {...this.link ()} />
        <TripTicket data={drop} {...this.link ()} />
      </Container>
    );
  }
}

/******************************************************************************/
