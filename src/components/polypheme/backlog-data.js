'use strict';

import Converters from './converters';

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
  if (data.BacklogFilter === 'Tous') {
    return false;
  } else {
    if (!ticket.Trip || !ticket.Trip.Product) {
      return true;
    } else if (data.BacklogFilter.indexOf ('dring') !== -1) {
      return ticket.Trip.Product.indexOf ('dring') === -1;
    } else if (data.BacklogFilter.indexOf ('urgent') !== -1) {
      return ticket.Trip.Product !== 'Urgent';
    }
    return false;
  }
}

function getTickets (data) {
  const result = [];
  for (var ticket of data.Backlog.Tickets) {
    if (!isFiltered (data, ticket)) {
      result.push (ticket);
    }
  }
  if (data.BacklogSort.indexOf ('heure pick') !== -1) {
    return result.sort (sortTimePick);
  } else if (data.BacklogSort.indexOf ('heure drop') !== -1) {
    return result.sort (sortTimeDrop);
  } else if (data.BacklogSort.indexOf ('zone pick') !== -1) {
    return result.sort (sortZonePick);
  } else if (data.BacklogSort.indexOf ('zone drop') !== -1) {
    return result.sort (sortZoneDrop);
  } else if (data.BacklogSort.indexOf ('produit') !== -1) {
    return result.sort (sortProduct);
  } else if (data.BacklogSort.indexOf ('prix') !== -1) {
    return result.sort (sortPrice);
  } else if (data.BacklogSort.indexOf ('poids') !== -1) {
    return result.sort (sortWeight);
  }
  return result;
}

export {getTickets};
