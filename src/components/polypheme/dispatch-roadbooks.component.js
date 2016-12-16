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
    this.data = null;
  }

  componentWillMount () {
    const data = this.read ('data');
    if (data) {
      this.data = data;
    } else {
      this.data = window.document.data.Roadbooks;
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

  renderMessenger (roadbook) {
    return (
      <MessengerTicket data={roadbook} {...this.link ()} />
    );
  }

  renderTicket (ticket, index) {
    return (
      <Trip key={index} kind='trip-ticket' data={ticket} {...this.link ()} />
    );
  }

  renderTickets (tickets) {
    const result = [];
    let index = 0;
    for (var ticket of tickets) {
      result.push (this.renderTicket (ticket, index++));
    }
    return result;
  }

  renderRoadbook (roadbook, index) {
    const maxWidth = Unit.add (this.props.theme.shapes.tripTicketWidth, '20px');
    return (
      <DragCab key={index} drag-handle='messengers' direction='horizontal'
        color={this.props.theme.palette.roadbookDragAndDropHover}
        thickness={this.props.theme.shapes.dragAndDropThickness}
        radius='0px'
        id={roadbook.id} owner-id='messengers' {...this.link ()}>
        <Roadbook key={index} {...this.link ()} >
          {this.renderMessenger (roadbook)}
          <Container kind='tickets-trips' drag-controller='tickets' drag-source='roadbooks'
            id={roadbook.id} max-width={maxWidth} {...this.link ()} >
            {this.renderTickets (roadbook.Tickets)}
          </Container>
        </Roadbook>
      </DragCab>
    );
  }

  renderRoadbooks (roadbooks) {
    const result = [];
    let index = 0;
    for (var roadbook of roadbooks) {
      result.push (this.renderRoadbook (roadbook, index++));
    }
    return result;
  }

  render () {
    return (
      <Container kind='tickets-messengers' drag-controller='messengers' drag-source='messengers' {...this.link ()} >
        {this.renderRoadbooks (this.data)}
      </Container>
    );
  }
}
