'use strict';

// month is zero based (0 = january).
function getMonthDescription (month) {
  const array = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];
  return array[month];
}

// dow is zero based (0 = monday).
function getDOWDescription (dow, format) {
  const array = [
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
    'dimanche',
  ];
  if (format === '3') {
    return array[dow].substring (0, 3);
  } else {
    return array[dow];
  }
}

function getEmptyTime () {
  return '00:00:00';
}

function getEmptyDate () {
  return '0001-01-01';
}

function isEmptyTime (time) {
  return !time || time === getEmptyTime ();
}

function isEmptyDate (date) {
  return !date || date === getEmptyDate ();
}

// value =  '1', decimals = 3  -> return '001'
// value =  'a', decimals = 3  -> return null
// value =    5, decimals = 3  -> return '005'
// value =   12, decimals = 3  -> return '012'
// value = 1234, decimals = 3  -> return null
function padding (value, decimals) {
  if (typeof value === 'string') {
    value = parseInt (value);
    if (isNaN (value)) {
      return null;
    }
  }
  const result = value.toLocaleString ('en-US', {minimumIntegerDigits: decimals, useGrouping: false});
  if (result.length > decimals) {
    return null;
  } else {
    return result;
  }
}

function jsToFormatedTime (time) {
  return padding (time.getHours (), 2) + ':' + padding (time.getMinutes (), 2) + ':' + padding (time.getSeconds (), 2);
}

function formatedTimeToJs (time) {
  const s = splitTime (time);
  return new Date (2000, 1, 1, s.hour, s.minute, s.second);
}

function jsToFormatedDate (date) {
  return padding (date.getFullYear (), 4) + '-' + padding (date.getMonth () + 1, 2) + '-' + padding (date.getDate (), 2);
}

function formatedDateToJs (date) {
  const s = splitDate (date);
  return new Date (s.year, s.month - 1, s.day);
}

function addHours (time, n) {
  const d = formatedTimeToJs (time);
  const nd = new Date (2000, 1, 1, d.getHours () + n, d.getMinutes (), d.getSeconds ());
  return jsToFormatedTime (nd);
}

function addMinutes (time, n) {
  const d = formatedTimeToJs (time);
  const nd = new Date (2000, 1, 1, d.getHours (), d.getMinutes () + n, d.getSeconds ());
  return jsToFormatedTime (nd);
}

function addSeconds (time, n) {
  const d = formatedTimeToJs (time);
  const nd = new Date (2000, 1, 1, d.getHours (), d.getMinutes (), d.getSeconds () + n);
  return jsToFormatedTime (nd);
}

function addDays (date, n) {
  const d = formatedDateToJs (date);
  const nd = new Date (d.getFullYear (), d.getMonth (), d.getDate () + n);
  return jsToFormatedDate (nd);
}

function addMonths (date, n) {
  const d = formatedDateToJs (date);
  const nd = new Date (d.getFullYear (), d.getMonth () + n, d.getDate ());
  return jsToFormatedDate (nd);
}

function addYears (date, n) {
  const d = formatedDateToJs (date);
  const nd = new Date (d.getFullYear () + n, d.getMonth (), d.getDate ());
  return jsToFormatedDate (nd);
}

// With '2017-03-31', return {year: 2017, month: 03, day: 31}.
function splitDate (date) {
  if (!date || date.length !== 10 || date[4] !== '-' || date[7] !== '-') {
    throw new Error (`Bad formated date '${date}' (must be 'yyyy-mm-dd')`);
  }
  let year  = parseInt (date.substring (0, 4));
  let month = parseInt (date.substring (5, 7));
  let day   = parseInt (date.substring (8, 10));
  return {
    year:  year,
    month: month,
    day:   day,
  };
}

// With '12:34:56', return {hour: 12, minute: 34, second: 56}.
function splitTime (time) {
  if (!time || time.length !== 8 || time[2] !== ':' || time[5] !== ':') {
    throw new Error (`Bad formated time '${time}' (must be 'hh:mm:ss')`);
  }
  let hour   = parseInt (time.substring (0, 2));
  let minute = parseInt (time.substring (3, 5));
  let second = parseInt (time.substring (6, 8));
  return {
    hour:   hour,
    minute: minute,
    second: second,
  };
}

// Return actual date and time.
function getNow () {
  const now = new Date (Date.now ());
  return {
    year:   now.getFullYear (),
    month:  now.getMonth () + 1,
    day:    now.getDate (),
    hour:   now.getHours (),
    minute: now.getMinutes (),
    second: now.getSeconds (),
  };
}

// With {year: 2017, month: 03, day: 31}, return '2017-03-31'.
function joinDate (date) {
  return padding (date.year,  4) + '-' +
         padding (date.month, 2) + '-' +
         padding (date.day,   2);
}

// With {hour: 12, minute: 34, second: 56}, return '12:34:56'.
function joinTime (time) {
  return padding (time.hour,   2) + ':' +
         padding (time.minute, 2) + ':' +
         padding (time.second, 2);
}

// With ' 12/3 ', return [12, 3].
function parseTime (editedTime) {
  const result = [];
  if (editedTime) {
    editedTime = editedTime.trim ();
    editedTime = editedTime.replace (/:|;|-|,|\.|\/| /g, ':');
    if (editedTime) {
      const p = editedTime.split (':');
      for (var n of p) {
        result.push (n);
      }
    }
  }
  return result;
}

function getTimeFromMinutes (minutes) {
  const hour = Math.floor (minutes / 60);
  const minute = minutes % 60;
  return joinTime ({hour: hour, minute: minute, second: 0});
}

function getMinutes (time) {
  const s = splitTime (time);
  return (s.hour * 60) + s.minute;
}

// With date = '2017-03-31', return '31.03.2017'.
function getDisplayedDate (date, useNowByDefault, format) {
  let d;
  if (date && !isEmptyDate (date)) {
    d = splitDate (date);
  } else if (useNowByDefault) {
    d = getNow ();
  }
  if (d) {
    if (format === 'y') {
      return padding (d.year, 4);
    } else if (format === 'My') {
      return getMonthDescription (d.month - 1) + ' ' + padding (d.year, 4);
    } else if (format === 'W') {
      const w = formatedDateToJs (date).getDay ();  // 0..6 (0 = Sunday)
      return getDOWDescription ((w + 6) % 7);
    } else if (format === 'Wd') {
      const w = formatedDateToJs (date).getDay ();  // 0..6 (0 = Sunday)
      return getDOWDescription ((w + 6) % 7, '3') + ' ' + padding (d.day, 2);
    } else if (format === 'Wdm') {
      const w = formatedDateToJs (date).getDay ();  // 0..6 (0 = Sunday)
      return getDOWDescription ((w + 6) % 7, '3') + ' ' + padding (d.day, 2) + '.' + padding (d.month, 2);
    } else if (format === 'Wdmy') {
      const w = formatedDateToJs (date).getDay ();  // 0..6 (0 = Sunday)
      return getDOWDescription ((w + 6) % 7, '3') + ' ' + padding (d.day, 2) + '.' + padding (d.month, 2) + '.' + padding (d.year, 4);
    } else {
      return padding (d.day, 2) + '.' + padding (d.month, 2) + '.' + padding (d.year, 4);
    }
  } else {
    return date;  // return the initial text if it's not a valid date
  }
}

// With time = '12:34:56', return '12:34'.
function getDisplayedTime (time, useNowByDefault, format) {
  let d;
  if (time && !isEmptyTime (time)) {
    d = splitTime (time);
  } else if (useNowByDefault) {
    d = getNow ();
  }
  if (d) {
    if (format === 'hms') {
      return padding (d.hour, 2) + ':' + padding (d.minute, 2) + ':' + padding (d.second, 2);
    } else if (format === 'h') {
      return padding (d.hour, 2);
    } else {
      return padding (d.hour, 2) + ':' + padding (d.minute, 2);
    }
  } else {
    return null;
  }
}

// With editedTime = '12', return '12:00:00'.
function getFormatedTime (editedTime) {
  const time = {
    hour:   0,
    minute: 0,
    second: 0,
  };
  const edited = parseTime (editedTime);
  if (edited.length > 0) {
    time.hour = edited[0];
  }
  if (edited.length > 1) {
    time.minute = edited[1];
  }
  if (edited.length > 2) {
    time.second = edited[2];
  }
  return joinTime (time);
}

// With '12 3', return true;
// With '12 60', return false;
// With '12 3 4 5', return false;
function checkTime (editedTime) {
  const edited = parseTime (editedTime);
  if (edited.length === 0 || edited.length > 3) {
    return false;
  }
  const max = [23, 59, 59];  // max for hour, minute and second
  let i = 0;
  for (var part of edited) {
    const n = padding (part, 2);
    if (!n || n > max[i++]) {
      return false;
    }
  }
  const time = getFormatedTime (editedTime);
  if (isEmptyTime (time)) {
    return false;
  }
  return true;
}

module.exports = {
  getMonthDescription, getDOWDescription,
  getEmptyTime, getEmptyDate,
  isEmptyTime, isEmptyDate,
  getDisplayedTime, getFormatedTime, checkTime, splitTime, getTimeFromMinutes, getMinutes,
  getDisplayedDate,
  addHours, addMinutes, addSeconds,
  addDays, addMonths, addYears,
};
