/* global window */

import {React} from 'electrum';
import * as ReducerData from './reducer-data.js';
import * as RoadbooksToChronos from './roadbooks-to-chronos.js';

import {
  Container,
  DispatchTicket,
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

  get viewType () {
    return this.state.viewType;
  }

  set viewType (value) {
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

  onClickAction (roadbook, e) {
    if (e.altKey) {  // compected/extended ?
      const data = this.read ('data');
      ReducerData.reduce (data, ReducerData.swapRoadbookCompactedAction = (roadbook.id));
    }
  }

  onCycleViewType () {
    switch (this.viewType) {
      case 'tickets':
        this.viewType = 'chronos';
        break;
      default:
        this.viewType = 'tickets';
        break;
    }
  }

  getViewTypeGlyph () {
    switch (this.viewType) {
      case 'tickets':
        return {glyph: 'clock-o', rotate: '0'};
      default:
        return {glyph: 'bars', rotate: '90'};
    }
  }

  getLastRoadbookId (data) {
    for (let i = data.Roadbooks.length - 1; i >= 0 ; i--) {
      const roadbook = data.Roadbooks[i];
      if (roadbook.Tickets.length > 0) {
        return roadbook.id;
      }
    }
    return null;
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
          custom-on-click = {this.onCycleViewType}
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
      <DispatchTicket
        key    = {index}
        kind   = 'trip-ticket'
        source = 'roadbook'
        ticket = {ticket}
        data   = {data}
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
          drag-owner-id   = {roadbook.id}
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
        do-click-action = {e => this.onClickAction (roadbook, e)}
        drag-owner-id   = {roadbook.id}
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
        drag-owner-id   = {data.id}
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
        kind = 'tickets-messengers'
        {...this.link ()} >
        <Container
          kind = 'tickets-root'
          {...this.link ()} >
          <Chronos
            data            = {data}
            events          = {RoadbooksToChronos.transform (data.Roadbooks, this.props.theme)}
            lineWidth       = '250px'
            glyphWidth      = '80px'
            drag-controller = 'ticket'
            drag-source     = 'roadbooks'
            drag-owner-id   = {this.getLastRoadbookId (data)}
            {...this.link ()} />
        </Container>
        {this.renderHoverButton ()}
      </Container>
    );
  }

  render () {
    switch (this.viewType) {
      case 'tickets':
        return this.renderRoadbooks ();
      default:
        return this.renderChronos ();
    }
  }
}
