'use strict';

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

function splitDate (date) {
  if (date && date.length === 33) {
    // Format '2016-11-30T17:45:03.9052723+01:00'.
    let year   = date.substring (0, 4);
    let month  = date.substring (5, 7);
    let day    = date.substring (8, 10);
    let hour   = date.substring (11, 13);
    let minute = date.substring (14, 16);
    let second = date.substring (17, 19);
    return {
      year:   year,
      month:  month,
      day:    day,
      hour:   hour,
      minute: minute,
      second: second,
    };
  } else {
    throw new Error (`Invalid date ${date}`);
  }
}

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

function joinDate (date) {
  return padding (date.year,   4) + '-' +
         padding (date.month,  2) + '-' +
         padding (date.day,    2) + 'T' +
         padding (date.hour,   2) + ':' +
         padding (date.minute, 2) + ':' +
         padding (date.second, 2) + '.0000000+01:00';
}

function parseTime (time) {
  const result = [];
  if (time) {
    time = time.trim ();
    time = time.replace (/:|;|-|,|\.|\/| /g, ':');
    if (time) {
      const p = time.split (':');
      for (var n of p) {
        result.push (n);
      }
    }
  }
  return result;
}

function getTime (date, useNowByDefault) {
  let d;
  if (date) {
    d = splitDate (date);
  } else if (useNowByDefault) {
    d = getNow ();
  }
  if (d) {
    return padding (d.hour, 2) + ':' + padding (d.minute, 2);
  } else {
    return null;
  }
}

function setTime (date, editedTime) {
  let d;
  if (date) {
    d = splitDate (date);
  } else {
    d = getNow ();
  }
  d.hour   = 0;
  d.minute = 0;
  d.second = 0;
  const edited = parseTime (editedTime);
  if (edited.length > 0) {
    d.hour = edited[0];
  }
  if (edited.length > 1) {
    d.minute = edited[1];
  }
  if (edited.length > 2) {
    d.second = edited[2];
  }
  return joinDate (d);
}

function checkTime (editedTime) {
  const edited = parseTime (editedTime);
  if (edited.length === 0 || edited.length > 3) {
    return false;
  }
  const max = [23, 59, 59];
  let i = 0;
  for (var part of edited) {
    const n = padding (part, 2);
    if (!n || n > max[i++]) {
      return false;
    }
  }
  return true;
}

function getPackageCount (length) {
  return length + 'x';
}

export {getTime, setTime, checkTime, getPackageCount};
