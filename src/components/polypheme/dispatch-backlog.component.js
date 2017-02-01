'use strict';

import React from 'react';
import BacklogData from './backlog-data';
import ReducerData from '../polypheme/reducer-data.js';
import Enumerable from 'linq';

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
    if (window.document.mock) {
      data.BacklogSort = item.key;
      this.forceUpdate ();
    } else {
      ReducerData.reducer (data, {
        type:    'ELECTRUM-DISPATCH',
        payload: {
          type:  'changeBacklogSort',
          value: item.key,
        }
      });
    }
  }

  changeFilter (data, item) {
    if (window.document.mock) {
      data.BacklogFilter = item.key;
      this.forceUpdate ();
    } else {
      ReducerData.reducer (data, {
        type:    'ELECTRUM-DISPATCH',
        payload: {
          type:  'changeBacklogFilter',
          value: item.key,
        }
      });
    }
  }

  getItem (item, current, action) {
    return {
      text:   item.value.description,
      glyph:  item.value.glyph,
      active: item.key === current ? 'true' : 'false',
      action: action,
    };
  }

  getSortItem (data, item) {
    return this.getItem (item, data.BacklogSort, () => this.changeSort (data, item));
  }

  getFilterItem (data, item) {
    return this.getItem (item, data.BacklogFilter, () => this.changeFilter (data, item));
  }

  getSortList (data) {
    return Enumerable
      .from (BacklogData.getSortItems ())
      .select (item => this.getSortItem (data, item))
      .toArray ();
  }

  getFilterList (data) {
    return Enumerable
      .from (BacklogData.getFilterItems ())
      .select (item => this.getFilterItem (data, item))
      .toArray ();
  }

  getCurrentSortDescription (data) {
    return Enumerable
      .from (BacklogData.getSortItems ())
      .where (item => item.key === data.BacklogSort)
      .select (item => item.value.description)
      .firstOrDefault ();
  }

  getCurrentFilterDescription (data) {
    return Enumerable
      .from (BacklogData.getFilterItems ())
      .where (item => item.key === data.BacklogFilter)
      .select (item => item.value.description)
      .firstOrDefault ();
  }

  renderTicket (ticket, data, index) {
    return (
      <Trip
        key     = {index}
        kind    = 'trip-box'
        source  = 'backlog'
        item-id = {ticket.id}
        ticket  = {ticket}
        data    = {data}
        {...this.link ()} />
    );
  }

  renderTickets (data) {
    const result = [];
    let index = 0;
    const sortedTickets = BacklogData.getSortedBacklog (data);
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
            value={this.getCurrentSortDescription (data)}
            grow='1' spacing='large' list={this.getSortList (data)}
            {...this.link ()} />
          <TextFieldCombo hint-text='Filtrer' combo-glyph='filter' width='300px'
            grow='1' spacing='large' list={this.getFilterList (data)}
            value={this.getCurrentFilterDescription (data)}
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
