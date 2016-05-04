'use strict';

export function multiply (value, factor) {
  if (value.endsWith ('px')) {
    const v = value.substring (0, value.length - 2);
    return v * factor + 'px';
  } else if (value.endsWith ('em')) {
    const v = value.substring (0, value.length - 2);
    return v * factor + 'em';
  } else {
    return value;
  }
}
