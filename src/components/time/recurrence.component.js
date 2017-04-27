import CronParser from 'cron-parser';
import {React, Store, State} from 'electrum';
import {Calendar, TextField, LabelTextField, TextFieldDate, Button, Label} from 'electrum-arc';
import * as Converters from '../polypheme/converters';
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
      const itemDate = Converters.jsToFormatedDate (next.value);
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
    this.updateEditor ();
    this.updateInfo ();
    this.updateDates ();
  }


  // LocalBus.notify
  notify (props, source, value) {
    this.internalStore.select (props.field).set ('value', value);
    // TODO: Update external state !

    this.updateInfo ();
    if (props.field === 'Days' || props.field === 'Months') {
      this.updateDates ();
    }
    this.forceUpdate ();
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

  updateEditor () {
    const startDate = this.props.state.get ('StartDate');
    const endDate   = this.props.state.get ('EndDate');
    const cron      = this.props.state.get ('Cron');

    this.internalStore.select ('StartDate').set ('value', startDate);
    this.internalStore.select ('EndDate'  ).set ('value', endDate);

    this.internalStore.select ('Days'  ).set ('value', CronHelpers.getFormatedDays   (cron));
    this.internalStore.select ('Months').set ('value', CronHelpers.getFormatedMonths (cron));

    this.internalStore.select ('Delete').set ('value', []);  // TODO: ...
    this.internalStore.select ('Add'   ).set ('value', []);

    if (!this.visibleDate || this.visibleDate < startDate || this.visibleDate > endDate) {
      if (startDate) {
        const year  = Converters.getYear  (startDate);
        const month = Converters.getMonth (startDate);
        this.visibleDate = Converters.getDate (year, month, 1);
      } else {
        const now = Converters.getNowFormatedDate ();
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

  dateClicked (date) {
    const deleteList = this.internalStore.select ('Delete').get ('value');
    const addList    = this.internalStore.select ('Add'   ).get ('value');
    const item = getRecurrenceItem (date, this.recurrenceDates);
    if (item.Type === 'default') {
      // If click on recurrent event, add a date into section 'Delete' for canceled the recurrence.
      ReducerRecurrence.reducer (deleteList, {type: 'ADD', date: item.Date});
    } else if (item.Type === 'added') {
      // If click on added event, simply remove it.
      ReducerRecurrence.reducer (addList, {type: 'DELETE', date: item.Date});
    } else if (item.Type === 'deleted') {
      // If click on deleted event, remove 'Delete' entry. That restore the recurrent event.
      ReducerRecurrence.reducer (deleteList, {type: 'DELETE', date: item.Date});
    } else if (item.Type === 'none') {
      // If click on free date, add a event.
      ReducerRecurrence.reducer (addList, {type: 'ADD', date: item.Date});
    }
    this.internalStore.select ('Delete').set ('value', deleteList);
    this.internalStore.select ('Add'   ).set ('value', addList);
    this.updateInfo ();
    this.updateDates ();
  }

  createRecurrence () {
    const x = this.read ('do-create');
    if (x) {
      x (this.recurrenceData);
    }
  }

  deleteRecurrence () {
    const x = this.read ('do-delete');
    if (x) {
      const index = this.read ('index');
      x (index);
    }
  }

  eraseEvents () {
    const x = this.read ('do-erase-events');
    if (x) {
      const index = this.read ('index');
      x (index);
    }
  }

  visibleDateChanged (date) {
    this.visibleDate = date;
    this.updateDates ();
    this.forceUpdate ();
  }

  swapExtended () {
    const extended = this.read ('extended') === 'true';
    if (!extended) {  // compact ?
      this.updateEditor ();
      this.updateInfo ();
      this.updateDates ();
    }
    const x = this.read ('do-swap-extended');
    if (x) {
      const index = this.read ('index');
      x (index);
    }
  }

  renderInfo (extended) {
    const singleStyle = this.mergeStyles (extended ? 'header' : 'single');
    return (
      <div style={singleStyle}>
        <Label
          text = {this.periodInfo}
          kind = 'title-recurrence'
          grow = '2'
          {...this.link ()} />
        <Label
          text = {this.cronInfo}
          kind = 'title-recurrence'
          grow = '2.3'
          {...this.link ()} />
        <Button
          kind       = 'recurrence'
          glyph      = {extended ? 'caret-up' : 'caret-down'}
          tooltip    = {extended ? 'Compacte la ligne' : 'Etend la ligne pour la modifier'}
          active     = {extended ? 'true' : 'false'}
          mouse-down = {() => this.swapExtended ()}
          {...this.link ()} />
      </div>
    );
  }

  renderEditorEraser (create) {
    if (create) {
      return null;
    } else {
      return (
        <Button
          glyph      = 'eraser'
          tooltip    = 'Supprime toutes les exceptions'
          mouse-down = {() => this.eraseEvents ()}
          {...this.link ()} />
      );
    }
  }

  renderEditor (create) {
    const editStyle = this.mergeStyles (create ? 'create' : 'edit');

    const buttonGlyph   = create ? 'plus' : 'trash';
    const buttonTooltip = create ? 'Crée une nouvelle ligne' : 'Supprime la ligne';
    const buttonAction  = create ? () => this.createRecurrence () : () => this.deleteRecurrence ();

    return (
      <div style={editStyle}>
        <TextFieldDate
          field       = 'StartDate'
          hint-text   = 'Date de début'
          label-glyph = 'forward'
          grow        = '1'
          spacing     = 'large'
          {...this.linkStartDate ()} />
        <TextFieldDate
          field       = 'EndDate'
          hint-text   = 'Date de fin'
          label-glyph = 'backward'
          grow        = '1'
          spacing     = 'large'
          {...this.linkEndDate ()} />
        <LabelTextField
          field       = 'Days'
          hint-text   = 'Jours de la semaine'
          tooltip     = '1..7 = lundi..dimanche   - = à   , = et'
          label-glyph = 'calendar'
          grow        = '1'
          spacing     = 'large'
          {...this.linkDays ()} />
        <LabelTextField
          field       = 'Months'
          hint-text   = 'Mois de l´année'
          tooltip     = '1..12 = janvier..décembre   - = à   , = et'
          label-glyph = 'calendar-o'
          grow        = '1'
          spacing     = 'large'
          {...this.linkMonths ()} />
        {this.renderEditorEraser (create)}
        <Button
          glyph      = {buttonGlyph}
          tooltip    = {buttonTooltip}
          mouse-down = {buttonAction}
          {...this.link ()} />
      </div>
    );
  }

  renderCalendar () {
    const editStyle = this.mergeStyles ('edit');
    return (
      <div style={editStyle}>
        <Calendar
          month-count          = {monthCount ()}
          visible-date         = {this.visibleDate}
          dates                = {this.dates}
          start-date           = {this.getStartDate ()}
          end-date             = {this.getEndDate ()}
          date-clicked         = {x => this.dateClicked (x)}
          visible-date-changed = {x => this.visibleDateChanged (x)}
          {...this.link ()} />
      </div>
    );
  }

  render () {
    const create   = this.read ('create') === 'true';
    const extended = this.read ('extended') === 'true';

    const boxStyle = this.mergeStyles (extended ? 'extendedBox' : 'box');

    if (create) {
      return (
        <div style={boxStyle}>
          {this.renderEditor (create)}
        </div>
      );
    } else {
      if (extended) {
        return (
          <div style={boxStyle}>
            {this.renderInfo (extended)}
            {this.renderEditor (create)}
            {this.renderCalendar ()}
          </div>
        );
      } else {
        return (
          <div style={boxStyle}>
            {this.renderInfo (extended)}
            {this.renderEditor (create)}
            {this.renderCalendar ()}
          </div>
        );
      }
    }
  }
}

/******************************************************************************/
