'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Ticket, Container, Label, Button, MessengerModify, MessengerCombo} from '../../all-components.js';
import ComboHelpers from '../combo/combo-helpers.js';
import {ColorManipulator} from 'electrum';

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

  getHover () {
    return this.state.hover;
  }

  setHover (value) {
    this.setState ( {
      hover: value
    });
  }

  getShowCombo () {
    return this.state.showCombo;
  }

  setShowCombo (value) {
    this.setState ( {
      showCombo: value
    });
    const roadbook = this.read ('roadbook');
    const id = roadbook.id;
    ComboHelpers.setDragCabHasCombo (id, value);
  }

  getShowModify () {
    return this.state.showModify;
  }

  setShowModify (value) {
    this.setState ( {
      showModify: value
    });
  }

  getShowSomethink () {
    return this.getShowCombo () || this.getShowModify ();
  }

  showCombo (x, y) {
    // console.log ('MessengerTicket.showCombo');
    const node = ReactDOM.findDOMNode (this);
    this.comboLocation = ComboHelpers.getComboLocation (node, this.props.theme, x);
    this.setShowCombo (true);
  }

  mouseOver () {
    this.setHover (true);
  }

  mouseOut () {
    this.setHover (false);
  }

  mouseDown (event) {
    // console.log ('MessengerTicket.mouseDown');
    if (this.getShowCombo () || this.getShowModify ()) {
      return true;
    }
    // if (event.button === 2)  // right-click ?
    if (event.button === 2 || (event.ctrlKey && event.shiftKey)) {  // right-click ?
      this.showCombo (event.clientX, event.clientY);
      return true;
    }
    return false;
  }

  mouseUp (event) {
    // console.log ('MessengerTicket.mouseUp');
    if (this.getShowCombo () || this.getShowModify ()) {
      return true;
    }
    return false;
  }

  closeModify (action) {
    // console.log ('MessengerTicket.closeModify ' + action);
    this.setShowModify (false);
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
    if (this.getShowModify ()) {
      const roadbook = this.read ('roadbook');
      return (
        <MessengerModify
          data         = {data}
          roadbook     = {roadbook}
          close-modify = {action => this.closeModify (action)}
          {...this.link ()} />
      );
    } else {
      return null;
    }
  }

  renderCombo (data) {
    if (this.getShowCombo ()) {
      const roadbook = this.read ('roadbook');
      return (
        <MessengerCombo
          data        = {data}
          roadbook    = {roadbook}
          center      = {this.comboLocation.center}
          top         = {this.comboLocation.top}
          bottom      = {this.comboLocation.bottom}
          close-combo = {() => this.setShowCombo (false)}
          show-modify = {() => this.setShowModify (true)}
          {...this.link ()}/>
      );
    } else {
      return null;
    }
  }

  renderMode (roadbook) {
    if (roadbook.ShowHidden === 'true') {
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

    const width  = this.props.theme.shapes.tripTicketWidth;
    const height = this.props.theme.shapes.messengerHeight;

    const photo = (roadbook.Messenger && roadbook.Messenger.Photo && roadbook.Messenger.Photo.Glyph) ?
      roadbook.Messenger.Photo.Glyph :
      'user';
    const name = (roadbook.Messenger && roadbook.Messenger.Name) ?
      roadbook.Messenger.Name :
      'A définir';

    let color = this.props.theme.palette.ticketMessengerBackground;
    if (this.getHover ()) {
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
        mouse-over       = {() => this.mouseOver ()}
        mouse-out        = {() => this.mouseOut ()}
        mouse-down       = {event => this.mouseDown (event)}
        mouse-up         = {event => this.mouseUp (event)}
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
        {this.renderMode (roadbook)}
        {this.renderCombo (data)}
        {this.renderModify (data)}
      </Ticket>
    );
  }

  renderCompacted () {
    const data     = this.read ('data');
    const roadbook = this.read ('roadbook');

    const width = this.props.theme.shapes.tripTicketCompactedWidth;

    let color = this.props.theme.palette.ticketMessengerBackground;
    if (this.getHover ()) {
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
          mouse-over = {() => this.mouseOver ()}
          mouse-out  = {() => this.mouseOut ()}
          mouse-down = {event => this.mouseDown (event)}
          mouse-up   = {event => this.mouseUp (event)}
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
    const roadbook = this.read ('roadbook');
    const compacted  = roadbook.Compacted  === 'true';
    if (compacted) {
      return this.renderCompacted ();
    } else {
      return this.renderExtended ();
    }
  }
}

/******************************************************************************/
