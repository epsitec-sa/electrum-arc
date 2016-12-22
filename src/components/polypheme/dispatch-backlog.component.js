'use strict';

import React from 'react';

import {
  Container,
  TextFieldCombo,
  LabelTextField,
  Trip
} from '../../all-components.js';

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

  closeCombo () {
  }

  sortTime () {
    this.closeCombo ();
  }

  sortType () {
    this.closeCombo ();
  }

  filterAll () {
    this.closeCombo ();
  }

  filterDring () {
    this.closeCombo ();
  }

  filterUrgent () {
    this.closeCombo ();
  }

  getSortList () {
    return [
      {
        text:   'Chronologique',
        glyph:  'clock-o',
        action: () => this.sortTime (),
      },
      {
        text:   'Par types',
        glyph:  'cube',
        action: () => this.sortType (),
      },
    ];
  }

  getFilterList () {
    return [
      {
        text:   'Tous',
        glyph:  'square',
        action: () => this.filterAll (),
      },
      {
        text:   'Seulement les dring-dring',
        glyph:  'bell',
        action: () => this.filterDring (),
      },
      {
        text:   'Seulement les urgents',
        glyph:  'fighter-jet',
        action: () => this.filterUrgent (),
      },
    ];
  }

  renderTicket (ticket, data, index) {
    return (
      <Trip key={index} kind='trip-box' id={ticket.id} ticket={ticket} data={data} {...this.link ()} />
    );
  }

  renderTickets (tickets, data) {
    const result = [];
    let index = 0;
    for (var ticket of tickets) {
      result.push (this.renderTicket (ticket, data, index++));
    }
    return result;
  }

  render () {
    let data = this.read ('data');

    return (
      <Container kind='view-stretch' {...this.link ()} >
        <Container kind='pane-top' {...this.link ()} >
          <TextFieldCombo hint-text='Trier' combo-glyph='sort' width='300px'
            grow='1' spacing='large' list={this.getSortList ()}
            {...this.link ()} />
          <TextFieldCombo hint-text='Filtrer' combo-glyph='filter' width='300px'
            grow='1' spacing='large' list={this.getFilterList ()}
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
