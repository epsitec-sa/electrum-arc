import * as Converters from '../polypheme/converters';

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    |
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, optional)

function join (list, separator) {
  var result = '';
  for (var item of list) {
    if (result !== '') {
      result += separator;
    }
    result += item;
  }
  return result;
}

// Return a recurrence of days. By example:
// lun
// mar à jeu
// mer et ven
export function getDisplayedDays (formatedDays) {
  let result = [];
  if (formatedDays && formatedDays !== '*') {
    for (let c of formatedDays) {
      if (c >= '1' && c <= '7') {
        result.push (Converters.getDOWDescription (c - 1, '3'));
      } else if (c === '-') {
        result.push ('à');
      } else if (c === ',') {
        result.push ('et');
      } else {
        result.push ('?');
      }
    }
  }
  return join (result, ' ');
}

// Return a recurrence of months. By example:
// janv
// févr à sept
// mars et juin
// TODO: process month 10..12 (2 digits) !!!
export function getDisplayedMonths (formatedMonths) {
  let result = [];
  if (formatedMonths && formatedMonths !== '*') {
    for (let c of formatedMonths) {
      if (c >= '1' && c <= '9') {
        result.push (Converters.getMonthDescription (c - 1, '4').toLowerCase ());
      } else if (c === '-') {
        result.push ('à');
      } else if (c === ',') {
        result.push ('et');
      } else {
        result.push ('?');
      }
    }
  }
  return join (result, ' ');
}

// Return a recurrence of days. By example:
// 1
// 2-4
// 3,5
export function getFormatedDays (cron) {
  if (cron) {
    const a = cron.split (' ');
    if (a.length > 5) {
      const f = a[5];
      if (f === '*') {
        return null;
      }
      return f;
    }
  }
  return null;
}

// Return a recurrence of months. By example:
// 1
// 2-9
// 3,6
export function getFormatedMonths (cron) {
  if (cron) {
    const a = cron.split (' ');
    if (a.length > 4) {
      const f = a[4];
      if (f === '*') {
        return null;
      }
      return f;
    }
  }
  return null;
}

// Return a full description of recurrence. By example:
// lun et jeu, mars à sept, -4, +5
export function getDisplayedCron (cron, deleteList, addList) {
  const result = [];

  const d = getDisplayedDays (getFormatedDays (cron));
  if (d && d !== '') {
    result.push (d);
  }

  const m = getDisplayedMonths (getFormatedMonths (cron));
  if (m && m !== '') {
    result.push (m);
  }

  if (deleteList && deleteList.length > 0) {
    result.push ('-' + deleteList.length);
  }

  if (addList && addList.length > 0) {
    result.push ('+' + addList.length);
  }

  return join (result, ', ');
}

// Return a cron expression. By example:
// 0 0 0 * * 1,4
// 0 0 0 * * 2
// 0 0 0 * 3-6 2
export function getCron (formatedDays, formatedMonths) {
  if (!formatedDays || formatedDays === '') {
    formatedDays = '*';
  }
  if (!formatedMonths || formatedMonths === '') {
    formatedMonths = '*';
  }
  return `0 0 0 * ${formatedMonths} ${formatedDays}`;
}
