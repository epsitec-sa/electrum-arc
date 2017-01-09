'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Ticket, Container, Label, Button, MessengerModify, MessengerCombo} from '../../all-components.js';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class MessengerTicket extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      showCombo:  false,
      showModify: false,
    };
  }

  getShowCombo () {
    return this.state.showCombo;
  }

  setShowCombo (value) {
    this.setState ( {
      showCombo: value
    });
    this.setDragCabHasCombo (value);
  }

  getShowModify () {
    return this.state.showModify;
  }

  setShowModify (value) {
    this.setState ( {
      showModify: value
    });
  }

  // Set the DragCab.hasCombo parent to true or false. It will be informed that a combo is
  // opening, for don't initiate a drag and drop.
  setDragCabHasCombo (value) {
    const roadbook = this.read ('roadbook');
    const id = roadbook.id;
    for (let dragCab of window.document.dragCabs) {
      if (dragCab.props['item-id'] === id) {
        console.log ('MessengerTicket.setDragCabHasCombo id=' + id + ' value=' + value);
        dragCab.hasCombo = value;
        return;
      }
    }
  }

  showCombo (x, y) {
    console.log ('MessengerTicket.showCombo');
    const node = ReactDOM.findDOMNode (this);
    const comboRect = node.getBoundingClientRect ();

    // Compute horizontal position according to mouse.
    const width = 300;  // assumed approximate width
    this.comboLeft = (x - width / 2) + 'px';

    // Puts the menu under the component if it is in the upper half of the window.
    const my = (comboRect.top + comboRect.bottom) / 2;
    const underside = my < window.innerHeight / 2;
    const t = this.props.theme.shapes.flyingBalloonTriangleSize;
    const top = Unit.add ((window.innerHeight - y) + 'px', t);
    const bottom = Unit.add (y + 'px', t);
    this.comboTop = underside ? bottom : null;
    this.comboBottom = underside ? null : top;

    this.setShowCombo (true);
  }

  mouseDown (event) {
    console.log ('MessengerTicket.mouseDown');
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
    console.log ('MessengerTicket.mouseUp');
    if (this.getShowCombo () || this.getShowModify ()) {
      return true;
    }
    return false;
  }

  closeModify (action) {
    console.log ('MessengerTicket.closeModify ' + action);
    this.setShowModify (false);
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
          left        = {this.comboLeft}
          top         = {this.comboTop}
          bottom      = {this.comboBottom}
          close-combo = {() => this.setShowCombo (false)}
          show-modify = {() => this.setShowModify (true)}
          {...this.link ()}/>
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

    return (
      <Ticket kind='ticket' shape='header' width={width} height={height} color='selected'
        mouse-down = {event => this.mouseDown (event)}
        mouse-up   = {event => this.mouseUp (event)}
        no-drag='false' cursor='ew-resize' {...this.link ()} >
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
        {this.renderCombo (data)}
        {this.renderModify (data)}
      </Ticket>
    );
  }

  renderCompacted () {
    const data     = this.read ('data');
    const roadbook = this.read ('roadbook');

    const width  = this.props.theme.shapes.tripTicketCompactedWidth;

    const name = (roadbook.Messenger && roadbook.Messenger.Name) ?
      roadbook.Messenger.Name :
      'A définir';

    return (
      <Container kind='column' {...this.link ()}>
        <Ticket kind='cover' shape='header' width={width} color='selected'
          mouse-down = {event => this.mouseDown (event)}
          mouse-up   = {event => this.mouseUp (event)}
          no-drag='false' cursor='ew-resize' {...this.link ()} >
          <Container kind='column' grow='1' {...this.link ()} >
            <Label text={name} text-color='#fff' {...this.link ()} />
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
