'use strict';

import React from 'react';

import {DragCab, Ticket} from '../../all-components.js';
import TicketHelpers from './ticket-helpers.js';

/******************************************************************************/

export default class CodispatchTicket extends React.Component {

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
    const ticketId  = this.read ('ticket-id');
    const isDragged = this.props.isDragged;
    const hasHeLeft = this.props.hasHeLeft;

    let color = this.props.theme.palette.paneBackground;
    if (hasHeLeft && !isDragged) {
      color = this.props.theme.palette.ticketDragAndDropShadow;
    }

    return (
      <DragCab
        key              = '1'
        drag-controller  = 'codispo-ticket'
        drag-owner-id    = {ticketId}
        direction        = 'vertical'
        mode             = 'corner-top-left'
        color            = {this.props.theme.palette.roadbookDragAndDropHover}
        thickness        = {this.props.theme.shapes.dragAndDropTicketThickness}
        over-spacing     = '0px'
        vertical-spacing = '0px'
        radius           = '0px'
        {...this.link ()}>
        <Ticket
          kind         = 'subpane'
          color        = {color}
          hide-content = {hasHeLeft && !isDragged ? 'true' : 'false'}
          {...this.link ()} >
          {this.props.children}
        </Ticket>
      </DragCab>
    );
  }
}

/******************************************************************************/
