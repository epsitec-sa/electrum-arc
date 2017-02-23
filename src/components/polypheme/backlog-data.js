'use strict';

import Converters from './converters';

// --------------------------------------------------------------------------------------------------------------------

// Returns the items to populate the sort combo-menu.
// It is here (for now) that the possible actions are decided, not in the C#.
// The key (byPickTime, byProduct, usw.) is used to exchange information in data.BacklogSort (JS <-> C#).
function getSortItems () {
  return {
    byTime: {
      description: 'Par heures',
      glyph:       'clock-o',
    },
    byZone: {
      description: 'Par zones',
      glyph:       'map-marker',
    },
    byProduct: {
      description: 'Par produits',
      glyph:       'cube',
    },
    byPrice: {
      description: 'Par prix',
      glyph:       'dollar',
    },
    byWeight: {
      description: 'Par poids',
      glyph:       'balance-scale',
    },
  };
}

// Returns the items to populate the filter combo-menu.
// It is here (for now) that the possible actions are decided, not in the C#.
// The key (all, urgent, usw.) is used to exchange information in data.BacklogFilter (JS <-> C#).
function getFilterItems () {
  return {
    all: {
      description: 'Tous',
      glyph:       'square',
    },
    dringDring: {
      description: 'Seulement les dring-dring',
      glyph:       'bell',
    },
    urgent: {
      description: 'Seulement les urgents',
      glyph:       'fighter-jet',
    },
  };
}

// --------------------------------------------------------------------------------------------------------------------

function sortTime (a, b) {
  const ta = Converters.getFormatedTime (a.Trip.MeetingPoint.StartPlanedTime);
  const tb = Converters.getFormatedTime (b.Trip.MeetingPoint.StartPlanedTime);
  return ta.localeCompare (tb);
}

function sortZone (a, b) {
  const ta = a.Trip.MeetingPoint.Zone;
  const tb = b.Trip.MeetingPoint.Zone;
  return ta.localeCompare (tb);
}

function sortProduct (a, b) {
  const ta = a.Trip.Product;
  const tb = b.Trip.Product;
  return ta.localeCompare (tb);
}

function sortPrice (a, b) {
  const ta = a.Trip.Price;
  const tb = b.Trip.Price;
  return tb.localeCompare (ta);
}

function sortWeight (a, b) {
  const ta = a.Trip.Weight;
  const tb = b.Trip.Weight;
  return tb.localeCompare (ta);
}

function isFiltered (data, ticket) {
  if (data.BacklogFilter === 'all') {
    return false;
  } else {
    if (!ticket.Trip || !ticket.Trip.Product) {
      return true;
    } else if (data.BacklogFilter === 'dringDring') {
      return ticket.Trip.Product.indexOf ('dring') === -1;
    } else if (data.BacklogFilter === 'urgent') {
      return ticket.Trip.Product !== 'Urgent';
    }
    return false;
  }
}

// Return sorted content of backlog, only with 'mock = true'.
// With 'mock = false', it is the C# that decides on filtering and sorting.
function getSortedBacklog (data) {
  if (window.document.mock) {
    const result = [];
    for (var ticket of data.Backlog.Tickets) {
      if (!isFiltered (data, ticket)) {
        result.push (ticket);
      }
    }
    if (data.BacklogSort === 'byTime') {
      return result.sort (sortTime);
    } else if (data.BacklogSort === 'byZone') {
      return result.sort (sortZone);
    } else if (data.BacklogSort === 'byProduct') {
      return result.sort (sortProduct);
    } else if (data.BacklogSort === 'byPrice') {
      return result.sort (sortPrice);
    } else if (data.BacklogSort === 'byWeight') {
      return result.sort (sortWeight);
    }
    return result;
  } else {
    return data.Backlog.Tickets;  // bypass
  }
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = {
  getSortItems, getFilterItems,
  getSortedBacklog,
};
