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

  changeSort (data, item) {
    data.Backlog.Sort = item.text;
    this.forceUpdate ();
  }

  changeFilter (data, item) {
    data.Backlog.Filter = item.text;
    this.forceUpdate ();
  }

  getItem (text, current, glyph, action) {
    return {
      text:   text,
      glyph:  glyph,
      active: text === current ? 'true' : 'false',
      action: action,
    };
  }

  getSortItem (data, text, glyph) {
    return this.getItem (text, data.Backlog.Sort, glyph, item => this.changeSort (data, item));
  }

  getFilterItem (data, text, glyph) {
    return this.getItem (text, data.Backlog.Filter, glyph, item => this.changeFilter (data, item));
  }

  getSortList (data) {
    return [
      this.getSortItem (data, 'Chronologique'),
      this.getSortItem (data, 'Par types'),
    ];
  }

  getFilterList (data) {
    return [
      this.getFilterItem (data, 'Tous',                      'square'),
      this.getFilterItem (data, 'Seulement les dring-dring', 'bell'),
      this.getFilterItem (data, 'Seulement les urgents',     'fighter-jet'),
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
