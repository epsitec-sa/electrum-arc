'use strict';

function getTime (time) {
  if (time && time.length === 33) {
    // If format '2016-11-30T17:45:03.9052723+01:00', extract 'hh:mm'.
    let h = time.substring (11, 13);
    let m = time.substring (14, 16);
    time = h + ':' + m;
  } else if (time && time.length === 8) {
    // If format '12:45:30', extract 'hh:mm'.
    let h = time.substring (0, 2);
    let m = time.substring (3, 5);
    time = h + ':' + m;
  }
  return time;
}

function sortTimePick (a, b) {
  const ta = getTime (a.Trip.Pick.PlanedTime);
  const tb = getTime (b.Trip.Pick.PlanedTime);
  return ta.localeCompare (tb);
}

function sortTimeDrop (a, b) {
  const ta = getTime (a.Trip.Drop.PlanedTime);
  const tb = getTime (b.Trip.Drop.PlanedTime);
  return ta.localeCompare (tb);
}

function sortZonePick (a, b) {
  const ta = getTime (a.Trip.Pick.Zone);
  const tb = getTime (b.Trip.Pick.Zone);
  return ta.localeCompare (tb);
}

function sortZoneDrop (a, b) {
  const ta = getTime (a.Trip.Drop.Zone);
  const tb = getTime (b.Trip.Drop.Zone);
  return ta.localeCompare (tb);
}

function sortProduct (a, b) {
  const ta = getTime (a.Trip.Product);
  const tb = getTime (b.Trip.Product);
  return ta.localeCompare (tb);
}

function sortPrice (a, b) {
  const ta = getTime (a.Trip.Price);
  const tb = getTime (b.Trip.Price);
  return tb.localeCompare (ta);
}

function sortWeight (a, b) {
  const ta = getTime (a.Trip.Weight);
  const tb = getTime (b.Trip.Weight);
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
