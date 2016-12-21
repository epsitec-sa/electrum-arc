'use strict';

import React from 'react';
import {
  Container,
  Trip,
  TextFieldCombo,
  LabelTextField
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

  renderTicket (ticket, data, index) {
    return (
      <Trip key={index} kind='trip-box' ticket={ticket} data={data} {...this.link ()} />
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
            <TextFieldCombo hint-text='Trier' combo-glyph='sort'
              grow='1' spacing='large' combo-type='calendar'
              combo-direction='right' flying-balloon-anchor='bottom'
              {...this.link ()} />
            <TextFieldCombo hint-text='Filtrer' combo-glyph='filter'
              grow='1' spacing='large' combo-type='clock'
              flying-balloon-anchor='right' {...this.link ()} />
            <LabelTextField shape='rounded' hint-text='Chercher'
              grow='2' label-glyph='Search' {...this.link ()} />
          </Container>

          <Container kind='panes' {...this.link ()} >
            <Container kind='column'
              drag-controller='ticket' drag-source='backlog' id={data.Backlog.id}
              {...this.link ()} >
              {this.renderTickets (data.Backlog.Tickets, data)}
            </Container>
          </Container>
        </Container>
      </Container>
    );
  }
}
