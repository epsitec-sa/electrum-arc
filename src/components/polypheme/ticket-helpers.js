'use strict';

import {ColorHelpers} from 'electrum-theme';

function getDirectionGlyph (theme, type) {
  const transit = type.endsWith ('-transit');
  const color = ColorHelpers.GetMarkColor (theme, type);
  if (type.startsWith ('pick')) {
    if (transit) {
      return {
        glyph: 'plus-square-o',
        color: color,
      };
    } else {
      return {
        glyph: 'plus-square',
        color: color,
      };
    }
  } else if (type.startsWith ('drop')) {
    if (transit) {
      return {
        glyph: 'minus-square-o',
        color: color,
      };
    } else {
      return {
        glyph: 'minus-square',
        color: color,
      };
    }
  } else {
    throw new Error (`Unknown type ${type}`);
  }
}

export {getDirectionGlyph};
