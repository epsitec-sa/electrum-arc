'use strict';

import React from 'react';
import BacklogData from './backlog-data';
import ReducerData from '../polypheme/reducer-data.js';
import Enumerable from 'linq';

import {
  Container,
  TextFieldCombo,
  Trip
} from '../../all-components.js';

/******************************************************************************/

function getTicketsFromMissionId (tickets, missionId) {
  return Enumerable.from (tickets).where (t => t.MissionId === missionId).toArray ();
}

/******************************************************************************/

export default class DispatchBacklog extends React.Component {

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

  changeSort (data, item) {
    if (window.document.mock) {
      data.BacklogSort = item.key;
      this.forceUpdate ();
    } else {
      ReducerData.reducer (data, {
        type: 'ELECTRUM_DISPATCH',
        oper: 'ChangeBacklogSortCommand',
        payload: {
          Value: item.key,
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
        type: 'ELECTRUM_DISPATCH',
        oper: 'ChangeBacklogFilterCommand',
        payload: {
          Value: item.key,
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

  renderDistinctTicket (ticket, data, index) {
    return (
      <Trip
        key     = {index}
        kind    = 'trip-backlog'
        source  = 'backlog'
        item-id = {ticket.id}
        ticket  = {ticket}
        data    = {data}
        {...this.link ()} />
    );
  }

  renderDistinctTickets (data) {
    const result = [];
    let index = 0;
    const sortedTickets = BacklogData.getSortedBacklog (data);
    for (var ticket of sortedTickets) {
      result.push (this.renderDistinctTicket (ticket, data, index++));
    }
    return result;
  }

  renderDistincts () {
    const data = this.read ('data');

    return (
      <Container kind='view-stretch' {...this.link ()} >
        <Container kind='pane-top' {...this.link ()} >
          <TextFieldCombo
            hint-text   = 'Trier'
            combo-glyph = 'sort'
            value       = {this.getCurrentSortDescription (data)}
            width       = '200px'
            list        = {this.getSortList (data)}
            {...this.link ()} />
        </Container>
        <Container kind='panes' drag-parent={data.Backlog.id} {...this.link ()} >
          <Container
            kind            = 'wrap'
            drag-controller = 'ticket'
            drag-source     = 'backlog'
            drag-mode       = 'all'
            item-id         = {data.Backlog.id}
            view-parent-id  = 'view-backlog'
            {...this.link ()} >
            {this.renderDistinctTickets (data)}
          </Container>
        </Container>
      </Container>
    );
  }

  renderGroupedTicket (tickets, data, index) {
    const metaTicket = JSON.parse (JSON.stringify (tickets[0]));
    metaTicket.MeetingPoints = [];
    for (var ticket of tickets) {
      metaTicket.MeetingPoints.push (ticket.MeetingPoint);
    }
    return (
      <Trip
        key        = {index}
        kind       = 'trip-box'
        source     = 'backlog'
        metaTicket = {metaTicket}
        data       = {data}
        {...this.link ()} />
    );
  }

  renderGroupedTickets (data) {
    const result = [];
    const missionIds = new Map ();
    let index = 0;
    const sortedTickets = BacklogData.getSortedBacklog (data);
    for (var ticket of sortedTickets) {
      if (!missionIds.has (ticket.MissionId)) {
        missionIds.set (ticket.MissionId);
        const tickets = getTicketsFromMissionId (sortedTickets, ticket.MissionId);
        result.push (this.renderGroupedTicket (tickets, data, index++));
      }
    }
    return result;
  }

  renderGrouped () {
    const data = this.read ('data');

    return (
      <Container kind='view-stretch' {...this.link ()} >
        <Container kind='pane-top' {...this.link ()} >
          <TextFieldCombo
            hint-text   = 'Trier'
            combo-glyph = 'sort'
            value       = {this.getCurrentSortDescription (data)}
            width       = '200px'
            list        = {this.getSortList (data)}
            {...this.link ()} />
        </Container>
        <Container kind='panes' drag-parent={data.Backlog.id} {...this.link ()} >
          <Container
            kind            = 'column'
            drag-controller = 'ticket'
            drag-source     = 'backlog'
            drag-mode       = 'all'
            item-id         = {data.Backlog.id}
            view-parent-id  = 'view-backlog'
            {...this.link ()} >
            {this.renderGroupedTickets (data)}
          </Container>
        </Container>
      </Container>
    );
  }

  render () {
    // return this.renderDistincts ();
    return this.renderGrouped ();
  }
}
