'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {TripBox, TripTicket, DragCab, TripCombo, TripModify, TripDeliver, TripPredispatch} from '../../all-components.js';
import {Unit} from 'electrum-theme';
import reducerDragAndDrop from './reducer-drag-and-drop.js';
import {setDragCabHasCombo, getComboLocation} from '../combo/combo-helpers.js';

/******************************************************************************/

export default class Trip extends React.Component {

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

  showCombo (x, y) {
    const node = ReactDOM.findDOMNode (this);
    this.comboLocation = getComboLocation (node, this.props.theme, x);
    this.setShowCombo (true);
  }

  mouseDown (event) {
    // console.log ('Trip.mouseDown');
    if (this.getShowSomethink ()) {
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
    if (this.getShowSomethink ()) {
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
      if (ticket.Status === 'dispatched') {  // dispatched -> delivered ?
        this.showDeliver ();  // selected realised time...
      } else if (ticket.Status === 'delivered') {  // delivered -> pre-dispatched ?
        this.showPredispatch ();  // request confirmation...
      } else {
        this.reduce ('SWAP_STATUS', event.shiftKey);  // change directly without dialog
      }
    }
  }

  reduce (action, shiftKey, value, date, time) {
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
      value:    value,
      date:     date,
      time:     time,
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

  closeDeliver (action, date, time) {
    this.setShowDeliver (false);
    if (action === 'accept') {
      this.reduce ('CHANGE_STATUS', false, 'delivered', date, time);
    }
  }

  showPredispatch () {
    this.setShowPredispatch (true);
  }

  closePredispatch (action, date, time) {
    this.setShowPredispatch (false);
    if (action === 'accept') {
      this.reduce ('CHANGE_STATUS', false, 'pre-dispatched', date, time);
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
          close-deliver = {(action, date, time) => this.closeDeliver (action, date, time)}
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
          close-predispatch = {(action, date, time) => this.closePredispatch (action, date, time)}
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
          close-combo      = {() => this.setShowCombo (false)}
          show-modify      = {() => this.showModify ()}
          show-deliver     = {() => this.showDeliver ()}
          show-predispatch = {() => this.showPredispatch ()}
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
        {this.renderPredispatch (data)}
      </DragCab>
    );
  }

  render () {
    const kind     = this.read ('kind');
    const ticket   = this.read ('ticket');
    const data     = this.read ('data');
    const noDrag   = (ticket.Status === 'dispatched' || ticket.Status === 'delivered') ? 'true' : null;
    const selected = this.getShowSomethink () ? 'true' : 'false';

    let verticalSpacing;
    if (kind === 'trip-box') {
      verticalSpacing = this.props.theme.shapes.tripBoxVerticalSpacing;
    } else {
      if (ticket.Shape === 'first') {
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
        item-id          = {ticket.id}
        no-drag          = {noDrag}
        vertical-spacing = {verticalSpacing}
        mouse-down       = {event => this.mouseDown (event)}
        mouse-up         = {event => this.mouseUp (event)}
        do-click-action  = {(event) => this.doClickAction (event)}
        {...this.link ()}>
        <TripTicket
          kind             = {kind}
          ticket           = {ticket}
          data             = {data}
          selected         = {selected}
          no-drag          = {noDrag}
          shape            = {ticket.Shape}
          vertical-spacing = {verticalSpacing}
          {...this.link ()} />
        {this.renderCombo (data)}
        {this.renderModify (data)}
        {this.renderDeliver (data)}
        {this.renderPredispatch (data)}
      </DragCab>
    );
  }
}

/******************************************************************************/
