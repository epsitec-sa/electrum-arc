'use strict';

import React from 'react';
import BacklogData from './backlog-data';
import ReducerData from '../polypheme/reducer-data.js';
import Enumerable from 'linq';

import {
  Container,
  TextFieldCombo,
  CheckButton,
  Button,
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
    this.state = {
      distincts: false,
      viewType:  'tripbox'
    };
  }

  getDistincts () {
    return this.state.distincts;
  }

  setDistincts (value) {
    this.setState ( {
      distincts: value
    });
  }

  getViewType () {
    return this.state.viewType;
  }

  setViewType (value) {
    this.setState ( {
      viewType: value
    });
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

  cycleViewType () {
    switch (this.getViewType ()) {
      case 'tripbox':
        this.setViewType ('distincts');
        break;
      case 'distincts':
        this.setViewType ('chronos');
        break;
      default:
        this.setViewType ('tripbox');
        break;
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

  renderHoverButton () {
    const style = {
      position: 'absolute',
      left:     '0px',
      top:      '0px',
    };
    return (
      <div style={style}>
        <Button
          kind            = 'hover'
          glyph           = 'eye'
          custom-on-click = {() => this.cycleViewType ()}
          {...this.link ()} />
      </div>
    );
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
        ticket     = {metaTicket}
        metaTicket = 'true'
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

  renderTripbox () {
    const data = this.read ('data');
    return (
      <Container kind='view-stretch' {...this.link ()} >
        <Container kind='pane-top' {...this.link ()} >
          <TextFieldCombo
            hint-text   = 'Trier'
            combo-glyph = 'sort'
            width       = '250px'
            spacing     = 'large'
            value       = {this.getCurrentSortDescription (data)}
            list        = {this.getSortList (data)}
            {...this.link ()} />
        </Container>
        <Container kind='panes' drag-parent={data.Backlog.id} {...this.link ()} >
          <Container
            kind            = {'column'}
            drag-controller = 'ticket'
            drag-source     = 'backlog'
            drag-mode       = 'all'
            item-id         = {data.Backlog.id}
            view-parent-id  = 'view-backlog'
            {...this.link ()} >
            {this.renderGroupedTickets (data)}
          </Container>
        </Container>
        {this.renderHoverButton ()}
      </Container>
    );
  }

  renderDistincts () {
    const data = this.read ('data');
    return (
      <Container kind='view-stretch' {...this.link ()} >
        <Container kind='pane-top' {...this.link ()} >
          <TextFieldCombo
            hint-text   = 'Trier'
            combo-glyph = 'sort'
            width       = '250px'
            spacing     = 'large'
            value       = {this.getCurrentSortDescription (data)}
            list        = {this.getSortList (data)}
            {...this.link ()} />
        </Container>
        <Container kind='panes' drag-parent={data.Backlog.id} {...this.link ()} >
          <Container
            kind            = {'wrap'}
            drag-controller = 'ticket'
            drag-source     = 'backlog'
            drag-mode       = 'all'
            item-id         = {data.Backlog.id}
            view-parent-id  = 'view-backlog'
            {...this.link ()} >
            {this.renderDistinctTickets (data)}
          </Container>
        </Container>
        {this.renderHoverButton ()}
      </Container>
    );
  }

  renderChronos () {
    const data = this.read ('data');
    return (
      <Container kind='view-stretch' {...this.link ()} >
        {this.renderHoverButton ()}
      </Container>
    );
  }

  render () {
    switch (this.getViewType ()) {
      case 'tripbox':
        return this.renderTripbox ();
        break;
      case 'distincts':
        return this.renderDistincts ();
        break;
      default:
        return this.renderChronos ();
        break;
    }
  }
}
