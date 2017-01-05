'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {DragCarrier} from '../../all-components.js';
import reducerDragAndDrop from '../polypheme/reducer-drag-and-drop.js';

/******************************************************************************/

function isInside (rect, x, y) {
  if (rect && rect.left < rect.right && rect.top < rect.bottom) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  } else {
    return true;
  }
}

// Return the property 'drag-controller' of the rectangle targeted by the
// mouse (x, y). If there are several imbricated rectangles, it is necessary
// to take the one whose surface is the smallest !
function findDragController (x, y) {
  let dc = null;
  let minSurface = Number.MAX_SAFE_INTEGER;
  for (var container of window.document.dragControllers) {
    const node = ReactDOM.findDOMNode (container);
    const rect = node.getBoundingClientRect ();
    const surface = rect.width * rect.height;
    if (isInside (rect, x, y) && surface < minSurface) {
      dc = container.props['drag-controller'];
      minSurface = surface;
    }
  }
  return dc;
}

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
    const id = this.read ('item-id');
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
    const mouseDown = this.read ('mouse-down');
    if (mouseDown && mouseDown (event)) {
      return;
    }
    const noDrag = this.read ('no-drag');
    if (noDrag === 'true') {
      return;  // if drag prohibited, don't initiate drag & drop ?
    }
    const dc = findDragController (event.clientX, event.clientY);
    if (!dc || dc !== this.props['drag-controller']) {
      // When clicking in a ticket of a messenger, 2 different drags try to start.
      // The first to move the ticket (drag-controller = 'ticket') and the second
      // to move the messenger (drag-controller = 'roadbook').
      // The second one should not be started. It must start only when a click in
      // the header of the messenger !
      return;
    }
    const node = ReactDOM.findDOMNode (this);
    this.dragHeight = node.clientHeight;
    this.setDragInProcess (true);
  }

  mouseUp (event) {
    console.log ('DragCab.mouseUp');
    const mouseUp = this.read ('mouse-up');
    if (mouseUp && mouseUp (event)) {
      return;
    }
    const noDrag = this.read ('no-drag');
    if (noDrag === 'true') {  // simple click when drag prohibited ?
      this.childrenChangeState (event);
    }
  }

  dragEnding (event, isDragDoing) {
    console.log ('DragCab.dragEnding');
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
    if (!props.ticket) {
      return;
    }
    const id   = props.ticket.id;
    const data = this.read ('data');

    // inject electrum state (needed for electrumDispatch)
    data.state = props.state;
    reducerDragAndDrop (data, {
      type:     action,
      id:       id,
      shiftKey: shiftKey,
    });
    if (window.document.mock) {
      for (var c of window.document.toUpdate) {
        c.forceUpdate ();
      }
    }
  }

  renderDragCarrier () {
    const direction      = this.read ('direction');
    const color          = this.read ('color');
    const thickness      = this.read ('thickness');
    const radius         = this.read ('radius');
    const overSpacing    = this.read ('over-spacing');
    const mode           = this.read ('mode');
    const data           = this.read ('data');
    const dragId         = this.read ('item-id');
    const dragController = this.read ('drag-controller');
    return (
      <DragCarrier
        direction         = {direction}
        color             = {color}
        thickness         = {thickness}
        radius            = {radius}
        over-spacing      = {overSpacing}
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
    const id            = this.read ('item-id');
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
