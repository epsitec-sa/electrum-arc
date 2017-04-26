/* global window */

import CronParser from 'cron-parser';
import {React} from 'electrum';
import {Calendar, TextFieldCombo, Button, Label} from 'electrum-arc';
import * as Converters from '../polypheme/converters';
import * as CronHelpers from './cron-helpers';
import * as ReducerRecurrence from './reducer-recurrence.js';

/******************************************************************************/

function monthCount () {
  return 2;  // display 2 months simultaneously
}

function pushCron (result, cron, startDate, endDate, date, deleteList) {
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

function getRecurrenceItems (recurrence, date) {
  const result = [];
  if (recurrence) {
    let startDate = recurrence.StartDate;
    if (!startDate) {
      startDate = '2000-01-01';
    }
    let endDate = recurrence.EndDate;
    if (!endDate) {
      endDate = '2100-12-31';
    }

    if (recurrence.Cron) {
      pushCron (result, recurrence.Cron, startDate, endDate, date, recurrence.Delete);
    }

    for (var a of recurrence.Add) {
      if (a >= startDate && a <= endDate) {
        const item = {
          Date: a,
          Type: 'added',
        };
        result.push (item);
      }
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
    this.state = {
      periodInfo:      null,
      cronInfo:        null,
      startDateEdited: null,
      endDateEdited:   null,
      daysEdited:      null,
      monthsEdited:    null,
      recurrenceDates: [],
      dates:           [],
    };
  }

  getPeriodInfo () {
    return this.state.periodInfo;
  }

  setPeriodInfo (value) {
    this.setState ( {
      periodInfo: value
    });
  }

  getCronInfo () {
    return this.state.cronInfo;
  }

  setCronInfo (value) {
    this.setState ( {
      cronInfo: value
    });
  }

  getStartDateEdited () {
    return this.state.startDateEdited;
  }

  setStartDateEdited (value) {
    this.setState ( {
      startDateEdited: value
    });
  }

  getEndDateEdited () {
    return this.state.endDateEdited;
  }

  setEndDateEdited (value) {
    this.setState ( {
      endDateEdited: value
    });
  }

  getDaysEdited () {
    return this.state.daysEdited;
  }

  setDaysEdited (value) {
    this.setState ( {
      daysEdited: value
    });
  }

  getMonthsEdited () {
    return this.state.monthsEdited;
  }

  setMonthsEdited (value) {
    this.setState ( {
      monthsEdited: value
    });
  }

  getRecurrenceDates () {
    return this.state.recurrenceDates;
  }

  setRecurrenceDates (value) {
    this.setState ( {
      recurrenceDates: value
    });
  }

  getDates () {
    return this.state.dates;
  }

  setDates (value) {
    this.setState ( {
      dates: value
    });
  }

  initializeDates (recurrence) {
    this.recurrenceData = recurrence ? recurrence : this.read ('recurrence');

    if (!this.recurrenceData.Cron) {
      this.recurrenceData.Cron = '0 0 0 * * *';
    }
    if (!this.recurrenceData.Add) {
      this.recurrenceData.Add = [];
    }
    if (!this.recurrenceData.Delete) {
      this.recurrenceData.Delete = [];
    }

    let startDate = this.recurrenceData.StartDate ? this.recurrenceData.StartDate : null;
    if (!startDate) {
      startDate = '2000-01-01';
    }
    let endDate = this.recurrenceData.EndDate ? this.recurrenceData.EndDate : null;
    if (!endDate) {
      endDate = '2100-12-31';
    }
    if (!this.visibleDate || this.visibleDate < startDate || this.visibleDate > endDate) {
      if (this.recurrenceData.StartDate) {
        const year  = Converters.getYear  (this.recurrenceData.StartDate);
        const month = Converters.getMonth (this.recurrenceData.StartDate);
        this.visibleDate = Converters.getDate (year, month, 1);
      } else {
        const now = Converters.getNowFormatedDate ();
        const year  = Converters.getYear  (now);
        const month = Converters.getMonth (now);
        this.visibleDate = Converters.getDate (year, month, 1);
      }
    }
  }

  componentWillMount () {
    this.initializeDates ();
    this.updateEditor ();
    this.updateInfo ();
    this.updateDates ();
  }

  componentDidMount () {
    // TODO: Shit code to replace by correct code !!!
    if (!window.document.recurrenceComponents) {
      window.document.recurrenceComponents = [];
    }
    window.document.recurrenceComponents.push (this);
  }

  componentWillUnmount () {
    // TODO: Shit code to replace by correct code !!!
    const index = window.document.recurrenceComponents.indexOf (this);
    if (index !== -1) {
      window.document.recurrenceComponents.splice (index, 1);
    }
  }

  updateComponent (recurrence) {
    this.initializeDates (recurrence);
    this.updateEditor ();
    this.updateInfo ();
    this.updateDates ();
  }

  updateEditor () {
    this.setStartDateEdited (Converters.getDisplayedDate (this.recurrenceData.StartDate));
    this.setEndDateEdited   (Converters.getDisplayedDate (this.recurrenceData.EndDate));
    this.setDaysEdited   (CronHelpers.getFormatedDays   (this.recurrenceData.Cron));
    this.setMonthsEdited (CronHelpers.getFormatedMonths (this.recurrenceData.Cron));
  }

  updateInfo () {
    this.setPeriodInfo (Converters.getPeriodDescription (this.recurrenceData.StartDate, this.recurrenceData.EndDate));
    this.setCronInfo (CronHelpers.getDisplayedCron (this.recurrenceData));
  }

  updateDates () {
    const items = getRecurrenceItems (this.recurrenceData, this.visibleDate);
    this.setRecurrenceDates (items);

    const dates = [];
    for (let item of items) {
      if (item.Type === 'default' || item.Type === 'added') {
        dates.push (item.Date);
      }
    }
    this.setDates (dates);
  }

  dateClicked (date) {
    const item = getRecurrenceItem (date, this.getRecurrenceDates ());
    var data = this.recurrenceData;
    if (item.Type === 'default') {
      // If click on recurrent event, add a date into section 'Delete' for canceled the recurrence.
      data = ReducerRecurrence.reducer (data, {type: 'ADD_DELETE', date: item.Date});
    } else if (item.Type === 'added') {
      // If click on added event, simply remove it.
      data = ReducerRecurrence.reducer (data, {type: 'DELETE_ADD', date: item.Date});
    } else if (item.Type === 'deleted') {
      // If click on deleted event, remove 'Delete' entry. That restore the recurrent event.
      data = ReducerRecurrence.reducer (data, {type: 'DELETE_DELETE', date: item.Date});
    } else if (item.Type === 'none') {
      // If click on free date, add a event.
      data = ReducerRecurrence.reducer (data, {type: 'ADD_ADD', date: item.Date});
    }
    this.recurrenceData = data;
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
  }

  startDateChanged (e) {
    const value = e.target.value;
    const date = Converters.getFormatedDate (value, true);
    this.recurrenceData.StartDate = date;
    this.updateInfo ();
  }

  endDateChanged (e) {
    const value = e.target.value;
    const date = Converters.getFormatedDate (value, true);
    this.recurrenceData.EndDate = date;
    this.updateInfo ();
  }

  daysChanged (e) {
    const value = e.target.value;
    const months = CronHelpers.getFormatedMonths (this.recurrenceData.Cron);
    this.recurrenceData.Cron = CronHelpers.getCron (value, months);
    this.updateInfo ();
    this.updateDates ();
  }

  monthsChanged (e) {
    const value = e.target.value;
    const days = CronHelpers.getFormatedDays (this.recurrenceData.Cron);
    this.recurrenceData.Cron = CronHelpers.getCron (days, value);
    this.updateInfo ();
    this.updateDates ();
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
          text = {this.getPeriodInfo ()}
          kind = 'title-recurrence'
          grow = '2.1'
          {...this.link ()} />
        <Label
          text = {this.getCronInfo ()}
          kind = 'title-recurrence'
          grow = '2'
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
        <TextFieldCombo
          value          = {this.getStartDateEdited ()}
          hint-text      = 'Date de début'
          combo-glyph    = 'forward'
          grow           = '1'
          updateStrategy = 'every-time'
          onChange       = {e => this.startDateChanged (e)}
          spacing        = 'large'
          {...this.link ()} />
        <TextFieldCombo
          value          = {this.getEndDateEdited ()}
          hint-text      = 'Date de fin'
          combo-glyph    = 'backward'
          grow           = '1'
          updateStrategy = 'every-time'
          onChange       = {e => this.endDateChanged (e)}
          spacing        = 'large'
          {...this.link ()} />
        <TextFieldCombo
          value          = {this.getDaysEdited ()}
          hint-text      = 'Jours de la semaine'
          tooltip        = '1..7 = lundi..dimanche   - = à   , = et'
          combo-glyph    = 'calendar'
          grow           = '1'
          updateStrategy = 'every-time'
          onChange       = {e => this.daysChanged (e)}
          spacing        = 'large'
          {...this.link ()} />
        <TextFieldCombo
          value          = {this.getMonthsEdited ()}
          hint-text      = 'Mois de l´année'
          tooltip        = '1..12 = janvier..décembre   - = à   , = et'
          combo-glyph    = 'calendar-o'
          grow           = '1'
          updateStrategy = 'every-time'
          onChange       = {e => this.monthsChanged (e)}
          spacing        = 'large'
          {...this.link ()} />
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
          dates                = {this.getDates ()}
          start-date           = {this.recurrenceData.StartDate}
          end-date             = {this.recurrenceData.EndDate}
          date-clicked         = {x => this.dateClicked (x)}
          visible-date-changed = {x => this.visibleDateChanged (x)}
          {...this.link ()} />
      </div>
    );
  }

  render () {
    this.initializeDates ();

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
