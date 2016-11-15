'use strict';

import React from 'react';
import {default as dragula} from 'react-dragula';
// import autoScroll from 'dom-autoscroller';

/******************************************************************************/

export default class DragController extends React.Component {

  constructor (props) {
    super (props);
  }

  dragBegin (element, target, source, nextSibling) {
    console.log ('>>>>>>>>>>>>>>');
    console.dir (element);
    console.dir (target);
    console.dir (source);
    console.dir (nextSibling);
    const ticketId = element.children[2].dataset.ticketId;
    console.dir (ticketId);
    const containersNodes = document.querySelectorAll (`[data-ticket-id="${ticketId}"]`);
    console.dir (containersNodes);
  }

  initDragula () {
    // Restrict controller with handle constraint or not.
    const controllerName = this.read ('name');
    const direction      = this.read ('direction');
    const dragHandle     = this.read ('drag-handle');
    let drake;
    if (dragHandle) {
      drake = dragula ([], {
        moves:     (el, container, handle) => this.movesWithHandle (handle),
        invalid:   (el, handle) => this.isInvalid (handle),
        direction: direction,
      });
    } else {
      drake = dragula ([], {
        invalid:   (el) => this.isInvalid (el),
        direction: direction,
      });
    }
    drake.on ('drag', (element, target, source, nextSibling) => this.dragBegin (element, target, source, nextSibling));

    // Configure auto-scroll
    /*autoScroll ([
      document.querySelectorAll (`[data-drag-controller="${controllerName}"]`)
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
    const containersNodes = document.querySelectorAll (`[data-drag-container-for="${controllerName}"]`);
    containersNodes.forEach (c => drake.containers.push (c));
  }

  componentDidMount () {
    this.initDragula ();
  }

  movesWithHandle (handle) {
    const dragHandle = this.read ('drag-handle');
    return handle.dataset.dragHandle === dragHandle;
  }

  isInvalid (el) {
    return el.dataset.dragInvalid === 'true' || el.dataset.dragInvalid === true;
  }

  render () {
    const controllerName = this.read ('name');

    return (
      <div data-drag-controller = {controllerName} />
    );
  }
}

/******************************************************************************/
