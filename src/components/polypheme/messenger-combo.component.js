'use strict';

import React from 'react';
import {Combo} from '../../all-components.js';
import ReducerDragAndDrop from '../polypheme/reducer-drag-and-drop.js';
import StateManager from './state-manager.js';

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
    // console.log ('MessengerCombo.swapCompacted');
    const roadbook = this.read ('roadbook');
    const x = StateManager.isMessengerCompacted (roadbook.id);
    StateManager.putMessengerCompacted (roadbook.id, !x);
  }

  swapCompactedAndShift () {
    // console.log ('MessengerCombo.swapCompactedAndShift');
    const data     = this.read ('data');
    const roadbook = this.read ('roadbook');
    if (StateManager.isMessengerCompacted (roadbook.id)) {
      this.shiftToBegin ();
      StateManager.clearMessengerCompacted (data.Roadbooks[0].id);
    } else {
      this.shiftToEnd ();
      StateManager.setMessengerCompacted (data.Roadbooks[data.Roadbooks.length - 1].id);
    }
  }

  shiftToBegin () {
    // console.log ('MessengerCombo.shiftToBegin');
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
    // console.log ('MessengerCombo.shiftToEnd');
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
    // console.log ('MessengerCombo.swapShowHidden');
    const roadbook = this.read ('roadbook');
    const x = StateManager.isMessengerShowHidden (roadbook.id);
    StateManager.putMessengerShowHidden (roadbook.id, !x);
  }

  closeCombo () {
    // console.log ('MessengerCombo.closeCombo');
    const closeCombo = this.read ('close-combo');
    if (closeCombo) {
      closeCombo ();
    }
  }

  showModify () {
    // console.log ('MessengerCombo.showModify');
    const showModify = this.read ('show-modify');
    if (showModify) {
      showModify ();
    }
  }

  showMission () {
    // console.log ('MessengerCombo.showMission');
  }

  getList () {
    const data     = this.read ('data');
    const roadbook = this.read ('roadbook');
    const compacted  = StateManager.isMessengerCompacted (roadbook.id);
    const showHidden = StateManager.isMessengerShowHidden (roadbook.id);
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
