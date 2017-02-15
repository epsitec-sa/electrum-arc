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
  const result = [];
  var lastDate = null;
  var pos = 0;
  for (var event of data.Events) {
    if (!lastDate || lastDate !== event.FromDate) {
      if (lastDate) {
        result.push ({type: 'sep', pos: pos});
        pos += Unit.parse (theme.shapes.chronosSeparatorHeight).value;
      }
      result.push ({type: 'top', pos: pos, date: event.FromDate});
      pos += Unit.parse (theme.shapes.chronosTopHeight).value;
      lastDate = event.FromDate;
    }
    result.push ({type: 'event', pos: pos, event: event});
    pos += Unit.parse (theme.shapes.chronosLineHeight).value;
  }
  return result;
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
      shoingPos:     0,
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

  getShoingPos () {
    return this.state.shoingPos;
  }

  setShoingPos (value) {
    this.setState ( {
      shoingPos: value
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

    // const node = ReactDOM.findDOMNode (this);
    // console.dir (node);

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
    if (this.mouseLastY) {
      const delta = y - this.mouseLastY;
      const pos = Math.max (this.getShoingPos () - delta, 0);
      this.setShoingPos (pos);
    }
    this.mouseLastX = x;
    this.mouseLastY = y;
  }

  mouseUp (e) {
    // console.log ('Chronos.mouseUp');
    this.isMouseDown = false;
  }

  mouseOver (event) {
    UpdateHover (event, !this.isMouseDown);
  }

  mouseOut (event) {
    UpdateHover (event, false);
  }

  /******************************************************************************/

  getHeaderTitle () {
    const data = this.read ('data');
    const f = Converters.getDisplayedDate (data.FromDate);
    const t = Converters.getDisplayedDate (data.ToDate);
    return `${f} — ${t}`;
  }

  /******************************************************************************/

  actionPrev () {
    this.setShoingPos (this.getShoingPos () - 32);
  }

  actionNext () {
    this.setShoingPos (this.getShoingPos () + 32);
  }

  actionScale (scale) {
    this.setScale (scale);
  }

  /******************************************************************************/

  renderHeaderButton (glyph, text, tooltip, active, action) {
    return (
      <Button
        glyph   = {glyph}
        text    = {text}
        tooltip = {tooltip}
        border  = 'none'
        active  = {active ? 'true' : 'false'}
        action  = {() => action ()}
        {...this.link ()} />
    );
  }

  renderHeader (header) {
    const headerStyle = this.mergeStyles ('header');
    const textStyle   = this.mergeStyles ('headerText');

    const scale = this.getScale ();

    return (
      <div style = {headerStyle}>
        {this.renderHeaderButton ('chevron-left',  null, null, false, () => this.actionPrev ())}
        {this.renderHeaderButton ('chevron-right', null, null, false, () => this.actionNext ())}
        <div style = {textStyle}>
          {header}
        </div>
        {this.renderHeaderButton (null, '÷2', null, scale === 0.5, () => this.actionScale (0.5))}
        {this.renderHeaderButton (null, '×1', null, scale === 1, () => this.actionScale (1))}
        {this.renderHeaderButton (null, '×2', null, scale === 2, () => this.actionScale (2))}
        {this.renderHeaderButton (null, '×3', null, scale === 3, () => this.actionScale (3))}
        {this.renderHeaderButton (null, '×4', null, scale === 4, () => this.actionScale (4))}
        {this.renderHeaderButton (null, '×10', null, scale === 10, () => this.actionScale (10))}
        {this.renderHeaderButton (null, '×20', null, scale === 20, () => this.actionScale (20))}
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

  renderZone (start, end) {
    const width = Unit.sub (end, start);
    const style = {
      position:        'absolute',
      top:             '0px',
      height:          '100%',
      left:            start,
      width:           width,
      backgroundColor: this.props.theme.palette.eventOddBackground,
    };
    return (
      <div style={style} ref={start} />
    );
  }

  renderGrid () {
    const result = [];
    const scale = this.getScale ();
    for (var h = 0; h < 24 ; h++) {
      if (h % 2 === 1) {
        const start = ((h + 0) * 60 * scale) + 'px';
        const end   = ((h + 1) * 60 * scale) + 'px';
        result.push (this.renderZone (start, end));
      }
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
    const text = Converters.getDisplayedTime (Converters.addSeconds (time, 1), false, 'h');

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

    const text = Converters.getDisplayedDate (date, false, 'Wdm');

    return (
      <div style={lineStyle} ref={index}>
        <Label text={text} grow='1' {...this.link ()} />
      </div>
    );
  }

  renderLabelsContentEvent (pos, event, index) {
    return (
      <ChronoLabel
        event     = {event}
        pos       = {pos}
        mouseOver = {() => this.mouseOver (event)}
        mouseOut  = {() => this.mouseOut (event)}
        {...this.link ()}/>
    );
  }

  renderLabelsContent () {
    const result = [];
    const shoingPos = this.getShoingPos ();
    let index = 0;
    for (var item of this.flatData) {
      if (item.pos >= shoingPos - 50) {
        const pos = (item.pos - shoingPos) + 'px';
        if (item.type === 'top') {
          result.push (this.renderLabelsContentDay (pos, item.date, index++));
        } else if (item.type === 'event') {
          result.push (this.renderLabelsContentEvent (pos, item.event, index++));
        }
        if (item.pos - shoingPos > 1000) {  // TODO !!!
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

  renderEventsContentDayLine () {
    const result = [];
    let index = 0;
    const scale = this.getScale ();
    for (var h = 0 ; h < 24; h++) {
      const start = ((h + 0) * 60 * scale) + 'px';
      const end   = ((h + 1) * 60 * scale) + 'px';
      const time = Converters.getTimeFromMinutes (h * 60);
      result.push (this.renderTime (start, end, time, index++));
    }
    return result;
  }

  renderEventsContentDay (pos, index) {
    const lineStyle = this.mergeStyles ('eventTop');
    lineStyle.top = pos;

    return (
      <div style={lineStyle} ref={index}>
        {this.renderEventsContentDayLine ()}
      </div>
    );
  }

  renderEventsContentEvent (pos, event, index) {
    const scale = this.getScale ();
    return (
      <ChronoEvent
        event     = {event}
        pos       = {pos}
        scale     = {scale}
        mouseOver = {() => this.mouseOver (event)}
        mouseOut  = {() => this.mouseOut (event)}
        {...this.link ()}
        />
    );
  }

  renderEventsContent () {
    const result = [];
    const shoingPos = this.getShoingPos ();
    let index = 0;
    for (var item of this.flatData) {
      if (item.pos >= shoingPos - 50) {
        const pos = (item.pos - shoingPos) + 'px';
        if (item.type === 'top') {
          result.push (this.renderEventsContentDay (pos, index++));
        } else if (item.type === 'event') {
          result.push (this.renderEventsContentEvent (pos, item.event, index++));
        }
        if (item.pos - shoingPos > 1000) {  // TODO !!!
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
    const boxStyle     = this.mergeStyles ('box');
    const contentStyle = this.mergeStyles ('content');

    return (
      <div
        style        = {boxStyle}
        onMouseDown  = {e => this.mouseDown (e)}
        onMouseMove  = {e => this.mouseMove (e)}
        onMouseUp    = {e => this.mouseUp (e)}
        onTouchStart = {e => this.mouseDown (e)}
        onTouchMove  = {e => this.mouseMove (e)}
        onTouchEnd   = {e => this.mouseUp (e)}
        >
        {this.renderHeader (this.getHeaderTitle ())}
        <div style = {contentStyle}>
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
