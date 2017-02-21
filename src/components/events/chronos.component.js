'use strict';

import React from 'react';
import Converters from '../polypheme/converters';
import {Unit} from 'electrum-theme';

import {
  ChronoLine,
  Label,
  Button,
  Badge
} from '../../all-components.js';

/******************************************************************************/

function getFlatData (data, filters) {
  // console.log ('Chronos.getFlatData');
  const lines = [];
  const groups = new Map ();
  var lastGroup = null;
  var hasDates = false;
  var notesCount = 0;
  for (var event of data.Events) {
    hasDates = event.FromDate || event.StartFromDate;
    let group;
    if (hasDates) {
      if (event.StartFromDate) {
        group = event.StartFromDate;
      } else {
        group = event.FromDate;
      }
    } else {
      group = event.Group;
    }
    if (filters.length === 0 || filters.indexOf (group) !== -1) {
      if (!lastGroup || lastGroup !== group) {
        if (lastGroup) {
          lines.push ({type: 'sep'});
        }
        lines.push ({type: 'top', date: event.FromDate, group: event.Group});
        lastGroup = group;
      }
      lines.push ({type: 'event', event: event});

      var noteCount = 0;
      if (event.Note) {
        noteCount = 1;
      } else if (event.Notes) {
        noteCount = event.Notes.length;
      }
      notesCount = Math.max (notesCount, noteCount);

      if (!groups.has (group)) {
        groups.set (group, 0);
      }
      const n = groups.get (group);
      groups.set (group, n + 1);
    }
  }
  const g = [];
  const n = [];
  for (var group of groups) {
    g.push (group[0]);
    n.push (group[1]);
  }
  return {
    hasDates:   hasDates,
    groups:     g,
    count:      n,
    lines:      lines,
    notesCount: notesCount,
  };
}

/******************************************************************************/

export default class Chronos extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      filters: [],
    };
  }

  getFilters () {
    return this.state.filters;
  }

  setFilters (value) {
    this.setState ( {
      filters: value
    });
  }

  /******************************************************************************/

  componentWillMount () {
    const data = this.read ('data');
    const filters = this.getFilters ();
    this.flatData = getFlatData (data, filters);
    this.updateFilter (filters);
  }

  /******************************************************************************/

  updateFilter (filters) {
    if (filters.length === 0) {  // show all events ?
      this.flatFilteredData = this.flatData;
    } else {  // has filter ?
      const data = this.read ('data');
      this.flatFilteredData = getFlatData (data, filters);
    }
  }

  actionAll () {
    this.updateFilter ([]);
    this.setFilters ([]);
  }

  actionFilter (e, date) {
    const filters = this.getFilters ();
    if (e.ctrlKey) {
      const i = filters.indexOf (date);
      if (i === -1) {
        filters.push (date);  // add date
      } else {
        filters.splice (i, 1);  // delete date
      }
    } else {
      filters.splice (0, filters.length);
      filters.push (date);
    }
    this.updateFilter (filters);
    this.setFilters (filters.slice ());
  }

  actionPrevFilter () {
    const filters = this.getFilters ();
    if (filters.length === 1) {
      const index = this.flatData.groups.indexOf (filters[0]);
      if (index !== -1 && index > 0) {
        const newDate = this.flatData.groups[index - 1];
        this.updateFilter ([newDate]);
        this.setFilters ([newDate]);
      }
    }
  }

  actionNextFilter () {
    const filters = this.getFilters ();
    if (filters.length === 1) {
      const index = this.flatData.groups.indexOf (filters[0]);
      if (index !== -1 && index < this.flatData.groups.length - 1) {
        const newDate = this.flatData.groups[index + 1];
        this.updateFilter ([newDate]);
        this.setFilters ([newDate]);
      }
    }
  }

  /******************************************************************************/

  renderNavigationButton (glyph, text, count, tooltip, disabled, active, action) {
    if (count) {
      return (
        <Button
          kind            = 'chronos-navigator'
          subkind         = 'with-badge'
          glyph           = {glyph}
          text            = {text}
          tooltip         = {tooltip}
          border          = 'none'
          disabled        = {disabled ? 'true' : 'false'}
          active          = {active ? 'true' : 'false'}
          custom-on-click = {e => action (e)}
          {...this.link ()}>
          <Badge value={count} kind='chronos-count' {...this.link ()} />
        </Button>
      );
    } else {
      return (
        <Button
          kind            = 'chronos-navigator'
          glyph           = {glyph}
          text            = {text}
          tooltip         = {tooltip}
          border          = 'none'
          disabled        = {disabled ? 'true' : 'false'}
          active          = {active ? 'true' : 'false'}
          custom-on-click = {e => action (e)}
          {...this.link ()}/>
      );
    }
  }

  renderNavigationButtons () {
    const result = [];
    const filters = this.getFilters ();
    result.push (this.renderNavigationButton (null, 'Tout', null, null, false, filters.length === 0, () => this.actionAll ()));
    result.push (this.renderNavigationButton ('chevron-up', null, null, null, filters.length !== 1, false, () => this.actionPrevFilter ()));
    for (var i = 0; i < this.flatData.groups.length; i++) {
      const group = this.flatData.groups[i];
      const count = this.flatData.count[i];
      var text, tooltip;
      if (this.flatData.hasDates) {
        text    = Converters.getDisplayedDate (group);
        tooltip = Converters.getDisplayedDate (group, false, 'W');
      } else {
        text    = group;
        tooltip = null;
      }
      const x = group;  // necessary, but strange !
      result.push (this.renderNavigationButton (null, text, count, tooltip, false, filters.indexOf (x) !== -1, e => this.actionFilter (e, x)));
    }
    result.push (this.renderNavigationButton ('chevron-down', null, null, null, filters.length !== 1, false, () => this.actionNextFilter ()));
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

  renderContentTop (text, index) {
    const lineStyle      = this.mergeStyles ('top');
    const lineLabelStyle = this.mergeStyles ('topLabel');
    const lineEventStyle = this.mergeStyles ('topEvent');

    const lineWidth  = this.read ('lineWidth');
    const width = Unit.add (lineWidth, this.props.theme.shapes.chronosSeparatorWidth);
    lineLabelStyle.width = Unit.sub (Unit.multiply (width, this.flatFilteredData.notesCount), this.props.theme.shapes.chronosLabelMargin);

    return (
      <div style={lineStyle} ref={index}>
        <div style={lineLabelStyle}>
          <Label text={text} text-color='#fff' grow='1' {...this.link ()} />
        </div>
        <div style={lineEventStyle}>
          {this.renderContentTopTimes ()}
        </div>
      </div>
    );
  }

  renderContentEvent (event, index) {
    const lineWidth  = this.read ('lineWidth');
    const glyphWidth = this.read ('glyphWidth');
    return (
      <ChronoLine
        event      = {event}
        lineWidth  = {lineWidth}
        glyphWidth = {glyphWidth}
        {...this.link ()}>
      </ChronoLine>
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
        var text;
        if (item.date) {
          text = Converters.getDisplayedDate (item.date, false, 'Wdmy');
        } else {
          text = item.group;
        }
        result.push (this.renderContentTop (text, index++));
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
