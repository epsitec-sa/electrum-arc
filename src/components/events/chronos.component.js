'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Converters from '../polypheme/converters';
import {Unit} from 'electrum-theme';

import {
  Chrono,
  ChronoLabel,
  ChronoEvent,
  Label,
  Button,
  Splitter
} from '../../all-components.js';

/******************************************************************************/

function getFlatData (data, theme) {
  console.log ('Chronos.getFlatData');
  const lines = [];
  const dates = new Map ();
  var lastDate = null;
  var pos = 0;
  for (var event of data.Events) {
    if (!lastDate || lastDate !== event.FromDate) {
      if (lastDate) {
        lines.push ({type: 'sep', pos: pos});
        pos += Unit.parse (theme.shapes.chronosSeparatorHeight).value;
      }
      lines.push ({type: 'top', pos: pos, date: event.FromDate});
      pos += Unit.parse (theme.shapes.chronosTopHeight).value;
      lastDate = event.FromDate;
    }
    lines.push ({type: 'event', pos: pos, event: event});
    pos += Unit.parse (theme.shapes.chronosLineHeight).value;

    if (!dates.has (event.FromDate)) {
      dates.set (event.FromDate, null);
    }
  }
  const d = [];
  for (var date of dates.keys ()) {
    d.push (date);
  }
  return {dates: d, lines: lines};
}

function getFlatPos (flatData, date) {
  for (var item of flatData.lines) {
    if (item.type === 'top' && item.date === date) {
      return item.pos;
    }
  }
  return -1;
}

function getFlatDate (flatData, pos) {
  for (var item of flatData.lines) {
    if (item.pos >= pos) {
      if (item.type === 'top') {
        return item.date;
      } else if (item.type === 'event') {
        return item.event.FromDate;
      }
    }
  }
  return null;
}

/******************************************************************************/

function UpdateHover (event, state) {
  for (let c of window.document.chronoLabels) {
    if (c.props.event === event) {
      c.setHover (state);
    }
  }
  for (let c of window.document.chronoEvents) {
    if (c.props.event === event) {
      c.setHover (state);
    }
  }
}

/******************************************************************************/

export default class Chronos extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      scale:         1,
      verticalPos:   0,
      horizontalPos: 0,
      showingDate:   null,
      splitterWidth: '10%',
      eventHover:    null,
    };
  }

  getScale () {
    return this.state.scale;
  }

  setScale (value) {
    this.setState ( {
      scale: value
    });
  }

  getVerticalPos () {
    return this.state.verticalPos;
  }

  setVerticalPos (value) {
    this.setState ( {
      verticalPos: value
    });
  }

  getHorizontalPos () {
    return this.state.horizontalPos;
  }

  setHorizontalPos (value) {
    this.setState ( {
      horizontalPos: value
    });
  }

  getShowingDate () {
    return this.state.showingDate;
  }

  setShowingDate (value) {
    this.setState ( {
      showingDate: value
    });
  }

  getSplitterWidth () {
    return this.state.splitterWidth;
  }

  setSplitterWidth (value) {
    this.setState ( {
      splitterWidth: value
    });
  }

  getEventHover () {
    return this.state.eventHover;
  }

  setEventHover (value) {
    this.setState ( {
      eventHover: value
    });
  }

  /******************************************************************************/

  componentWillMount () {
    const data = this.read ('data');
    this.flatData = getFlatData (data, this.props.theme);
    this.changeVerticalPos (0);

    // const node = ReactDOM.findDOMNode (this);
    // console.dir (node);
  }

  changeVerticalPos (pos) {
    const max = this.flatData.lines[this.flatData.lines.length - 1].pos - 100;
    pos = Math.max (pos, 0);
    pos = Math.min (pos, max);
    this.setVerticalPos (pos);
    this.setShowingDate (getFlatDate (this.flatData, pos));
  }

  changeHorizontalPos (pos) {
    const scale = this.getScale ();
    const max = (24 * 60 * scale) - 100;
    pos = Math.max (pos, 0);
    pos = Math.min (pos, max);
    this.setHorizontalPos (pos);
  }

  mouseDown (e) {
    // console.log ('Chronos.mouseDown');
    this.isMouseDown = true;
    this.mouseLastX = null;
    this.mouseLastY = null;
  }

  mouseMove (e) {
    // console.log ('Chronos.mouseMove');
    if (!this.isMouseDown) {
      return;
    }
    let x = e.clientX;
    let y = e.clientY;
    if (!x && e.touches.length > 0) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }
    if (!x || !y) {
      return;
    }

    if (this.mouseLastX) {
      const delta = x - this.mouseLastX;
      const pos = Math.max (this.getHorizontalPos () - delta, 0);
      this.changeHorizontalPos (pos);
    }
    if (this.mouseLastY) {
      const delta = y - this.mouseLastY;
      const pos = this.getVerticalPos () - delta;
      this.changeVerticalPos (pos);
    }
    this.mouseLastX = x;
    this.mouseLastY = y;
  }

  mouseUp (e) {
    // console.log ('Chronos.mouseUp');
    this.isMouseDown = false;
  }

  mouseWheel (e) {
    if (e.shiftKey) {
      var scale = this.getScale ();
      if (e.deltaY > 0) {
        scale *= 1.1;
      }
      if (e.deltaY < 0) {
        scale /= 1.1;
      }
      scale = Math.max (scale, 0.5);
      scale = Math.min (scale, 10);
      this.setScale (scale);
    } else {
      if (e.deltaY !== 0) {
        const delta = e.deltaY / 5;
        const pos = this.getVerticalPos () + delta;
        this.changeVerticalPos (pos);
      }
      if (e.deltaX !== 0) {
        const delta = e.deltaX / 5;
        const pos = this.getHorizontalPos () + delta;
        this.changeHorizontalPos (pos);
      }
    }
  }

  mouseOver (event) {
    UpdateHover (event, !this.isMouseDown);
  }

  mouseOut (event) {
    UpdateHover (event, false);
  }

  /******************************************************************************/

  actionDate (date) {
    console.log ('Chronos.actionDate ' + date);
    const pos = getFlatPos (this.flatData, date);
    if (pos !== -1) {
      this.changeVerticalPos (pos);
    }
  }

  actionScale (scale) {
    this.setScale (scale);
  }

  /******************************************************************************/

  renderNavigationButton (text, tooltip, active, action) {
    return (
      <Button
        kind    = 'chronos-navigator'
        text    = {text}
        tooltip = {tooltip}
        border  = 'none'
        active  = {active ? 'true' : 'false'}
        action  = {() => action ()}
        {...this.link ()} />
    );
  }

  renderNavigationButtons () {
    const result = [];
    const showingDate = this.getShowingDate ();
    for (var date of this.flatData.dates) {
      const x = date;  // necessary, but strange !
      const text    = Converters.getDisplayedDate (date);
      const tooltip = Converters.getDisplayedDate (date, false, 'Wdmy');
      result.push (this.renderNavigationButton (text, tooltip, showingDate === x, () => this.actionDate (x)));
    }
    return result;
  }

  renderNavigation () {
    const navigationStyle = this.mergeStyles ('navigation');

    return (
      <div style = {navigationStyle}>
        {this.renderNavigationButtons ()}
      </div>
    );
  }

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

  renderZone (start, end, odd) {
    const width = Unit.sub (end, start);
    const style = {
      position:        'absolute',
      top:             '0px',
      height:          '100%',
      left:            start,
      width:           width,
      backgroundColor: odd ? this.props.theme.palette.eventOddBackground : this.props.theme.palette.eventBackground,
    };
    return (
      <div style={style} ref={start} />
    );
  }

  renderGrid () {
    const result = [];
    const scale         = this.getScale ();
    const horizontalPos = this.getHorizontalPos ();
    for (var h = 0; h < 24 ; h++) {
      const odd   = (h % 2 === 1);
      const start = (((h + 0) * 60 * scale) - horizontalPos) + 'px';
      const end   = (((h + 1) * 60 * scale) - horizontalPos) + 'px';
      result.push (this.renderZone (start, end, odd));
    }
    return result;
  }

  renderTime (start, end, time, index) {
    const width = Unit.sub (end, start);
    const style = {
      position:        'absolute',
      top:             '0px',
      height:          '100%',
      left:            start,
      width:           width,
      backgroundColor: this.props.theme.palette.chronoDayBackground,
      userSelect:      'none',
    };
    const text = time ? Converters.getDisplayedTime (Converters.addSeconds (time, 1), false, 'h') : '';

    return (
      <div style={style} ref={index}>
        <Label text={text} justify='center' grow='1' height='100%' {...this.link ()} />
      </div>
    );
  }

  renderEvent (event, index) {
    const scale = this.getScale ();
    const from = Converters.getMinutes (event.FromTime) * scale;
    const   to = Converters.getMinutes (event.ToTime)   * scale;

    const s = this.props.theme.shapes.eventSeparator;
    const left   = from + 'px';
    const width  = (to - from) + 'px';
    const top    = s;
    const height = `calc(100% - ${Unit.multiply (s, 2)})`;

    return (
      <Chrono
        key    = {index}
        event  = {event}
        left   = {left}
        width  = {width}
        top    = {top}
        height = {height}
        {...this.link ()} />
    );
  }

  /******************************************************************************/

  renderLabelsContentDay (pos, date, index) {
    const lineStyle = this.mergeStyles ('labelTop');
    lineStyle.top = pos;

    const text = Converters.getDisplayedDate (date, false, 'Wdmy');

    return (
      <div style={lineStyle} ref={index}>
        <Label text={text} grow='1' {...this.link ()} />
      </div>
    );
  }

  renderLabelsContentEvent (verticalPos, event, index) {
    return (
      <ChronoLabel
        event       = {event}
        verticalPos = {verticalPos}
        mouseOver   = {() => this.mouseOver (event)}
        mouseOut    = {() => this.mouseOut (event)}
        {...this.link ()}/>
    );
  }

  renderLabelsContent () {
    const result = [];
    const verticalPos = this.getVerticalPos ();
    let index = 0;
    for (var item of this.flatData.lines) {
      if (item.pos >= verticalPos - 50) {
        const pos = (item.pos - verticalPos) + 'px';
        if (item.type === 'top') {
          result.push (this.renderLabelsContentDay (pos, item.date, index++));
        } else if (item.type === 'event') {
          result.push (this.renderLabelsContentEvent (pos, item.event, index++));
        }
        if (item.pos - verticalPos > 1000) {  // TODO !!!
          break;
        }
      }
    }
    return result;
  }

  renderLabels () {
    const labelsStyle = this.mergeStyles ('labels');

    return (
      <div style = {labelsStyle}>
        {this.renderLabelsContent ()}
      </div>
    );
  }

  /******************************************************************************/

  renderEventsContentDayLine (horizontalPos, firstTop) {
    const result = [];
    let index = 0;
    const scale = this.getScale ();
    for (var h = 0 ; h < 24; h++) {
      const start = (((h + 0) * 60 * scale) - horizontalPos) + 'px';
      const end   = (((h + 1) * 60 * scale) - horizontalPos) + 'px';
      const time = firstTop ? Converters.getTimeFromMinutes (h * 60) : null;
      result.push (this.renderTime (start, end, time, index++));
    }
    return result;
  }

  renderEventsContentDay (verticalPos, horizontalPos, firstTop, index) {
    const lineStyle = this.mergeStyles ('eventTop');
    lineStyle.top = verticalPos;

    return (
      <div style={lineStyle} ref={index}>
        {this.renderEventsContentDayLine (horizontalPos, firstTop)}
      </div>
    );
  }

  renderEventsContentEvent (verticalPos, horizontalPos, event, index) {
    const scale = this.getScale ();
    return (
      <ChronoEvent
        event         = {event}
        verticalPos   = {verticalPos}
        horizontalPos = {horizontalPos + 'px'}
        scale         = {scale}
        mouseOver     = {() => this.mouseOver (event)}
        mouseOut      = {() => this.mouseOut (event)}
        {...this.link ()}
        />
    );
  }

  renderEventsContent () {
    const result = [];
    const verticalPos   = this.getVerticalPos ();
    const horizontalPos = this.getHorizontalPos ();
    let firstTop = true;
    let index = 0;
    for (var item of this.flatData.lines) {
      if (item.pos >= verticalPos - 50) {
        const pos = (item.pos - verticalPos) + 'px';
        if (item.type === 'top') {
          result.push (this.renderEventsContentDay (pos, horizontalPos, firstTop, index++));
          firstTop = false;
        } else if (item.type === 'event') {
          result.push (this.renderEventsContentEvent (pos, horizontalPos, item.event, index++));
        }
        if (item.pos - verticalPos > 1000) {  // TODO !!!
          break;
        }
      }
    }
    return result;
  }

  renderEvents () {
    const eventsStyle = this.mergeStyles ('events');

    return (
      <div style = {eventsStyle}>
        {this.renderGrid ()}
        {this.renderEventsContent ()}
      </div>
    );
  }

  /******************************************************************************/

  render () {
    const mainStyle    = this.mergeStyles ('main');
    const contentStyle = this.mergeStyles ('content');

    return (
      <div style={mainStyle}>
        {this.renderNavigation ()}
        <div
          style        = {contentStyle}
          onMouseDown  = {e => this.mouseDown (e)}
          onMouseMove  = {e => this.mouseMove (e)}
          onMouseUp    = {e => this.mouseUp (e)}
          onWheel      = {e => this.mouseWheel (e)}
          onTouchStart = {e => this.mouseDown (e)}
          onTouchMove  = {e => this.mouseMove (e)}
          onTouchEnd   = {e => this.mouseUp (e)}
          >
          <Splitter
            kind          = 'vertical'
            first-view-id = 'view-backlog'
            last-view-id  = 'view-desk'
            default-size  = {this.getSplitterWidth ()} min-size='0px'
            onSizeChanged = {size => this.setSplitterWidth (size)}
            {...this.link ()} >
            {this.renderLabels ()}
            {this.renderEvents ()}
          </Splitter>
        </div>
      </div>
    );
  }
}

/******************************************************************************/
