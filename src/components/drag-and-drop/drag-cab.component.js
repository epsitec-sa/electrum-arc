'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {DragCarrier} from '../../all-components.js';
import Electrum from 'electrum';

/******************************************************************************/

export default class DragCab extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      dragInProcess: false,
      dragStarting:  false,
    };
    this.dragHeight = 0;
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
    const id = this.read ('id');
    if (!id) {
      throw new Error ('DragCab has not id');
    }
    if (!window.document.dragCabs) {
      window.document.dragCabs = [];
    }
    window.document.dragCabs.push (this);
  }

  componentWillUnmount () {
    const index = window.document.dragCabs.indexOf (this);
    if (index !== -1) {
      window.document.dragCabs.splice (index, 1);
    }
  }

  mouseDown (event) {
    console.log ('DragCab.mouseDown');
    const noDrag = this.read ('no-drag');
    if (noDrag === 'true') {
      return;  // if drag prohibited, don't initiate drag & drop ?
    }
    const node = ReactDOM.findDOMNode (this);
    this.dragHeight = node.clientHeight;
    const direction = this.read ('direction');
    if (direction === 'vertical') {
      this.setDragInProcess (true);
    } else if (direction === 'horizontal' && event.clientY < 166) {  // TODO: PROVISOIRE !!!
      this.setDragInProcess (true);
    }
  }

  mouseUp (event) {
    const noDrag = this.read ('no-drag');
    if (noDrag === 'true') {  // simple click when drag prohibited ?
      this.childrenChangeState (event);
    }
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
    if (window.document.mock) {
      for (var c of window.document.toUpdate) {
        c.forceUpdate ();
      }
    }
  }

  changeState (ticket, event) {
    if (event.ctrlKey || event.shiftKey || event.metaKey) {  // select/deselect ?
      this.reduce ('SWAP_SELECTED', ticket.props, event.shiftKey);
    } else if (event.altKey) {  // dispatched/undispatched ?
      this.reduce ('SWAP_STATUS', ticket.props, event.shiftKey);
    } else {  // compected/extended ?
      this.reduce ('SWAP_EXTENDED', ticket.props, event.shiftKey);
    }
  }

  reduce (action, props, shiftKey) {
    const id   = props.ticket.id;
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

  renderDragCarrier () {
    const direction      = this.read ('direction');
    const color          = this.read ('color');
    const thickness      = this.read ('thickness');
    const radius         = this.read ('radius');
    const mode           = this.read ('mode');
    const data           = this.read ('data');
    const dragId         = this.read ('id');
    const dragController = this.read ('drag-controller');
    return (
      <DragCarrier
        direction         = {direction}
        color             = {color}
        thickness         = {thickness}
        radius            = {radius}
        mode              = {mode}
        data              = {data}
        drag-ending       = {(e, x) => this.dragEnding (e, x)}
        drag-height       = {this.dragHeight}
        drag-controller   = {dragController}
        drag-id           = {dragId}
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

  renderForDrag (isDragged, index) {
    const id            = this.read ('id');
    const direction     = this.read ('direction');
    const marginBottom  = this.read ('margin-bottom');
    const dragInProcess = this.getDragInProcess ();
    const dragStarting  = this.getDragStarting ();

    const htmlDragCarrier = (dragInProcess && !isDragged) ? this.renderDragCarrier () : null;

    const boxStyle = direction === 'horizontal' ? {
      display:       'flex',
      flexDirection: 'column',
      flexGrow:      1,
      alignItems:    'stretch',
      userSelect:    'none',
    } : {
      userSelect:    'none',
    };

    return (
      <div
        key                = {index}
        style              = {boxStyle}
        data-id            = {id}
        data-margin-bottom = {marginBottom}
        onMouseDown        = {event => this.mouseDown (event)}
        onMouseUp          = {event => this.mouseUp (event)}
        >
        {this.renderChildren (isDragged, dragStarting)}
        {htmlDragCarrier}
      </div>
    );
  }

  render () {
    return this.renderForDrag (false);
  }
}

/******************************************************************************/
