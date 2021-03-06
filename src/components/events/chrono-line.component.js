/* global window */

import {React} from 'electrum';
import {ChronoLabel, ChronoEvent} from '../../all-components.js';

/******************************************************************************/

export default class ChronoLine extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover: false,
    };
  }

  get hover () {
    return this.state.hover;
  }

  set hover (value) {
    this.setState ( {
      hover: value
    });
  }

  get styleProps () {
    return {
      lineWidth:  this.read ('lineWidth'),
      notesCount: this.read ('notesCount'),
    };
  }

  /******************************************************************************/

  componentDidMount () {
    if (!window.document.chronoLines) {
      window.document.chronoLines = [];
    }
    window.document.chronoLines.push (this);
  }

  componentWillUnmount () {
    const index = window.document.chronoLines.indexOf (this);
    if (index !== -1) {
      window.document.chronoLines.splice (index, 1);
    }
  }

  onMyMouseOver () {
    const x = this.read ('mouseOver');
    if (x) {
      const event = this.read ('event');
      x (event);
    }
  }

  onMyMouseOut () {
    const x = this.read ('mouseOut');
    if (x) {
      const event = this.read ('event');
      x (event);
    }
  }

  /******************************************************************************/

  renderLabel (note, isDragged, hasHeLeft, index) {
    const lineWidth  = this.read ('lineWidth');
    const glyphWidth = this.read ('glyphWidth');
    return (
      <ChronoLabel
        index      = {index}
        isDragged  = {isDragged}
        hasHeLeft  = {hasHeLeft}
        note       = {note}
        lineWidth  = {lineWidth}
        glyphWidth = {glyphWidth}
        mouseOver  = {this.onMyMouseOver}
        mouseOut   = {this.onMyMouseOut}
        {...this.link ()}/>
    );
  }

  renderLabels (event, isDragged, hasHeLeft) {
    const result = [];
    const notesCount = this.read ('notesCount');
    let index = 0;
    if (event.Note) {  // only one note ?
      result.push (this.renderLabel (event.Note, isDragged, hasHeLeft, index++));
    } else if (event.Notes) {  // collection of notes ?
      for (var note of event.Notes) {
        result.push (this.renderLabel (note, isDragged, hasHeLeft, index++));
      }
    }
    const len = notesCount - index;
    for (let i = 0; i < len; i++) {
      result.push (this.renderLabel (null, isDragged, hasHeLeft, index++));
    }
    return result;
  }

  render () {
    const index     = this.read ('index');
    const event     = this.read ('event');
    const minHour   = this.read ('minHour');
    const maxHour   = this.read ('maxHour');
    const isDragged = this.props.isDragged;
    const hasHeLeft = this.props.hasHeLeft;
    // Trace.log ('ChronoLine ' + isDragged + ' ' + hasHeLeft);

    const hover = !isDragged && this.hover;
    const cursor = isDragged ? 'move' : 'default';

    let styleName = hover ? 'lineHover' : 'line';
    if (isDragged) {
      styleName = 'lineDragged';
    }
    const lineStyle      = this.mergeStyles (styleName);
    const lineLabelStyle = this.mergeStyles ('lineLabel');
    const lineEventStyle = this.mergeStyles ('lineEvent');

    lineStyle.cursor = cursor;

    return (
      <div style={lineStyle} key={index}>
        <div style={lineLabelStyle} key='label'>
          {this.renderLabels (event, isDragged, hasHeLeft)}
        </div>
        <div style={lineEventStyle} key='event'>
          <ChronoEvent
            event     = {event}
            isDragged = {isDragged}
            hasHeLeft = {hasHeLeft}
            minHour   = {minHour}
            maxHour   = {maxHour}
            mouseOver = {this.onMyMouseOver}
            mouseOut  = {this.onMyMouseOut}
            {...this.link ()}/>
        </div>
      </div>
    );
  }
}

/******************************************************************************/
