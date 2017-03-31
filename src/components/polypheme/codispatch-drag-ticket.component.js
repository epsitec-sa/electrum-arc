'use strict';

import React from 'react';
import {Ticket} from '../../all-components.js';
import TicketHelpers from './ticket-helpers.js';

/******************************************************************************/

export default class CodispatchDragTicket extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover:     false,
      dragHover: false,
      link:      false,
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

  getDragHover () {
    return this.state.dragHover;
  }

  setDragHover (value) {
    this.setState ( {
      dragHover: value
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

  dragBarMouseOver () {
    if (!this.props.isDragged) {
      this.setDragHover (true);
    }
  }

  dragBarMouseOut () {
    this.setDragHover (false);
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

    const subkind = isDragged ? 'dragged' : null;

    let color = this.props.theme.palette.paneBackground;
    if (hasHeLeft && !isDragged) {
      color = this.props.theme.palette.ticketDragAndDropShadow;
    } else if (this.getDragHover ()) {
      color = this.props.theme.palette.ticketDragAndDropHover;
    }

    const boxStyle = {
      position: 'relative',
    };

    const dragBarStyle = {
      position: 'absolute',
      left:     '0px',
      width:    this.props.theme.shapes.containerMargin,
      top:      '0px',
      height:   '100%',
      cursor:   'move',
    };

    return (
      <div
        style = {boxStyle}
        >
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
        <div
          style       = {dragBarStyle}
          onMouseOver = {() => this.dragBarMouseOver ()}
          onMouseOut  = {() => this.dragBarMouseOut ()}
          />
      </div>
    );
  }
}

/******************************************************************************/
