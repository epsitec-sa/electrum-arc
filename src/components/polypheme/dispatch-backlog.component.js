'use strict';

import React from 'react';

import {
  Container,
  TextFieldCombo,
  Trip
} from '../../all-components.js';

export default class DispatchBacklog extends React.Component {

  constructor (props) {
    super (props);
    this.data = window.document.data.Backlog.Tickets;
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
      <Trip key={index} kind='trip-box' data={ticket} {...this.link ()} />
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

  render () {
    return (
      <Container kind='view-stretch' {...this.link ()} >
        <Container kind='pane-top' {...this.link ()} >
          <TextFieldCombo hint-text='Date' combo-glyph='calendar'
            grow='1' spacing='large' combo-type='calendar'
            combo-direction='right' flying-balloon-anchor='bottom'
            {...this.link ('exp-date')} />
          <TextFieldCombo hint-text='Période' combo-glyph='clock-o'
            grow='1' spacing='large' combo-type='clock'
            flying-balloon-anchor='right' {...this.link ('exp-time')} />
          <TextFieldCombo shape='rounded' hint-text='Chercher'
            grow='2' combo-glyph='Search' {...this.link ()} />
        </Container>
        <Container kind='panes' {...this.link ()} >
          <Container kind='column' drag-controller='tickets' drag-source='backlog'
            view-parent-id='view-backlog' {...this.link ()} >
            {this.renderTickets (this.data)}
          </Container>
        </Container>
      </Container>
    );
  }
}
