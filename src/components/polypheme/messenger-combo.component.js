'use strict';

import React from 'react';
import {Combo} from '../../all-components.js';
import reducerDragAndDrop from '../polypheme/reducer-drag-and-drop.js';
import {isSelected, isExtended} from './ticket-helpers.js';

/******************************************************************************/

export default class MessengerCombo extends React.Component {

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
    const data     = this.read ('data');
    const roadbook = this.read ('roadbook');
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
        text:   'Voir le coursier...',
        glyph:  'eye',
        action: () => this.showMission (),
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
