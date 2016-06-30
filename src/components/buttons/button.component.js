'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Unit} from 'electrum-theme';
import {Badge} from 'electrum-arc';

/******************************************************************************/

export default class Button extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      glyph:         this.read ('glyph'),
      text:          this.read ('text'),
      border:        this.read ('border'),
      glyphPosition: this.read ('glyph-position'),
      spacing:       this.read ('spacing'),
      grow:          this.read ('grow'),
      width:         this.read ('width'),
      kind:          this.read ('kind'),
      nature:        this.read ('nature'),
      place:         this.read ('place'),
      active:        this.read ('active'),
      badgeValue:    this.read ('badge-value'),
      justify:       this.read ('justify'),
      shape:         this.read ('shape'),
    };
  }

  render () {
    const {state, theme} = this.props;
    const disabled = Action.isDisabled (state);
    const inputKind          = this.read ('kind');
    const inputActive        = this.read ('active');
    const inputGlyph         = this.read ('glyph');
    const inputRotate        = this.read ('rotate');
    const inputFlip          = this.read ('flip');
    const inputSpin          = this.read ('spin');
    const inputText          = this.read ('text');
    const inputGlyphPosition = this.read ('glyph-position');
    const inputBadgeValue    = this.read ('badge-value');
    const inputTooltip       = this.read ('tooltip');

    const boxStyle   = this.mergeStyles ('box');
    const glyphStyle = this.mergeStyles ('glyph');
    const textStyle  = this.mergeStyles ('text');

    const htmlText = (
      <label key='text' style={textStyle}>
        {inputText}
      </label>
    );

    const renderSpin = inputSpin ? 'fa-spin' : '';
    const htmlGlyph = (
      <i key='icon'
        style={glyphStyle}
        className={`fa
        fa-${inputGlyph}
        fa-rotate-${inputRotate}
        fa-flip-${inputFlip}
        ${renderSpin}`}
      />
    );

    const htmlBadge = inputBadgeValue ? (
      <Badge
        value={inputBadgeValue}
        layer='over'
        {...this.link ()}
      />
    ) : null;

    let htmlTriangle = null;
    if (inputKind === 'main-tab' && inputActive === 'true') {
      if (false) {
        // Generate a triangle with svg graphics, see:
        // http://www.w3schools.com/svg/svg_polygon.asp
        const triangleStyle = {
          position: 'absolute',
          right:    '0px',
          top:      '0px',
        };
        const w  = boxStyle.width;
        const h  = boxStyle.height;
        const d  = theme.shapes.mainTabTriangleSize;
        const x2 = Unit.multiply (w, 0.5);
        const x1 = Unit.sub (x2, d);
        const y2 = Unit.sub (h,  d);
        const x3 = Unit.add (x2, d);
        const p  = (x1 + h + x2 + y2 + x3 + h).replace (/px/g, ' ');
        htmlTriangle = (
          <svg width={w} height={h} style={triangleStyle}>
            <polygon points={p} fill={theme.palette.viewTabBackground}/>
          </svg>
        );
      } else {
        // Generate a triangle with subtle css, see:
        // https://css-tricks.com/snippets/css/css-triangle/
        const d = theme.shapes.mainTabTriangleSize;
        const triangleStyle = {
          position:     'absolute',
          right:        '50%',
          bottom:       '0px',
          borderLeft:   d + ' solid transparent',
          borderRight:  d + ' solid transparent',
          borderBottom: d + ' solid ' + theme.palette.viewTabBackground,
        };
        htmlTriangle = (
          <div style={triangleStyle} />
        );
      }
    }

    const layout = () => {
      if (inputGlyph) {
        if (inputText) {
          if (inputGlyphPosition === 'right') {
            return [htmlText, htmlGlyph];
          } else {
            return [htmlGlyph, htmlText];
          }
        } else {
          return [htmlGlyph];
        }
      } else {
        return [htmlText];
      }
    };

    return (
      <div
        onClick={this.onClick}
        disabled={disabled}
        style={boxStyle}
        title={inputTooltip}
        {...this.props}
      >
        {layout ().map ((comp) => comp)}
        {htmlTriangle}
        {htmlBadge}
      </div>
    );
  }
}

/******************************************************************************/
