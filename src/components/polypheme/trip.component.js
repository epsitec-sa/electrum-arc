'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {TripBox, TripTicket, DragCab, TripCombo, TripModify, TripDeliver} from '../../all-components.js';
import {Unit} from 'electrum-theme';
import reducerDragAndDrop from './reducer-drag-and-drop.js';
import {setDragCabHasCombo, getComboLocation} from '../combo/combo-helpers.js';

/******************************************************************************/

export default class Trip extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      showCombo:   false,
      showModify:  false,
      showDeliver: false,
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
    setDragCabHasCombo (id, value);
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

  showCombo (x, y) {
    const node = ReactDOM.findDOMNode (this);
    this.comboLocation = getComboLocation (node, this.props.theme, x);
    this.setShowCombo (true);
  }

  mouseDown (event) {
    // console.log ('Trip.mouseDown');
    if (this.getShowCombo () || this.getShowModify () || this.getShowDeliver ()) {
      return true;
    }
    // if (event.button === 2)  // right-click ?
    if (event.button === 2 || (event.ctrlKey && event.shiftKey)) {
      this.showCombo (event.clientX, event.clientY);
      return true;
    }
    return false;
  }

  mouseUp (event) {
    // console.log ('Trip.mouseUp');
    if (this.getShowCombo () || this.getShowModify () || this.getShowDeliver ()) {
      return true;
    }
    return false;
  }

  doClickAction (event) {
    if (event.ctrlKey || event.shiftKey || event.metaKey) {  // select/deselect ?
      this.reduce ('SWAP_SELECTED', event.shiftKey);
    } else if (event.altKey) {  // compected/extended ?
      this.reduce ('SWAP_EXTENDED', event.shiftKey);
    } else {  // pre-dispatched/dispatched/delivered ?
      const ticket = this.read ('ticket');
      if (ticket.Status === 'dispatched') {
        this.showDeliver ();
      } else {
        this.reduce ('SWAP_STATUS', event.shiftKey);
      }
    }
  }

  reduce (action, shiftKey) {
    console.log ('Trip.reducer');
    const data   = this.read ('data');
    const ticket = this.read ('ticket');
    const id     = ticket.id;

    // inject electrum state (needed for electrumDispatch)
    data.state = this.props.state;

    reducerDragAndDrop (data, {
      type:     action,
      id:       id,
      shiftKey: shiftKey,
    });
    if (window.document.mock) {
      for (var c of window.document.toUpdate) {
        c.forceUpdate ();
      }
    }
  }

  showModify () {
    this.setShowModify (true);
  }

  closeModify (action) {
    this.setShowModify (false);
  }

  showDeliver () {
    this.setShowDeliver (true);
  }

  closeDeliver (action) {
    this.setShowDeliver (false);
    if (action === 'accept') {
      this.reduce ('SWAP_STATUS');
    }
  }

  renderModify (data) {
    if (this.getShowModify ()) {
      const ticket = this.read ('ticket');
      return (
        <TripModify
          data         = {data}
          ticket       = {ticket}
          close-modify = {action => this.closeModify (action)}
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
          close-deliver = {action => this.closeDeliver (action)}
          {...this.link ()} />
      );
    } else {
      return null;
    }
  }

  renderCombo (data) {
    if (this.getShowCombo ()) {
      const ticket = this.read ('ticket');
      return (
        <TripCombo
          data         = {data}
          ticket       = {ticket}
          center       = {this.comboLocation.center}
          top          = {this.comboLocation.top}
          bottom       = {this.comboLocation.bottom}
          close-combo  = {() => this.setShowCombo (false)}
          show-modify  = {() => this.showModify ()}
          show-deliver = {() => this.showDeliver ()}
          {...this.link ()}/>
      );
    } else {
      return null;
    }
  }

  renderTrip (ticket, data, noDrag, margin, content) {
    return (
      <DragCab
        drag-controller = 'ticket'
        direction       = 'vertical'
        color           = {this.props.theme.palette.dragAndDropHover}
        thickness       = {this.props.theme.shapes.dragAndDropTicketThickness}
        radius          = {this.props.theme.shapes.dragAndDropTicketThickness}
        mode            = 'corner-top-left'
        data            = {data}
        item-id         = {ticket.id}
        no-drag         = {noDrag}
        margin-bottom   = {margin}
        mouse-down      = {event => this.mouseDown (event)}
        mouse-up        = {event => this.mouseUp (event)}
        do-click-action = {(event) => this.doClickAction (event)}
        {...this.link ()}>
        {content ()}
        {this.renderCombo (data)}
        {this.renderModify (data)}
        {this.renderDeliver (data)}
      </DragCab>
    );
  }

  render () {
    const kind     = this.read ('kind');
    const ticket   = this.read ('ticket');
    const data     = this.read ('data');
    const noDrag   = (ticket.Status === 'dispatched' || ticket.Status === 'delivered') ? 'true' : null;
    const selected = this.getShowCombo () || this.getShowModify () || this.getShowDeliver () ? 'true' : 'false';

    if (kind === 'trip-box') {
      const m = Unit.parse (this.props.theme.shapes.tripBoxBottomMargin).value;
      return this.renderTrip (ticket, data, noDrag, m, () => (
        <TripBox ticket={ticket} data={data} selected={selected}
          {...this.link ()} />
      ));
    } else if (kind === 'trip-ticket') {
      return this.renderTrip (ticket, data, noDrag, 2, () => (
        <TripTicket ticket={ticket} data={data} selected={selected}
          no-drag={noDrag} shape={ticket.Shape} {...this.link ()} />
      ));
    } else {
      throw new Error (`Trip component contains invalid kind: ${kind}`);
    }
  }
}

/******************************************************************************/
