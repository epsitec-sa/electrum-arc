'use strict';

import React from 'react';
import {Combo} from '../../all-components.js';
import reducerDragAndDrop from '../polypheme/reducer-drag-and-drop.js';

/******************************************************************************/

export default class MessengerCombo extends React.Component {

  reduce (action, ticket) {
    const id   = ticket.id;
    const data = this.read ('data');
    reducerDragAndDrop (data, {
      type: action,
      id:   id,
    });
    if (window.document.mock) {
      for (var c of window.document.toUpdate) {
        c.forceUpdate ();
      }
    }
  }

  swapCompacted () {
    console.log ('MessengerCombo.swapCompacted');
    const roadbook = this.read ('roadbook');
    this.reduce ('SWAP_ROADBOOK_COMPACTED', roadbook);
  }

  swapShowHidden () {
    console.log ('MessengerCombo.swapShowHidden');
    const roadbook = this.read ('roadbook');
    this.reduce ('SWAP_ROADBOOK_SHOWHIDDEN', roadbook);
  }

  closeCombo () {
    console.log ('MessengerCombo.closeCombo');
    const closeCombo = this.read ('close-combo');
    if (closeCombo) {
      closeCombo ();
    }
  }

  showModify () {
    console.log ('MessengerCombo.showModify');
    const showModify = this.read ('show-modify');
    if (showModify) {
      showModify ();
    }
  }

  showMission () {
    console.log ('MessengerCombo.showMission');
  }

  getList () {
    const roadbook = this.read ('roadbook');
    const compacted  = roadbook.Compacted  === 'true';
    const showHidden = roadbook.ShowHidden === 'true';
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
        glyph:  'user',
        action: () => this.showMission (),
      }
    );
    list.push (
      {
        text:   compacted ? 'Étendre' : 'Réduire',
        glyph:  compacted ? 'arrow-right' : 'arrow-left',
        action: () => this.swapCompacted (),
      }
    );
    list.push (
      {
        text:   showHidden ? 'Cacher les livrés' : 'Montrer les livrés',
        glyph:  showHidden ? 'eye-slash' : 'eye',
        action: () => this.swapShowHidden (),
      }
    );
    return list;
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
