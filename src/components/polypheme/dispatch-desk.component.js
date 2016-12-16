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
    this.data = null;
  }

  componentWillMount () {
    const data = this.read ('data');
    if (data) {
      this.data = data;
    } else {
      this.data = window.document.data.Desk;
    }
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

  renderTicket (ticket, index) {
    return (
      <Trip key={index} kind='trip-ticket' data={ticket} {...this.link ()} />
    );
  }

  renderTrayTickets (tickets) {
    const result = [];
    let index = 0;
    for (var ticket of tickets) {
      result.push (this.renderTicket (ticket, index++));
    }
    return result;
  }

  renderTray (tray, index) {
    return (
      <TicketsTray key={index} left={tray.Left} top={tray.Top} rotate={tray.Rotation} title={tray.Name}
        data={tray} {...this.link ()} >
        {this.renderTrayTickets (tray.Tickets)}
      </TicketsTray>
    );
  }

  renderDesk (desk) {
    const result = [];
    let index = 0;
    for (var tray of desk) {
      result.push (this.renderTray (tray, index++));
    }
    return result;
  }

  render () {
    return (
      <Container kind='tickets-desk' {...this.link ()} >
        {this.renderDesk (this.data)}
      </Container>
    );
  }
}
