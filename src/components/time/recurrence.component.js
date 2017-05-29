import CronParser from 'cron-parser';
import {React, Store} from 'electrum';
import {createStore} from 'redux';
import {Calendar, LabelTextField, TextFieldTyped, Button, Label} from 'electrum-arc';
import * as Converters from './converters';
import * as CronHelpers from './cron-helpers';
import * as ReducerRecurrence from './reducer-recurrence.js';

/******************************************************************************/

function monthCount () {
  return 2;  // display 2 months simultaneously
}

function pushCron (result, date, startDate, endDate, cron, deleteList) {
  const year  = Converters.getYear  (date);
  const month = Converters.getMonth (date);
  var options = {
    currentDate: new Date (year, month - 2,             1),
    endDate:     new Date (year, month + monthCount (), 1),
    iterator:    true
  };
  try {
    const interval = CronParser.parseExpression (cron, options);
    /* eslint no-constant-condition: 0 */
    while (true) {
      const next = interval.next ();
      if (next.done) {
        break;
      }
      const itemDate = Converters.jsToCanonicalDate (next.value);
      if (itemDate >= startDate && itemDate <= endDate) {
        const deleted = deleteList.indexOf (itemDate) !== -1;
        const item = {
          Date: itemDate,
          Type: deleted ? 'deleted' : 'default',
        };
        result.push (item);
      }
    }
  } catch (e) {
  }
}

function getRecurrenceItems (date, startDate, endDate, cron, deleteList, addList) {
  const result = [];
  if (!startDate) {
    startDate = '2000-01-01';
  }
  if (!endDate) {
    endDate = '2100-12-31';
  }

  if (cron) {
    pushCron (result, date, startDate, endDate, cron, deleteList);
  }

  for (var a of addList) {
    if (a >= startDate && a <= endDate) {
      const item = {
        Date: a,
        Type: 'added',
      };
      result.push (item);
    }
  }
  return result;
}

function getRecurrenceItem (date, recurrenceList) {
  for (var item of recurrenceList) {
    if (item.Date === date) {
      return item;
    }
  }
  return {
    Date: date,
    Type: 'none',
  };
}

/******************************************************************************/

export default class Recurrence extends React.Component {

  constructor (props) {
    super (props);

    this.internalStore = Store.create ();
    this.localBus = this;  // for access to property notify
  }

  get styleProps () {
    return {
      extended:  this.read ('extended'),
      isDragged: this.read ('isDragged'),
      hasHeLeft: this.read ('hasHeLeft'),
    };
  }

  // LocalBus.notify
  notify (props, source, value) {
    // console.log (`Recurrence.notify field=${props.field} type=${source.type}`);
    if (source.type === 'change') {
      this.internalStore.select (props.field).set ('value', value);
      this.notifyParent ('change');
      this.updateInfo ();
      this.updateDates ();
      this.forceUpdate ();
    }
  }

  notifyParent (type) {
    const source = {type: type};
    this.props.bus.notify (this.props, source, this.getValueState ());
  }

  getValueState () {
    const startDate  = this.internalStore.select ('StartDate').get ('value');
    const endDate    = this.internalStore.select ('EndDate'  ).get ('value');
    const days       = this.internalStore.select ('Days'     ).get ('value');
    const months     = this.internalStore.select ('Months'   ).get ('value');
    const deleteList = this.internalStore.select ('Delete'   ).get ('value');
    const addList    = this.internalStore.select ('Add'      ).get ('value');
    const cron       = CronHelpers.getCron (days, months);

    return {
      id:        this.recurrenceId,
      StartDate: startDate,
      EndDate:   endDate,
      Cron:      cron,
      Delete:    deleteList,
      Add:       addList,
    };
  }

  linkStartDate () {
    return {...this.link (), state: this.internalStore.select ('StartDate'), bus: this.localBus};
  }

  getStartDate () {
    return this.internalStore.select ('StartDate').get ('value');
  }

  linkEndDate () {
    return {...this.link (), state: this.internalStore.select ('EndDate'), bus: this.localBus};
  }

  getEndDate () {
    return this.internalStore.select ('EndDate').get ('value');
  }

  linkDays () {
    return {...this.link (), state: this.internalStore.select ('Days'), bus: this.localBus};
  }

  linkMonths () {
    return {...this.link (), state: this.internalStore.select ('Months'), bus: this.localBus};
  }

  updateComponent () {
    const recurrence = this.read ('value');
    if (recurrence !== this.lastRecurrence) {
      this.updateInternalState (recurrence);
      this.lastRecurrence = recurrence;
      this.updateInfo ();
      this.updateDates ();
    }
  }

  updateInternalState (recurrence) {
    const startDate  = recurrence.StartDate;
    const endDate    = recurrence.EndDate;
    const cron       = recurrence.Cron;
    const deleteList = recurrence.Delete;
    const addList    = recurrence.Add;

    this.recurrenceId = recurrence.id;

    this.internalStore.select ('StartDate').set ('value', startDate);
    this.internalStore.select ('EndDate'  ).set ('value', endDate);

    this.internalStore.select ('Days'  ).set ('value', CronHelpers.getCanonicalDays   (cron));
    this.internalStore.select ('Months').set ('value', CronHelpers.getCanonicalMonths (cron));

    this.internalStore.select ('Delete').set ('value', deleteList);
    this.internalStore.select ('Add'   ).set ('value', addList);

    if (!this.visibleDate || this.visibleDate < startDate || this.visibleDate > endDate) {
      if (startDate) {
        const year  = Converters.getYear  (startDate);
        const month = Converters.getMonth (startDate);
        this.visibleDate = Converters.getDate (year, month, 1);
      } else {
        const now = Converters.getNowCanonicalDate ();
        const year  = Converters.getYear  (now);
        const month = Converters.getMonth (now);
        this.visibleDate = Converters.getDate (year, month, 1);
      }
    }
  }

  updateInfo () {
    const startDate  = this.internalStore.select ('StartDate').get ('value');
    const endDate    = this.internalStore.select ('EndDate'  ).get ('value');
    const days       = this.internalStore.select ('Days'     ).get ('value');
    const months     = this.internalStore.select ('Months'   ).get ('value');
    const deleteList = this.internalStore.select ('Delete'   ).get ('value');
    const addList    = this.internalStore.select ('Add'      ).get ('value');
    const cron       = CronHelpers.getCron (days, months);
    this.periodInfo = Converters.getPeriodDescription (startDate, endDate);
    this.cronInfo   = CronHelpers.getDisplayedCron (cron, deleteList, addList);
  }

  updateDates () {
    const startDate  = this.internalStore.select ('StartDate').get ('value');
    const endDate    = this.internalStore.select ('EndDate'  ).get ('value');
    const days       = this.internalStore.select ('Days'     ).get ('value');
    const months     = this.internalStore.select ('Months'   ).get ('value');
    const deleteList = this.internalStore.select ('Delete'   ).get ('value');
    const addList    = this.internalStore.select ('Add'      ).get ('value');
    const cron       = CronHelpers.getCron (days, months);
    const items = getRecurrenceItems (this.visibleDate, startDate, endDate, cron, deleteList, addList);
    this.recurrenceDates = items;

    const dates = [];
    for (let item of items) {
      if (item.Type === 'default' || item.Type === 'added') {
        dates.push (item.Date);
      }
    }
    this.dates = dates;
  }

  onDateClicked (date) {
    const item = getRecurrenceItem (date, this.recurrenceDates);
    if (item.Type === 'default') {
      // If click on recurrent event, add a date into section 'Delete' for canceled the recurrence.
      const list = this.internalStore.select ('Delete').get ('value');
      const reduxStore = createStore (ReducerRecurrence.reducer, list);
      reduxStore.dispatch (ReducerRecurrence.addAction (item.Date));
      const newList = reduxStore.getState ();
      this.internalStore.select ('Delete').set ('value', newList);
    } else if (item.Type === 'added') {
      // If click on added event, simply remove it.
      const list = this.internalStore.select ('Add').get ('value');
      const reduxStore = createStore (ReducerRecurrence.reducer, list);
      reduxStore.dispatch (ReducerRecurrence.deleteAction (item.Date));
      const newList = reduxStore.getState ();
      this.internalStore.select ('Add').set ('value', newList);
    } else if (item.Type === 'deleted') {
      // If click on deleted event, remove 'Delete' entry. That restore the recurrent event.
      const list = this.internalStore.select ('Delete').get ('value');
      const reduxStore = createStore (ReducerRecurrence.reducer, list);
      reduxStore.dispatch (ReducerRecurrence.deleteAction (item.Date));
      const newList = reduxStore.getState ();
      this.internalStore.select ('Delete').set ('value', newList);
    } else if (item.Type === 'none') {
      // If click on free date, add a event.
      const list = this.internalStore.select ('Add').get ('value');
      const reduxStore = createStore (ReducerRecurrence.reducer, list);
      reduxStore.dispatch (ReducerRecurrence.addAction (item.Date));
      const newList = reduxStore.getState ();
      this.internalStore.select ('Add').set ('value', newList);
    }
    this.notifyParent ('change');
    this.updateInfo ();
    this.updateDates ();
    this.forceUpdate ();
  }

  onCreateRecurrence () {
    this.notifyParent ('create');
    this.updateInfo ();
    this.updateDates ();
    this.forceUpdate ();
  }

  onDeleteRecurrence () {
    this.notifyParent ('delete');
    this.updateInfo ();
    this.updateDates ();
    this.forceUpdate ();
  }

  onEraseEvents () {
    this.internalStore.select ('Delete').set ('value', []);
    this.internalStore.select ('Add'   ).set ('value', []);
    this.notifyParent ('change');
    this.updateInfo ();
    this.updateDates ();
    this.forceUpdate ();
  }

  onVisibleDateChanged (date) {
    this.visibleDate = date;
    this.updateDates ();
    this.forceUpdate ();
  }

  renderInfo (extended) {
    const headerInfoStyle = this.mergeStyles ('headerInfo');
    const headerDragStyle = this.mergeStyles ('headerDrag');
    return (
      <div style={headerInfoStyle}>
        <div style={headerDragStyle}>
          <Label
            text = {this.periodInfo}
            kind = 'title-recurrence'
            grow = '2'
            {...this.link ()} />
          <Label
            text = {this.cronInfo}
            kind = 'title-recurrence'
            grow = '2'
            {...this.link ()} />
        </div>
        <Button
          kind         = 'recurrence'
          glyph        = {extended ? 'caret-up' : 'caret-down'}
          tooltip      = {extended ? 'Compacte la récurrence' : 'Etend la récurrence pour la modifier'}
          active       = {extended ? 'true' : 'false'}
          active-color = {this.props.theme.palette.recurrenceExtendedBoxBackground}
          {...this.link ()} />
      </div>
    );
  }

  renderEditor (extended) {
    if (extended) {
      const style = this.mergeStyles ('editor');
      return (
        <div style={style}>
          <TextFieldTyped
            type                = 'date'
            field               = 'StartDate'
            select-all-on-focus = 'true'
            hint-text           = 'Date de début'
            tooltip             = 'Date de début'
            label-glyph         = 'forward'
            grow                = '1'
            spacing             = 'large'
            {...this.linkStartDate ()} />
          <TextFieldTyped
            type                = 'date'
            field               = 'EndDate'
            select-all-on-focus = 'true'
            hint-text           = 'Date de fin'
            tooltip             = 'Date de fin'
            label-glyph         = 'backward'
            grow                = '1'
            spacing             = 'large'
            {...this.linkEndDate ()} />
          <LabelTextField
            field               = 'Days'
            select-all-on-focus = 'true'
            hint-text           = 'Jours de la semaine'
            tooltip             = '1..7 = lundi..dimanche   - = à   , = et'
            label-glyph         = 'calendar'
            grow                = '1'
            spacing             = 'large'
            {...this.linkDays ()} />
          <LabelTextField
            field               = 'Months'
            select-all-on-focus = 'true'
            hint-text           = 'Mois de l´année'
            tooltip             = '1..12 = janvier..décembre   - = à   , = et'
            label-glyph         = 'calendar-o'
            grow                = '1'
            spacing             = 'large'
            {...this.linkMonths ()} />
          <Button
            glyph    = 'eraser'
            tooltip  = 'Supprime toutes les exceptions'
            on-click = {this.onEraseEvents}
            {...this.link ()} />
          <Button
            glyph    = 'trash'
            tooltip  = 'Supprime la récurrence'
            on-click = {this.onDeleteRecurrence}
            {...this.link ()} />
        </div>
      );
    } else {
      return null;
    }
  }

  renderCalendar (extended) {
    if (extended) {
      const style        = this.mergeStyles ('calendar');
      const buttonsStyle = this.mergeStyles ('calendarButtons');
      return (
        <div style={style}>
          <Calendar
            month-count          = {monthCount ()}
            visible-date         = {this.visibleDate}
            dates                = {this.dates}
            start-date           = {this.getStartDate ()}
            end-date             = {this.getEndDate ()}
            date-clicked         = {this.onDateClicked}
            visible-date-changed = {this.onVisibleDateChanged}
            {...this.link ()} />
          <div style={buttonsStyle}>
            <Button glyph='sun-o'         text='aujourd´hui' justify='flex-start' grow='1' {...this.link ()} />
            <Button glyph='chevron-left'  text='deux mois'   justify='flex-start' grow='1' {...this.link ()} />
            <Button glyph='chevron-right' text='deux mois'   justify='flex-start' grow='1' {...this.link ()} />
            <Button glyph='chevron-left'  text='six mois'    justify='flex-start' grow='1' {...this.link ()} />
            <Button glyph='chevron-right' text='six mois'    justify='flex-start' grow='1' {...this.link ()} />
            <Button glyph='step-backward' text='année préc.' justify='flex-start' grow='1' {...this.link ()} />
            <Button glyph='step-forward'  text='année suiv.' justify='flex-start' grow='1' {...this.link ()} />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  render () {
    this.updateComponent ();

    const extended = this.read ('extended') === 'true';
    const mainStyle = this.mergeStyles ('main');

    return (
      <div style={mainStyle}>
        {this.renderInfo (extended)}
        {this.renderEditor (extended)}
        {this.renderCalendar (extended)}
      </div>
    );
  }
}

/******************************************************************************/
