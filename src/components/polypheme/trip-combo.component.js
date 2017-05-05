/* global window */

import {React} from 'electrum';
import {Trace} from 'electrum';
import {Combo} from '../../all-components.js';
import * as ReducerData from '../polypheme/reducer-data.js';

/******************************************************************************/

export default class TripCombo extends React.Component {

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
      const data   = this.read ('data');
      const ticket = this.read ('ticket');
      ReducerData.reducer (data,
        ReducerData.electrumDispatchAction ('ShowModifyTicketCommand', {TicketId: ticket.id}));
    }
  }

  onShowMission () {
    if (window.document.mock) {
      Trace.error ('showMission is possible only with Lydia');
    } else {
      const data   = this.read ('data');
      const ticket = this.read ('ticket');
      ReducerData.reducer (data,
        ReducerData.electrumDispatchAction ('ShowMissionCommand', {TicketId: ticket.id}));
    }
  }

  onShowDeliver () {
    if (window.document.mock) {
      const showDeliver = this.read ('show-deliver');
      if (showDeliver) {
        showDeliver ();
      }
    } else {
      throw new Error ('Direct call to showDeliver is impossible in mock=false mode');
    }
  }

  onShowPredispatch () {
    if (window.document.mock) {
      const showPredispatch = this.read ('show-predispatch');
      if (showPredispatch) {
        showPredispatch ();
      }
    } else {
      throw new Error ('Direct call to showPredispatch is impossible in mock=false mode');
    }
  }

  onDispatch (value) {
    if (window.document.mock) {
      if (value === 'delivered') {
        this.onShowDeliver ();
      } else if (value === 'pre-dispatch') {
        this.onShowPredispatch ();
      } else {
        const data   = this.read ('data');
        const ticket = this.read ('ticket');
        ReducerData.reduce (data, ReducerData.changeTicketStatusAction = (ticket.id, value));
      }
    } else {
      const data   = this.read ('data');
      const ticket = this.read ('ticket');
      ReducerData.reduce (data, ReducerData.changeTicketStatusAction = (ticket.id, value));
    }
  }

  onExtend () {
    const data   = this.read ('data');
    const ticket = this.read ('ticket');
    ReducerData.reduce (data, ReducerData.swapTicketExtendedAction = (ticket.id));
  }

  onSelectOne () {
    const data   = this.read ('data');
    const ticket = this.read ('ticket');
    ReducerData.reduce (data, ReducerData.swapTicketSelectedAction = (ticket.id, false));
  }

  onSelectMany () {
    const data   = this.read ('data');
    const ticket = this.read ('ticket');
    ReducerData.reduce (data, ReducerData.swapTicketSelectedAction = (ticket.id, true));
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
        action: this.onShowModify,
      }
    );
    list.push (
      {
        text:   'Voir la mission...',
        glyph:  'eye',
        action: this.onShowMission,
      }
    );
    list.push (
      {
        text:     selected ? 'Désélectionner un' : 'Sélectionner un',
        glyph:    selected ? 'circle-o' : 'check-circle',
        shortcut: '_ctrl_+clic',
        action:   this.onSelectOne,
      }
    );
    list.push (
      {
        text:     selected ? 'Tout désélectionner' : 'Sélectionner plusieurs',
        glyph:    selected ? 'circle-o' : 'check-circle',
        shortcut: '_shift_+clic',
        action:   this.onSelectMany,
      }
    );
    if (source !== 'backlog') {
      list.push (
        {
          text:     extended ? 'Réduire' : 'Étendre',
          glyph:    extended ? 'arrow-up' : 'arrow-down',
          shortcut: '_alt_+clic',
          action:   this.onExtend,
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
            action:   () => this.onDispatch ('pre-dispatched'),
          }
        );
        list.push (
          {
            text:     'Dispatché',
            glyph:    'envelope-o',
            active:   ticket.Status === 'dispatched' ? 'true' : 'false',
            shortcut: ticket.Status === 'pre-dispatched' ? 'clic' : null,
            action:   () => this.onDispatch ('dispatched'),
          }
        );
        list.push (
          {
            text:     'Livré',
            glyph:    'envelope',
            active:   ticket.Status === 'delivered' ? 'true' : 'false',
            shortcut: ticket.Status === 'dispatched' ? 'clic' : null,
            action:   () => this.onDispatch ('delivered'),
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
        close  = {this.onCloseCombo}
        {...this.link ()} />
    );
  }
}

/******************************************************************************/
