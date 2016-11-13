'use strict';

import React from 'react';
import {Action, ColorManipulator} from 'electrum';

const {emphasize} = ColorManipulator;

/******************************************************************************/

export default class Ticket extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover: false,
      link:  false,
    };
  }

  get styleProps () {
    return {
      width:    this.read ('width'),
      height:   this.read ('height'),
      kind:     this.read ('kind'),
      selected: this.read ('selected'),
      color:    this.read ('color'),
      noDrag:   this.read ('no-drag'),
      cursor:   this.read ('cursor'),
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

  getLink () {
    return this.state.link;
  }

  setLink (value) {
    this.setState ( {
      link: value
    });
  }

  componentDidMount () {
    const inputTicketId = this.read ('ticket-id');
    const inputTripId   = this.read ('trip-id');
    if (inputTicketId && inputTripId) {
      if (!window.document.tickets) {
        window.document.tickets = {};
      }
      if (!window.document.tickets[inputTripId]) {
        window.document.tickets[inputTripId] = new Map ();
      }
      window.document.tickets[inputTripId].set (inputTicketId, (hover) => this.change (this, hover));
    }
  }

  componentWillUnmount () {
    const inputTicketId = this.read ('ticket-id');
    const inputTripId   = this.read ('trip-id');
    if (inputTicketId && inputTripId) {
      if (!window.document.tickets) {
        throw new Error (`Fatal error during Ticket.componentWillUnmount with tripId=${inputTripId} (#1)`);
      }
      if (!window.document.tickets[inputTripId]) {
        throw new Error (`Fatal error during Ticket.componentWillUnmount tripId=${inputTripId} (#2)`);
      }
      window.document.tickets[inputTripId].delete (inputTicketId);
    }
  }

  change(that, link) {
    that.setLink (link);
  }

  search(tripId, link) {
    if (tripId) {
      window.document.tickets[tripId].forEach ((value, key, map) => value (link));
    }
  }

  mouseIn (tripId) {
    this.setHover (true);
    this.search (tripId, true);
  }

  mouseOut (tripId) {
    this.setHover (false);
    this.search (tripId, false);
  }

  computeHover(shadowStyle, shapeStyle, contentStyle) {
    const inputKind = this.read ('kind');

    // shapeStyle.fill        = emphasize (shapeStyle.fill, 0.1);
    shadowStyle.top          = '0px';
    contentStyle.transform   = 'scale(0.85)';
    shapeStyle.stroke        = emphasize (shadowStyle.fill, 0.3);
    shapeStyle.strokeWidth   = 1;
    if (inputKind === 'header') {
      // Dash line only on bottom.
      shapeStyle.transform         = 'scaleX(0.94) scaleY(0.9)';
      shapeStyle.transformOrigin   = 'top';
      contentStyle.transformOrigin = 'top';
    } else if (inputKind === 'footer') {
      // Dash line only on top.
      shapeStyle.transform         = 'scaleX(0.94) scaleY(0.9)';
      shapeStyle.transformOrigin   = 'bottom';
      contentStyle.transformOrigin = 'bottom';
    } else {
      shapeStyle.transform         = 'scaleX(0.94) scaleY(0.85)';
    }
  }

  render () {
    const {state}    = this.props;
    const disabled   = Action.isDisabled (state);
    const inputDragHandle = this.read ('drag-handle');
    const inputNoDrag     = this.read ('no-drag');
    const inputTicketId   = this.read ('ticket-id');
    const inputTripId     = this.read ('trip-id');

    if (!inputTicketId) {
      throw new Error (`Undefined ticket ticket-id`);
    }

    const boxStyle      = this.mergeStyles ('box');
    const shadowStyle   = this.mergeStyles ('shadow');
    const shapeStyle    = this.mergeStyles ('shape');
    const svgStyle      = this.mergeStyles ('svg');
    const contentStyle  = this.mergeStyles ('content');
    const dragZoneStyle = this.mergeStyles ('dragZoneStyle');

    if (this.getHover ()) {
      this.computeHover (shadowStyle, shapeStyle, contentStyle);
    } else if (this.getLink ()) {
      this.computeHover (shadowStyle, shapeStyle, contentStyle);
    }

    const w = boxStyle.width;
    const h = boxStyle.height;
    if (!w || !h) {
      throw new Error (`Undefined ticket width or height`);
    }
    const htmlShadow = (
      <svg width={w} height={h} style={shadowStyle}>
        <path d={svgStyle.path} />
      </svg>
    );
    const htmlShape = (
      <svg width={w} height={h} style={shapeStyle}>
        <path d={svgStyle.path} />
      </svg>
    );

    return (
      <div
        disabled = {disabled}
        style    = {boxStyle}
        >
        {htmlShadow}
        {htmlShape}
        <div
          onMouseOver       = {() => this.mouseIn (inputTripId)}
          onMouseOut        = {() => this.mouseOut (inputTripId)}
          style             = {dragZoneStyle}
          data-drag-handle  = {inputDragHandle}
          data-drag-invalid = {inputNoDrag === 'true'}
          />
        <div style = {contentStyle}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

/******************************************************************************/
