'use strict';

import React from 'react';
import Enumerable from 'linq';
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
      range:         'week',
      scale:         1,
      fromDate:      null,
      splitterWidth: '10%',
      eventHover:    null,
    };
  }

  getRange () {
    return this.state.range;
  }

  setRange (value) {
    this.setState ( {
      range: value
    });
  }

  getScale () {
    return this.state.scale;
  }

  setScale (value) {
    this.setState ( {
      scale: value
    });
  }

  getFromDate () {
    return this.state.fromDate;
  }

  setFromDate (value) {
    this.setState ( {
      fromDate: value
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
    this.setFromDate (data.FromDate);
  }

  mouseOver (event) {
    UpdateHover (event, true);
  }

  mouseOut (event) {
    UpdateHover (event, false);
  }

  /******************************************************************************/

  getToDate (direction) {
    const date = this.getFromDate ();
    const range = this.getRange ();
    const m = (direction === 'back') ? -1 : 1;
    if (range === 'day') {
      return Converters.addDays (date, 1 * m);
    } else if (range === 'week') {
      return Converters.addDays (date, 7 * m);
    } else if (range === 'month') {
      return Converters.addMonths (date, 1 * m);
    } else {
      return Converters.addYears (date, 1 * m);
    }
  }

  getGroupedByDays (data) {
    const result = new Map ();
    let currentDate = this.getFromDate ();
    const toDate = this.getToDate ();
    while (true) {
      const events = Enumerable
        .from (data.Events)
        .where (e => e.FromDate === currentDate)
        .toArray ();
      result.set (currentDate, events);
      currentDate = Converters.addDays (currentDate, 1);
      if (currentDate === toDate) {
        break;
      }
    }
    return result;
  }

  getHeaderTitle () {
    const f = this.getFromDate ();
    const t = Converters.addDays (this.getToDate (), -1);
    const range = this.getRange ();
    if (range === 'day') {
      return Converters.getDisplayedDate (f, false, 'Wdmy');
    } else if (range === 'week') {
      return Converters.getDisplayedDate (f) + ' — ' + Converters.getDisplayedDate (t);
    } else if (range === 'month') {
      return Converters.getDisplayedDate (f, false, 'My');
    } else {
      return Converters.getDisplayedDate (f, false, 'y');
    }
  }

  /******************************************************************************/

  actionPrev () {
    this.setFromDate (this.getToDate ('back'));
  }

  actionNext () {
    this.setFromDate (this.getToDate ('next'));
  }

  actionRange (range) {
    this.setRange (range);
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

    const range = this.getRange ();
    const scale = this.getScale ();

    return (
      <div style = {headerStyle}>
        {this.renderHeaderButton ('chevron-left',  null, null, false, () => this.actionPrev ())}
        {this.renderHeaderButton ('chevron-right', null, null, false, () => this.actionNext ())}
        <div style = {textStyle}>
          {header}
        </div>
        {this.renderHeaderButton (null, '1',   'Jour',    range === 'day',   () => this.actionRange ('day'))}
        {this.renderHeaderButton (null, '7',   'Semaine', range === 'week',  () => this.actionRange ('week'))}
        {this.renderHeaderButton (null, '31',  'Mois',    range === 'month', () => this.actionRange ('month'))}
        {this.renderHeaderButton (null, '365', 'Année',   range === 'year',  () => this.actionRange ('year'))}
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

  renderSeparator (index) {
    const style = this.mergeStyles ('separator');
    return (
      <div style={style} ref={index} />
    );
  }

  /******************************************************************************/

  renderLabelsContentDay (day, index) {
    const lineStyle = this.mergeStyles ('labelTop');
    const text = Converters.getDisplayedDate (day[0], false, 'Wdm');

    return (
      <div style={lineStyle} ref={index}>
        <Label text={text} grow='1' {...this.link ()} />
      </div>
    );
  }

  renderLabelsContentEvent (event, index) {
    return (
      <ChronoLabel
        event     = {event}
        mouseOver = {() => this.mouseOver (event)}
        mouseOut  = {() => this.mouseOut (event)}
        {...this.link ()}/>
    );
  }

  renderLabelsContent (days) {
    const result = [];
    let index = 0;
    for (var day of days) {
      if (day[1].length > 0) {  // is day with events ?
        if (index > 0) {
          result.push (this.renderSeparator (index++));
        }
        result.push (this.renderLabelsContentDay (day, index++));
        for (var event of day[1]) {
          result.push (this.renderLabelsContentEvent (event, index++));
        }
      }
    }
    return result;
  }

  renderLabels (data, days) {
    const labelsStyle = this.mergeStyles ('labels');

    return (
      <div style = {labelsStyle}>
        {this.renderLabelsContent (days)}
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

  renderEventsContentDay (index) {
    const lineStyle = this.mergeStyles ('eventTop');

    return (
      <div style={lineStyle} ref={index}>
        {this.renderEventsContentDayLine ()}
      </div>
    );
  }

  renderEventsContentEvent (event, index) {
    const scale = this.getScale ();
    return (
      <ChronoEvent
        event     = {event}
        scale     = {scale}
        mouseOver = {() => this.mouseOver (event)}
        mouseOut  = {() => this.mouseOut (event)}
        {...this.link ()}
        />
    );
  }

  renderEventsContent (days) {
    const result = [];
    let index = 0;
    for (var day of days) {
      if (day[1].length > 0) {  // is day with events ?
        if (index > 0) {
          result.push (this.renderSeparator (index++));
        }
        result.push (this.renderEventsContentDay (index++));
        for (var event of day[1]) {
          result.push (this.renderEventsContentEvent (event, index++));
        }
      }
    }
    return result;
  }

  renderEvents (data, days) {
    const eventsStyle = this.mergeStyles ('events');

    return (
      <div style = {eventsStyle}>
        {this.renderGrid ()}
        {this.renderEventsContent (days)}
      </div>
    );
  }

  /******************************************************************************/

  render () {
    const data = this.read ('data');
    const days = this.getGroupedByDays (data);
    const h = this.getHeaderTitle ();

    const boxStyle     = this.mergeStyles ('box');
    const contentStyle = this.mergeStyles ('content');

    return (
      <div style = {boxStyle}>
        {this.renderHeader (h)}
        <div style = {contentStyle}>
          <Splitter
            kind          = 'vertical'
            first-view-id = 'view-backlog'
            last-view-id  = 'view-desk'
            default-size  = {this.getSplitterWidth ()} min-size='0px'
            onSizeChanged = {size => this.setSplitterWidth (size)}
            {...this.link ()} >
            {this.renderLabels (data, days)}
            {this.renderEvents (data, days)}
          </Splitter>
        </div>
      </div>
    );
  }
}

/******************************************************************************/
