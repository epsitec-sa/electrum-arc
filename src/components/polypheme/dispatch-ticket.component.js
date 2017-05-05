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

  get showCombo () {
    return this.state.showCombo;
  }

  set showCombo (value) {
    this.setState ( {
      showCombo: value
    });
    const ticket = this.read ('ticket');
    const id = ticket.id;
    ComboHelpers.setDragCabHasCombo (id, value);
  }

  get showModify () {
    return this.state.showModify;
  }

  set showModify (value) {
    this.setState ( {
      showModify: value
    });
  }

  get showDeliver () {
    return this.state.showDeliver;
  }

  set showDeliver (value) {
    this.setState ( {
      showDeliver: value
    });
  }

  get showPredispatch () {
    return this.state.showPredispatch;
  }

  set showPredispatch (value) {
    this.setState ( {
      showPredispatch: value
    });
  }

  getShowSomethink () {
    return this.showCombo || this.showModify || this.showDeliver || this.showPredispatch;
  }

  doShowCombo (x) {
    const node = ReactDOM.findDOMNode (this);
    this.comboLocation = ComboHelpers.getComboLocation (node, this.props.theme, x);
    this.showCombo = true;
  }

  onMyMouseDown (e) {
    // Trace.log ('Trip.mouseDown');
    if (this.getShowSomethink ()) {
      return true;
    }
    // if (e.button === 2)  // right-click ?
    if (e.button === 2 || (e.ctrlKey && e.shiftKey)) {
      this.doShowCombo (e.clientX, e.clientY);
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
    const data   = this.read ('data');
    const ticket = this.read ('ticket');
    if (e.ctrlKey || e.shiftKey || e.metaKey) {  // select/deselect ?
      ReducerData.reduce (data, ReducerData.swapTicketSelectedAction = (ticket.id, e.shiftKey));
    } else if (e.altKey) {  // compected/extended ?
      ReducerData.reduce (data, ReducerData.swapTicketExtendedAction = (ticket.id));
    } else {  // pre-dispatched/dispatched/delivered ?
      if (window.document.mock) {
        if (ticket.Status === 'dispatched') {  // dispatched -> delivered ?
          this.onShowDeliver ();  // selected realised time...
        } else if (ticket.Status === 'delivered') {  // delivered -> pre-dispatched ?
          this.onShowPredispatch ();  // request confirmation...
        } else {
          ReducerData.reduce (data, ReducerData.cycleTicketStatusAction = (ticket.id));
        }
      } else {
        ReducerData.reduce (data, ReducerData.cycleTicketStatusAction = (ticket.id));
      }
    }
  }

  onCloseCombo () {
    this.showCombo = false;
  }

  onShowModify () {
    if (window.document.mock) {
      this.showModify = true;
    } else {
      throw new Error ('Direct call to showModify is impossible in mock=false mode');
    }
  }

  onCloseModify () {
    this.showModify = false;
  }

  onShowDeliver () {
    if (window.document.mock) {
      this.showDeliver = true;
    } else {
      throw new Error ('Direct call to showDeliver is impossible in mock=false mode');
    }
  }

  onCloseDeliver (action, date, time) {
    // console.log (`DispatchTicket.closeDeliver action=${action} date=${date} time=${time}`);
    this.showDeliver = false;
    if (action === 'accept') {
      const data   = this.read ('data');
      const ticket = this.read ('ticket');
      ReducerData.reduce (data, ReducerData.changeTicketStatusAction = (ticket.id, 'delivered', date, time));
    }
  }

  onShowPredispatch () {
    if (window.document.mock) {
      this.showPredispatch = true;
    } else {
      throw new Error ('Direct call to showPredispatch is impossible in mock=false mode');
    }
  }

  onClosePredispatch (action, date, time) {
    this.showPredispatch = false;
    if (action === 'accept') {
      const data   = this.read ('data');
      const ticket = this.read ('ticket');
      ReducerData.reduce (data, ReducerData.changeTicketStatusAction = (ticket.id, 'pre-dispatched', date, time));
    }
  }

  renderModify (data) {
    if (this.showModify) {
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
    if (this.showDeliver) {
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
    if (this.showPredispatch) {
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
    if (this.showCombo) {
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
