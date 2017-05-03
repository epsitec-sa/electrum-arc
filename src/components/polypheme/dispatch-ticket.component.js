/* eslint react/no-find-dom-node: 0 */
/* global window */

import {React} from 'electrum';
import {ReactDOM} from 'electrum';

import {
  DispatchDragTicket, DragCab, TripCombo, TripModify, TripDeliver, TripPredispatch
} from '../../all-components.js';

import * as ReducerData from './reducer-data.js';
import * as ComboHelpers from '../combo/combo-helpers.js';
import * as StateManager from './state-manager.js';

/******************************************************************************/

export default class DispatchTicket extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      showCombo:       false,
      showModify:      false,
      showDeliver:     false,
      showPredispatch: false,
    };
    this.comboLocation = null;
  }

  getShowCombo () {
    return this.state.showCombo;
  }

  setShowCombo (value) {
    this.setState ( {
      showCombo: value
    });
    const ticket = this.read ('ticket');
    const id = ticket.id;
    ComboHelpers.setDragCabHasCombo (id, value);
  }

  getShowModify () {
    return this.state.showModify;
  }

  setShowModify (value) {
    this.setState ( {
      showModify: value
    });
  }

  getShowDeliver () {
    return this.state.showDeliver;
  }

  setShowDeliver (value) {
    this.setState ( {
      showDeliver: value
    });
  }

  getShowPredispatch () {
    return this.state.showPredispatch;
  }

  setShowPredispatch (value) {
    this.setState ( {
      showPredispatch: value
    });
  }

  getShowSomethink () {
    return this.getShowCombo () || this.getShowModify () || this.getShowDeliver () || this.getShowPredispatch ();
  }

  showCombo (x) {
    const node = ReactDOM.findDOMNode (this);
    this.comboLocation = ComboHelpers.getComboLocation (node, this.props.theme, x);
    this.setShowCombo (true);
  }

  onMyMouseDown (e) {
    // Trace.log ('Trip.mouseDown');
    if (this.getShowSomethink ()) {
      return true;
    }
    // if (e.button === 2)  // right-click ?
    if (e.button === 2 || (e.ctrlKey && e.shiftKey)) {
      this.showCombo (e.clientX, e.clientY);
      return true;
    }
    return false;
  }

  onMyMouseUp () {
    // Trace.log ('Trip.mouseUp');
    if (this.getShowSomethink ()) {
      return true;
    }
    return false;
  }

  onClickAction (e) {
    if (e.ctrlKey || e.shiftKey || e.metaKey) {  // select/deselect ?
      this.reduce ('SWAP_TICKET_SELECTED', e.shiftKey);
    } else if (e.altKey) {  // compected/extended ?
      this.reduce ('SWAP_TICKET_EXTENDED');
    } else {  // pre-dispatched/dispatched/delivered ?
      if (window.document.mock) {
        const ticket = this.read ('ticket');
        if (ticket.Status === 'dispatched') {  // dispatched -> delivered ?
          this.onShowDeliver ();  // selected realised time...
        } else if (ticket.Status === 'delivered') {  // delivered -> pre-dispatched ?
          this.onShowPredispatch ();  // request confirmation...
        } else {
          this.reduce ('CYCLE_TICKET_STATUS');  // change directly without dialog
        }
      } else {
        this.reduce ('CYCLE_TICKET_STATUS');
      }
    }
  }

  reduce (action, shiftKey, value, date, time) {
    // Trace.log ('Trip.reducer');
    const data   = this.read ('data');
    const ticket = this.read ('ticket');
    const id     = ticket.id;

    // Inject electrum state (needed for electrumDispatch).
    data.state = this.props.state;

    ReducerData.reducer (data, {
      type:     action,
      id:       id,
      shiftKey: shiftKey,
      value:    value,
      date:     date,
      time:     time,
    });
  }

  onCloseCombo () {
    this.setShowCombo (false);
  }

  onShowModify () {
    if (window.document.mock) {
      this.setShowModify (true);
    } else {
      throw new Error ('Direct call to showModify is impossible in mock=false mode');
    }
  }

  onCloseModify () {
    this.setShowModify (false);
  }

  onShowDeliver () {
    if (window.document.mock) {
      this.setShowDeliver (true);
    } else {
      throw new Error ('Direct call to showDeliver is impossible in mock=false mode');
    }
  }

  onCloseDeliver (action, date, time) {
    // console.log (`DispatchTicket.closeDeliver action=${action} date=${date} time=${time}`);
    this.setShowDeliver (false);
    if (action === 'accept') {
      this.reduce ('CHANGE_TICKET_STATUS', false, 'delivered', date, time);
    }
  }

  onShowPredispatch () {
    if (window.document.mock) {
      this.setShowPredispatch (true);
    } else {
      throw new Error ('Direct call to showPredispatch is impossible in mock=false mode');
    }
  }

  onClosePredispatch (action, date, time) {
    this.setShowPredispatch (false);
    if (action === 'accept') {
      this.reduce ('CHANGE_TICKET_STATUS', false, 'pre-dispatched', date, time);
    }
  }

  renderModify (data) {
    if (this.getShowModify ()) {
      const ticket = this.read ('ticket');
      return (
        <TripModify
          data         = {data}
          ticket       = {ticket}
          close-modify = {this.onCloseModify}
          {...this.link ()} />
      );
    } else {
      return null;
    }
  }

  renderDeliver (data) {
    if (this.getShowDeliver ()) {
      const ticket = this.read ('ticket');
      return (
        <TripDeliver
          data          = {data}
          ticket        = {ticket}
          close-deliver = {this.onCloseDeliver}
          {...this.link ()} />
      );
    } else {
      return null;
    }
  }

  renderPredispatch (data) {
    if (this.getShowPredispatch ()) {
      const ticket = this.read ('ticket');
      return (
        <TripPredispatch
          data              = {data}
          ticket            = {ticket}
          close-predispatch = {this.onClosePredispatch}
          {...this.link ()} />
      );
    } else {
      return null;
    }
  }

  renderCombo (data) {
    if (this.getShowCombo ()) {
      const ticket = this.read ('ticket');
      const source = this.read ('source');
      return (
        <TripCombo
          data             = {data}
          ticket           = {ticket}
          source           = {source}
          center           = {this.comboLocation.center}
          top              = {this.comboLocation.top}
          bottom           = {this.comboLocation.bottom}
          close-combo      = {this.onCloseCombo}
          show-modify      = {this.onShowModify}
          show-deliver     = {this.onShowDeliver}
          show-predispatch = {this.onShowPredispatch}
          {...this.link ()}/>
      );
    } else {
      return null;
    }
  }

  renderMetaTicket (ticket) {
    const kind     = this.read ('kind');
    const data     = this.read ('data');
    const noDrag   = null;
    const selected = this.getShowSomethink () ? 'true' : 'false';

    return (
      <DragCab
        drag-controller  = 'ticket'
        direction        = 'vertical'
        color            = {this.props.theme.palette.dragAndDropHover}
        thickness        = {this.props.theme.shapes.dragAndDropTicketThickness}
        radius           = {this.props.theme.shapes.dragAndDropTicketThickness}
        mode             = 'corner-top-left'
        data             = {data}
        drag-owner-id    = {ticket.id}
        no-drag          = {noDrag}
        vertical-spacing = {this.props.theme.shapes.ticketBacklogVerticalSpacing}
        mouse-down       = {this.onMyMouseDown}
        mouse-up         = {this.onMyMouseUp}
        do-click-action  = {this.onClickAction}
        {...this.link ()} >
        <DispatchDragTicket
          kind             = {kind}
          ticket           = {ticket}
          metaTicket       = 'true'
          data             = {data}
          selected         = {selected}
          no-drag          = {noDrag}
          vertical-spacing = {this.props.theme.shapes.ticketBacklogVerticalSpacing}
          {...this.link ()} />
        {this.renderCombo (data)}
        {this.renderModify (data)}
        {this.renderDeliver (data)}
        {this.renderPredispatch (data)}
      </DragCab>
    );
  }

  renderTicket (ticket) {
    const kind     = this.read ('kind');
    const data     = this.read ('data');
    const noDrag   = (ticket.Status === 'dispatched' || ticket.Status === 'delivered') ? 'true' : null;
    const selected = this.getShowSomethink () ? 'true' : 'false';
    const shape    = StateManager.getTicketShape (ticket.id);

    let verticalSpacing;
    let horizontalSpacing;
    if (kind === 'backlog-box') {
      verticalSpacing = this.props.theme.shapes.ticketBacklogVerticalSpacing;
    } else if (kind === 'trip-backlog') {
      verticalSpacing   = this.props.theme.shapes.ticketBacklogSpacing;
      horizontalSpacing = this.props.theme.shapes.ticketBacklogSpacing;
    } else {
      if (shape === 'first') {
        verticalSpacing = this.props.theme.shapes.ticketVerticalSpacingFirst;
      } else {
        verticalSpacing = this.props.theme.shapes.ticketVerticalSpacing;
      }
    }

    return (
      <DragCab
        drag-controller  = 'ticket'
        direction        = 'vertical'
        color            = {this.props.theme.palette.dragAndDropHover}
        thickness        = {this.props.theme.shapes.dragAndDropTicketThickness}
        radius           = {this.props.theme.shapes.dragAndDropTicketThickness}
        mode             = 'corner-top-left'
        data             = {data}
        drag-owner-id    = {ticket.id}
        no-drag          = {noDrag}
        vertical-spacing = {verticalSpacing}
        mouse-down       = {this.onMyMouseDown}
        mouse-up         = {this.onMyMouseUp}
        do-click-action  = {this.onClickAction}
        {...this.link ()} >
        <DispatchDragTicket
          kind               = {kind}
          ticket             = {ticket}
          data               = {data}
          selected           = {selected}
          no-drag            = {noDrag}
          shape              = {shape}
          vertical-spacing   = {verticalSpacing}
          horizontal-spacing = {horizontalSpacing}
          {...this.link ()} />
        {this.renderCombo (data)}
        {this.renderModify (data)}
        {this.renderDeliver (data)}
        {this.renderPredispatch (data)}
      </DragCab>
    );
  }

  render () {
    const ticket     = this.read ('ticket');
    const metaTicket = this.read ('metaTicket');
    if (metaTicket === 'true') {
      return this.renderMetaTicket (ticket);
    } else {
      return this.renderTicket (ticket);
    }
  }
}

/******************************************************************************/
