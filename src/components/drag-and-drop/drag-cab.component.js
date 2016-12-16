'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {DragCarrier} from '../../all-components.js';

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
    const id      = this.read ('id');
    const ownerId = this.read ('owner-id');
    if (!id || !ownerId) {
      throw new Error ('DragCab has not id or ownerId');
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
    if (event.ctrlKey || event.metaKey) {  // select/deselect ?
      this.reduce ('SWAP_SELECTED', ticket.props);
    } else if (event.altKey) {  // dispatched/undispatched ?
      this.reduce ('SWAP_STATUS', ticket.props);
    } else {  // compected/extended ?
      this.reduce ('SWAP_EXTENDED', ticket.props);
    }
  }

  reduce (action, props) {
    const id      = props.data.id;
    const ownerId = props.data.OwnerId;
    window.document.data = window.document.reducerDragAndDrop (window.document.data, {
      type:    action,
      id:      id,
      ownerId: ownerId,
    });
    if (window.document.mock) {
      // This trick is necessary for update the UI !!!
      window.document.data = window.document.reducerDragAndDrop (window.document.data, {type: 'CLONE'});
      for (var c of window.document.toUpdate) {
        c.forceUpdate ();
      }
    }
  }

  renderDragCarrier () {
    const direction = this.read ('direction');
    const color     = this.read ('color');
    const thickness = this.read ('thickness');
    const radius    = this.read ('radius');
    const mode      = this.read ('mode');
    return (
      <DragCarrier
        direction         = {direction}
        color             = {color}
        thickness         = {thickness}
        radius            = {radius}
        mode              = {mode}
        drag-starting     = {() => this.setDragStarting (true)}
        drag-ending       = {(e, x) => this.dragEnding (e, x)}
        drag-height       = {this.dragHeight}
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
        style              = {boxStyle}
        data-id            = {id}
        data-owner-id      = {ownerId}
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
