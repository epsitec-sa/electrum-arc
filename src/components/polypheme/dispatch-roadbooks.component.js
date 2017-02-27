'use strict';

import React from 'react';
import ReducerData from './reducer-data.js';
import RoadbooksToChronos from './roadbooks-to-chronos.js';

import {
  Container,
  Trip,
  MessengerTicket,
  DragCab,
  Roadbook,
  Button,
  Chronos
} from '../../all-components.js';

export default class DispatchRoadbooks extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      viewType: 'tickets'
    };
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

  reduce (action, id) {
    // console.log ('DispatchRoadbooks.reducer');
    const data = this.read ('data');

    // Inject electrum state (needed for electrumDispatch).
    data.state = this.props.state;

    ReducerData.reducer (data, {
      type: action,
      id:   id,
    });
  }

  doClickAction (roadbook, e) {
    if (e.altKey) {  // compected/extended ?
      this.reduce ('SWAP_ROADBOOK_COMPACTED', roadbook.id);
    }
  }

  cycleViewType () {
    switch (this.getViewType ()) {
      case 'tickets':
        this.setViewType ('chronos');
        break;
      default:
        this.setViewType ('tickets');
        break;
    }
  }

  getViewTypeGlyph () {
    switch (this.getViewType ()) {
      case 'tickets':
        return {glyph: 'clock-o', rotate: '0'};
      default:
        return {glyph: 'bars', rotate: '90'};
    }
  }

  renderHoverButton () {
    const style = {
      position: 'absolute',
      left:     '0px',
      top:      '0px',
    };
    const glyph = this.getViewTypeGlyph ();
    return (
      <div style={style}>
        <Button
          kind            = 'hover'
          glyph           = {glyph.glyph}
          rotate          = {glyph.rotate}
          custom-on-click = {() => this.cycleViewType ()}
          {...this.link ()} />
      </div>
    );
  }

  renderMessenger (data, roadbook) {
    return (
      <MessengerTicket
        data     = {data}
        roadbook = {roadbook}
        {...this.link ()} />
    );
  }

  renderTicket (ticket, data, index) {
    return (
      <Trip
        key     = {index}
        kind    = 'trip-ticket'
        source  = 'roadbook'
        item-id = {ticket.id}
        ticket  = {ticket}
        data    = {data}
        {...this.link ()} />
    );
  }

  renderTickets (roadbook, data) {
    const result = [];
    const showHidden = ReducerData.ask (data, {type: 'IS_MESSENGER_SHOWHIDDEN', id: roadbook.id});
    let index = 0;
    for (var ticket of roadbook.Tickets) {
      if (showHidden || ticket.Status !== 'delivered') {
        result.push (this.renderTicket (ticket, data, index++));
      }
    }
    return result;
  }

  renderTicketsContainer (roadbook, data) {
    const compacted = ReducerData.ask (data, {type: 'IS_MESSENGER_COMPACTED', id: roadbook.id});
    if (compacted) {
      return null;
    } else {
      return (
        <Container
          kind            = 'tickets-trips'
          drag-controller = 'ticket'
          drag-source     = 'roadbook'
          item-id         = {roadbook.id}
          {...this.link ()} >
          {this.renderTickets (roadbook, data)}
        </Container>
      );
    }
  }

  renderRoadbook (roadbook, data, index) {
    return (
      <DragCab
        key             = {index}
        drag-controller = 'roadbook'
        direction       = 'horizontal'
        color           = {this.props.theme.palette.roadbookDragAndDropHover}
        thickness       = {this.props.theme.shapes.dragAndDropRoadbookThickness}
        over-spacing    = {this.props.theme.shapes.viewSpacing}
        radius          = '0px'
        data            = {data}
        do-click-action = {e => this.doClickAction (roadbook, e)}
        item-id         = {roadbook.id}
        {...this.link ()}>
        <Roadbook
          key      = {index}
          data     = {data}
          roadbook = {roadbook}
          {...this.link ()} >
          {this.renderMessenger (data, roadbook)}
          {this.renderTicketsContainer (roadbook, data)}
        </Roadbook>
      </DragCab>
    );
  }

  renderRoadbooksList (roadbooks, data) {
    const result = [];
    let index = 0;
    for (var roadbook of roadbooks) {
      result.push (this.renderRoadbook (roadbook, data, index++));
    }
    return result;
  }

  renderRoadbooks () {
    let data = this.read ('data');
    return (
      <Container
        kind            = 'tickets-messengers'
        drag-controller = 'roadbook'
        drag-source     = 'roadbooks'
        item-id         = {data.id}
        {...this.link ()} >
        {this.renderRoadbooksList (data.Roadbooks, data)}
        {this.renderHoverButton ()}
      </Container>
    );
  }

  renderChronos () {
    let data = this.read ('data');
    return (
      <Container
        kind            = 'tickets-messengers'
        drag-controller = 'roadbook'
        drag-source     = 'roadbooks'
        item-id         = {data.id}
        {...this.link ()} >
        <Container kind='tickets-root' {...this.link ()} >
          <Chronos
            data       = {data}
            events     = {RoadbooksToChronos.transform (data.Roadbooks, this.props.theme)}
            lineWidth  = '250px'
            glyphWidth = '80px'
            {...this.link ()} />
        </Container>
        {this.renderHoverButton ()}
      </Container>
    );
  }

  render () {
    switch (this.getViewType ()) {
      case 'tickets':
        return this.renderRoadbooks ();
      default:
        return this.renderChronos ();
    }
  }
}
