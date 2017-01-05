'use strict';

function getTime (time) {
  if (time && time.length === 33) {
    // If format '2016-11-30T17:45:03.9052723+01:00', extract 'hh:mm'.
    let h = time.substring (11, 13);
    let m = time.substring (14, 16);
    time = h + ':' + m;
  } else if (time && time.length === 8) {
    // If format '12:45:30', extract 'hh:mm'.
    let h = time.substring (0, 2);
    let m = time.substring (3, 5);
    time = h + ':' + m;
  }
  return time;
}

function getPackageCount (length) {
  return length + 'x';
}

export {getTime, getPackageCount};
