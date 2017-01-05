'use strict';

import {ColorHelpers} from 'electrum-theme';
import reducerDragAndDrop from '../polypheme/reducer-drag-and-drop.js';
import {getPackageCount} from './converters';

function isSelected (data, id) {
  reducerDragAndDrop (data, {
    type: 'IS_SELECTED',
    id:   id,
  });
  return data._isSelected;
}

function isExtended (data, id) {
  reducerDragAndDrop (data, {
    type: 'IS_EXTENDED',
    id:   id,
  });
  return data._isExtended;
}

function isFlash (data, id) {
  reducerDragAndDrop (data, {
    type: 'IS_FLASH',
    id:   id,
  });
  return data._isFlash;
}

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

function getPackageDescription (ticket) {
  let desc = getPackageCount (ticket.Trip.Packages.length);
  if (ticket.Trip.Weight) {
    desc += ` — ${ticket.Trip.Weight}`;
  }
  if (ticket.Trip.Product) {
    desc += ` — ${ticket.Trip.Product}`;
  }
  return desc;
}

export {
  isSelected,
  isExtended,
  isFlash,
  getDirectionGlyph,
  getPackageDescription
};
