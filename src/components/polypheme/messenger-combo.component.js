import {React, Trace} from 'electrum';
import {Combo} from '../../all-components.js';
import ReducerData from '../polypheme/reducer-data.js';

/******************************************************************************/

export default class MessengerCombo extends React.Component {

  closeCombo () {
    const closeCombo = this.read ('close-combo');
    if (closeCombo) {
      closeCombo ();
    }
  }

  showModify () {
    if (window.document.mock) {
      const showModify = this.read ('show-modify');
      if (showModify) {
        showModify ();
      }
    } else {
      const data     = this.read ('data');
      const roadbook = this.read ('roadbook');
      ReducerData.reducer (data, {
        type:  'ELECTRUM_DISPATCH',
        oper: 'ShowModifyMessengerCommand',
        payload: {
          TicketId: roadbook.id,
        }
      });
    }
  }

  showMessenger () {
    if (window.document.mock) {
      Trace.log ('showMessenger is possible only with Lydia');
    } else {
      const data     = this.read ('data');
      const roadbook = this.read ('roadbook');
      ReducerData.reducer (data, {
        type: 'ELECTRUM_DISPATCH',
        oper: 'ShowMessengerCommand',
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

  swapCompacted () {
    const roadbook = this.read ('roadbook');
    this.reduce ('SWAP_ROADBOOK_COMPACTED', roadbook.id);
  }

  swapCompactedAndShift () {
    const data      = this.read ('data');
    const roadbook  = this.read ('roadbook');
    const compacted = ReducerData.ask (data, {type: 'IS_MESSENGER_COMPACTED', id: roadbook.id});
    if (compacted) {
      this.shift (data, roadbook, data.Roadbooks[0].id);  // shift |<-
    } else {
      this.shift (data, roadbook, null);  // shift ->|
    }
    this.reduce ('SWAP_ROADBOOK_COMPACTED', roadbook.id);
  }

  shift (data, roadbook, toId) {
    ReducerData.reducer (data, {
      type:        'DROP',
      fromKind:    'roadbook',
      fromIds:     [roadbook.id],
      toId:        toId,
      toOwnerId:   data.id,
      toOwnerKind: 'roadbook',
    });
  }

  swapShowHidden () {
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
        action: () => this.showModify (),
      }
    );
    list.push (
      {
        text:   'Voir le coursier...',
        glyph:  'user',
        action: () => this.showMessenger (),
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
          action: () => this.shift (data, roadbook, data.Roadbooks[0].id),
        }
      );
      list.push (
        {
          text:   'Pousser à droite',
          glyph:  'step-forward',
          action: () => this.shift (data, roadbook, null),
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
