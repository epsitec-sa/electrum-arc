'use strict';

import React from 'react';

import {
  Container,
  Trip,
  TicketsTray
} from '../../all-components.js';

export default class DispatchDesk extends React.Component {

  constructor (props) {
    super (props);
  }

  componentDidMount () {
    if (window.document.mock) {
      window.document.toUpdate.push (this);
    }
  }

  componentWillUnmount () {
    if (window.document.mock) {
      const index = window.document.toUpdate.indexOf (this);
      if (index !== -1) {
        window.document.toUpdate.splice (index, 1);
      }
    }
  }

  renderTicket (ticket, data, index) {
    return (
      <Trip key={index} kind='trip-ticket' item-id={ticket.id} ticket={ticket} data={data} {...this.link ()} />
    );
  }

  renderTrayTickets (tickets, data) {
    const result = [];
    let index = 0;
    for (var ticket of tickets) {
      result.push (this.renderTicket (ticket, data, index++));
    }
    return result;
  }

  renderTray (tray, data, index) {
    const left = tray.Left ? tray.Left : (30 + 280 * index) + 'px';
    const top  = tray.Top ? tray.Top : '30px';
    return (
      <TicketsTray key={index} left={left} top={top} rotate={tray.Rotation} title={tray.Name}
        tray={tray} {...this.link ()} >
        {this.renderTrayTickets (tray.Tickets, data)}
      </TicketsTray>
    );
  }

  renderDesk (desk, data) {
    const result = [];
    let index = 0;
    for (var tray of desk) {
      result.push (this.renderTray (tray, data, index++));
    }
    return result;
  }

  render () {
    let data = this.read ('data');

    return (
      <Container kind='tickets-desk' {...this.link ()} >
        {this.renderDesk (data.Desk, data)}
      </Container>
    );
  }
}
