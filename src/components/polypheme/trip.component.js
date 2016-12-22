'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {TripBox, TripTicket, DragCab, Combo, Container, Button, Label, DialogModal} from '../../all-components.js';
import {Unit} from 'electrum-theme';
import Electrum from 'electrum';

/******************************************************************************/

export default class Trip extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      showCombo:  false,
      showModify: false,
    };
    this.comboLeft   = null;
    this.comboTop    = null;
    this.comboBottom = null;
  }

  getShowCombo () {
    return this.state.showCombo;
  }

  setShowCombo (value) {
    this.setState ( {
      showCombo: value
    });
  }

  getShowModify () {
    return this.state.showModify;
  }

  setShowModify (value) {
    this.setState ( {
      showModify: value
    });
  }

  showCombo (x) {
    const node = ReactDOM.findDOMNode (this);
    const comboRect = node.getBoundingClientRect ();

    // Compute horizontal position according to mouse.
    const width = 200;  // assumed approximate width
    this.comboLeft = (x - width / 2) + 'px';

    // Puts the menu under the component if it is in the upper half of the window.
    const my = (comboRect.top + comboRect.bottom) / 2;
    const underside = my < window.innerHeight / 2;
    const top = Unit.add ((window.innerHeight - comboRect.top) + 'px', this.props.theme.shapes.flyingBalloonTriangleSize);
    const bottom = Unit.add (comboRect.bottom + 'px', this.props.theme.shapes.flyingBalloonTriangleSize);
    this.comboTop = underside ? bottom : null;
    this.comboBottom = underside ? null : top;

    this.setShowCombo (true);
  }

  mouseDown (event) {
    console.log ('Trip.mouseDown');
    if (this.getShowCombo () || this.getShowModify ()) {
      return true;
    }
    // if (event.button === 2)  // right-click ?
    if (event.button === 2 || (event.ctrlKey && event.shiftKey)) {
      this.showCombo (event.clientX);
      return true;
    }
    return false;
  }

  mouseUp (event) {
    console.log ('Trip.mouseUp');
    if (this.getShowCombo () || this.getShowModify ()) {
      return true;
    }
    return false;
  }

  reduce (action, ticket, shiftKey) {
    const id   = ticket.id;
    const data = this.read ('data');
    if (window.document.reducerDragAndDrop) {
      window.document.reducerDragAndDrop (data, {
        type:     action,
        id:       id,
        shiftKey: shiftKey,
      });
      if (window.document.mock) {
        for (var c of window.document.toUpdate) {
          c.forceUpdate ();
        }
      }
    } else {
      Electrum.bus.dispatch (this.props, 'select', {
        type:     action,
        key:      id,
        shiftKey: shiftKey,
      });
    }
  }

  modify () {
    this.setShowModify (true);
  }

  dispatch () {
    const ticket = this.read ('ticket');
    this.reduce ('SWAP_STATUS', ticket);
  }

  extend () {
    const ticket = this.read ('ticket');
    this.reduce ('SWAP_EXTENDED', ticket);
  }

  select () {
    const ticket = this.read ('ticket');
    this.reduce ('SWAP_SELECTED', ticket);
  }

  modifyAccept () {
    this.setShowModify (false);
  }

  modifyCancel () {
    this.setShowModify (false);
  }

  renderModify () {
    if (this.getShowModify ()) {
      return (
        <DialogModal width='400px' height='400px' {...this.link ()}>
          <Container kind='views' {...this.link ()} >
            <Container kind='full-view' {...this.link ()} >

              <Container kind='pane-navigator' {...this.link ()} >
                <Label text='Liste des mandats' grow='1' kind='title' {...this.link ()} />
              </Container>

              <Container kind='panes' subkind='top-margin' {...this.link ()} >
              </Container>

              <Container kind='actions' subkind='no-shadow' {...this.link ()} >
                <Button action={() => this.modifyAccept ()} glyph='check' text='Modifier' kind='action'
                  grow='1' place='left' {...this.link ()} />
                <Button action={() => this.modifyCancel ()} glyph='close' text='Annuler' kind='action'
                  grow='1' place='right' {...this.link ()} />
              </Container>
            </Container>
          </Container>
        </DialogModal>
      );
    } else {
      return null;
    }
  }

  renderCombo () {
    if (this.getShowCombo ()) {
      // console.log ('Trip.renderCombo');
      const ticket = this.read ('ticket');
      const list = [];
      list.push (
        {
          text:   'Modifier...',
          glyph:  'pencil',
          action: () => this.modify (),
        }
      );
      if (ticket.Type !== 'both') {
        list.push (
          {
            text:   ticket.Status === 'dispatched' ? 'Non dispatché' : 'Dispatché',
            glyph:  ticket.Status === 'dispatched' ? 'square-o' : 'hashtag',
            action: () => this.dispatch (),
          }
        );
        list.push (
          {
            text:   ticket.Extended === 'true' ? 'Réduire' : 'Étendre',
            glyph:  ticket.Extended === 'true' ? 'arrow-up' : 'arrow-down',
            action: () => this.extend (),
          }
        );
      }
      list.push (
        {
          text:   ticket.Selected === 'true' ? 'Désélectionner' : 'Sélectionner',
          glyph:  ticket.Selected === 'true' ? 'circle-o' : 'check-circle',
          action: () => this.select (),
        }
      );

      return (
        <Combo
          left   = {this.comboLeft}
          top    = {this.comboTop}
          bottom = {this.comboBottom}
          list   = {list}
          close  = {() => this.setShowCombo (false)}
          {...this.link ()} />
      );
    } else {
      return null;
    }
  }

  renderTrip (ticket, data, noDrag, margin, content) {
    return (
      <DragCab
        drag-controller = 'ticket'
        direction       = 'vertical'
        color           = {this.props.theme.palette.dragAndDropHover}
        thickness       = {this.props.theme.shapes.dragAndDropThickness}
        radius          = {this.props.theme.shapes.dragAndDropThickness}
        mode            = 'corner-top-left'
        data            = {data}
        id              = {ticket.id}
        no-drag         = {noDrag}
        margin-bottom   = {margin}
        mouse-down      = {event => this.mouseDown (event)}
        mouse-up        = {event => this.mouseUp (event)}
        {...this.link ()}>
        {content ()}
        {this.renderCombo ()}
        {this.renderModify ()}
      </DragCab>
    );
  }

  render () {
    const kind   = this.read ('kind');
    const ticket = this.read ('ticket');
    const data   = this.read ('data');
    const noDrag = (ticket.Status === 'dispatched') ? 'true' : null;

    if (kind === 'trip-box') {
      const m = Unit.parse (this.props.theme.shapes.tripBoxBottomMargin).value;
      return this.renderTrip (ticket, data, noDrag, m, () => (
        <TripBox ticket={ticket} {...this.link ()} />
      ));
    } else if (kind === 'trip-ticket') {
      return this.renderTrip (ticket, data, noDrag, 2, () => (
        <TripTicket ticket={ticket} no-drag={noDrag} shape={ticket.Shape} {...this.link ()} />
      ));
    } else {
      throw new Error (`Trip component contains invalid kind: ${kind}`);
    }
  }
}

/******************************************************************************/
