'use strict';

import React from 'react';
import {Ticket} from '../../all-components.js';
import TicketHelpers from './ticket-helpers.js';

/******************************************************************************/

export default class CodispatchDragTicket extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover: false,
      link:  false,
    };
  }

  getHover () {
    return this.state.hover;
  }

  setHover (value) {
    this.setState ( {
      hover: value
    });
  }

  mouseOver () {
    if (!this.props.isDragged) {
      this.setHover (true);
    }
  }

  mouseOut () {
    this.setHover (false);
  }

  renderTicketContent (ticket, extended, delivered) {
    const directionGlyph = TicketHelpers.getDirectionGlyph (this.props.theme, ticket.Type);

    if (extended) {
      return this.renderExtendedContent (ticket, directionGlyph, delivered);
    } else {
      return this.renderCompactedContent (ticket, directionGlyph, delivered);
    }
  }

  render () {
    const children  = this.read ('children');
    const isDragged = this.props.isDragged;
    const hasHeLeft = this.props.hasHeLeft;

    let subkind = null;
    if (isDragged) {
      subkind = 'dragged';
    } else if (this.getHover ()) {
      subkind = 'hover';
    }

    let color = this.props.theme.palette.paneBackground;
    if (hasHeLeft && !isDragged) {
      color = this.props.theme.palette.ticketDragAndDropShadow;
    }

    return (
      <Ticket
        kind         = 'subpane'
        subkind      = {subkind}
        color        = {color}
        hide-content = {hasHeLeft && !isDragged ? 'true' : 'false'}
        mouse-over   = {() => this.mouseOver ()}
        mouse-out    = {() => this.mouseOut ()}
        {...this.link ()} >
        {children}
      </Ticket>
    );
  }
}

/******************************************************************************/
