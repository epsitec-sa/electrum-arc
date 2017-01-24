'use strict';

import React from 'react';
import {Container, Button, SimpleTextField} from 'electrum-arc';
import reducerDragAndDrop from '../polypheme/reducer-drag-and-drop.js';

/******************************************************************************/

export default class TicketsTray extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      title: null,
      edit:  false,
    };
  }

  get styleProps () {
    return {
      left:   this.read ('left'),
      right:  this.read ('right'),
      top:    this.read ('top'),
      bottom: this.read ('bottom'),
      rotate: this.read ('rotate'),
    };
  }

  getTitle () {
    return this.state.title;
  }

  setTitle (value) {
    this.setState ( {
      title: value
    });
  }

  getEdit () {
    return this.state.edit;
  }

  setEdit (value) {
    this.setState ( {
      edit: value
    });
  }

  componentDidMount () {
    const title = this.read ('title');
    this.setTitle (title);
  }

  // The button was clicked, replace Button by SimpleTextField (edit = true).
  mouseDown (e) {
    this.setEdit (true);
  }

  // The SimpleTextField has lost focus, replace SimpleTextField by Button (edit = false).
  onMyBlur (e) {
    // console.log ('TicketsTray.onMyBlur');
    this.setEdit (false);
  }

  // The title in SimpleTextField was changed, update the data.
  // This method was called only when the SimpleTextField lost focus (not at every keys pressed),
  // for minimized the interaction with Lydia (see updateStrategy = 'when-blur').
  onMyChange (e) {
    const value = e.target.value;
    // console.log ('TicketsTray.onMyChange ' + value);
    this.setTitle (value);

    const data = this.read ('data');
    const tray = this.read ('tray');
    reducerDragAndDrop (data, {
      type:  'SET_TRAY_NAME',
      id:    tray.id,
      value: value,
    });
  }

  // Render the header, that contains a Button (with a look like a Label)
  // or a SimpleTextField.
  renderHeader () {
    if (this.getEdit ()) {
      return (
        <SimpleTextField
          autofocus      = {true}
          updateStrategy = 'when-blur'
          value          = {this.getTitle ()}
          onBlur         = {e => this.onMyBlur (e)}
          onChange       = {e => this.onMyChange (e)}
          {...this.link ()} />
      );
    } else {
      return (
        <Button
          kind       = 'tray-title'
          grow       = {1}
          text       = {this.getTitle ()}
          mouse-down = {e => this.mouseDown (e)}
          {...this.link ()} />
      );
    }
  }

  render () {
    const tray = this.read ('tray');

    const boxStyle = this.mergeStyles ('box');

    return (
      <div style = {boxStyle}>
        {this.renderHeader ()}
        <Container
          kind            = 'tickets-tray'
          drag-controller = 'ticket'
          drag-source     = 'tray'
          item-id         = {tray.id}
          {...this.link ()} >
          {this.props.children}
        </Container>
      </div>
    );
  }
}

/******************************************************************************/
