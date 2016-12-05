'use strict';

import React from 'react';
import {default as dragula} from 'react-dragula';
// import autoScroll from 'dom-autoscroller';

/******************************************************************************/

export default class DragController extends React.Component {

  constructor (props) {
    super (props);
    this.drake = null;
  }

  drop (element, target, source, sibling) {
    console.log ('>>>>> drop >>>>>');
    window.document.reducerDrag (window.document.data.new, {
      type:    'DRAG',
      element: element,
      target:  target,
      source:  source,
      sibling: sibling,
    });
    this.drake.remove ();  // remove the drop copy from DOM
    window.document.dispatch.forceUpdate ();
  }

  initDragula () {
    // Restrict controller with handle constraint or not.
    const controllerName = this.read ('name');
    const direction      = this.read ('direction');
    const dragHandle     = this.read ('drag-handle');
    if (dragHandle) {
      this.drake = dragula ([], {
        moves:     (el, container, handle) => this.movesWithHandle (handle),
        invalid:   (el, handle) => this.isInvalid (handle),
        copy:      true,
        direction: direction,
      });
    } else {
      this.drake = dragula ([], {
        invalid:   (el) => this.isInvalid (el),
        copy:      true,
        direction: direction,
      });
    }
    this.drake.on ('drop', (element, target, source, sibling) => this.drop (element, target, source, sibling));
    // this.drake.on ('dragEnd', () => console.log ('dragEnd'));
    // this.drake.on ('remove', () => console.log ('remove'));
    // this.drake.on ('shadow', () => console.log ('shadow'));
    // this.drake.on ('over', () => console.log ('over'));
    // this.drake.on ('out', () => console.log ('out'));
    // this.drake.on ('cloned', () => console.log ('cloned'));

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
    containersNodes.forEach (c => this.drake.containers.push (c));
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
