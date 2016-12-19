'use strict';

import React from 'react';
import {Unit} from 'electrum-theme';

import {
  Container,
  Trip,
  MessengerTicket,
  DragCab,
  Roadbook
} from '../../all-components.js';

export default class DispatchRoadbooks extends React.Component {

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

  renderMessenger (roadbook) {
    return (
      <MessengerTicket roadbook={roadbook} {...this.link ()} />
    );
  }

  renderTicket (ticket, data, index) {
    return (
      <Trip key={index} kind='trip-ticket' ticket={ticket} data={data} {...this.link ()} />
    );
  }

  renderTickets (tickets, data) {
    const result = [];
    let index = 0;
    for (var ticket of tickets) {
      result.push (this.renderTicket (ticket, data, index++));
    }
    return result;
  }

  renderRoadbook (roadbook, data, index) {
    const maxWidth = Unit.add (this.props.theme.shapes.tripTicketWidth, '20px');
    return (
      <DragCab key={index} drag-controller='roadbook' direction='horizontal'
        color={this.props.theme.palette.roadbookDragAndDropHover}
        thickness={this.props.theme.shapes.dragAndDropThickness}
        radius='0px'
        data={data}
        id={roadbook.id} {...this.link ()}>
        <Roadbook key={index} {...this.link ()} >
          {this.renderMessenger (roadbook)}
          <Container kind='tickets-trips' drag-controller='ticket' drag-source='roadbook'
            id={roadbook.id} max-width={maxWidth} {...this.link ()} >
            {this.renderTickets (roadbook.Tickets, data)}
          </Container>
        </Roadbook>
      </DragCab>
    );
  }

  renderRoadbooks (roadbooks, data) {
    const result = [];
    let index = 0;
    for (var roadbook of roadbooks) {
      result.push (this.renderRoadbook (roadbook, data, index++));
    }
    return result;
  }

  render () {
    let data = this.read ('data');

    return (
      <Container kind='tickets-messengers' drag-controller='roadbook' drag-source='roadbooks' {...this.link ()} >
        {this.renderRoadbooks (data.Roadbooks, data)}
      </Container>
    );
  }
}
