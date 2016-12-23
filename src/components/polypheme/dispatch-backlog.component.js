'use strict';

import React from 'react';

import {
  Container,
  TextFieldCombo,
  LabelTextField,
  Trip
} from '../../all-components.js';

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

/******************************************************************************/

export default class DispatchBacklog extends React.Component {

  constructor (props) {
    super (props);
  }

  componentDidMount () {
    if (window.document.mock) {
      window.document.toUpdate.push (this);
    }
  }

  componentWillUnmount () {
    if (window.document.mock) {
      const index = window.document.toUpdate.indexOf (this);
      if (index !== -1) {
        window.document.toUpdate.splice (index, 1);
      }
    }
  }

  changeSort (data, item) {
    data.BacklogSort = item.text;
    this.forceUpdate ();
  }

  changeFilter (data, item) {
    data.BacklogFilter = item.text;
    this.forceUpdate ();
  }

  getItem (text, current, glyph, action) {
    return {
      text:   text,
      glyph:  glyph,
      active: text === current ? 'true' : 'false',
      action: action,
    };
  }

  getSortItem (data, text, glyph) {
    return this.getItem (text, data.BacklogSort, glyph, item => this.changeSort (data, item));
  }

  getFilterItem (data, text, glyph) {
    return this.getItem (text, data.BacklogFilter, glyph, item => this.changeFilter (data, item));
  }

  getSortList (data) {
    return [
      this.getSortItem (data, 'Par heure pick', 'clock-o'),
      this.getSortItem (data, 'Par heure drop', 'clock-o'),
      this.getSortItem (data, 'Par zone pick',  'map-marker'),
      this.getSortItem (data, 'Par zone drop',  'map-marker'),
      this.getSortItem (data, 'Par produits',   'cube'),
      this.getSortItem (data, 'Par prix',       'dollar'),
      this.getSortItem (data, 'Par poids',      'balance-scale'),
    ];
  }

  getFilterList (data) {
    return [
      this.getFilterItem (data, 'Tous',                      'square'),
      this.getFilterItem (data, 'Seulement les dring-dring', 'bell'),
      this.getFilterItem (data, 'Seulement les urgents',     'fighter-jet'),
    ];
  }

  isFiltered (ticket, data) {
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

  getTickets (tickets, data) {
    const result = [];
    for (var ticket of tickets) {
      if (!this.isFiltered (ticket, data)) {
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

  renderTicket (ticket, data, index) {
    return (
      <Trip key={index} kind='trip-box' id={ticket.id} ticket={ticket} data={data} {...this.link ()} />
    );
  }

  renderTickets (tickets, data) {
    const result = [];
    let index = 0;
    const sortedTickets = this.getTickets (tickets, data);
    for (var ticket of sortedTickets) {
      result.push (this.renderTicket (ticket, data, index++));
    }
    return result;
  }

  render () {
    const data = this.read ('data');

    return (
      <Container kind='view-stretch' {...this.link ()} >
        <Container kind='pane-top' {...this.link ()} >
          <TextFieldCombo hint-text='Trier' combo-glyph='sort' width='300px'
            value={data.BacklogSort}
            grow='1' spacing='large' list={this.getSortList (data)}
            {...this.link ()} />
          <TextFieldCombo hint-text='Filtrer' combo-glyph='filter' width='300px'
            grow='1' spacing='large' list={this.getFilterList (data)}
            value={data.BacklogFilter}
            {...this.link ()} />
          <LabelTextField shape='rounded' hint-text='Chercher'
            grow='2' label-glyph='Search' {...this.link ()} />
        </Container>
        <Container kind='panes' {...this.link ()} >
          <Container kind='column'
            drag-controller='ticket' drag-source='backlog' id={data.Backlog.id}
            view-parent-id='view-backlog' {...this.link ()} >
            {this.renderTickets (data.Backlog.Tickets, data)}
          </Container>
        </Container>
      </Container>
    );
  }
}
