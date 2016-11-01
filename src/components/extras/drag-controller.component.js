'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Action} from 'electrum';
import Dragula from 'react-dragula';
import autoScroll from 'dom-autoscroller';

/******************************************************************************/

export default class DragController extends React.Component {

  constructor (props) {
    super (props);
    this.controllerName = null;
    this.drake          = null;
    this.dragHandle     = null;
    this.direction      = 'vertical';
  }

  initDragula () {
    // restrict controller with handle constraint or not
    if (this.dragHandle) {
      this.drake = Dragula ([], {
        moves:     (el, container, handle) => this.movesWithHandle (handle),
        invalid:   (el, handle) => this.isInvalid (handle),
        direction: this.direction
      });
    } else {
      this.drake = Dragula ([], {
        direction: this.direction,
        invalid:   (el) => this.isInvalid (el)
      });
    }

    // Configure auto-scroll
    /*let drake = this.drake;
    autoScroll ([
      document.querySelectorAll (
        `[data-drag-controller="${this.controllerName}"]`
      )
      ], {
      margin: 20,
      maxSpeed: 5,
      scrollWhenOutside: true,
      autoScroll: function () {
          //Only scroll when the pointer is down, and there is a child being dragged.
          return this.down && drake.dragging;
        }
    });*/

    // Register controller in document
    // TODO: register a namespace
    if (!window.document.dragControllers) {
      window.document.dragControllers = {};
    }
    let dCtrls = window.document.dragControllers;
    dCtrls[this.controllerName] = {};
    dCtrls[this.controllerName].register = (c) => this.register (c);

    // register existing
    const containersNodes = document.querySelectorAll (
      `[data-drag-controller="${this.controllerName}"]`
    );
    containersNodes.forEach (c => this.drake.containers.push (c));
  }

  componentDidMount () {
    this.initDragula ();
  }

  register (component) {
    let containers = this.drake.containers;
    const node = ReactDOM.findDOMNode (component);
    containers.push (node);
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
      <div data-drag-controller={this.controllerName} />
    );
  }
}

/******************************************************************************/
