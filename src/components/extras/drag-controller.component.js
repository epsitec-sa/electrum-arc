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
  }

  initDragula () {
    console.log (`creating global drag controller for
      ${this.controllerName}`
    );
    if (this.dragHandle) {
      this.drake = Dragula ([], {
        moves:  (e,s,h) => this.movesWithHandle (h),
      });
    } else {
      this.drake = Dragula ();
    }


    let containers = this.drake.containers;

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
    console.log (handle.dataset.dragHandle === this.dragHandle);
    return handle.dataset.dragHandle === this.dragHandle;
  }

  render () {
    const {state} = this.props;
    this.controllerName = this.read ('name');
    this.dragHandle     = this.read ('drag-handle');
    return (<div data-drag-controller={this.controllerName}/>);
  }
}

/******************************************************************************/
