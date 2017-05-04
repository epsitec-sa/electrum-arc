/* global window */

import {React} from 'electrum';
import {Combo} from '../../all-components.js';
import * as ReducerData from '../polypheme/reducer-data.js';

/******************************************************************************/

export default class MessengerCombo extends React.Component {

  onCloseCombo () {
    const x = this.read ('close-combo');
    if (x) {
      x ();
    }
  }

  onShowModify () {
    if (window.document.mock) {
      const x = this.read ('show-modify');
      if (x) {
        x ();
      }
    } else {
      const data     = this.read ('data');
      const roadbook = this.read ('roadbook');
      ReducerData.reducer (data, {
        type:    'ELECTRUM_DISPATCH',
        oper:    'ShowModifyMessengerCommand',
        payload: {
          TicketId: roadbook.id,
        }
      });
    }
  }

  onShowMessenger () {
    if (window.document.mock) {
      // Trace.log ('onShowMessenger is possible only with Lydia');
    } else {
      const data     = this.read ('data');
      const roadbook = this.read ('roadbook');
      ReducerData.reducer (data, {
        type:    'ELECTRUM_DISPATCH',
        oper:    'ShowMessengerCommand',
        payload: {
          MessengerId: roadbook.id,
        }
      });
    }
  }

  reduce (action, id) {
    const data = this.read ('data');

    // Inject electrum state (needed for electrumDispatch).
    data.state = this.props.state;

    ReducerData.reducer (data, {
      type: action,
      id:   id,
    });
  }

  onSwapCompacted () {
    const roadbook = this.read ('roadbook');
    this.reduce ('SWAP_ROADBOOK_COMPACTED', roadbook.id);
  }

  onSwapCompactedAndShift () {
    const data      = this.read ('data');
    const roadbook  = this.read ('roadbook');
    const compacted = ReducerData.ask (data, {type: 'IS_MESSENGER_COMPACTED', id: roadbook.id});
    if (compacted) {
      this.onShift (data, roadbook, data.Roadbooks[0].id);  // shift |<-
    } else {
      this.onShift (data, roadbook, null);  // shift ->|
    }
    this.reduce ('SWAP_ROADBOOK_COMPACTED', roadbook.id);
  }

  onShift (data, roadbook, toId) {
    ReducerData.reducer (data, {
      type:        'DROP',
      fromKind:    'roadbook',
      fromIds:     [ roadbook.id ],
      toId:        toId,
      toOwnerId:   data.id,
      toOwnerKind: 'roadbook',
    });
  }

  onSwapShowHidden () {
    const roadbook = this.read ('roadbook');
    this.reduce ('SWAP_ROADBOOK_SHOWHIDDEN', roadbook.id);
  }

  // Return the combo-menu content.
  getList () {
    const data       = this.read ('data');
    const roadbook   = this.read ('roadbook');
    const compacted  = ReducerData.ask (data, {type: 'IS_MESSENGER_COMPACTED',  id: roadbook.id});
    const showHidden = ReducerData.ask (data, {type: 'IS_MESSENGER_SHOWHIDDEN', id: roadbook.id});
    const list = [];
    list.push (
      {
        text:   'Modifier...',
        glyph:  'pencil',
        action: this.onShowModify,
      }
    );
    list.push (
      {
        text:   'Voir le coursier...',
        glyph:  'user',
        action: this.onShowMessenger,
      }
    );
    list.push (
      {
        text:     compacted ? 'Étendre' : 'Réduire',
        glyph:    compacted ? 'expand' : 'compress',
        shortcut: '_alt_+clic',
        action:   this.onSwapCompacted,
      }
    );
    if (data.Roadbooks.length > 1) {
      list.push (
        {
          text:   compacted ? 'Étendre et pousser' : 'Réduire et pousser',
          glyph:  compacted ? 'fast-backward' : 'fast-forward',
          action: this.onSwapCompactedAndShift,
        }
      );
      list.push (
        {
          text:   'Pousser à gauche',
          glyph:  'step-backward',
          action: () => this.onShift (data, roadbook, data.Roadbooks[0].id),
        }
      );
      list.push (
        {
          text:   'Pousser à droite',
          glyph:  'step-forward',
          action: () => this.onShift (data, roadbook, null),
        }
      );
    }
    list.push (
      {
        text:   showHidden ? 'Cacher les livrés' : 'Montrer les livrés',
        glyph:  showHidden ? 'eye-slash' : 'eye',
        action: this.onSwapShowHidden,
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
        close  = {this.onCloseCombo}
        {...this.link ()} />
    );
  }
}

/******************************************************************************/
