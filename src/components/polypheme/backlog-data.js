'use strict';

import Converters from './converters';

// --------------------------------------------------------------------------------------------------------------------

// Returns the items to populate the sort combo-menu.
// It is here (for now) that the possible actions are decided, not in the C#.
// The key (byPickTime, byProduct, usw.) is used to exchange information in data.BacklogSort (JS <-> C#).
function getSortItems () {
  return {
    byPickTime: {
      description: 'Par heure pick',
      glyph:       'clock-o',
    },
    byDropTime: {
      description: 'Par heure drop',
      glyph:       'clock-o',
    },
    byPickZone: {
      description: 'Par zone pick',
      glyph:       'map-marker',
    },
    byDropZone: {
      description: 'Par zone drop',
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

function sortTimePick (a, b) {
  const ta = Converters.getFormatedTime (a.Trip.Pick.PlanedTime);
  const tb = Converters.getFormatedTime (b.Trip.Pick.PlanedTime);
  return ta.localeCompare (tb);
}

function sortTimeDrop (a, b) {
  const ta = Converters.getFormatedTime (a.Trip.Drop.PlanedTime);
  const tb = Converters.getFormatedTime (b.Trip.Drop.PlanedTime);
  return ta.localeCompare (tb);
}

function sortZonePick (a, b) {
  const ta = a.Trip.Pick.Zone;
  const tb = b.Trip.Pick.Zone;
  return ta.localeCompare (tb);
}

function sortZoneDrop (a, b) {
  const ta = a.Trip.Drop.Zone;
  const tb = b.Trip.Drop.Zone;
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
    if (data.BacklogSort === 'byPickTime') {
      return result.sort (sortTimePick);
    } else if (data.BacklogSort === 'byDropTime') {
      return result.sort (sortTimeDrop);
    } else if (data.BacklogSort === 'byPickZone') {
      return result.sort (sortZonePick);
    } else if (data.BacklogSort === 'byDropZone') {
      return result.sort (sortZoneDrop);
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
