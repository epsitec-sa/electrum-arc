'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Converters from '../polypheme/converters';
import {Unit} from 'electrum-theme';

import {
  ChronoLabel,
  ChronoEvent,
  Label,
  Button,
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
      verticalPos:   0,
      showingDate:   null,
    };
  }

  getVerticalPos () {
    return this.state.verticalPos;
  }

  setVerticalPos (value) {
    this.setState ( {
      verticalPos: value
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

  actionPrevDate () {
    const date = this.getShowingDate ();
    if (date) {
      const index = this.flatData.dates.indexOf (date);
      if (index !== -1 && index > 0) {
        const newDate = this.flatData.dates[index - 1];
        const pos = getFlatPos (this.flatData, newDate);
        this.changeVerticalPos (pos);
      }
    }
  }

  actionNextDate () {
    const date = this.getShowingDate ();
    if (date) {
      const index = this.flatData.dates.indexOf (date);
      if (index !== -1 && index < this.flatData.dates.length - 1) {
        const newDate = this.flatData.dates[index + 1];
        const pos = getFlatPos (this.flatData, newDate);
        this.changeVerticalPos (pos);
      }
    }
  }

  /******************************************************************************/

  renderNavigationButton (glyph, text, tooltip, active, action) {
    return (
      <Button
        kind    = 'chronos-navigator'
        glyph   = {glyph}
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
    result.push (this.renderNavigationButton ('chevron-up', null, null, false, () => this.actionPrevDate ()));
    const showingDate = this.getShowingDate ();
    for (var date of this.flatData.dates) {
      const x = date;  // necessary, but strange !
      const text    = Converters.getDisplayedDate (date);
      const tooltip = Converters.getDisplayedDate (date, false, 'Wdmy');
      result.push (this.renderNavigationButton (null, text, tooltip, showingDate === x, () => this.actionDate (x)));
    }
    result.push (this.renderNavigationButton ('chevron-down', null, null, false, () => this.actionNextDate ()));
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

  renderTime (start, width, time, index) {
    const style = {
      position:   'absolute',
      top:        '0px',
      height:     '100%',
      left:       start,
      width:      width,
      userSelect: 'none',
    };
    const text = time ? Converters.getDisplayedTime (Converters.addSeconds (time, 1), false, 'h') : '';

    return (
      <div style={style} ref={index}>
        <Label text={text} justify='center' text-color='#fff' grow='1' height='100%' {...this.link ()} />
      </div>
    );
  }

  /******************************************************************************/

  renderContentTopDate (date) {
    const text = Converters.getDisplayedDate (date, false, 'Wdmy');

    return (
      <Label text={text} text-color='#fff' grow='1' {...this.link ()} />
    );
  }

  renderContentTopTimes () {
    const result = [];
    let index = 0;
    for (var h = 0 ; h < 24; h++) {
      const start = (h * 100 / 24) + '%';
      const width = (100 / 24) + '%';
      const time = Converters.getTimeFromMinutes (h * 60);
      result.push (this.renderTime (start, width, time, index++));
    }
    return result;
  }

  renderContentTop (date, index) {
    const lineStyle      = this.mergeStyles ('top');
    const lineLabelStyle = this.mergeStyles ('topLabel');
    const lineEventStyle = this.mergeStyles ('topEvent');
    return (
      <div style={lineStyle} ref={index}>
        <div style={lineLabelStyle}>
          <Label text='' width={this.props.theme.shapes.chronosLabelMargin} {...this.link ()} />
          {this.renderContentTopDate (date)}
        </div>
        <div style={lineEventStyle}>
          {this.renderContentTopTimes ()}
        </div>
      </div>
    );
  }

  renderContentEvent (event, index) {
    const lineStyle      = this.mergeStyles ('line');
    const lineLabelStyle = this.mergeStyles ('lineLabel');
    const lineEventStyle = this.mergeStyles ('lineEvent');
    return (
      <div
        style       = {lineStyle}
        ref         = {index}
        onMouseOver = {() => this.mouseOver (event)}
        onMouseOut  = {() => this.mouseOut (event)}
        >
        <div style={lineLabelStyle}>
          <ChronoLabel event={event} {...this.link ()}/>
        </div>
        <div style={lineEventStyle}>
          <ChronoEvent event={event} {...this.link ()}/>
        </div>
      </div>
    );
  }

  renderContentSep (index) {
    const lineStyle = this.mergeStyles ('sep');
    return (
      <div style={lineStyle} ref={index} />
    );
  }

  renderContent () {
    const result = [];
    let index = 0;
    for (var item of this.flatData.lines) {
      if (item.type === 'top') {
        result.push (this.renderContentTop (item.date, index++));
      } else if (item.type === 'event') {
        result.push (this.renderContentEvent (item.event, index++));
      } else if (item.type === 'sep') {
        result.push (this.renderContentSep (index++));
      }
    }
    return result;
  }

  renderEvents () {
    const eventsStyle = this.mergeStyles ('events');

    return (
      <div style = {eventsStyle}>
        {this.renderContent ()}
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
        <div style={contentStyle}>
          {this.renderEvents ()}
        </div>
      </div>
    );
  }
}

/******************************************************************************/
