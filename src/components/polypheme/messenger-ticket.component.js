/* eslint react/no-find-dom-node: 0 */

import {React} from 'electrum';
import {ReactDOM} from 'electrum';
import {ColorManipulator} from 'electrum';
import {Ticket, Container, Label, Button, MessengerModify, MessengerCombo} from '../../all-components.js';
import * as ComboHelpers from '../combo/combo-helpers.js';
import * as ReducerData from './reducer-data.js';

/******************************************************************************/

export default class MessengerTicket extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover:      false,
      showCombo:  false,
      showModify: false,
    };
    this.comboLocation = null;
  }

  get hover () {
    return this.state.hover;
  }

  set hover (value) {
    this.setState ( {
      hover: value
    });
  }

  get showCombo () {
    return this.state.showCombo;
  }

  set showCombo (value) {
    this.setState ( {
      showCombo: value
    });
    const roadbook = this.read ('roadbook');
    const id = roadbook.id;
    ComboHelpers.setDragCabHasCombo (id, value);
  }

  get showModify () {
    return this.state.showModify;
  }

  set showModify (value) {
    this.setState ( {
      showModify: value
    });
  }

  getShowSomethink () {
    return this.showCombo || this.showModify;
  }

  doShowCombo (x) {
    // Trace.log ('MessengerTicket.showCombo');
    const node = ReactDOM.findDOMNode (this);
    this.comboLocation = ComboHelpers.getComboLocation (node, this.props.theme, 'flying-balloon', x);
    this.showCombo = true;
  }

  onMyMouseOver () {
    this.hover = true;
  }

  onMyMouseOut () {
    this.hover = false;
  }

  onMyMouseDown (e) {
    // Trace.log ('MessengerTicket.onMyMouseDown');
    if (this.showCombo || this.showModify) {
      return true;
    }
    // if (e.button === 2)  // right-click ?
    if (e.button === 2 || (e.ctrlKey && e.shiftKey)) {  // right-click ?
      this.doShowCombo (e.clientX, e.clientY);
      return true;
    }
    return false;
  }

  onMyMouseUp () {
    // Trace.log ('MessengerTicket.onMyMouseUp');
    if (this.showCombo || this.showModify) {
      return true;
    }
    return false;
  }

  onCloseModify () {
    // Trace.log ('MessengerTicket.onCloseModify ' + action);
    this.showModify = false;
  }

  onShowModify () {
    this.showModify = true;
  }

  onCloseCombo () {
    this.showCombo = false;
  }

  // Return the name displayed in cover mode, 'Blupi (12)' by example.
  //  Blupi -> messenger name
  //  12    -> number of trips
  getCompactedName (roadbook) {
    const name = (roadbook.Messenger && roadbook.Messenger.Name) ?
      roadbook.Messenger.Name :
      'A définir';
    const n = roadbook.Tickets.length;
    if (n > 0) {  // has trips ?
      return `${name} (${n})`;
    } else {
      return name;
    }
  }

  renderModify (data) {
    if (this.showModify) {
      const roadbook = this.read ('roadbook');
      return (
        <MessengerModify
          data         = {data}
          roadbook     = {roadbook}
          close-modify = {this.onCloseModify}
          {...this.link ()} />
      );
    } else {
      return null;
    }
  }

  renderCombo (data) {
    if (this.showCombo) {
      const roadbook = this.read ('roadbook');
      return (
        <MessengerCombo
          data        = {data}
          roadbook    = {roadbook}
          center      = {this.comboLocation.center}
          top         = {this.comboLocation.top}
          bottom      = {this.comboLocation.bottom}
          close-combo = {this.onCloseCombo}
          show-modify = {this.onShowModify}
          {...this.link ()}/>
      );
    } else {
      return null;
    }
  }

  renderMode (data, roadbook) {
    const showHidden = ReducerData.ask (data, {type: 'IS_MESSENGER_SHOWHIDDEN', id: roadbook.id});
    if (showHidden) {
      return (
        <Container kind='ticket-mode' grow='1' {...this.link ()} >
          <Label glyph='eye' glyph-size='150%' {...this.link ()} />
        </Container>
      );
    } else {
      return null;
    }
  }

  renderExtended () {
    const data     = this.read ('data');
    const roadbook = this.read ('roadbook');

    const width  = this.props.theme.shapes.dispatchTicketWidth;
    const height = this.props.theme.shapes.messengerHeight;

    const photo = (roadbook.Messenger && roadbook.Messenger.Photo && roadbook.Messenger.Photo.Glyph) ?
      roadbook.Messenger.Photo.Glyph :
      'user';
    const name = (roadbook.Messenger && roadbook.Messenger.Name) ?
      roadbook.Messenger.Name :
      'A définir';

    let color = this.props.theme.palette.ticketMessengerBackground;
    if (this.hover) {
      color = ColorManipulator.darken (color, 0.1);
    }
    if (this.getShowSomethink ()) {
      color = this.props.theme.palette.ticketSelectedMessengerBackground;
    }

    return (
      <Ticket
        kind             = 'ticket'
        shape            = 'last'
        width            = {width}
        height           = {height}
        vertical-spacing = {this.props.theme.shapes.ticketVerticalSpacing}
        color            = {color}
        no-drag          = 'false'
        cursor           = 'ew-resize'
        mouse-over       = {this.onMyMouseOver}
        mouse-out        = {this.onMyMouseOut}
        mouse-down       = {this.onMyMouseDown}
        mouse-up         = {this.onMyMouseUp}
        {...this.link ()} >
        <Container kind='column' grow='2' {...this.link ()} >
          <Button glyph={photo} kind='identity' {...this.link ()} />
        </Container>
        <Container kind='column' grow='1' {...this.link ()} >
          <Label glyph={roadbook.Transport} glyph-size='150%' {...this.link ()} />
        </Container>
        <Container kind='column' grow='3' {...this.link ()} >
          <Label text={name} text-color='#fff' {...this.link ()} />
          <Label text={roadbook.Revenue} font-weight='bold' text-color='#fff' {...this.link ()} />
        </Container>
        {this.renderMode (data, roadbook)}
        {this.renderCombo (data)}
        {this.renderModify (data)}
      </Ticket>
    );
  }

  renderCompacted () {
    const data     = this.read ('data');
    const roadbook = this.read ('roadbook');

    const width = this.props.theme.shapes.dispatchTicketCompactedWidth;

    let color = this.props.theme.palette.ticketMessengerBackground;
    if (this.hover) {
      color = ColorManipulator.darken (color, 0.1);
    }
    if (this.getShowSomethink ()) {
      color = this.props.theme.palette.ticketSelectedMessengerBackground;
    }

    return (
      <Container kind='column' {...this.link ()}>
        <Ticket
          kind       = 'cover'
          shape      = 'header'
          width      = {width}
          color      = {color}
          no-drag    = 'false'
          cursor     = 'ew-resize'
          mouse-over = {this.onMyMouseOver}
          mouse-out  = {this.onMyMouseOut}
          mouse-down = {this.onMyMouseDown}
          mouse-up   = {this.onMyMouseUp}
          {...this.link ()} >
          <Container kind='column' grow='1' {...this.link ()} >
            <Label text={this.getCompactedName (roadbook)} text-color='#fff' {...this.link ()} />
          </Container>
        </Ticket>
        {this.renderCombo (data)}
        {this.renderModify (data)}
      </Container>
    );
  }

  render () {
    const data      = this.read ('data');
    const roadbook  = this.read ('roadbook');
    const compacted = ReducerData.ask (data, {type: 'IS_MESSENGER_COMPACTED', id: roadbook.id});
    if (compacted) {
      return this.renderCompacted ();
    } else {
      return this.renderExtended ();
    }
  }
}

/******************************************************************************/
