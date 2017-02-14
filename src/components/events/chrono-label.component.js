'use strict';

import React from 'react';
import {Label} from '../../all-components.js';

/******************************************************************************/

function getGlyph (note) {
  if (note.Glyphs && note.Glyphs.length > 0) {
    return note.Glyphs[0].Glyph;
  } else {
    return null;
  }
}

/******************************************************************************/

export default class ChronoLabel extends React.Component {

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

  /******************************************************************************/

  componentDidMount () {
    if (!window.document.chronoLabels) {
      window.document.chronoLabels = [];
    }
    window.document.chronoLabels.push (this);
  }

  componentWillUnmount () {
    const index = window.document.chronoLabels.indexOf (this);
    if (index !== -1) {
      window.document.chronoLabels.splice (index, 1);
    }
  }

  mouseOver (event) {
    const mouseOver = this.read ('mouseOver');
    if (mouseOver) {
      mouseOver (event);
    }
  }

  mouseOut (event) {
    const mouseOut = this.read ('mouseOut');
    if (mouseOut) {
      mouseOut (event);
    }
  }

  /******************************************************************************/

  renderLine (top, width) {
    const style = {
      position:        'absolute',
      top:             top,
      height:          '1px',
      left:            '0px',
      width:           width,
      backgroundColor: this.props.theme.palette.chronoLineSeparator,
    };
    return (
      <div style={style} />
    );
  }

  render () {
    const event = this.read ('event');

    const glyph = getGlyph (event.Note);
    const text  = event.Note.Content;

    const styleName = this.getHover () ? 'hoverLine' : 'line';
    const lineStyle = this.mergeStyles (styleName);

    return (
      <div
        style       = {lineStyle}
        onMouseOver = {() => this.mouseOver (event)}
        onMouseOut  = {() => this.mouseOut (event)}
        >
        {this.renderLine (this.props.theme.shapes.chronosLineHeight, '100%')}
        <Label glyph={glyph} width='30px' {...this.link ()} />
        <Label text={text} grow='1' wrap='no' {...this.link ()} />
      </div>
    );
  }
}

/******************************************************************************/
