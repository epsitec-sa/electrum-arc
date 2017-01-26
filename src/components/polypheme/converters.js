'use strict';

// value =    5, decimals = 3  -> return '005'
// value =   12, decimals = 3  -> return '012'
// value = 1234, decimals = 3  -> return '1234'
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

// With '12:34:56', return {hour: 12, minute: 34, second: 56}.
function splitTime (time) {
  if (time && time.length === 8) {
    // Format '17:45:03'.
    let hour   = time.substring (0, 2);
    let minute = time.substring (3, 5);
    let second = time.substring (6, 8);
    return {
      hour:   hour,
      minute: minute,
      second: second,
    };
  } else {
    throw new Error (`Invalid time ${time}`);
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

// With [12, 3], return '12:03:00'.
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

// With time = '12:34:56', return '12:34'.
function getDisplayedTime (time, useNowByDefault) {
  let d;
  if (time && !isEmptyTime (time)) {
    d = splitTime (time);
  } else if (useNowByDefault) {
    d = getNow ();
  }
  if (d) {
    return padding (d.hour, 2) + ':' + padding (d.minute, 2);
  } else {
    return null;
  }
}

// With editedTime = '12', return '12:00:00'.
function getFormatedTime (editedTime) {
  const d = {
    hour:   0,
    minute: 0,
    second: 0,
  };
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
  return joinTime (d);
}

// With '12 3', return true;
// With '12 60', return false;
// With '12 3 4 5', return false;
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
  const time = getFormatedTime (editedTime);
  if (isEmptyTime (time)) {
    return false;
  }
  return true;
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

function getPackageCount (length) {
  return length + 'x';
}

export {getDisplayedTime, getFormatedTime, checkTime, getEmptyTime, getEmptyDate, isEmptyTime, isEmptyDate, getPackageCount};
