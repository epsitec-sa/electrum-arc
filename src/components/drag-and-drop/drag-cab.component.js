'use strict';

import React from 'react';
import {DragCarrier} from '../../all-components.js';

/******************************************************************************/

export default class DragCab extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      dragInProcess: false,
      dragStarting:  false,
    };
  }

  getDragInProcess () {
    return this.state.dragInProcess;
  }

  setDragInProcess (value) {
    this.setState ( {
      dragInProcess: value
    });
  }

  getDragStarting () {
    return this.state.dragStarting;
  }

  setDragStarting (value) {
    this.setState ( {
      dragStarting: value
    });
  }

  componentDidMount () {
    const id      = this.read ('id');
    const ownerId = this.read ('owner-id');
    if (!id || !ownerId) {
      throw new Error ('DragCab has not id or ownerId');
    }
  }

  mouseDown (event) {
    // console.log ('Ticket.mouseDown');
    this.setDragInProcess (true);
  }

  dragEnding (event, isDragDoing) {
    this.setDragInProcess (false);
    this.setDragStarting (false);
    if (!isDragDoing) {  // simple click done ?
      this.childrenChangeState (event);
    }
  }

  childrenChangeState (event) {
    React.Children.forEach (this.props.children, ticket => this.changeState (ticket, event));
    window.document.dispatch.forceUpdate ();
  }

  changeState (ticket, event) {
    if (event.ctrlKey || event.metaKey) {  // select/deselect ?
      this.reduce ('SWAP_SELECTED', ticket.props);
    } else if (event.altKey) {  // dispatched/undispatched ?
      this.reduce ('SWAP_HATCH', ticket.props);
    } else {  // compected/extended ?
      this.reduce ('SWAP_EXTENDED', ticket.props);
    }
  }

  reduce (action, props) {
    const id      = props.data.id;
    const ownerId = props.data.OwnerId;
    window.document.reducerDadaDragAndDrop (window.document.data, {
      type:    action,
      id:      id,
      ownerId: ownerId,
    });
    window.document.dispatch.forceUpdate ();
  }

  renderDrag () {
    return (
      <DragCarrier
        drag-starting     = {() => this.setDragStarting (true)}
        drag-ending       = {(e, x) => this.dragEnding (e, x)}
        component-to-drag = {this}
        {...this.link ()} />
    );
  }

  renderChildren (isDragged, dragStarting) {
    return React.Children.map (this.props.children, c => {
      return React.cloneElement (c, {
        isDragged: isDragged,
        hasHeLeft: dragStarting,
      });
    });
  }

  renderForDrag (isDragged) {
    const id            = this.read ('id');
    const ownerId       = this.read ('owner-id');
    const dragInProcess = this.getDragInProcess ();
    const dragStarting  = this.getDragStarting ();

    const htmlDrag = (dragInProcess && !isDragged) ? this.renderDrag () : null;

    return (
      <div
        data-id       = {id}
        data-owner-id = {ownerId}
        onMouseDown   = {event => this.mouseDown (event)}
        >
        {this.renderChildren (isDragged, dragStarting)}
        {htmlDrag}
      </div>
    );
  }

  render () {
    return this.renderForDrag (false);
  }
}

/******************************************************************************/
