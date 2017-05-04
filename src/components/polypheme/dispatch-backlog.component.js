/* global window Map */

import Enumerable from 'linq';
import {React, Store} from 'electrum';
import * as BacklogData from './backlog-data';
import * as ReducerData from '../polypheme/reducer-data.js';
import * as BacklogToChronos from './backlog-to-chronos.js';

import {
  Container,
  TextFieldCombo,
  Button,
  DispatchTicket,
  Chronos
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
      viewType: 'box'
    };
    this.internalStore = Store.create ();
    this.localBus = this;  // for access to property notify
  }

  get viewType () {
    return this.state.viewType;
  }

  set viewType (value) {
    this.setState ( {
      viewType: value
    });
  }

  // LocalBus.notify
  notify (props, source, value) {
    if (source.type === 'change') {
    }
  }

  linkBacklogSort () {
    return {...this.link (), state: this.internalStore.select ('BacklogSort'), bus: this.localBus};
  }

  componentWillMount () {
    this.updateBacklogSort ();
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

  updateBacklogSort () {
    const data = this.read ('data');
    const backlogSort = this.getCurrentSortDescription (data.BacklogSort);
    this.internalStore.select ('BacklogSort').set ('value', backlogSort);
  }

  onCycleViewType () {
    switch (this.viewType) {
      case 'box':
        this.viewType = 'distincts';
        break;
      case 'distincts':
        this.viewType = 'chronos';
        break;
      default:
        this.viewType = 'box';
        break;
    }
  }

  getViewTypeGlyph () {
    switch (this.viewType) {
      case 'box':
        return 'th';
      case 'distincts':
        return 'clock-o';
      default:
        return 'bars';
    }
  }

  onChangeSort (data, item) {
    if (window.document.mock) {
      data.BacklogSort = item.key;
      this.updateBacklogSort ();
      this.forceUpdate ();
    } else {
      ReducerData.reducer (data, {
        type:    'ELECTRUM_DISPATCH',
        oper:    'ChangeBacklogSortCommand',
        payload: {
          Value: item.key,
        }
      });
    }
  }

  onChangeFilter (data, item) {
    if (window.document.mock) {
      data.BacklogFilter = item.key;
      this.forceUpdate ();
    } else {
      ReducerData.reducer (data, {
        type:    'ELECTRUM_DISPATCH',
        oper:    'ChangeBacklogFilterCommand',
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
    return this.getItem (item, data.BacklogSort, () => this.onChangeSort (data, item));
  }

  getFilterItem (data, item) {
    return this.getItem (item, data.BacklogFilter, () => this.onChangeFilter (data, item));
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

  getCurrentSortDescription (backlogSort) {
    return Enumerable
      .from (BacklogData.getSortItems ())
      .where (item => item.key === backlogSort)
      .select (item => item.value.description)
      .firstOrDefault ();
  }

  getCurrentFilterDescription (backlogFilter) {
    return Enumerable
      .from (BacklogData.getFilterItems ())
      .where (item => item.key === backlogFilter)
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
          glyph           = {this.getViewTypeGlyph ()}
          custom-on-click = {this.onCycleViewType}
          {...this.link ()} />
      </div>
    );
  }

  renderDistinctTicket (ticket, data, index) {
    return (
      <DispatchTicket
        key    = {index}
        kind   = 'trip-backlog'
        source = 'backlog'
        ticket = {ticket}
        data   = {data}
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
      <DispatchTicket
        key        = {index}
        kind       = 'backlog-box'
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

  renderBox (data) {
    return (
      <Container kind='view-stretch' {...this.link ()} >
        <Container kind='pane-top' {...this.link ()} >
          <TextFieldCombo
            field       = 'BacklogSort'
            readonly    = 'true'
            hint-text   = 'Trier'
            combo-glyph = 'sort'
            width       = '250px'
            spacing     = 'large'
            list        = {this.getSortList (data)}
            {...this.linkBacklogSort ()} />
        </Container>
        <Container
          kind        = 'panes'
          drag-parent = {data.Backlog.id}
          {...this.link ()} >
          <Container
            kind            = {'column'}
            drag-controller = 'ticket'
            drag-source     = 'backlog'
            drag-mode       = 'all'
            drag-owner-id   = {data.Backlog.id}
            view-parent-id  = 'view-backlog'
            {...this.link ()} >
            {this.renderGroupedTickets (data)}
          </Container>
        </Container>
        {this.renderHoverButton ()}
      </Container>
    );
  }

  renderDistincts (data) {
    return (
      <Container kind='view-stretch' {...this.link ()} >
        <Container kind='pane-top' {...this.link ()} >
          <TextFieldCombo
            field       = 'BacklogSort'
            readonly    = 'true'
            hint-text   = 'Trier'
            combo-glyph = 'sort'
            width       = '250px'
            spacing     = 'large'
            list        = {this.getSortList (data)}
            {...this.linkBacklogSort ()} />
        </Container>
        <Container
          kind        = 'panes'
          drag-parent = {data.Backlog.id}
          {...this.link ()} >
          <Container
            kind            = {'wrap'}
            drag-controller = 'ticket'
            drag-source     = 'backlog'
            drag-mode       = 'all'
            drag-owner-id   = {data.Backlog.id}
            view-parent-id  = 'view-backlog'
            {...this.link ()} >
            {this.renderDistinctTickets (data)}
          </Container>
        </Container>
        {this.renderHoverButton ()}
      </Container>
    );
  }

  renderChronos (data) {
    return (
      <Container kind='view-stretch' {...this.link ()} >
        <Container
          kind        = 'tickets-root'
          drag-parent = {data.Backlog.id}
          {...this.link ()} >
          <Chronos
            data            = {data}
            events          = {BacklogToChronos.transform (data.Backlog)}
            navigation      = 'hidden'
            lineWidth       = '200px'
            glyphWidth      = '40px'
            drag-controller = 'ticket'
            drag-source     = 'backlog'
            drag-mode       = 'all'
            drag-owner-id   = {data.Backlog.id}
            view-parent-id  = 'view-backlog'
            {...this.link ()} />
        </Container>
        {this.renderHoverButton ()}
      </Container>
    );
  }

  render () {
    const data = this.read ('data');
    switch (this.viewType) {
      case 'box':
        return this.renderBox (data);
      case 'distincts':
        return this.renderDistincts (data);
      default:
        return this.renderChronos (data);
    }
  }
}
