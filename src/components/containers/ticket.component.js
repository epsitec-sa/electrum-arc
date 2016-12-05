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
      hover:   false,
      link:    false,
      transit: false,
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

  getTransit () {
    return this.state.transit;
  }

  setTransit (value) {
    this.setState ( {
      transit: value
    });
  }

  componentDidMount () {
    if (!window.document.tickets) {
      window.document.tickets = [];
    }
    window.document.tickets.push (this);
  }

  componentWillUnmount () {
    const index = window.document.tickets.indexOf (this);
    if (index !== -1) {
      window.document.tickets.splice (index, 1);
    }
  }

  //  Update state.link to all tickets linked.
  //  By example, pick and drop to a trip, or 4 tickets is has transit.
  setLinkToAll (link) {
    const data = this.read ('data');
    if (data.Trip) {
      for (var i = 0, len = window.document.tickets.length; i < len; i++) {
        const t = window.document.tickets[i];
        const d = t.read ('data');
        if (d && d.Trip) {
          if (data.Trip.MissionId && d.Trip.MissionId && data.Trip.MissionId === d.Trip.MissionId) {
            t.setLink (link);
            t.setTransit (d.Type.endsWith ('-transit'));
          }
        }
      }
    }
  }

  mouseIn () {
    this.setHover (true);
    this.setLinkToAll (true);
  }

  mouseOut () {
    this.setHover (false);
    this.setLinkToAll (false);
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
    const dragHandle = this.read ('drag-handle');
    const noDrag     = this.read ('no-drag');
    const data       = this.read ('data');
    const hatch      = this.read ('hatch');
    const warning    = this.read ('warning');

    const boxStyle      = this.mergeStyles ('box');
    const shadowStyle   = this.mergeStyles ('shadow');
    const shapeStyle    = this.mergeStyles ('shape');
    const hatchStyle    = this.mergeStyles ('hatch');
    const svgStyle      = this.mergeStyles ('svg');
    const hoverStyle    = this.mergeStyles ('hover');
    const contentStyle  = this.mergeStyles ('content');
    const dragZoneStyle = this.mergeStyles ('dragZoneStyle');

    if (warning && warning !== '') {  // pick under drop ?
      shapeStyle.fill = this.props.theme.palette.ticketWarningBackground;
    }
    if (this.getHover ()) {
      shapeStyle.fill = emphasize (shapeStyle.fill, 0.1);
    }

    if (this.getTransit ()) {
      hoverStyle.fill = this.props.theme.palette.ticketTransitHover;
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
    const htmlHatch = (hatch === 'true') ? (
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
        disabled      = {disabled}
        style         = {boxStyle}
        data-id       = {data.id}
        data-owner-id = {data.OwnerId}
        >
        {htmlShadow}
        {htmlShape}
        {htmlHatch}
        {htmlHover}
        <div style = {contentStyle}>
          {this.props.children}
        </div>
        <div
          onMouseOver       = {() => this.mouseIn ()}
          onMouseOut        = {() => this.mouseOut ()}
          onMouseUp         = {event => this.mouseUp (event)}
          style             = {dragZoneStyle}
          data-drag-handle  = {dragHandle}
          data-drag-invalid = {noDrag === 'true'}
          />
      </div>
    );
  }

  renderRect () {
    const {state}  = this.props;
    const disabled = Action.isDisabled (state);
    const dragHandle = this.read ('drag-handle');
    const noDrag     = this.read ('no-drag');
    const data       = this.read ('data');
    const hatch      = this.read ('hatch');
    const warning    = this.read ('warning');

    const rectShadowStyle       = this.mergeStyles ('rectShadow');
    const rectStyle             = this.mergeStyles ('rect');
    const rectHoverStyle        = this.mergeStyles ('rectHover');
    const contentStyle          = this.mergeStyles ('content');
    const rectContentHatchStyle = this.mergeStyles ('rectContentHatch');
    const dragZoneStyle         = this.mergeStyles ('dragZoneStyle');

    if (warning && warning !== '') {  // pick under drop ?
      rectStyle.backgroundColor = this.props.theme.palette.ticketWarningBackground;
    }
    if (this.getHover ()) {
      rectStyle.backgroundColor = emphasize (rectStyle.backgroundColor, 0.1);
    }

    if (this.getTransit ()) {
      rectHoverStyle.borderColor = this.props.theme.palette.ticketTransitHover;
    }

    return (
      <div
        style         = {rectShadowStyle}
        data-id       = {data.id}
        data-owner-id = {data.OwnerId}
        >
        <div
          disabled = {disabled}
          style    = {rectStyle}
          >
          <div style = {hatch === 'true' ? rectContentHatchStyle : contentStyle}>
            {this.props.children}
          </div>
          <div
            onMouseOver       = {() => this.mouseIn ()}
            onMouseOut        = {() => this.mouseOut ()}
            onMouseUp         = {event => this.mouseUp (event)}
            style             = {this.getHover () || this.getLink () ? rectHoverStyle : dragZoneStyle}
            data-drag-handle  = {dragHandle}
            data-drag-invalid = {noDrag === 'true'}
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
