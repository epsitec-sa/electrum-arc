'use strict';

import React from 'react';
import {Action, ColorManipulator} from 'electrum';
import {Unit} from 'electrum-theme';

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
      shape:    this.read ('shape'),
      type:     this.read ('type'),
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
      window.document.tickets[inputTripId].set (inputTicketId, this);
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

  search(tripId, link) {
    if (tripId) {
      window.document.tickets[tripId].forEach ((value, key, map) => value.setLink (link));
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

  mouseUp (event) {
    //  With dragula, onMouseUp is catch only if click without move (without drag & drop).
    const mouseClick = this.read ('onMouseClick');
    if (mouseClick) {
      mouseClick (event);
    }
  }

  renderTicket () {
    const {state}  = this.props;
    const disabled = Action.isDisabled (state);
    const inputDragHandle = this.read ('drag-handle');
    const inputNoDrag     = this.read ('no-drag');
    const inputData       = this.read ('data');
    const inputTicketType = this.read ('ticket-type');
    const inputTicketId   = this.read ('ticket-id');
    const inputTripId     = this.read ('trip-id');
    const inputMessenger  = this.read ('messenger');
    const inputHatch      = this.read ('hatch');

    if (!inputTicketId) {
      throw new Error (`Undefined ticket ticket-id`);
    }

    const boxStyle      = this.mergeStyles ('box');
    const shadowStyle   = this.mergeStyles ('shadow');
    const shapeStyle    = this.mergeStyles ('shape');
    const hatchStyle    = this.mergeStyles ('hatch');
    const svgStyle      = this.mergeStyles ('svg');
    const hoverStyle    = this.mergeStyles ('hover');
    const contentStyle  = this.mergeStyles ('content');
    const dragZoneStyle = this.mergeStyles ('dragZoneStyle');

    if (inputData.warning) {  // pick under drop ?
      shapeStyle.fill = this.props.theme.palette.ticketWarningBackground;
    }
    if (this.getHover ()) {
      shapeStyle.fill = emphasize (shapeStyle.fill, 0.1);
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
    const hs = this.props.theme.shapes.ticketHatchSize;
    const ht = Unit.multiply (hs, 2);
    const htmlHatch = (inputHatch === 'true') ? (
      <svg width={w} height={h} style={hatchStyle}>
        <defs>
          <pattern id='hatch' x='0px' y='0px' width={ht} height={ht} patternTransform='rotate(45)' patternUnits='userSpaceOnUse'>
            <rect x='0px' y='0px' width={hs} height={ht} fill='#000' fillOpacity={this.props.theme.palette.ticketHatchOpacity} />
          </pattern>
        </defs>
        <path d={svgStyle.path} />
      </svg>
    ) : null;
    const htmlHover = (this.getHover () || this.getLink ()) ? (
      <svg width={w} height={h} style={hoverStyle}>
        <path d={hoverStyle.path} />
      </svg>
    ) : null;

    return (
      <div
        disabled         = {disabled}
        style            = {boxStyle}
        data-ticket-type = {inputTicketType}
        data-ticket-id   = {inputTicketId}
        data-trip-id     = {inputTripId}
        data-messenger   = {inputMessenger}
        data-index       = {inputData.index}
        >
        {htmlShadow}
        {htmlShape}
        {htmlHatch}
        {htmlHover}
        <div style = {contentStyle}>
          {this.props.children}
        </div>
        <div
          onMouseOver       = {() => this.mouseIn (inputTripId)}
          onMouseOut        = {() => this.mouseOut (inputTripId)}
          onMouseUp         = {event => this.mouseUp (event)}
          style             = {dragZoneStyle}
          data-drag-handle  = {inputDragHandle}
          data-drag-invalid = {inputNoDrag === 'true'}
          />
      </div>
    );
  }

  renderRect () {
    const {state}  = this.props;
    const disabled = Action.isDisabled (state);
    const inputDragHandle = this.read ('drag-handle');
    const inputNoDrag     = this.read ('no-drag');
    const inputData       = this.read ('data');
    const inputTicketType = this.read ('ticket-type');
    const inputTicketId   = this.read ('ticket-id');
    const inputTripId     = this.read ('trip-id');
    const inputMessenger  = this.read ('messenger');
    const inputHatch      = this.read ('hatch');

    if (!inputTicketId) {
      throw new Error (`Undefined ticket ticket-id`);
    }

    const rectShadowStyle       = this.mergeStyles ('rectShadow');
    const rectStyle             = this.mergeStyles ('rect');
    const rectHoverStyle        = this.mergeStyles ('rectHover');
    const contentStyle          = this.mergeStyles ('content');
    const rectContentHatchStyle = this.mergeStyles ('rectContentHatch');
    const dragZoneStyle         = this.mergeStyles ('dragZoneStyle');

    if (inputData.warning) {  // pick under drop ?
      rectStyle.backgroundColor = this.props.theme.palette.ticketWarningBackground;
    }
    if (this.getHover ()) {
      rectStyle.backgroundColor = emphasize (rectStyle.backgroundColor, 0.1);
    }

    return (
      <div
        style            = {rectShadowStyle}
        data-ticket-type = {inputTicketType}
        data-ticket-id   = {inputTicketId}
        data-trip-id     = {inputTripId}
        data-messenger   = {inputMessenger}
        data-index       = {inputData.index}
        >
        <div
          disabled         = {disabled}
          style            = {rectStyle}
          >
          <div style = {inputHatch === 'true' ? rectContentHatchStyle : contentStyle}>
            {this.props.children}
          </div>
          <div
            onMouseOver       = {() => this.mouseIn (inputTripId)}
            onMouseOut        = {() => this.mouseOut (inputTripId)}
            onMouseUp         = {event => this.mouseUp (event)}
            style             = {this.getHover () || this.getLink () ? rectHoverStyle : dragZoneStyle}
            data-drag-handle  = {inputDragHandle}
            data-drag-invalid = {inputNoDrag === 'true'}
            />
        </div>
      </div>
    );
  }

  render () {
    const inputKind = this.read ('kind');
    if (inputKind === 'ticket') {
      return this.renderTicket ();
    } else {
      return this.renderRect ();
    }
  }
}

/******************************************************************************/
