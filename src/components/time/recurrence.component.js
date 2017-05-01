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

  onDateClicked (date) {
    const item = getRecurrenceItem (date, this.recurrenceDates);
    if (item.Type === 'default') {
      // If click on recurrent event, add a date into section 'Delete' for canceled the recurrence.
      const list = this.internalStore.select ('Delete').get ('value');
      const newList = ReducerRecurrence.reducer (list, {type: 'ADD', date: item.Date});
      this.internalStore.select ('Delete').set ('value', newList);
    } else if (item.Type === 'added') {
      // If click on added event, simply remove it.
      const list = this.internalStore.select ('Add').get ('value');
      const newList = ReducerRecurrence.reducer (list, {type: 'DELETE', date: item.Date});
      this.internalStore.select ('Add').set ('value', newList);
    } else if (item.Type === 'deleted') {
      // If click on deleted event, remove 'Delete' entry. That restore the recurrent event.
      const list = this.internalStore.select ('Delete').get ('value');
      const newList = ReducerRecurrence.reducer (list, {type: 'DELETE', date: item.Date});
      this.internalStore.select ('Delete').set ('value', newList);
    } else if (item.Type === 'none') {
      // If click on free date, add a event.
      const list = this.internalStore.select ('Add').get ('value');
      const newList = ReducerRecurrence.reducer (list, {type: 'ADD', date: item.Date});
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

  onSwapExtended () {
    const extended = this.read ('extended') === 'true';
    if (!extended) {  // compact ?
      // this.updateInfo ();
      // this.updateDates ();
    }
    const x = this.read ('do-swap-extended');
    if (x) {
      const index = this.read ('index');
      x (index);
    }
  }

  renderInfo (extended) {
    const style = this.mergeStyles (extended ? 'headerInfoExtended' : 'headerInfoCompacted');
    return (
      <div style={style}>
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
        <Button
          kind            = 'recurrence'
          glyph           = {extended ? 'caret-up' : 'caret-down'}
          tooltip         = {extended ? 'Compacte la ligne' : 'Etend la ligne pour la modifier'}
          active          = {extended ? 'true' : 'false'}
          custom-on-click = {this.onSwapExtended}
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
          glyph           = 'eraser'
          tooltip         = 'Supprime toutes les exceptions'
          custom-on-click = {this.onEraseEvents}
          {...this.link ()} />
      );
    }
  }

  renderEditor (create) {
    const editStyle = this.mergeStyles (create ? 'headerEditor' : 'editor');

    const buttonGlyph   = create ? 'plus' : 'trash';
    const buttonTooltip = create ? 'Crée une nouvelle ligne' : 'Supprime la ligne';
    const buttonAction  = create ? this.onCreateRecurrence : this.onDeleteRecurrence;

    return (
      <div style={editStyle}>
        <TextFieldDate
          field       = 'StartDate'
          hint-text   = 'Date de début'
          tooltip     = 'Date de début'
          label-glyph = 'forward'
          grow        = '1'
          spacing     = 'large'
          {...this.linkStartDate ()} />
        <TextFieldDate
          field       = 'EndDate'
          hint-text   = 'Date de fin'
          tooltip     = 'Date de fin'
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
          glyph           = {buttonGlyph}
          tooltip         = {buttonTooltip}
          custom-on-click = {buttonAction}
          {...this.link ()} />
      </div>
    );
  }

  renderCalendar () {
    const editStyle = this.mergeStyles ('calendar');
    return (
      <div style={editStyle}>
        <Calendar
          month-count          = {monthCount ()}
          visible-date         = {this.visibleDate}
          dates                = {this.dates}
          start-date           = {this.getStartDate ()}
          end-date             = {this.getEndDate ()}
          date-clicked         = {this.onDateClicked}
          visible-date-changed = {this.onVisibleDateChanged}
          {...this.link ()} />
      </div>
    );
  }

  render () {
    this.updateComponent ();

    const create   = this.read ('create') === 'true';
    const extended = this.read ('extended') === 'true';

    const mainStyle = this.mergeStyles ('main');

    if (create) {
      return (
        <div style={mainStyle}>
          {this.renderEditor (create)}
        </div>
      );
    } else {
      const boxStyle = this.mergeStyles (extended ? 'extendedBox' : 'compactedBox');
      return (
        <div style={mainStyle}>
          {this.renderInfo (extended)}
          <div style={boxStyle}>
            {this.renderEditor (create)}
            {this.renderCalendar ()}
          </div>
        </div>
      );
    }
  }
}

/******************************************************************************/
