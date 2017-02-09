'use strict';

import React from 'react';
import Enumerable from 'linq';
import Converters from '../polypheme/converters';

import {
  Event,
  Label,
  Button
} from '../../all-components.js';

/******************************************************************************/

export default class Events extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      range:    'week',
      perHour:  false,
      fromDate: null,
      hover:    false,
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

  getPerHour () {
    return this.state.perHour;
  }

  setPerHour (value) {
    this.setState ( {
      perHour: value
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

  getHover () {
    return this.state.hover;
  }

  setHover (value) {
    this.setState ( {
      hover: value
    });
  }

  /******************************************************************************/

  componentWillMount () {
    const data = this.read ('data');
    this.setFromDate (data.FromDate);
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

  getGroupedByDays (data, hour) {
    const result = new Map ();
    let currentDate = this.getFromDate ();
    const toDate = this.getToDate ();
    while (true) {
      const events = Enumerable
        .from (data.Events)
        .where (e => e.FromDate === currentDate)
        .where (e => hour === -1 || Converters.splitTime (e.FromTime).hour === hour)
        .toArray ();
      result.set (currentDate, events);
      currentDate = Converters.addDays (currentDate, 1);
      if (currentDate === toDate) {
        break;
      }
    }
    return result;
  }

  /******************************************************************************/

  mouseOver () {
    this.setHover (true);
  }

  mouseOut () {
    this.setHover (false);
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

  actionPerHour () {
    this.setPerHour (!this.getPerHour ());
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
        {this.renderHeaderButton ('clock-o', null, 'Groupé par heures', this.getPerHour (),  () => this.actionPerHour ())}
      </div>
    );
  }

  renderText (text, index) {
    const dowStyle = this.mergeStyles ('dow');
    return (
      <div style = {dowStyle} key = {index}>
        <Label text={text} grow='1' {...this.link ()} />
      </div>
    );
  }

  renderHour (hour, index) {
    const hourStyle = this.mergeStyles ('hour');
    const text = hour + ':00';
    return (
      <div style = {hourStyle} key = {index}>
        <Label text={text} justify='center' grow='1' {...this.link ()} />
      </div>
    );
  }

  renderDow (date, index) {
    const dowStyle = this.mergeStyles ('dow');
    const h = Converters.getDisplayedDate (date, false, 'Wd');

    return (
      <div style = {dowStyle} key = {index}>
        <Label text={h} justify='center' grow='1' {...this.link ()} />
      </div>
    );
  }

  renderWeekDows (days, perHour) {
    const result = [];
    let index = 0;
    if (perHour) {
      result.push (this.renderText ('', index++));
    }
    for (var day of days) {
      result.push (this.renderDow (day[0], index++));
    }
    return result;
  }

  renderHeaderWeekDows (days, perHour) {
    const dowsStyle = this.mergeStyles ('dows');
    return (
      <div style = {dowsStyle}>
        {this.renderWeekDows (days, perHour)}
      </div>
    );
  }

  renderEvent (event, index) {
    return (
      <Event key={index} event={event} {...this.link ()} />
    );
  }

  renderEvents (events) {
    const result = [];
    let index = 0;
    for (var event of events) {
      result.push (this.renderEvent (event, index++));
    }
    return result;
  }

  renderWeekDay (day, index) {
    const columnStyle = this.mergeStyles ('column');
    return (
      <div style = {columnStyle} key = {index}>
        {this.renderEvents (day[1])}
      </div>
    );
  }

  renderWeekDaysList (days, hour) {
    const result = [];
    let index = 0;
    if (hour !== -1) {
      result.push (this.renderHour (hour, index++));
    }
    for (var day of days) {
      result.push (this.renderWeekDay (day, index++));
    }
    return result;
  }

  renderWeekDays (days, hour, index) {
    if (hour === -1) {
      const style = this.mergeStyles ('row');
      return (
        <div style = {style} ref = {index}>
          {this.renderWeekDaysList (days, hour)}
        </div>
      );
    } else {
      const style1 = this.mergeStyles ('part1');
      const style2 = this.mergeStyles (index % 2 === 0 ? 'part2' : 'part3');
      return (
        <div style = {style1} ref = {index}>
          <div style = {style2}>
            {this.renderWeekDaysList (days, hour)}
          </div>
        </div>
      );
    }
  }

  renderWeekPerHourDays (data) {
    const result = [];
    let index = 0;
    for (var hour = 0; hour < 24; hour++) {
      const days = this.getGroupedByDays (data, hour);
      var count = 0;
      for (var day of days) {
        count += day[1].length;
      }
      if (count > 0) {
        result.push (this.renderWeekDays (days, hour, index++));
      }
    }
    return result;
  }

  /******************************************************************************/

  renderDay (data) {
    const boxStyle = this.mergeStyles ('box');
    const rowStyle = this.mergeStyles ('row');

    const h = Converters.getDisplayedDate (this.getFromDate (), false, 'W');

    return (
      <div style = {boxStyle}>
        {this.renderHeader (h)}
        <div style = {rowStyle}>
        </div>
      </div>
    );
  }

  renderWeek (data) {
    const boxStyle = this.mergeStyles ('box');

    const h = Converters.getDisplayedDate (this.getFromDate (), false, 'My');
    const days = this.getGroupedByDays (data, -1);

    return (
      <div style = {boxStyle}>
        {this.renderHeader (h)}
        {this.renderHeaderWeekDows (days, false)}
        {this.renderWeekDays (days, -1, 0)}
      </div>
    );
  }

  renderWeekPerHour (data) {
    const boxStyle   = this.mergeStyles ('box');
    const partsStyle = this.mergeStyles ('parts');

    const h = Converters.getDisplayedDate (this.getFromDate (), false, 'My');
    const days = this.getGroupedByDays (data, -1);

    return (
      <div style = {boxStyle}>
        {this.renderHeader (h)}
        {this.renderHeaderWeekDows (days, true)}
        <div style = {partsStyle}>
          {this.renderWeekPerHourDays (data)}
        </div>
      </div>
    );
  }

  renderMonth (data) {
    const boxStyle = this.mergeStyles ('box');
    const rowStyle = this.mergeStyles ('row');

    const h = Converters.getDisplayedDate (this.getFromDate (), false, 'My');

    return (
      <div style = {boxStyle}>
        {this.renderHeader (h)}
        <div style = {rowStyle}>
        </div>
      </div>
    );
  }

  renderYear (data) {
    const boxStyle = this.mergeStyles ('box');
    const rowStyle = this.mergeStyles ('row');

    const h = Converters.getDisplayedDate (this.getFromDate (), false, 'y');

    return (
      <div style = {boxStyle}>
        {this.renderHeader (h)}
        <div style = {rowStyle}>
        </div>
      </div>
    );
  }

  render () {
    const data = this.read ('data');
    const range = this.getRange ();
    const perHour = this.getPerHour ();

    if (range === 'day') {
      return this.renderDay (data);
    } else if (range === 'week') {
      if (perHour) {
        return this.renderWeekPerHour (data);
      } else {
        return this.renderWeek (data);
      }
    } else if (range === 'month') {
      return this.renderMonth (data);
    } else {
      return this.renderYear (data);
    }
  }
}

/******************************************************************************/
