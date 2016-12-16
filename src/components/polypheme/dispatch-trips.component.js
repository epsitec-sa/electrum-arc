'use strict';

import React from 'react';
import {
  Container,
  Trip,
  TextFieldCombo
} from '../../all-components.js';

export default class DispatchTrips extends React.Component {

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
      <Trip key={index} kind='trip-box' data={ticket} data-dispatch={dataDispatch} {...this.link ()} />
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

  render () {
    let data = this.read ('data');
    if (data) {
      data = JSON.parse (data);
    } else {
      data = window.document.data;
    }

    return (
      <Container kind='views' {...this.link ()} >
        <Container kind='view' width='800px' {...this.link ()} >

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
            <Container kind='column' drag-controller='tickets' drag-source='backlog' {...this.link ()} >
              {this.renderTickets (data.Backlog.Tickets, data)}
            </Container>
          </Container>
        </Container>
      </Container>
    );
  }
}
