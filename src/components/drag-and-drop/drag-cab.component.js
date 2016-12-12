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
    console.log ('dragEnding ' + isDragDoing);
    this.setDragInProcess (false);
    this.setDragStarting (false);
    if (!isDragDoing) {  // simple click done ?
      const mouseClick = this.read ('onMouseClick');
      if (mouseClick) {
        mouseClick (event);
      }
    }
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
        hasHeLeft: dragStarting
      });
    });
  }

  renderForDrag (isDragged) {
    const dragHandle    = this.read ('drag-handle');
    const id            = this.read ('id');
    const ownerId       = this.read ('owner-id');
    const dragInProcess = this.getDragInProcess ();
    const dragStarting  = this.getDragStarting ();

    const boxStyle = {
      // visibility: dragInProcess ? 'hidden' : 'visible',
    };

    const htmlDrag = (dragInProcess && !isDragged) ? this.renderDrag () : null;

    return (
      <div style = {boxStyle}
        data-drag-handle = {dragHandle}
        data-id          = {id}
        data-owner-id    = {ownerId}
        onMouseDown = {event => this.mouseDown (event)}
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
