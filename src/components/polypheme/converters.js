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

function joinTime (time) {
  return padding (time.hour,   2) + ':' +
         padding (time.minute, 2) + ':' +
         padding (time.second, 2);
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

function getTime (time, useNowByDefault) {
  let d;
  if (time) {
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

function setTime (time, editedTime) {
  let d;
  if (time) {
    d = splitTime (time);
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
  return joinTime (d);
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
