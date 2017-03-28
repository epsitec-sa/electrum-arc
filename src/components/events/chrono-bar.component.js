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
      color:     this.read ('color'),
    };
  }

  renderThin (dotStyleName, lineStyleName) {
    const result = [];
    const dotStyle  = this.mergeStyles (dotStyleName);
    const lineStyle = this.mergeStyles (lineStyleName);
    result.push ((<div style={dotStyle}  key='dot'  />));
    result.push ((<div style={lineStyle} key='line' />));
    return result;
  }

  renderDot () {
    const tricolor = this.read ('tricolor');
    if (tricolor === 'false') {
      const startFrom = this.read ('startFrom');
      const endTo     = this.read ('endTo');
      if (startFrom === endTo) {
        return this.renderThin ('dot', 'line');
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
        return this.renderThin ('fromDot', 'fromLine');
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
        return this.renderThin ('toDot', 'toLine');
      }
    }
    return null;
  }

  // If hover. draw a 'tooltip' on the right side of bar.
  renderLeftTooltip (hover) {
    const isDragged = this.read ('isDragged');
    if (!isDragged && hover) {
      const tooltip = this.read ('leftTooltip');
      const style = this.mergeStyles ('leftTooltip');
      return (
        <div style={style} key='leftTooltip'>
          <Label text={tooltip} wrap='stretch' {...this.link ()} />
        </div>
      );
    } else {
      return null;
    }
  }

  // If hover. draw a 'tooltip' on the right side of bar.
  renderRightTooltip (hover) {
    const isDragged = this.read ('isDragged');
    if (!isDragged && hover) {
      const tooltip = this.read ('rightTooltip');
      const style = this.mergeStyles ('rightTooltip');
      return (
        <div style={style} key='rightTooltip'>
          <Label text={tooltip} wrap='stretch' {...this.link ()} />
        </div>
      );
    } else {
      return null;
    }
  }

  renderStart (styleName, hover) {
    const style = this.mergeStyles (styleName);
    return (
      <div style={style} key='start'>
        {this.renderLeftTooltip (hover === 'true')}
      </div>
    );
  }

  renderMain () {
    const tricolor = this.read ('tricolor');
    const style = this.mergeStyles (tricolor === 'true' ? 'middleDistinct' : 'mainDistinct');
    return (
      <div style={style} key='main'/>
    );
  }

  renderEnd (styleName, hover) {
    const style = this.mergeStyles (styleName);
    return (
      <div style={style} key='end'>
        {this.renderRightTooltip (hover === 'true')}
      </div>
    );
  }

  renderDistinct () {
    const hover = this.read ('hover');
    return (
      <div key='bar'>
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
      <div key='bar'>
        {this.renderStart ('startOverlap', hover)}
        <div style={topStyle}    key='top'    />
        <div style={bottomStyle} key='bottom' />
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
