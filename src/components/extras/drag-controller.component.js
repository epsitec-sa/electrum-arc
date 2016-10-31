'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Action} from 'electrum';
import Dragula from 'react-dragula';

/******************************************************************************/

export default class DragController extends React.Component {

  constructor (props) {
    super (props);
    this.controllerName = null;
    this.drake = null;
    this.dragHandle = null;
    this.direction = 'vertical';
  }

  initDragula () {
    console.log (`creating global drag controller for
      ${this.controllerName}`
    );

    // restrict controller with handle constraint or not
    if (this.dragHandle) {
      this.drake = Dragula ([], {
        moves:  (el, container, handle) => this.movesWithHandle (handle),
        invalid: (el, handle) => this.isInvalid (handle),
        direction: this.direction
      });
    } else {
      this.drake = Dragula ([], {
        direction: this.direction,
        invalid: (el) => this.isInvalid (el)
      });
    }

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

    console.dir (this.drake.containers);
  }

  componentDidMount () {
    this.initDragula ();
  }

  register (component) {
    let containers = this.drake.containers;
    const node = ReactDOM.findDOMNode (component);
    containers.push (node);
    console.dir (containers);
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
    return (<div data-drag-controller={this.controllerName} />);
  }
}

/******************************************************************************/
