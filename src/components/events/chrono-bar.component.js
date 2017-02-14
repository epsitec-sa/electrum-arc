'use strict';

import React from 'react';
import Converters from '../polypheme/converters';

/******************************************************************************/

export default class ChronoBar extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover: false,
    };
  }

  get styleProps () {
    return {
      left:   this.read ('left'),
      width:  this.read ('width'),
      top:    this.read ('top'),
      height: this.read ('height'),
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
    this.setHover (true);
  }

  mouseOut () {
    this.setHover (false);
  }

  getTooltip (event) {
    const f = Converters.getDisplayedTime (event.FromTime);
    const t = Converters.getDisplayedTime (event.ToTime);
    const n = event.Note.Content ? event.Note.Content : '(vide)';
    return f + ' — ' + t + ' : ' + n;
  }

  render () {
    const event = this.read ('event');

    const note = event.Note;
    let glyph = null;
    if (note.Glyphs && note.Glyphs.length > 0) {
      glyph = note.Glyphs[0].Glyph;
    }

    const style = this.mergeStyles (this.getHover () ? 'hover' : 'base');
    // const style = this.mergeStyles ('base');

    return (
      <div
        style       = {style}
        title       = {this.getTooltip (event)}
        onMouseOver = {() => this.mouseOver ()}
        onMouseOut  = {() => this.mouseOut ()}
        {...this.link ()} />
    );
  }
}

/******************************************************************************/
