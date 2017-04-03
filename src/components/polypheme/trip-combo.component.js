/* global window */

import {React} from 'electrum';
import {Trace} from 'electrum';
import {Combo} from '../../all-components.js';
import ReducerData from '../polypheme/reducer-data.js';

/******************************************************************************/

export default class TripCombo extends React.Component {

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
      const data   = this.read ('data');
      const ticket = this.read ('ticket');
      ReducerData.reducer (data, {
        type:    'ELECTRUM_DISPATCH',
        oper:    'ShowModifyTicketCommand',
        payload: {
          TicketId: ticket.id,
        }
      });
    }
  }

  showMission () {
    if (window.document.mock) {
      Trace.error ('showMission is possible only with Lydia');
    } else {
      const data   = this.read ('data');
      const ticket = this.read ('ticket');
      ReducerData.reducer (data, {
        type:    'ELECTRUM_DISPATCH',
        oper:    'ShowMissionCommand',
        payload: {
          TicketId: ticket.id,
        }
      });
    }
  }

  showDeliver () {
    if (window.document.mock) {
      const showDeliver = this.read ('show-deliver');
      if (showDeliver) {
        showDeliver ();
      }
    } else {
      throw new Error ('Direct call to showDeliver is impossible in mock=false mode');
    }
  }

  showPredispatch () {
    if (window.document.mock) {
      const showPredispatch = this.read ('show-predispatch');
      if (showPredispatch) {
        showPredispatch ();
      }
    } else {
      throw new Error ('Direct call to showPredispatch is impossible in mock=false mode');
    }
  }

  reduce (action, id, value, shiftKey) {
    const data = this.read ('data');
    ReducerData.reducer (data, {
      type:     action,
      id:       id,
      value:    value,
      shiftKey: shiftKey,
    });
  }

  dispatch (value) {
    if (window.document.mock) {
      if (value === 'delivered') {
        this.showDeliver ();
      } else if (value === 'pre-dispatch') {
        this.showPredispatch ();
      } else {
        const ticket = this.read ('ticket');
        this.reduce ('CHANGE_TICKET_STATUS', ticket.id, value);
      }
    } else {
      const ticket = this.read ('ticket');
      this.reduce ('CHANGE_TICKET_STATUS', ticket.id, value);
    }
  }

  extend () {
    const ticket = this.read ('ticket');
    this.reduce ('SWAP_TICKET_EXTENDED', ticket.id);
  }

  select () {
    const ticket = this.read ('ticket');
    this.reduce ('SWAP_TICKET_SELECTED', ticket.id);
  }

  selectMany () {
    const ticket = this.read ('ticket');
    this.reduce ('SWAP_TICKET_SELECTED', ticket.id, null, true);
  }

  // Return the combo-menu content.
  getList () {
    const data     = this.read ('data');
    const ticket   = this.read ('ticket');
    const source   = this.read ('source');
    const selected = ReducerData.ask (data, {type: 'IS_TICKET_SELECTED', id: ticket.id});
    const extended = ReducerData.ask (data, {type: 'IS_TICKET_EXTENDED', id: ticket.id});
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
        text:     selected ? 'Désélectionner un' : 'Sélectionner un',
        glyph:    selected ? 'circle-o' : 'check-circle',
        shortcut: '_ctrl_+clic',
        action:   () => this.select (),
      }
    );
    list.push (
      {
        text:     selected ? 'Tout désélectionner' : 'Sélectionner plusieurs',
        glyph:    selected ? 'circle-o' : 'check-circle',
        shortcut: '_shift_+clic',
        action:   () => this.selectMany (),
      }
    );
    if (ticket.Type !== 'both') {
      list.push (
        {
          text:     extended ? 'Réduire' : 'Étendre',
          glyph:    extended ? 'arrow-up' : 'arrow-down',
          shortcut: '_alt_+clic',
          action:   () => this.extend (),
        }
      );
      if (source === 'roadbook') {
        list.push (
          {
            separator: true,
          }
        );
        list.push (
          {
            text:     'Non dispatché',
            glyph:    'ban',
            active:   ticket.Status === 'pre-dispatched' ? 'true' : 'false',
            shortcut: ticket.Status === 'delivered' ? 'clic' : null,
            action:   () => this.dispatch ('pre-dispatched'),
          }
        );
        list.push (
          {
            text:     'Dispatché',
            glyph:    'envelope-o',
            active:   ticket.Status === 'dispatched' ? 'true' : 'false',
            shortcut: ticket.Status === 'pre-dispatched' ? 'clic' : null,
            action:   () => this.dispatch ('dispatched'),
          }
        );
        list.push (
          {
            text:     'Livré',
            glyph:    'envelope',
            active:   ticket.Status === 'delivered' ? 'true' : 'false',
            shortcut: ticket.Status === 'dispatched' ? 'clic' : null,
            action:   () => this.dispatch ('delivered'),
          }
        );
      }
    }
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
