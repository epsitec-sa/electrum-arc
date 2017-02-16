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
  Badge
} from '../../all-components.js';

/******************************************************************************/

function getFlatData (data, dateFilter) {
  console.log ('Chronos.getFlatData');
  const lines = [];
  const dates = new Map ();
  var lastDate = null;
  for (var event of data.Events) {
    if (!dateFilter || event.FromDate === dateFilter) {
      if (!lastDate || lastDate !== event.FromDate) {
        if (lastDate) {
          lines.push ({type: 'sep'});
        }
        lines.push ({type: 'top', date: event.FromDate});
        lastDate = event.FromDate;
      }
      lines.push ({type: 'event', event: event});

      if (!dates.has (event.FromDate)) {
        dates.set (event.FromDate, 0);
      }
      const n = dates.get (event.FromDate);
      dates.set (event.FromDate, n + 1);
    }
  }
  const d = [];
  const n = [];
  for (var date of dates) {
    d.push (date[0]);
    n.push (date[1]);
  }
  return {dates: d, count: n, lines: lines};
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
      dateFilter:   null,
    };
  }

  getDateFilter () {
    return this.state.dateFilter;
  }

  setDateFilter (value) {
    this.setState ( {
      dateFilter: value
    });
  }

  /******************************************************************************/

  componentWillMount () {
    const data = this.read ('data');
    this.flatData = getFlatData (data);
    this.updateFilter (null);

    // const node = ReactDOM.findDOMNode (this);
    // console.dir (node);
  }

  mouseOver (event) {
    UpdateHover (event, !this.isMouseDown);
  }

  mouseOut (event) {
    UpdateHover (event, false);
  }

  /******************************************************************************/

  updateFilter (dateFilter) {
    if (dateFilter) {  // has filter ?
      const data = this.read ('data');
      this.flatFilteredData = getFlatData (data, dateFilter);
    } else {  // show all events ?
      this.flatFilteredData = this.flatData;
    }
  }

  actionAll () {
    this.updateFilter (null);
    this.setDateFilter (null);
  }

  actionDate (date) {
    this.updateFilter (date);
    this.setDateFilter (date);
  }

  actionPrevDate () {
    const date = this.getDateFilter ();
    if (date) {
      const index = this.flatData.dates.indexOf (date);
      if (index !== -1 && index > 0) {
        const newDate = this.flatData.dates[index - 1];
        this.updateFilter (newDate);
        this.setDateFilter (newDate);
      }
    }
  }

  actionNextDate () {
    const date = this.getDateFilter ();
    if (date) {
      const index = this.flatData.dates.indexOf (date);
      if (index !== -1 && index < this.flatData.dates.length - 1) {
        const newDate = this.flatData.dates[index + 1];
        this.updateFilter (newDate);
        this.setDateFilter (newDate);
      }
    }
  }

  /******************************************************************************/

  renderNavigationButton (glyph, text, count, tooltip, active, action) {
    if (count) {
      return (
        <Button
          kind    = 'chronos-navigator'
          subKind = 'with-badge'
          glyph   = {glyph}
          text    = {text}
          tooltip = {tooltip}
          border  = 'none'
          active  = {active ? 'true' : 'false'}
          action  = {() => action ()}
          {...this.link ()}>
          <Badge value={count} kind='chronos-count' {...this.link ()} />
        </Button>
      );
    } else {
      return (
        <Button
          kind    = 'chronos-navigator'
          glyph   = {glyph}
          text    = {text}
          tooltip = {tooltip}
          border  = 'none'
          active  = {active ? 'true' : 'false'}
          action  = {() => action ()}
          {...this.link ()}/>
      );
    }
  }

  renderNavigationButtons () {
    const result = [];
    const dateFilter = this.getDateFilter ();
    result.push (this.renderNavigationButton (null, 'Tout', null, null, !dateFilter, () => this.actionAll ()));
    result.push (this.renderNavigationButton ('chevron-up', null, null, null, false, () => this.actionPrevDate ()));
    for (var i = 0; i < this.flatData.dates.length; i++) {
      var date  = this.flatData.dates[i];
      var count = this.flatData.count[i];
      const text    = Converters.getDisplayedDate (date);
      const tooltip = Converters.getDisplayedDate (date, false, 'W');
      const x = date;  // necessary, but strange !
      result.push (this.renderNavigationButton (null, text, count, tooltip, dateFilter === x, () => this.actionDate (x)));
    }
    result.push (this.renderNavigationButton ('chevron-down', null, null, null, false, () => this.actionNextDate ()));
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
    for (var item of this.flatFilteredData.lines) {
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
