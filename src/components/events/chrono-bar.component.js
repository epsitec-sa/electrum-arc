'use strict';

import React from 'react';
import {Unit} from 'electrum-theme';
import {Label} from '../../all-components.js';

/******************************************************************************/

export default class ChronoBar extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      startFrom: this.read ('startFrom'),
      endFrom:   this.read ('endFrom'),
      startTo:   this.read ('startTo'),
      endTo:     this.read ('endTo'),
      top:       this.read ('top'),
      height:    this.read ('height'),
    };
  }

  renderVerticalLine (x, color) {
    const style = this.mergeStyles ('mainDistinct');
    style.left            = `calc(${x} - 1px)`;
    style.width           = '2px';
    style.backgroundColor = color;

    return (
      <div style={style} />
    );
  }

  renderThin (dotStyle, x, color) {
    const result = [];
    const style = this.mergeStyles (dotStyle);
    result.push ((<div style={style} />));
    result.push (this.renderVerticalLine (x, color));
    return result;
  }

  renderDot () {
    const tricolor = this.read ('tricolor');
    if (tricolor === 'false') {
      const startFrom = this.read ('startFrom');
      const endTo     = this.read ('endTo');
      if (startFrom === endTo) {
        return this.renderThin ('dot', startFrom, this.props.theme.palette.chronoEventMainBackground);
      }
    }
    return null;
  }

  renderFromDot () {
    const tricolor = this.read ('tricolor');
    if (tricolor === 'true') {
      const startFrom = this.read ('startFrom');
      const endFrom   = this.read ('endFrom');
      if (startFrom === endFrom) {
        return this.renderThin ('fromDot', startFrom, this.props.theme.palette.chronoEventStartBackground);
      }
    }
    return null;
  }

  renderToDot () {
    const tricolor = this.read ('tricolor');
    if (tricolor === 'true') {
      const startTo   = this.read ('startTo');
      const endTo     = this.read ('endTo');
      if (startTo === endTo) {
        return this.renderThin ('toDot', startTo, this.props.theme.palette.chronoEventEndBackground);
      }
    }
    return null;
  }

  // If hover. draw a 'tooltip' on the right side of bar.
  renderLeftTooltip (hover) {
    if (hover) {
      const tooltip = this.read ('leftTooltip');
      const style = this.mergeStyles ('leftTooltip');
      return (
        <div style={style}>
          <Label text={tooltip} wrap='no' {...this.link ()} />
        </div>
      );
    } else {
      return null;
    }
  }

  // If hover. draw a 'tooltip' on the right side of bar.
  renderRightTooltip (hover) {
    if (hover) {
      const tooltip = this.read ('rightTooltip');
      const style = this.mergeStyles ('rightTooltip');
      return (
        <div style={style}>
          <Label text={tooltip} wrap='no' {...this.link ()} />
        </div>
      );
    } else {
      return null;
    }
  }

  renderStart (styleName, hover) {
    const style = this.mergeStyles (styleName);
    return (
      <div style = {style} {...this.link ()}>
        {this.renderLeftTooltip (hover === 'true')}
      </div>
    );
  }

  renderMain () {
    const tricolor = this.read ('tricolor');
    const style = this.mergeStyles (tricolor === 'true' ? 'middleDistinct' : 'mainDistinct');
    return (
      <div style = {style} {...this.link ()} />
    );
  }

  renderEnd (styleName, hover) {
    const style = this.mergeStyles (styleName);
    return (
      <div style = {style} {...this.link ()}>
        {this.renderRightTooltip (hover === 'true')}
      </div>
    );
  }

  renderDistinct () {
    const hover = this.read ('hover');
    return (
      <div>
        {this.renderMain ()}
        {this.renderStart ('startDistinct', hover)}
        {this.renderEnd ('endDistinct', hover)}
        {this.renderDot ()}
        {this.renderFromDot ()}
        {this.renderToDot ()}
      </div>
    );
  }

  renderOverlap () {
    const hover = this.read ('hover');

    const topStyle    = this.mergeStyles ('topOverlap');
    const bottomStyle = this.mergeStyles ('bottomOverlap');

    return (
      <div>
        {this.renderStart ('startOverlap', hover)}
        <div style = {topStyle}    {...this.link ()} />
        <div style = {bottomStyle} {...this.link ()} />
        {this.renderEnd ('endOverlap', hover)}
        {this.renderDot ()}
        {this.renderFromDot ()}
        {this.renderToDot ()}
      </div>
    );
  }

  render () {
    const endFrom = this.read ('endFrom');
    const startTo = this.read ('startTo');

    const a = Unit.parse (endFrom).value;
    const b = Unit.parse (startTo).value;

    if (a <= b) {
      return this.renderDistinct ();
    } else {
      return this.renderOverlap ();
    }
  }
}

/******************************************************************************/
