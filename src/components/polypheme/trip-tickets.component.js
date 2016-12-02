'use strict';

import React from 'react';

import {TripTicket, Container} from '../../all-components.js';

/******************************************************************************/

export default class TripTickets extends React.Component {

  constructor (props) {
    super (props);
  }

  renderTripTicket (data, type) {
    const shape = (type === 'pick') ? 'footer' : 'header';
    return (
      <TripTicket shape={shape} data={data} type={type} {...this.link ()} />
    );
  }

  render () {
    const width  = this.props.theme.shapes.tripTicketWidth;
    const height = this.props.theme.shapes.tripTicketsHeight;
    const data   = this.read ('data');

    return (
      <Container kind='column' min-width={width} min-height={height} position='relative'
        {...this.link ()} >
        {this.renderTripTicket (data, 'pick')}
        {this.renderTripTicket (data, 'drop')}
      </Container>
    );
  }
}

/******************************************************************************/
