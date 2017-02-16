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

function getPackageCount (length) {
  return length + 'x';
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

function getStatusDescription (ticket) {
  if (ticket.Status === 'pre-dispatched') {
    return 'Pré-dispatché';
  } else if (ticket.Status === 'dispatched') {
    return 'Dispatché';
  } else if (ticket.Status === 'delivered') {
    return 'Livré';
  } else {
    return ticket.Status;
  }
}

module.exports = {
  getDirectionGlyph,
  getPackageDescription,
  getPackageCount,
  getStatusDescription
};
