/* global window */

/******************************************************************************/
// Returns the items to populate the sort combo-menu.
// It is here (for now) that the possible actions are decided, not in the C#.
// The key (byPickTime, byProduct, usw.) is used to exchange information in data.BacklogSort (JS <-> C#).
export function getSortItems () {
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
export function getFilterItems () {
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
  const ta = a.MeetingPoint.StartPlanedTime;
  const tb = b.MeetingPoint.StartPlanedTime;
  return ta.localeCompare (tb);
}

function sortZone (a, b) {
  const ta = a.MeetingPoint.Zone;
  const tb = b.MeetingPoint.Zone;
  return ta.localeCompare (tb);
}

function sortProduct (a, b) {
  const ta = a.Product;
  const tb = b.Product;
  return ta.localeCompare (tb);
}

function sortPrice (a, b) {
  const ta = a.NetPrice;
  const tb = b.NetPrice;
  return tb.localeCompare (ta);
}

function sortWeight (a, b) {
  const ta = a.Weight;
  const tb = b.Weight;
  return tb.localeCompare (ta);
}

function isFiltered (data, ticket) {
  if (data.BacklogFilter === 'all') {
    return false;
  } else {
    if (!ticket.Product) {
      return true;
    } else if (data.BacklogFilter === 'dringDring') {
      return ticket.Product.indexOf ('dring') === -1;
    } else if (data.BacklogFilter === 'urgent') {
      return ticket.Product !== 'Urgent';
    }
    return false;
  }
}

// Return sorted content of backlog, only with 'mock = true'.
// With 'mock = false', it is the C# that decides on filtering and sorting.
export function getSortedBacklog (data) {
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
