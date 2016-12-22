'use strict';

import React from 'react';

import {
  Container,
  TextFieldCombo,
  LabelTextField,
  Trip
} from '../../all-components.js';

export default class DispatchBacklog extends React.Component {

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

  closeCombo () {
  }

  sortTime () {
    this.closeCombo ();
  }

  sortType () {
    this.closeCombo ();
  }

  filterAll () {
    this.closeCombo ();
  }

  filterDring () {
    this.closeCombo ();
  }

  filterUrgent () {
    this.closeCombo ();
  }

  getItem (text, current, glyph, action) {
    return {
      text:   text,
      glyph:  glyph,
      active: text === current ? 'true' : 'false',
      action: action,
    };
  }

  getSortList (data) {
    return [
      this.getItem ('Chronologique', data.Backlog.Sort, 'clock-o', () => this.sortTime ()),
      this.getItem ('Par types',     data.Backlog.Sort, 'cube',    () => this.sortType ()),
    ];
  }

  getFilterList (data) {
    return [
      this.getItem ('Tous',                      data.Backlog.Filter, 'square',      () => this.filterAll ()),
      this.getItem ('Seulement les dring-dring', data.Backlog.Filter, 'bell',        () => this.filterDring ()),
      this.getItem ('Seulement les urgents',     data.Backlog.Filter, 'fighter-jet', () => this.filterUrgent ()),
    ];
  }

  renderTicket (ticket, data, index) {
    return (
      <Trip key={index} kind='trip-box' id={ticket.id} ticket={ticket} data={data} {...this.link ()} />
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

    return (
      <Container kind='view-stretch' {...this.link ()} >
        <Container kind='pane-top' {...this.link ()} >
          <TextFieldCombo hint-text='Trier' combo-glyph='sort' width='300px'
            value={data.Backlog.Sort}
            grow='1' spacing='large' list={this.getSortList (data)}
            {...this.link ()} />
          <TextFieldCombo hint-text='Filtrer' combo-glyph='filter' width='300px'
            grow='1' spacing='large' list={this.getFilterList (data)}
            value={data.Backlog.Filter}
            {...this.link ()} />
          <LabelTextField shape='rounded' hint-text='Chercher'
            grow='2' label-glyph='Search' {...this.link ()} />
        </Container>
        <Container kind='panes' {...this.link ()} >
          <Container kind='column'
            drag-controller='ticket' drag-source='backlog' id={data.Backlog.id}
            view-parent-id='view-backlog' {...this.link ()} >
            {this.renderTickets (data.Backlog.Tickets, data)}
          </Container>
        </Container>
      </Container>
    );
  }
}
