'use strict';

export function multiply (value, factor) {
  if (value.endsWith ('px')) {
    const v = value.substring (0, value.length - 2);
    return v * factor + 'px';
  } else if (value.endsWith ('em')) {
    const v = value.substring (0, value.length - 2);
    return v * factor + 'em';
  } else if (value.endsWith ('rem')) {
    const v = value.substring (0, value.length - 3);
    return v * factor + 'rem';
  } else if (value.endsWith ('%')) {
    const v = value.substring (0, value.length - 1);
    return v * factor + '%';
  } else {
    return value;
  }
}
