'use strict';

import React from 'react';
import {default as dragula} from 'react-dragula';
// import autoScroll from 'dom-autoscroller';

/******************************************************************************/

export default class DragController extends React.Component {

  constructor (props) {
    super (props);
    this.drake          = null;
    this.controllerName = null;
    this.dragHandle     = null;
    this.direction      = 'vertical';
  }

  initDragula () {
    // Restrict controller with handle constraint or not.
    if (this.dragHandle) {
      this.drake = dragula ([], {
        moves:     (el, container, handle) => this.movesWithHandle (handle),
        invalid:   (el, handle) => this.isInvalid (handle),
        direction: this.direction,
      });
    } else {
      this.drake = dragula ([], {
        invalid:   (el) => this.isInvalid (el),
        direction: this.direction,
      });
    }

    // Configure auto-scroll
    /*let drake = this.drake;
    autoScroll ([
      document.querySelectorAll (`[data-drag-controller="${this.controllerName}"]`)
      ], {
      margin: 20,
      maxSpeed: 5,
      scrollWhenOutside: true,
      autoScroll: function () {
          //Only scroll when the pointer is down, and there is a child being dragged.
          return this.down && drake.dragging;
        }
    });*/

    // find and add existing containers in dom
    const containersNodes = document.querySelectorAll (`[data-drag-container-for="${this.controllerName}"]`);
    containersNodes.forEach (c => this.drake.containers.push (c));
  }

  componentDidMount () {
    this.initDragula ();
  }

  movesWithHandle (handle) {
    return handle.dataset.dragHandle === this.dragHandle;
  }

  isInvalid (el) {
    return el.dataset.dragInvalid === 'true' || el.dataset.dragInvalid === true;
  }

  render () {
    this.controllerName = this.read ('name');
    this.dragHandle     = this.read ('drag-handle');
    this.direction      = this.read ('direction');
    return (
      <div data-drag-controller = {this.controllerName} />
    );
  }
}

/******************************************************************************/
