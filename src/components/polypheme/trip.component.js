'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {TripBox, TripTicket, DragCab, Combo} from '../../all-components.js';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class Trip extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      showCombo: false,
    };
    this.comboWidth  = null;
    this.comboLeft   = null;
    this.comboTop    = null;
    this.comboBottom = null;
  }

  getShowCombo () {
    return this.state.showCombo;
  }

  setShowCombo (value) {
    this.setState ( {
      showCombo: value
    });
  }

  showCombo (x) {
    const node = ReactDOM.findDOMNode (this);
    const comboRect = node.getBoundingClientRect ();

    // Compute horizontal position according to mouse.
    const width = 200;
    this.comboLeft = (x - width / 2) + 'px';
    this.comboWidth = width + 'px';

    // Puts the menu under the component if it is in the upper half of the window.
    const my = (comboRect.top + comboRect.bottom) / 2;
    const underside = my < window.innerHeight / 2;
    const top = Unit.add ((window.innerHeight - comboRect.top) + 'px', this.props.theme.shapes.flyingBalloonTriangleSize);
    const bottom = Unit.add (comboRect.bottom + 'px', this.props.theme.shapes.flyingBalloonTriangleSize);
    this.comboTop = underside ? bottom : null;
    this.comboBottom = underside ? null : top;

    this.setShowCombo (true);
  }

  mouseDown (event) {
    console.log ('Trip.mouseDown');
    if (this.getShowCombo ()) {
      this.setShowCombo (false);
      return true;
    }
    // if (event.button === 2)  // right-click ?
    if (event.ctrlKey && event.shiftKey) {
      this.showCombo (event.clientX);
      return true;
    }
    return false;
  }

  renderCombo () {
    if (this.getShowCombo ()) {
      console.log ('Trip.renderCombo');
      const ticket = this.read ('ticket');
      const dispatch = ticket.Status === 'dispatched' ? 'Dé-Dispatch' : 'Dispatch';
      const extend   = ticket.Extended === 'true' ? 'Compacte' : 'Etend';
      const select   = ticket.Selected === 'true' ? 'Désélectionne' : 'Sélectionne';
      const list = ['Modifie', dispatch, extend, select];


      return (
        <Combo
          left   = {this.comboLeft}
          top    = {this.comboTop}
          bottom = {this.comboBottom}
          width  = {this.comboWidth}
          list   = {list}
          {...this.link ()} />
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
        thickness       = {this.props.theme.shapes.dragAndDropThickness}
        radius          = {this.props.theme.shapes.dragAndDropThickness}
        mode            = 'corner-top-left'
        data            = {data}
        id              = {ticket.id}
        no-drag         = {noDrag}
        margin-bottom   = {margin}
        mouse-down      = {event => this.mouseDown (event)}
        {...this.link ()}>
        {content ()}
        {this.renderCombo ()}
      </DragCab>
    );
  }

  render () {
    const kind   = this.read ('kind');
    const ticket = this.read ('ticket');
    const data   = this.read ('data');
    const noDrag = (ticket.Status === 'dispatched') ? 'true' : null;

    if (kind === 'trip-box') {
      const m = Unit.parse (this.props.theme.shapes.tripBoxBottomMargin).value;
      return this.renderTrip (ticket, data, noDrag, m, () => (
        <TripBox ticket={ticket} {...this.link ()} />
      ));
    } else if (kind === 'trip-ticket') {
      return this.renderTrip (ticket, data, noDrag, 2, () => (
        <TripTicket ticket={ticket} no-drag={noDrag} shape={ticket.Shape} {...this.link ()} />
      ));
    } else {
      throw new Error (`Trip component contains invalid kind: ${kind}`);
    }
  }
}

/******************************************************************************/
