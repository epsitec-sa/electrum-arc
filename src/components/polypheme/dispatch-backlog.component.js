'use strict';

import React from 'react';
import Electrum from 'electrum';
import {getTickets} from './backlog-data';

import {
  Container,
  TextFieldCombo,
  LabelTextField,
  Trip
} from '../../all-components.js';

/******************************************************************************/

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
    data.BacklogSort = item.text;
    this.forceUpdate ();

    Electrum.bus.dispatch (data, 'dnd', {
      type: 'changeBacklogSort',
      value: item.text,
    });
  }

  changeFilter (data, item) {
    data.BacklogFilter = item.text;
    this.forceUpdate ();

    Electrum.bus.dispatch (data, 'dnd', {
      type: 'changeBacklogFilter',
      value: item.text,
    });
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
    return this.getItem (text, data.BacklogSort, glyph, item => this.changeSort (data, item));
  }

  getFilterItem (data, text, glyph) {
    return this.getItem (text, data.BacklogFilter, glyph, item => this.changeFilter (data, item));
  }

  getSortList (data) {
    return [
      this.getSortItem (data, 'Par heure pick', 'clock-o'),
      this.getSortItem (data, 'Par heure drop', 'clock-o'),
      this.getSortItem (data, 'Par zone pick',  'map-marker'),
      this.getSortItem (data, 'Par zone drop',  'map-marker'),
      this.getSortItem (data, 'Par produits',   'cube'),
      this.getSortItem (data, 'Par prix',       'dollar'),
      this.getSortItem (data, 'Par poids',      'balance-scale'),
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
      <Trip key={index} kind='trip-box' item-id={ticket.id} ticket={ticket} data={data} {...this.link ()} />
    );
  }

  renderTickets (data) {
    const result = [];
    let index = 0;
    const sortedTickets = getTickets (data);
    for (var ticket of sortedTickets) {
      result.push (this.renderTicket (ticket, data, index++));
    }
    return result;
  }

  render () {
    const data = this.read ('data');

    return (
      <Container kind='view-stretch' {...this.link ()} >
        <Container kind='pane-top' {...this.link ()} >
          <TextFieldCombo hint-text='Trier' combo-glyph='sort' width='300px'
            value={data.BacklogSort}
            grow='1' spacing='large' list={this.getSortList (data)}
            {...this.link ()} />
          <TextFieldCombo hint-text='Filtrer' combo-glyph='filter' width='300px'
            grow='1' spacing='large' list={this.getFilterList (data)}
            value={data.BacklogFilter}
            {...this.link ()} />
          <LabelTextField shape='rounded' hint-text='Chercher'
            grow='2' label-glyph='Search' {...this.link ()} />
        </Container>
        <Container kind='panes' drag-parent={data.Backlog.id} {...this.link ()} >
          <Container kind='column'
            drag-controller='ticket' drag-source='backlog' drag-mode='all' item-id={data.Backlog.id}
            view-parent-id='view-backlog' {...this.link ()} >
            {this.renderTickets (data)}
          </Container>
        </Container>
      </Container>
    );
  }
}
