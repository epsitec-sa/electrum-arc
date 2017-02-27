'use strict';

import React from 'react';
import Converters from '../polypheme/converters';
import {Unit} from 'electrum-theme';

import {
  DragCab,
  Container,
  ChronoLine,
  Label,
  Button,
  Badge
} from '../../all-components.js';

/******************************************************************************/

function getFlatEvents (events, filters) {
  // console.log ('Chronos.getFlatEvents');
  const lines = [];
  const groups = new Map ();
  var lastGroup = null;
  var hasDates = false;
  var notesCount = 0;
  var minHour = 8;
  var maxHour = 18;
  for (var event of events.Events) {
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

      if (event.FromTime) {
        minHour = Math.min (minHour, Converters.splitTime (event.FromTime).hour - 1);
      }
      if (event.startFromTime) {
        minHour = Math.min (minHour, Converters.splitTime (event.startFromTime).hour - 1);
      }
      if (event.ToTime) {
        maxHour = Math.max (maxHour, Converters.splitTime (event.ToTime).hour + 1);
      }
      if (event.EndToTime) {
        maxHour = Math.max (maxHour, Converters.splitTime (event.EndToTime).hour + 1);
      }

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
    minHour:    Math.max (minHour, 0),
    maxHour:    Math.min (maxHour + 1, 24),
  };
}

/******************************************************************************/

function updateHover (event, state) {
  for (let line of window.document.chronoLines) {
    if (line.props.event === event) {
      line.setHover (state);
    } else if (event.Link && line.props.event.Link && event.Link === line.props.event.Link) {
      line.setHover (state);
    }
  }
}

/******************************************************************************/

function filtersGet (filters, key) {
  if (filters.length === 0) {
    return true;
  } else {
    return filters.indexOf (key) !== -1;
  }
}

function filtersSet (filters, key, state) {
  if (state) {
    filters.push (key);  // add key
  } else {
    const i = filters.indexOf (key);
    filters.splice (i, 1);  // delete key
  }
}

function filtersFlush (filters) {
  filters.splice (0, filters.length);
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
    const events = this.read ('events');
    const filters = this.getFilters ();
    this.flatEvents = getFlatEvents (events, filters);
    this.updateFilter (filters);
  }

  mouseOver (event) {
    updateHover (event, true);
  }

  mouseOut (event) {
    updateHover (event, false);
  }

  mouseDown (e) {
    console.log ('ChronoLine.mouseDown');
    return false;
  }

  mouseUp (e) {
    console.log ('ChronoLine.mouseUp');
    return false;
  }

  doClickAction (e) {
    console.log ('ChronoLine.doClickAction');
  }

  /******************************************************************************/

  updateFilter (filters) {
    if (filters.length === 0) {  // show all events ?
      this.flatFilteredEvents = this.flatEvents;
    } else {  // has filter ?
      const events = this.read ('events');
      this.flatFilteredEvents = getFlatEvents (events, filters);
    }
  }

  actionAll () {
    this.updateFilter ([]);
    this.setFilters ([]);
  }

  actionFilter (e, date) {
    const filters = this.getFilters ();
    if (e.ctrlKey) {
      if (filtersGet (filters, date)) {
        if (filters.length === 0) {
          for (var i = 0; i < this.flatEvents.groups.length; i++) {
            const group = this.flatEvents.groups[i];
            filtersSet (filters, group, true);
          }
        }
        filtersSet (filters, date, false);
      } else {
        filtersSet (filters, date, true);
      }
    } else {
      filtersFlush (filters);
      filtersSet (filters, date, true);
    }
    this.updateFilter (filters);
    this.setFilters (filters.slice ());
  }

  actionPrevFilter () {
    const filters = this.getFilters ();
    if (filters.length === 1) {
      const index = this.flatEvents.groups.indexOf (filters[0]);
      if (index !== -1 && index > 0) {
        const newDate = this.flatEvents.groups[index - 1];
        this.updateFilter ([newDate]);
        this.setFilters ([newDate]);
      }
    }
  }

  actionNextFilter () {
    const filters = this.getFilters ();
    if (filters.length === 1) {
      const index = this.flatEvents.groups.indexOf (filters[0]);
      if (index !== -1 && index < this.flatEvents.groups.length - 1) {
        const newDate = this.flatEvents.groups[index + 1];
        this.updateFilter ([newDate]);
        this.setFilters ([newDate]);
      }
    }
  }

  /******************************************************************************/

  renderNavigationButton (glyph, text, count, tooltip, disabled, active, action, index) {
    if (count) {
      return (
        <Button
          index           = {index}
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
          index           = {index}
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
    let index = 0;
    result.push (this.renderNavigationButton (null, 'Tout', null, null, false, filters.length === 0, () => this.actionAll (), index++));
    result.push (this.renderNavigationButton ('chevron-up', null, null, null, filters.length !== 1, false, () => this.actionPrevFilter (), index++));
    for (var i = 0; i < this.flatEvents.groups.length; i++) {
      const group = this.flatEvents.groups[i];
      const count = this.flatEvents.count[i];
      var text, tooltip;
      if (this.flatEvents.hasDates) {
        text    = Converters.getDisplayedDate (group);
        tooltip = Converters.getDisplayedDate (group, false, 'W');
      } else {
        text    = group;
        tooltip = null;
      }
      const x = group;  // necessary, but strange !
      result.push (this.renderNavigationButton (null, text, count, tooltip, false, filtersGet (filters, x), e => this.actionFilter (e, x), index++));
    }
    result.push (this.renderNavigationButton ('chevron-down', null, null, null, filters.length !== 1, false, () => this.actionNextFilter (), index++));
    return result;
  }

  renderNavigation () {
    const navigation  = this.read ('navigation');
    if (navigation === 'hidden') {
      return null;
    } else {
      const style = this.mergeStyles ('navigation');
      return (
        <div style={style} key='navigation'>
          {this.renderNavigationButtons ()}
        </div>
      );
    }
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
      <div style={style} key={index}>
        <Label text={text} justify='center' text-color='#fff' grow='1' height='100%' {...this.link ()} />
      </div>
    );
  }

  /******************************************************************************/

  renderContentTopTimes () {
    const result = [];
    let index = 0;
    const minHour = this.flatFilteredEvents.minHour;
    const maxHour = this.flatFilteredEvents.maxHour;
    const lenHour = maxHour - minHour;
    for (var h = minHour + 1; h < maxHour; h++) {
      const width = 100 / lenHour;
      const start = ((h - minHour) * 100 / lenHour) - width / 2;
      const time = Converters.getTimeFromMinutes (h * 60);
      result.push (this.renderTime (start + '%', width + '%', time, index++));
    }
    return result;
  }

  renderContentTop (text, index) {
    const lineStyle      = this.mergeStyles ('top');
    const lineLabelStyle = this.mergeStyles ('topLabel');
    const lineEventStyle = this.mergeStyles ('topEvent');

    const lineWidth  = this.read ('lineWidth');
    const width = Unit.add (lineWidth, this.props.theme.shapes.chronosSeparatorWidth);
    lineLabelStyle.width = Unit.sub (Unit.multiply (width, this.flatFilteredEvents.notesCount), this.props.theme.shapes.chronosLabelMargin);

    return (
      <div style={lineStyle} key={index}>
        <div style={lineLabelStyle} key='label'>
          <Label text={text} text-color='#fff' grow='1' {...this.link ()} />
        </div>
        <div style={lineEventStyle} key='event'>
          {this.renderContentTopTimes ()}
        </div>
      </div>
    );
  }

  renderContentEvent (event, index) {
    const data       = this.read ('data');
    const lineWidth  = this.read ('lineWidth');
    const glyphWidth = this.read ('glyphWidth');

    const noDrag = null;
    const verticalSpacing = null;

    return (
      <DragCab
        drag-controller  = 'ticket'
        direction        = 'vertical'
        color            = {this.props.theme.palette.dragAndDropHover}
        thickness        = {this.props.theme.shapes.dragAndDropTicketThickness}
        radius           = {this.props.theme.shapes.dragAndDropTicketThickness}
        mode             = 'corner-top-left'
        data             = {data}
        item-id          = {event.id}
        no-drag          = {noDrag}
        vertical-spacing = {verticalSpacing}
        mouse-down       = {e => this.mouseDown (e)}
        mouse-up         = {e => this.mouseUp (e)}
        do-click-action  = {e => this.doClickAction (e)}
        {...this.link ()} >
        <ChronoLine
          index      = {index}
          data       = {data}
          event      = {event}
          lineWidth  = {lineWidth}
          glyphWidth = {glyphWidth}
          notesCount = {this.flatFilteredEvents.notesCount}
          minHour    = {this.flatFilteredEvents.minHour}
          maxHour    = {this.flatFilteredEvents.maxHour}
          mouseOver  = {e => this.mouseOver (e)}
          mouseOut   = {e => this.mouseOut  (e)}
          {...this.link ()}>
        </ChronoLine>
      </DragCab>
    );
  }

  renderContentSep (index) {
    const style = this.mergeStyles ('sep');
    return (
      <div style={style} key={index} />
    );
  }

  renderEventsList () {
    const result = [];
    let index = 0;
    for (var item of this.flatFilteredEvents.lines) {
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
    return (
      <Container
        kind            = {'chronos-events'}
        drag-controller = 'ticket'
        drag-source     = 'backlog'
        drag-mode       = 'all'
        item-id         = 'chronos'
        view-parent-id  = 'view-backlog'
        {...this.link ()} >
        {this.renderEventsList ()}
      </Container>
    );
  }

  /******************************************************************************/

  render () {
    const mainStyle = this.mergeStyles ('main');

    return (
      <div style={mainStyle}>
        {this.renderNavigation ()}
        {this.renderEvents ()}
      </div>
    );
  }
}

/******************************************************************************/
