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
      <MessengerTicket data={roadbook} {...this.link ()} />
    );
  }

  renderTicket (ticket, dataDispatch, index) {
    return (
      <Trip key={index} kind='trip-ticket' data={ticket} data-dispatch={dataDispatch} {...this.link ()} />
    );
  }

  renderTickets (tickets, dataDispatch) {
    const result = [];
    let index = 0;
    for (var ticket of tickets) {
      result.push (this.renderTicket (ticket, dataDispatch, index++));
    }
    return result;
  }

  renderRoadbook (roadbook, dataDispatch, index) {
    const maxWidth = Unit.add (this.props.theme.shapes.tripTicketWidth, '20px');
    return (
      <DragCab key={index} drag-handle='messengers' direction='horizontal'
        color={this.props.theme.palette.roadbookDragAndDropHover}
        thickness={this.props.theme.shapes.dragAndDropThickness}
        radius='0px'
        data={roadbook}
        id={roadbook.id} owner-id='messengers' {...this.link ()}>
        <Roadbook key={index} {...this.link ()} >
          {this.renderMessenger (roadbook)}
          <Container kind='tickets-trips' drag-controller='tickets' drag-source='roadbooks'
            id={roadbook.id} max-width={maxWidth} {...this.link ()} >
            {this.renderTickets (roadbook.Tickets, dataDispatch)}
          </Container>
        </Roadbook>
      </DragCab>
    );
  }

  renderRoadbooks (roadbooks, dataDispatch) {
    const result = [];
    let index = 0;
    for (var roadbook of roadbooks) {
      result.push (this.renderRoadbook (roadbook, dataDispatch, index++));
    }
    return result;
  }

  render () {
    let data         = this.read ('data');
    let dataDispatch = this.read ('data-dispatch');

    return (
      <Container kind='tickets-messengers' drag-controller='messengers' drag-source='messengers' {...this.link ()} >
        {this.renderRoadbooks (data, dataDispatch)}
      </Container>
    );
  }
}
