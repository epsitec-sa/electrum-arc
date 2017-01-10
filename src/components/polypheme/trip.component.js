'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {TripBox, TripTicket, DragCab, TripCombo, TripModify} from '../../all-components.js';
import {Unit} from 'electrum-theme';
import {setDragCabHasCombo, getComboLocation} from '../combo/combo-helpers.js';

/******************************************************************************/

export default class Trip extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      showCombo:  false,
      showModify: false,
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

  showCombo (x, y) {
    const node = ReactDOM.findDOMNode (this);
    this.comboLocation = getComboLocation (node, this.props.theme, x, y);
    this.setShowCombo (true);
  }

  mouseDown (event) {
    // console.log ('Trip.mouseDown');
    if (this.getShowCombo () || this.getShowModify ()) {
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
    if (this.getShowCombo () || this.getShowModify ()) {
      return true;
    }
    return false;
  }

  closeModify (action) {
    // console.log ('Trip.closeModify ' + action);
    this.setShowModify (false);
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

  renderCombo (data) {
    if (this.getShowCombo ()) {
      const ticket = this.read ('ticket');
      return (
        <TripCombo
          data        = {data}
          ticket      = {ticket}
          center      = {this.comboLocation.center}
          top         = {this.comboLocation.top}
          bottom      = {this.comboLocation.bottom}
          close-combo = {() => this.setShowCombo (false)}
          show-modify = {() => this.setShowModify (true)}
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
        show-modify     = {() => this.setShowModify (true)}
        {...this.link ()}>
        {content ()}
        {this.renderCombo (data)}
        {this.renderModify (data)}
      </DragCab>
    );
  }

  render () {
    const kind     = this.read ('kind');
    const ticket   = this.read ('ticket');
    const data     = this.read ('data');
    const noDrag   = (ticket.Status === 'dispatched' || ticket.Status === 'delivered') ? 'true' : null;
    const selected = this.getShowCombo () || this.getShowModify () ? 'true' : 'false';

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
