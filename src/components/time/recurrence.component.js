import CronParser from 'cron-parser';
import {React} from 'electrum';
import {Calendar, Container, TextFieldCombo, Button, Label} from 'electrum-arc';
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
    if (recurrence.Cron) {
      pushCron (result, recurrence.Cron, recurrence.StartDate, recurrence.EndDate, date, recurrence.Delete);
    }

    for (var a of recurrence.Add) {
      if (a >= recurrence.StartDate && a <= recurrence.EndDate) {
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
      extended:        false,
      recurrenceDates: [],
      dates:           [],
    };

    this.recurrenceData = this.read ('recurrence');

    if (!this.recurrenceData.Cron) {
      this.recurrenceData.Cron = '0 0 0 * * *';
    }
    if (!this.recurrenceData.Add) {
      this.recurrenceData.Add = [];
    }
    if (!this.recurrenceData.Delete) {
      this.recurrenceData.Delete = [];
    }

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

  getExtended () {
    return this.state.extended;
  }

  setExtended (value) {
    this.setState ( {
      extended: value
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

  componentWillMount () {
    this.setExtended (this.read ('extended') === 'true');
    this.updateEditor ();
    this.updateInfo ();
  }

  componentDidMount () {
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
      console.log ('Recurrence.createRecurrence');
      console.dir (this.recurrenceData);
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

  visibleDateChanged (date) {
    this.visibleDate = date;
    this.updateDates ();
  }

  startDateChanged (e) {
    const value = e.target.value;
    const date = Converters.getFormatedDate (value, true);
    this.recurrenceData.StartDate = date;
    console.log ('Recurrence.startDateChanged ' + date);
    console.dir (this.recurrenceData);
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
    if (this.getExtended ()) {
      this.setExtended (false);
    } else {
      this.updateEditor ();
      this.setExtended (true);
    }
  }

  renderInfo () {
    return (
      <Container kind='row' {...this.link ()}>
        <Label
          text    = {this.getPeriodInfo ()}
          kind    = 'title-recurrence'
          grow    = '2.1'
          {...this.link ()} />
        <Label
          text    = {this.getCronInfo ()}
          kind    = 'title-recurrence'
          grow    = '2'
          spacing = 'large'
          {...this.link ()} />
        <Button
          glyph      = {this.getExtended () ? 'caret-up' : 'caret-down'}
          tooltip    = {this.getExtended () ? 'Compacte la ligne' : 'Etend la ligne pour la modifier'}
          mouse-down = {() => this.swapExtended ()}
          {...this.link ()} />
      </Container>
    );
  }

  renderEditor () {
    return (
      <Container kind='row' {...this.link ()}>
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
          combo-glyph    = 'calendar'
          grow           = '1'
          updateStrategy = 'every-time'
          onChange       = {e => this.daysChanged (e)}
          spacing        = 'large'
          {...this.link ()} />
        <TextFieldCombo
          value          = {this.getMonthsEdited ()}
          hint-text      = 'Mois de l´année'
          combo-glyph    = 'calendar-o'
          grow           = '1'
          updateStrategy = 'every-time'
          onChange       = {e => this.monthsChanged (e)}
          spacing        = 'large'
          {...this.link ()} />
        <Button
          glyph      = 'trash'
          tooltip    = 'Supprime la ligne'
          mouse-down = {() => this.deleteRecurrence ()}
          {...this.link ()} />
      </Container>
    );
  }

  renderCreate () {
    return (
      <Container kind='row' {...this.link ()}>
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
          combo-glyph    = 'calendar'
          grow           = '1'
          updateStrategy = 'every-time'
          onChange       = {e => this.daysChanged (e)}
          spacing        = 'large'
          {...this.link ()} />
        <TextFieldCombo
          value          = {this.getMonthsEdited ()}
          hint-text      = 'Mois de l´année'
          combo-glyph    = 'calendar-o'
          grow           = '1'
          updateStrategy = 'every-time'
          onChange       = {e => this.monthsChanged (e)}
          spacing        = 'large'
          {...this.link ()} />
        <Button
          glyph      = 'plus'
          tooltip    = 'Crée une nouvelle recurrence'
          mouse-down = {() => this.createRecurrence ()}
          {...this.link ()} />
      </Container>
    );
  }

  renderCalendar () {
    if (this.getExtended ()) {
      return (
        <Calendar
          month-count          = {monthCount ()}
          visible-date         = {this.visibleDate}
          dates                = {this.getDates ()}
          start-date           = {this.recurrenceData.StartDate}
          end-date             = {this.recurrenceData.EndDate}
          date-clicked         = {x => this.dateClicked (x)}
          visible-date-changed = {x => this.visibleDateChanged (x)}
          {...this.link ()} />
      );
    } else {
      return null;
    }
  }

  render () {
    const create = this.read ('create');
    const boxStyle = this.mergeStyles ('box');
    if (create === 'true') {
      return (
        <div style={boxStyle}>
          {this.renderCreate ()}
        </div>
      );
    } else {
      if (this.getExtended ()) {
        return (
          <div style={boxStyle}>
            {this.renderInfo ()}
            {this.renderEditor ()}
            {this.renderCalendar ()}
          </div>
        );
      } else {
        return (
          <div style={boxStyle}>
            {this.renderInfo ()}
          </div>
        );
      }
    }
  }
}

/******************************************************************************/
