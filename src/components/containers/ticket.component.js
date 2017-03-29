'use strict';

import React from 'react';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class Ticket extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover: false,
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

  get styleProps () {
    return {
      width:             this.read ('width'),
      height:            this.read ('height'),
      kind:              this.read ('kind'),
      shape:             this.read ('shape'),
      hoverShape:        this.read ('hover-shape'),
      type:              this.read ('type'),
      selected:          this.read ('selected'),
      color:             this.read ('color'),
      cursor:            this.read ('cursor'),
      verticalSpacing:   this.read ('vertical-spacing'),
      horizontalSpacing: this.read ('horizontal-spacing'),
      hideContent:       this.read ('hide-content'),
    };
  }

  mouseOver () {
    // Trace.log ('Ticket.mouseOver');
    this.setHover (true);
    const x = this.read ('mouse-over');
    if (x) {
      x ();
    }
  }

  mouseOut () {
    // Trace.log ('Ticket.mouseOut');
    this.setHover (false);
    const x = this.read ('mouse-out');
    if (x) {
      x ();
    }
  }

  mouseDown (e) {
    // Trace.log ('Ticket.mouseDown');
    const x = this.read ('mouse-down');
    if (x) {
      x (e);
    }
  }

  mouseUp (e) {
    // Trace.log ('Ticket.mouseUp');
    const x = this.read ('mouse-up');
    if (x) {
      x (e);
    }
  }

  renderBackgroundText () {
    const text = this.read ('background-text');
    if (text) {
      const backgroundTextStyle = this.mergeStyles ('backgroundText');
      return (
        <div style={backgroundTextStyle}>
          {text}
        </div>
      );
    } else {
      return null;
    }
  }

  renderHud () {
    const hudGlyph = this.read ('hud-glyph');
    const hudGlyphShadowStyle     = this.mergeStyles ('hudGlyphShadow');
    const hudGlyphShadowNoneStyle = this.mergeStyles ('hudGlyphShadowNone');
    const hudGlyphBoxStyle        = this.mergeStyles ('hudGlyphBox');
    const hudGlyphContentStyle    = this.mergeStyles ('hudGlyphContent');
    return (
      <div style={hudGlyph ? hudGlyphShadowStyle : hudGlyphShadowNoneStyle}>
        <div style={hudGlyphBoxStyle}>
          <i style={hudGlyphContentStyle} className={`fa fa-${hudGlyph}`} />
        </div>
      </div>
    );
  }

  renderTicket () {
    const hatch      = this.read ('hatch');
    const hoverShape = this.read ('hover-shape');

    const boxStyle     = this.mergeStyles ('box');
    const shadowStyle  = this.mergeStyles ('shadow');
    const shapeStyle   = this.mergeStyles ('shape');
    const hatchStyle   = this.mergeStyles ('hatch');
    const svgStyle     = this.mergeStyles ('svg');
    const hoverStyle   = this.mergeStyles ('hover');
    const contentStyle = this.mergeStyles ('content');

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
    const htmlHatch = hatch === 'true' ? (
      <svg width={w} height={h} style={hatchStyle}>
        <defs>
          <pattern id='hatch' x='0px' y='0px' width={ht} height={ht} patternTransform='rotate(45)' patternUnits='userSpaceOnUse'>
            <rect x='0px' y='0px' width={hs} height={ht} fill='#000' fillOpacity={this.props.theme.palette.ticketHatchOpacity} />
          </pattern>
        </defs>
        <path d={svgStyle.path} />
      </svg>
    ) : null;
    const htmlHover = hoverShape ? (
      <svg width={w} height={h} style={hoverStyle}>
        <path d={hoverStyle.path} />
      </svg>
    ) : null;

    return (
      <div
        style        = {boxStyle}
        onMouseOver  = {() => this.mouseOver ()}
        onMouseOut   = {() => this.mouseOut ()}
        onMouseDown  = {e => this.mouseDown (e)}
        onMouseUp    = {e => this.mouseUp (e)}
        onTouchStart = {e => this.mouseDown (e)}
        onTouchEnd   = {e => this.mouseUp (e)}
        >
        {htmlShadow}
        {htmlShape}
        {htmlHatch}
        {this.renderBackgroundText ()}
        {htmlHover}
        <div style = {contentStyle}>
          {this.props.children}
        </div>
        {this.renderHud ()}
      </div>
    );
  }

  renderRect () {
    const hatch      = this.read ('hatch');
    const hoverShape = this.read ('hover-shape');

    const rectShadowStyle       = this.mergeStyles ('rectShadow');
    const rectStyle             = this.mergeStyles ('rect');
    const rectEmptyStyle        = this.mergeStyles ('rectEmpty');
    const rectHoverStyle        = this.mergeStyles ('rectHover');
    const contentStyle          = this.mergeStyles ('content');
    const rectContentHatchStyle = this.mergeStyles ('rectContentHatch');

    return (
      <div
        style        = {rectShadowStyle}
        onMouseOver  = {() => this.mouseOver ()}
        onMouseOut   = {() => this.mouseOut ()}
        onMouseDown  = {e => this.mouseDown (e)}
        onMouseUp    = {e => this.mouseUp (e)}
        onTouchStart = {e => this.mouseDown (e)}
        onTouchEnd   = {e => this.mouseUp (e)}
        >
        <div style = {rectStyle}>
          <div style = {hatch === 'true' ? rectContentHatchStyle : contentStyle}>
            {this.renderBackgroundText ()}
            {this.props.children}
          </div>
          <div style = {hoverShape ? rectHoverStyle : rectEmptyStyle} />
        </div>
        {this.renderHud ()}
      </div>
    );
  }

  renderSubpane () {
    const rectStyle = this.mergeStyles (this.getHover () ? 'subpaneHoverRect' : 'subpaneRect');

    return (
      <div
        style        = {rectStyle}
        onMouseOver  = {() => this.mouseOver ()}
        onMouseOut   = {() => this.mouseOut ()}
        onMouseDown  = {e => this.mouseDown (e)}
        onMouseUp    = {e => this.mouseUp (e)}
        onTouchStart = {e => this.mouseDown (e)}
        onTouchEnd   = {e => this.mouseUp (e)}
        >
        {this.props.children}
      </div>
    );
  }

  renderCover () {
    const coverStyle        = this.mergeStyles ('cover');
    const coverContentStyle = this.mergeStyles ('coverContent');

    return (
      <div
        style        = {coverStyle}
        onMouseOver  = {() => this.mouseOver ()}
        onMouseOut   = {() => this.mouseOut ()}
        onMouseDown  = {e => this.mouseDown (e)}
        onMouseUp    = {e => this.mouseUp (e)}
        onTouchStart = {e => this.mouseDown (e)}
        onTouchEnd   = {e => this.mouseUp (e)}
        >
        <div style = {coverContentStyle}>
          {this.props.children}
        </div>
      </div>
    );
  }

  render () {
    const kind = this.read ('kind');
    if (kind === 'ticket') {
      return this.renderTicket ();
    } else if (kind === 'cover') {
      return this.renderCover ();
    } else if (kind === 'subpane') {
      return this.renderSubpane ();
    } else {  // 'rect' 'thin' 'event' ... ?
      return this.renderRect ();
    }
  }
}

/******************************************************************************/
