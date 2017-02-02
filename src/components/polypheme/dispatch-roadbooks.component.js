'use strict';

import React from 'react';
import ReducerData from './reducer-data.js';
import StateManager from './state-manager.js';

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
    if (!window.document.toUpdate) {
      window.document.toUpdate = [];
    }
    window.document.toUpdate.push (this);
  }

  componentWillUnmount () {
    const index = window.document.toUpdate.indexOf (this);
    if (index !== -1) {
      window.document.toUpdate.splice (index, 1);
    }
  }

  reduce (action, id) {
    // console.log ('DispatchRoadbooks.reducer');
    const data = this.read ('data');

    // Inject electrum state (needed for electrumDispatch).
    data.state = this.props.state;

    ReducerData.reducer (data, {
      type: action,
      id:   id,
    });
  }

  doClickAction (roadbook, event) {
    if (event.altKey) {  // compected/extended ?
      this.reduce ('SWAP_ROADBOOK_COMPACTED', roadbook.id);
    }
  }

  renderMessenger (data, roadbook) {
    return (
      <MessengerTicket
        data     = {data}
        roadbook = {roadbook}
        {...this.link ()} />
    );
  }

  renderTicket (ticket, data, index) {
    return (
      <Trip
        key={index}
        kind    = 'trip-ticket'
        source  = 'roadbook'
        item-id = {ticket.id}
        ticket  = {ticket}
        data    = {data}
        {...this.link ()} />
    );
  }

  renderTickets (roadbook, data) {
    const result = [];
    const showHidden = StateManager.isMessengerShowHidden (roadbook.id);
    let index = 0;
    for (var ticket of roadbook.Tickets) {
      if (showHidden || ticket.Status !== 'delivered') {
        result.push (this.renderTicket (ticket, data, index++));
      }
    }
    return result;
  }

  renderTicketsContainer (roadbook, data) {
    if (StateManager.isMessengerCompacted (roadbook.id)) {
      return null;
    } else {
      return (
        <Container
          kind            = 'tickets-trips'
          drag-controller = 'ticket'
          drag-source     = 'roadbook'
          item-id         = {roadbook.id}
          {...this.link ()} >
          {this.renderTickets (roadbook, data)}
        </Container>
      );
    }
  }

  renderRoadbook (roadbook, data, index) {
    return (
      <DragCab
        key             = {index}
        drag-controller = 'roadbook'
        direction       = 'horizontal'
        color           = {this.props.theme.palette.roadbookDragAndDropHover}
        thickness       = {this.props.theme.shapes.dragAndDropRoadbookThickness}
        over-spacing    = {this.props.theme.shapes.viewSpacing}
        radius          = '0px'
        data            = {data}
        do-click-action = {(event) => this.doClickAction (roadbook, event)}
        item-id         = {roadbook.id}
        {...this.link ()}>
        <Roadbook
          key      = {index}
          data     = {data}
          roadbook = {roadbook}
          {...this.link ()} >
          {this.renderMessenger (data, roadbook)}
          {this.renderTicketsContainer (roadbook, data)}
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
      <Container
        kind            = 'tickets-messengers'
        drag-controller = 'roadbook'
        drag-source     = 'roadbooks'
        item-id         = {data.id}
        {...this.link ()} >
        {this.renderRoadbooks (data.Roadbooks, data)}
      </Container>
    );
  }
}
