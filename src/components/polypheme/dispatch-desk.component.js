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

  renderTicket (ticket, dataDispatch, index) {
    return (
      <Trip key={index} kind='trip-ticket' data={ticket} data-dispatch={dataDispatch} {...this.link ()} />
    );
  }

  renderTrayTickets (tickets, dataDispatch) {
    const result = [];
    let index = 0;
    for (var ticket of tickets) {
      result.push (this.renderTicket (ticket, dataDispatch, index++));
    }
    return result;
  }

  renderTray (tray, dataDispatch, index) {
    return (
      <TicketsTray key={index} left={tray.Left} top={tray.Top} rotate={tray.Rotation} title={tray.Name}
        data={tray} {...this.link ()} >
        {this.renderTrayTickets (tray.Tickets, dataDispatch)}
      </TicketsTray>
    );
  }

  renderDesk (desk, dataDispatch) {
    const result = [];
    let index = 0;
    for (var tray of desk) {
      result.push (this.renderTray (tray, dataDispatch, index++));
    }
    return result;
  }

  render () {
    let data         = this.read ('data');
    let dataDispatch = this.read ('data-dispatch');

    return (
      <Container kind='tickets-desk' {...this.link ()} >
        {this.renderDesk (data, dataDispatch)}
      </Container>
    );
  }
}
