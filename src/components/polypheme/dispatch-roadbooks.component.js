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

  renderMessenger (data, roadbook) {
    return (
      <MessengerTicket data={data} roadbook={roadbook} {...this.link ()} />
    );
  }

  renderTicket (ticket, data, index) {
    return (
      <Trip key={index} kind='trip-ticket' item-id={ticket.id} ticket={ticket} data={data} {...this.link ()} />
    );
  }

  renderTickets (roadbook, data) {
    const result = [];
    const showHidden = roadbook.ShowHidden === 'true';
    let index = 0;
    for (var ticket of roadbook.Tickets) {
      if (showHidden || ticket.Status !== 'delivered') {
        result.push (this.renderTicket (ticket, data, index++));
      }
    }
    return result;
  }

  renderTicketsContainer (roadbook, data) {
    const compacted  = roadbook.Compacted  === 'true';
    if (compacted) {
      return null;
    } else {
      return (
        <Container kind='tickets-trips'
          drag-controller='ticket' drag-source='roadbook' item-id={roadbook.id}
          {...this.link ()} >
          {this.renderTickets (roadbook, data)}
        </Container>
      );
    }
  }

  renderRoadbook (roadbook, data, index) {
    return (
      <DragCab key={index} drag-controller='roadbook' direction='horizontal'
        color={this.props.theme.palette.roadbookDragAndDropHover}
        thickness={this.props.theme.shapes.dragAndDropRoadbookThickness}
        over-spacing={this.props.theme.shapes.viewSpacing}
        radius='0px'
        data={data}
        item-id={roadbook.id} {...this.link ()}>
        <Roadbook key={index} data={data} roadbook={roadbook} {...this.link ()} >
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
      <Container kind='tickets-messengers'
        drag-controller='roadbook' drag-source='roadbooks' item-id={data.id}
        {...this.link ()} >
        {this.renderRoadbooks (data.Roadbooks, data)}
      </Container>
    );
  }
}
