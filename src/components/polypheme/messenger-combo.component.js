'use strict';

import React from 'react';
import {Combo} from '../../all-components.js';
import ReducerDragAndDrop from '../polypheme/reducer-drag-and-drop.js';

/******************************************************************************/

export default class MessengerCombo extends React.Component {

  update () {
    if (window.document.mock) {
      for (var c of window.document.toUpdate) {
        c.forceUpdate ();
      }
    }
  }

  reduce (action, id) {
    const data = this.read ('data');
    ReducerDragAndDrop.reducer (data, {
      type: action,
      id:   id,
    });
    this.update ();
  }

  swapCompacted () {
    console.log ('MessengerCombo.swapCompacted');
    const roadbook = this.read ('roadbook');
    this.reduce ('SWAP_ROADBOOK_COMPACTED', roadbook.id);
  }

  swapCompactedAndShift () {
    console.log ('MessengerCombo.swapCompactedAndShift');
    const data     = this.read ('data');
    const roadbook = this.read ('roadbook');
    const compacted = roadbook.Compacted  === 'true';
    if (compacted) {
      this.shiftToBegin ();
      this.reduce ('SWAP_ROADBOOK_COMPACTED', data.Roadbooks[0].id);
    } else {
      this.shiftToEnd ();
      this.reduce ('SWAP_ROADBOOK_COMPACTED', data.Roadbooks[data.Roadbooks.length - 1].id);
    }
  }

  shiftToBegin () {
    console.log ('MessengerCombo.shiftToBegin');
    const data     = this.read ('data');
    const roadbook = this.read ('roadbook');
    ReducerDragAndDrop.reducer (data, {
      type:        'DROP',
      fromKind:    'roadbook',
      fromIds:     [roadbook.id],
      toId:        data.Roadbooks[0].id,
      toOwnerId:   data.id,
      toOwnerKind: 'roadbook',
    });
    this.update ();
  }

  shiftToEnd () {
    console.log ('MessengerCombo.shiftToEnd');
    const data     = this.read ('data');
    const roadbook = this.read ('roadbook');
    ReducerDragAndDrop.reducer (data, {
      type:        'DROP',
      fromKind:    'roadbook',
      fromIds:     [roadbook.id],
      toId:        null,
      toOwnerId:   data.id,
      toOwnerKind: 'roadbook',
    });
    this.update ();
  }

  swapShowHidden () {
    console.log ('MessengerCombo.swapShowHidden');
    const roadbook = this.read ('roadbook');
    this.reduce ('SWAP_ROADBOOK_SHOWHIDDEN', roadbook.id);
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
    const data     = this.read ('data');
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
        text:     compacted ? 'Étendre' : 'Réduire',
        glyph:    compacted ? 'expand' : 'compress',
        shortcut: '_alt_+clic',
        action: () => this.swapCompacted (),
      }
    );
    if (data.Roadbooks.length > 1) {
      list.push (
        {
          text:   compacted ? 'Étendre et pousser' : 'Réduire et pousser',
          glyph:  compacted ? 'fast-backward' : 'fast-forward',
          action: () => this.swapCompactedAndShift (),
        }
      );
      list.push (
        {
          text:   'Pousser à gauche',
          glyph:  'step-backward',
          action: () => this.shiftToBegin (),
        }
      );
      list.push (
        {
          text:   'Pousser à droite',
          glyph:  'step-forward',
          action: () => this.shiftToEnd (),
        }
      );
    }
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
