import {React} from 'electrum';
import {Button} from 'electrum-arc';
import * as Converters from './converters';

/******************************************************************************/

export default class Calendar extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      visibleDate: null,
    };
  }

  get visibleDate () {
    return this.state.visibleDate;
  }

  set visibleDate (value) {
    this.setState ( {
      visibleDate: value
    });
  }

  componentWillMount () {
    // At first time, initialize internalState.visibleDate with current date.
    var date = this.read ('visible-date');
    if (!date) {
      const now = Converters.getNowCanonicalDate ();
      const year  = Converters.getYear  (now);
      const month = Converters.getMonth (now);
      date = Converters.getDate (year, month, 1);
    }
    this.visibleDate = date;
  }

  /******************************************************************************/

  get styleProps () {
    return {
      width:   this.read ('width'),
      height:  this.read ('height'),
      kind:    this.read ('kind'),
      spacing: this.read ('spacing'),
    };
  }

  get monthCount () {
    const monthCount = this.read ('month-count');
    return monthCount ? monthCount : 1;
  }

  getDOW3Letters (dow) {
    return Converters.getDOWDescription (dow).substring (0, 3);
  }

  changeDate (date) {
    this.visibleDate = date;
    var x = this.read ('visible-date-changed');
    if (x) {
      x (date);
    }
  }

  // Called when the '<' button is clicked.
  // Modify internalState.visibleDate (fix visible year and month).
  onPrevMonth () {
    const visibleDate = this.visibleDate;
    const newDate = Converters.addMonths (visibleDate, -1);
    this.changeDate (newDate);
  }

  // Called when the '>' button is clicked.
  // Modify internalState.visibleDate (fix visible year and month).
  onNextMonth () {
    const visibleDate = this.visibleDate;
    const newDate = Converters.addMonths (visibleDate, 1);
    this.changeDate (newDate);
  }

  onVisibleDateNow () {
    const now = Converters.getNowCanonicalDate ();
    const year  = Converters.getYear  (now);
    const month = Converters.getMonth (now);
    const date = Converters.getDate (year, month, 1);
    this.changeDate (date);
  }

  onVisibleDateAddMonths (months) {
    const date = Converters.addMonths (this.visibleDate, months);
    this.changeDate (date);
  }

  onVisibleDatePrevYear () {
    const s = Converters.splitDate (this.visibleDate);
    const year = s.month === 1 ? s.year - 1 : s.year;
    const date = Converters.getDate (year, 1, 1);
    this.changeDate (date);
  }

  onVisibleDateNextYear () {
    const s = Converters.splitDate (this.visibleDate);
    const date = Converters.getDate (s.year + 1, 1, 1);
    this.changeDate (date);
  }

  // Called when a [1]..[31] button is clicked.
  setDate (date) {
    const {state} = this.props;
    state.set ('date', date);

    if (this.props.onChange) {
      this.props.onChange (date);
    }
  }

  onDateClicked (date) {
    // this.setDate (date);
    const x = this.read ('date-clicked');
    if (x) {
      x (date);
    }
  }

  /******************************************************************************/

  // Return the html for a [1]..[31] button.
  renderButton (date, active, dimmed, weekend, index) {
    const tooltip = Converters.getDisplayedDate (date, 'Wdmy');
    return (
      <Button
        key      = {index}
        text     = {Converters.getDay (date)}  // 1..31
        tooltip  = {tooltip}
        kind     = 'calendar'
        active   = {active}
        dimmed   = {dimmed}
        weekend  = {weekend}
        on-click = {() => this.onDateClicked (date)}
        {...this.link ()}
      />
    );
  }

  // Return an array of 7 buttons, for a week.
  renderButtons (firstDate, visibleDate, selectedDate, selectedDates) {
    let line = [];
    const startDate = this.read ('start-date');
    const endDate   = this.read ('end-date');
    let i = 0;
    for (i = 0; i < 7; ++i) {  // monday..sunday
      let active  = 'false';
      let dimmed  = 'false';
      let weekend = 'false';
      if (firstDate === selectedDate || (selectedDates && selectedDates.indexOf (firstDate) !== -1)) {
        active = 'true';
      }
      if (Converters.getYear  (firstDate) !== Converters.getYear  (visibleDate) ||
          Converters.getMonth (firstDate) !== Converters.getMonth (visibleDate)) {
        dimmed = 'true';
      }
      if ((startDate && firstDate < startDate) || (endDate && firstDate > endDate)) {
        dimmed = 'true';
      }
      if (i >= 5) {  // saturday or sunday ?
        weekend = 'true';
      }

      const button = this.renderButton (firstDate, active, dimmed, weekend, i);
      line.push (button);
      firstDate = Converters.addDays (firstDate, 1);
    }
    return line;
  }

  // Return the html for a line of 7 buttons (for a week).
  renderLineOfButtons (firstDate, visibleDate, selectedDate, selectedDates, index) {
    const style = this.mergeStyles ('line');
    return (
      <div style={style} key={index}>
        {this.renderButtons (firstDate, visibleDate, selectedDate, selectedDates)}
      </div>
    );
  }

  renderPrevMonthButton (showing) {
    if (showing) {
      return (
        <Button
          glyph    = 'chevron-left'
          kind     = 'calendar-navigation'
          key      = 'prevMonth'
          on-click = {this.onPrevMonth}
          {...this.link ()} />
      );
    } else {
      return null;
    }
  }

  renderNextMonthButton (showing) {
    if (showing) {
      return (
        <Button
          glyph    = 'chevron-right'
          kind     = 'calendar-navigation'
          key      = 'nextMonth'
          on-click = {this.onNextMonth}
          {...this.link ()} />
      );
    } else {
      return null;
    }
  }

  // Return the html for the header, with 2 buttons next/prevMonth and the title.
  // By example: '<' mai 2016 '>'
  renderHeader (header, firstMonth, lastMonth) {
    const style     = this.mergeStyles ('header');
    const textStyle = this.mergeStyles ('headerText');
    return (
      <div style={style} key='header'>
        {this.renderPrevMonthButton (firstMonth)}
        <div style={textStyle}>
          {header}
        </div>
        {this.renderNextMonthButton (lastMonth)}
      </div>
    );
  }

  // Return the html for a [lun]..[dim] labels.
  renderDOW (text, index) {
    const textStyle = this.mergeStyles ('dowText');
    return (
      <div style={textStyle} key={index}>
        {text}
      </div>
    );
  }

  // Return an array of 7 days of week.
  renderDOWs () {
    let line = [];
    let i = 0;
    for (i = 0; i < 7; ++i) {
      const dow = this.getDOW3Letters (i);
      line.push (this.renderDOW (dow, i));
    }
    return line;
  }

  // Return the html for the 7 days of week header.
  renderLineOfDOWs () {
    const style = this.mergeStyles ('dowLine');
    return (
      <div style={style} key='dows'>
        {this.renderDOWs ()}
      </div>
    );
  }

  // Return an array of lines, with header then week's lines.
  // The array must have from 4 to 6 lines.
  renderColumnOfLines (header, firstDate, visibleDate, selectedDate, selectedDates, firstMonth, lastMonth) {
    let column = [];
    column.push (this.renderHeader (header, firstMonth, lastMonth));
    column.push (this.renderLineOfDOWs ());
    let i = 0;
    for (i = 0; i < 6; ++i) {
      const line = this.renderLineOfButtons (firstDate, visibleDate, selectedDate, selectedDates, i);
      column.push (line);
      firstDate = Converters.addDays (firstDate, 7);
    }
    return column;
  }

  // Retourne all the html content of the calendar.
  renderLines (selectedDate, selectedDates, visibleDate, firstMonth, lastMonth) {
    const firstDate = Converters.getCalendarStartDate (visibleDate);
    const header    = Converters.getDisplayedDate (visibleDate, 'My');  // 'mai 2016' by example

    const style = this.mergeStyles ('column');
    return (
      <div style={style}>
        {this.renderColumnOfLines (header, firstDate, visibleDate, selectedDate, selectedDates, firstMonth, lastMonth)}
      </div>
    );
  }

  renderMonth (selectedDate, selectedDates, visibleDate, firstMonth, lastMonth) {
    const monthStyle = this.mergeStyles (lastMonth ? 'singleMonth' : 'month');
    return (
      <div style={monthStyle}>
        {this.renderLines (selectedDate, selectedDates, visibleDate, firstMonth, lastMonth)}
      </div>
    );
  }

  renderMonths () {
    const selectedDate  = this.read ('date');
    const selectedDates = this.read ('dates');

    const visibleDate = this.visibleDate;
    if (!visibleDate) {
      return null;
    }

    const result = [];
    const monthCount = this.monthCount;
    for (var m = 0; m < monthCount; m++) {
      const year  = Converters.getYear  (visibleDate);
      const month = Converters.getMonth (visibleDate);
      const date  = Converters.getDate (year, month + m, 1);

      const firstMonth = (m === 0);
      const lastMonth  = (m === monthCount - 1);
      result.push (this.renderMonth (selectedDate, selectedDates, date, firstMonth, lastMonth));
    }
    return result;
  }

  renderNavigator () {
    const navigator = this.read ('navigator');
    if (navigator === 'standard') {
      const style = this.mergeStyles ('navigator');
      return (
      <div style={style}>
        <Button
          glyph    = 'sun-o'
          text     = 'aujourd´hui'
          justify  = 'flex-start'
          grow     = '1'
          on-click = {this.onVisibleDateNow}
          {...this.link ()} />
        <Button
          glyph    = 'chevron-left'
          text     = 'deux mois'
          justify  = 'flex-start'
          grow     = '1'
          on-click = {() => this.onVisibleDateAddMonths (-2)}
          {...this.link ()} />
        <Button
          glyph    = 'chevron-right'
          text     = 'deux mois'
          justify  = 'flex-start'
          grow     = '1'
          on-click = {() => this.onVisibleDateAddMonths (2)}
          {...this.link ()} />
        <Button
          glyph    = 'chevron-left'
          text     = 'six mois'
          justify  = 'flex-start'
          grow     = '1'
          on-click = {() => this.onVisibleDateAddMonths (-6)}
          {...this.link ()} />
        <Button
          glyph    = 'chevron-right'
          text     = 'six mois'
          justify  = 'flex-start'
          grow     = '1'
          on-click = {() => this.onVisibleDateAddMonths (6)}
          {...this.link ()} />
        <Button
          glyph    = 'step-backward'
          text     = 'année'
          justify  = 'flex-start'
          grow     = '1'
          on-click = {this.onVisibleDatePrevYear}
          {...this.link ()} />
        <Button
          glyph   = 'step-forward'
          text    = 'année'
          justify = 'flex-start'
          grow    = '1'
          on-click = {this.onVisibleDateNextYear}
          {...this.link ()} />
      </div>
      );
    } else {
      return null;
    }
  }

  render () {
    const style = this.mergeStyles ('box');
    return (
      <div style={style}>
        {this.renderMonths ()}
        {this.renderNavigator ()}
      </div>
    );
  }
}

/******************************************************************************/
