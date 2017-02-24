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

function getPackageCount (ticket) {
  if (ticket.Packages) {
    return ticket.Packages.length + 'x';
  } else {
    return '';
  }
}

function getPackageDescription (ticket) {
  let desc = getPackageCount (ticket);
  if (ticket.Weight) {
    desc += ` — ${ticket.Weight}`;
  }
  if (ticket.Product) {
    desc += ` — ${ticket.Product}`;
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
