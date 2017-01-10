'use strict';

import React from 'react';
import {Combo} from '../../all-components.js';
import reducerDragAndDrop from '../polypheme/reducer-drag-and-drop.js';
import {isSelected, isExtended} from './ticket-helpers.js';

/******************************************************************************/

export default class TripCombo extends React.Component {

  closeCombo () {
    const closeCombo = this.read ('close-combo');
    if (closeCombo) {
      closeCombo ();
    }
  }

  showModify () {
    const showModify = this.read ('show-modify');
    if (showModify) {
      showModify ();
    }
  }

  showMission () {
  }

  getList () {
    const data   = this.read ('data');
    const ticket = this.read ('ticket');
    const selected = isSelected (data, ticket.id);
    const extended = isExtended (data, ticket.id);
    const list = [];
    list.push (
      {
        text:   'Modifier...',
        glyph:  'pencil',
        action: () => this.showModify (),
      }
    );
    list.push (
      {
        text:   'Voir la mission...',
        glyph:  'eye',
        action: () => this.showMission (),
      }
    );
    list.push (
      {
        text:     selected ? 'Désélectionner' : 'Sélectionner',
        glyph:    selected ? 'circle-o' : 'check-circle',
        shortcut: '(ctrl-clic)',
        action: () => this.select (),
      }
    );
    if (ticket.Type !== 'both') {
      list.push (
        {
          text:     extended ? 'Réduire' : 'Étendre',
          glyph:    extended ? 'arrow-up' : 'arrow-down',
          shortcut: '(alt-clic)',
          action: () => this.extend (),
        }
      );
      list.push (
        {
          separator: true,
        }
      );
      list.push (
        {
          text:     'Non dispatché',
          glyph:    'square-o',
          active:   ticket.Status === 'pre-dispatched' ? 'true' : 'false',
          shortcut: ticket.Status === 'delivered' ? '(clic)' : null,
          action: () => this.dispatch ('pre-dispatched'),
        }
      );
      list.push (
        {
          text:     'Dispatché',
          glyph:    'hashtag',
          active:   ticket.Status === 'dispatched' ? 'true' : 'false',
          shortcut: ticket.Status === 'pre-dispatched' ? '(clic)' : null,
          action: () => this.dispatch ('dispatched'),
        }
      );
      list.push (
        {
          text:     'Livré',
          glyph:    'envelope',
          active:   ticket.Status === 'delivered' ? 'true' : 'false',
          shortcut: ticket.Status === 'dispatched' ? '(clic)' : null,
          action: () => this.dispatch ('delivered'),
        }
      );
    }
    return list;
  }

  reduce (action, ticket, value) {
    const id   = ticket.id;
    const data = this.read ('data');
    reducerDragAndDrop (data, {
      type:  action,
      id:    id,
      value: value,
    });
    if (window.document.mock) {
      for (var c of window.document.toUpdate) {
        c.forceUpdate ();
      }
    }
  }

  dispatch (value) {
    const ticket = this.read ('ticket');
    if (ticket.Status === 'dispatched') {
      this.showModify ();
    }
    this.reduce ('CHANGE_STATUS', ticket, value);
  }

  extend () {
    const ticket = this.read ('ticket');
    this.reduce ('SWAP_EXTENDED', ticket);
  }

  select () {
    const ticket = this.read ('ticket');
    this.reduce ('SWAP_SELECTED', ticket);
  }

  render () {
    const center = this.read ('center');
    const top    = this.read ('top');
    const bottom = this.read ('bottom');

    return (
      <Combo
        center = {center}
        top    = {top}
        bottom = {bottom}
        list   = {this.getList ()}
        close  = {() => this.closeCombo ()}
        {...this.link ()} />
    );
  }
}

/******************************************************************************/
