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
    if (ticket.Type !== 'both') {
      if (ticket.Status === 'dispatched') {
        list.push (
          {
            text:     'Livré',
            glyph:    'envelope',
            shortcut: '(clic)',
            action: () => this.dispatch (),
          }
        );
      } else if (ticket.Status === 'delivered') {
        list.push (
          {
            text:     'Non dispatché',
            glyph:    'square-o',
            shortcut: '(clic)',
            action: () => this.dispatch (),
          }
        );
      } else {
        list.push (
          {
            text:     'Dispatché',
            glyph:    'hashtag',
            shortcut: '(clic)',
            action: () => this.dispatch (),
          }
        );
      }
      list.push (
        {
          text:     extended ? 'Réduire' : 'Étendre',
          glyph:    extended ? 'arrow-up' : 'arrow-down',
          shortcut: '(alt-clic)',
          action: () => this.extend (),
        }
      );
    }
    list.push (
      {
        text:     selected ? 'Désélectionner' : 'Sélectionner',
        glyph:    selected ? 'circle-o' : 'check-circle',
        shortcut: '(ctrl-clic)',
        action: () => this.select (),
      }
    );
    return list;
  }

  reduce (action, ticket, shiftKey) {
    const id   = ticket.id;
    const data = this.read ('data');
    reducerDragAndDrop (data, {
      type:     action,
      id:       id,
      shiftKey: shiftKey,
    });
    if (window.document.mock) {
      for (var c of window.document.toUpdate) {
        c.forceUpdate ();
      }
    }
  }

  dispatch () {
    const ticket = this.read ('ticket');
    if (ticket.Status === 'dispatched') {
      this.showModify ();
    }
    this.reduce ('SWAP_STATUS', ticket);
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
    const left   = this.read ('left');
    const top    = this.read ('top');
    const bottom = this.read ('bottom');

    return (
      <Combo
        left   = {left}
        top    = {top}
        bottom = {bottom}
        list   = {this.getList ()}
        close  = {() => this.closeCombo ()}
        {...this.link ()} />
    );
  }
}

/******************************************************************************/
