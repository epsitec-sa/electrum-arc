'use strict';

import React from 'react';
import {Label} from '../../all-components.js';

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

  /******************************************************************************/

  renderGlyph (glyph) {
    if (glyph.startsWith ('bookmark-')) {
      const color = glyph.substring (9);
      return (
        <Label glyph='bookmark' glyph-color={color} spacing='compact' {...this.link ()} />
      );
    } else {
      return (
        <Label glyph={glyph} spacing='compact' {...this.link ()} />
      );
    }
  }

  renderGlyphs (event) {
    const result = [];
    for (var glyph of event.Note.Glyphs) {
      result.push (this.renderGlyph (glyph.Glyph));
    }
    return result;
  }

  render () {
    const event = this.read ('event');

    const text = event.Note.Content;

    const styleName = this.getHover () ? 'lineHover' : 'line';
    const lineStyle = this.mergeStyles (styleName);
    const glyphsStyle = this.mergeStyles ('glyphs');

    return (
      <div style={lineStyle}>
        <Label text='' width={this.props.theme.shapes.chronosLabelMargin} {...this.link ()} />
          <div style={glyphsStyle}>
            {this.renderGlyphs (event)}
          </div>
        <Label text={text} grow='1' wrap='no' {...this.link ()} />
      </div>
    );
  }
}

/******************************************************************************/
