'use strict';

import React from 'react';
import {ColorManipulator} from 'electrum';
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
    const missionId = this.read ('mission-id');
    if (missionId) {
      for (var i = 0, len = window.document.tickets.length; i < len; i++) {
        const ticket = window.document.tickets[i];
        const m = ticket.read ('mission-id');
        const t = ticket.read ('type');
        if (missionId === m) {
          ticket.setLink (link);
          ticket.setTransit (t.endsWith ('-transit'));
        }
      }
    }
  }

  mouseOver () {
    // console.log ('Ticket.mouseOver');
    const isDragged = this.read ('isDragged');
    if (!isDragged) {
      this.setHover (true);
      this.setLinkToAll (true);
    }
  }

  mouseOut () {
    // console.log ('Ticket.mouseOut');
    this.setHover (false);
    this.setLinkToAll (false);
  }

  mouseDown (event) {
    console.log ('Ticket.mouseDown');
    const x = this.read ('mouse-down');
    if (x) {
      x (event);
    }
  }

  mouseUp (event) {
    console.log ('Ticket.mouseUp');
    const x = this.read ('mouse-up');
    if (x) {
      x (event);
    }
  }

  renderHud (hasHeLeft, isDragged) {
    if (!hasHeLeft || isDragged) {
      const hudGlyph = this.read ('hud-glyph');
      const hudGlyphShadowStyle     = this.mergeStyles ('hudGlyphShadow');
      const hudGlyphShadowNoneStyle = this.mergeStyles ('hudGlyphShadowNone');
      const hudGlyphBoxStyle        = this.mergeStyles ('hudGlyphBox');
      const hudGlyphBoxNoneStyle    = this.mergeStyles ('hudGlyphBoxNone');
      const hudGlyphContentStyle    = this.mergeStyles ('hudGlyphContent');
      return (
        <div style={hudGlyph ? hudGlyphShadowStyle : hudGlyphShadowNoneStyle}>
          <div style={hudGlyph ? hudGlyphBoxStyle : hudGlyphBoxNoneStyle}>
            <i style={hudGlyphContentStyle} className={`fa fa-${hudGlyph}`} />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  renderTicket () {
    const status    = this.read ('status');
    const flash     = this.read ('flash') === 'true';
    const warning   = this.read ('warning');
    const hasHeLeft = this.read ('hasHeLeft');
    const isDragged = this.read ('isDragged');
    const selected  = this.read ('selected');

    const boxStyle     = this.mergeStyles ('box');
    const shadowStyle  = this.mergeStyles ('shadow');
    const shapeStyle   = this.mergeStyles ('shape');
    const hatchStyle   = this.mergeStyles ('hatch');
    const svgStyle     = this.mergeStyles ('svg');
    const hoverStyle   = this.mergeStyles ('hover');
    const contentStyle = this.mergeStyles ('content');

    const hatch       = status === 'dispatched' || status === 'delivered';
    const hoverOrLink = (this.getHover () || this.getLink ()) && !hasHeLeft && !isDragged;

    if (hasHeLeft && !isDragged) {
      shadowStyle.fill = this.props.theme.palette.ticketDragAndDropShadow;
      shapeStyle.opacity = 0;
      contentStyle.visibility = 'hidden';
    }

    if (flash && !isDragged) {
      shapeStyle.fill = this.props.theme.palette.ticketFlashBackground;
    }
    if (status === 'delivered') {
      shapeStyle.fill = this.props.theme.palette.ticketDeliveredBackground;
    }
    if (warning && !isDragged) {  // pick under drop ?
      shapeStyle.fill = this.props.theme.palette.ticketWarningBackground;
    }
    if (this.getHover () && !isDragged) {
      shapeStyle.fill = emphasize (shapeStyle.fill, 0.1);
    }
    if (selected === 'true' && !isDragged) {
      shapeStyle.fill = emphasize (shapeStyle.fill, 0.3);
    }

    if (this.getTransit () && !isDragged) {
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
    const htmlHatch = hatch ? (
      <svg width={w} height={h} style={hatchStyle}>
        <defs>
          <pattern id='hatch' x='0px' y='0px' width={ht} height={ht} patternTransform='rotate(45)' patternUnits='userSpaceOnUse'>
            <rect x='0px' y='0px' width={hs} height={ht} fill='#000' fillOpacity={this.props.theme.palette.ticketHatchOpacity} />
          </pattern>
        </defs>
        <path d={svgStyle.path} />
      </svg>
    ) : null;
    const htmlHover = hoverOrLink ? (
      <svg width={w} height={h} style={hoverStyle}>
        <path d={hoverStyle.path} />
      </svg>
    ) : null;

    return (
      <div
        style       = {boxStyle}
        onMouseOver = {() => this.mouseOver ()}
        onMouseOut  = {() => this.mouseOut ()}
        onMouseDown = {event => this.mouseDown (event)}
        onMouseUp   = {event => this.mouseUp (event)}
        >
        {htmlShadow}
        {htmlShape}
        {htmlHatch}
        {htmlHover}
        <div style = {contentStyle}>
          {this.props.children}
        </div>
        {this.renderHud (hasHeLeft, isDragged)}
      </div>
    );
  }

  renderRect () {
    const status    = this.read ('status');
    const flash     = this.read ('flash') === 'true';
    const warning   = this.read ('warning');
    const hasHeLeft = this.read ('hasHeLeft');
    const isDragged = this.read ('isDragged');
    const selected  = this.read ('selected');

    const rectShadowStyle       = this.mergeStyles ('rectShadow');
    const rectStyle             = this.mergeStyles ('rect');
    const rectEmptyStyle        = this.mergeStyles ('rectEmpty');
    const rectHoverStyle        = this.mergeStyles ('rectHover');
    const contentStyle          = this.mergeStyles ('content');
    const rectContentHatchStyle = this.mergeStyles ('rectContentHatch');

    const hatch       = status === 'dispatched' || status === 'delivered';
    const hoverOrLink = (this.getHover () || this.getLink ()) && !hasHeLeft && !isDragged;

    if (hasHeLeft && !isDragged) {
      rectShadowStyle.backgroundColor = this.props.theme.palette.ticketDragAndDropShadow;
      rectStyle.opacity = 0;
      contentStyle.visibility = 'hidden';
    }

    if (flash && !isDragged) {
      rectStyle.backgroundColor = this.props.theme.palette.ticketFlashBackground;
    }
    if (status === 'delivered') {
      rectStyle.backgroundColor = this.props.theme.palette.ticketDeliveredBackground;
    }
    if (warning && !isDragged) {  // pick under drop ?
      rectStyle.backgroundColor = this.props.theme.palette.ticketWarningBackground;
    }
    if (this.getHover () && !isDragged) {
      rectStyle.backgroundColor = emphasize (rectStyle.backgroundColor, 0.1);
    }
    if (selected === 'true' && !isDragged) {
      rectStyle.backgroundColor = emphasize (rectStyle.backgroundColor, 0.3);
    }

    if (this.getTransit () && !isDragged) {
      rectHoverStyle.borderColor = this.props.theme.palette.ticketTransitHover;
    }

    return (
      <div
        style       = {rectShadowStyle}
        onMouseOver = {() => this.mouseOver ()}
        onMouseOut  = {() => this.mouseOut ()}
        onMouseDown = {event => this.mouseDown (event)}
        onMouseUp   = {event => this.mouseUp (event)}
        >
        <div style = {rectStyle}>
          <div style = {hatch ? rectContentHatchStyle : contentStyle}>
            {this.props.children}
          </div>
          <div style = {hoverOrLink ? rectHoverStyle : rectEmptyStyle} />
        </div>
        {this.renderHud (hasHeLeft, isDragged)}
      </div>
    );
  }

  render () {
    const kind = this.read ('kind');
    if (kind === 'ticket') {
      return this.renderTicket ();
    } else {
      return this.renderRect ();
    }
  }
}

/******************************************************************************/
