'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

/******************************************************************************/

function getVRect (rect, top, bottom) {
  return {
    left:   rect.left,
    right:  rect.right,
    top:    top,
    bottom: bottom,
  };
}

function getHRect (rect, left, right) {
  return {
    left:   left,
    right:  right,
    top:    rect.top,
    bottom: rect.bottom,
  };
}

function inflate (rect, size) {
  return {
    left:   rect.left   - size,
    right:  rect.right  + size,
    top:    rect.top    - size,
    bottom: rect.bottom + size,
    width:  rect.width  + size * 2,
    height: rect.height + size * 2,
  };
}

function isInside (rect, x, y, size) {
  rect = inflate (rect, size);
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

export default class DadaDrag extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      x: 0,
      y: 0,
      dest: null,
    };
    this.moveCount = 0;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  getX () {
    return this.state.x;
  }

  setX (value) {
    this.setState ( {
      x: value
    });
  }

  getY () {
    return this.state.y;
  }

  setY (value) {
    this.setState ( {
      y: value
    });
  }

  getDest () {
    return this.state.dest;
  }

  setDest (value) {
    this.setState ( {
      dest: value
    });
  }

  // componentDidMount () {
  //   console.log ('DadaDrag.componentDidMount');
  // }

  // componentWillUnmount () {
  //   console.log ('DadaDrag.componentWillUnmount');
  // }

  isDragStarted () {
    return this.moveCount > 3;
  }

  find (x, y) {
    const thickness = this.props.theme.shapes.dragAndDropThickness;
    for (var i = 0, len = window.document.tickets.length; i < len; i++) {
      const t = window.document.tickets[i];
      const d = t.read ('data');
      if (d && d.Trip) {
        const node = ReactDOM.findDOMNode (t);
        const rect = node.getBoundingClientRect ();
        if (isInside (getVRect (rect, rect.top, rect.top + rect.height / 2), x, y, 5)) {
          return {
            id:       t.props.data.id,
            ownerId:  t.props.data.OwnerId,
            position: 'before',
            rect:     getVRect (rect, rect.top - thickness / 2, rect.top + thickness / 2),
          };
        } else if (isInside (getVRect (rect, rect.bottom - rect.height / 2, rect.bottom), x, y, 5)) {
          return {
            id:       t.props.data.id,
            ownerId:  t.props.data.OwnerId,
            position: 'after',
            rect:     getVRect (rect, rect.bottom - thickness / 2, rect.bottom + thickness / 2),
          };
        }
      }
    }
    return null;
  }

  mouseMove (event) {
    console.log ('DadaDrag.mouseMove');
    if (this.moveCount === 0) {  // first move ?
      const toDrag = this.read ('component-to-drag');
      const node = ReactDOM.findDOMNode (toDrag);
      const rect = node.getBoundingClientRect ();
      this.offsetX = event.clientX - rect.left;
      this.offsetY = event.clientY - rect.top;
    }
    this.moveCount++;
    this.setX (event.clientX - this.offsetX);
    this.setY (event.clientY - this.offsetY);

    const dest = this.find (event.clientX, event.clientY);
    if (this.isUsefull (dest)) {
      this.setDest (dest);
    } else {
      this.setDest (null);
    }

    if (this.isDragStarted ()) {
      const dragStarting = this.read ('drag-starting');
      if (dragStarting) {
        dragStarting ();
      }
    }
  }

  mouseDown (event) {
    console.log ('DadaDrag.mouseDown');
  }

  mouseUp (event) {
    console.log ('DadaDrag.mouseUp');
    const dragEnding = this.read ('drag-ending');
    if (dragEnding) {
      dragEnding (event, this.isDragStarted ());
      const dest = this.getDest ();
      if (dest) {
        this.reduce (dest.id, dest.ownerId, dest.position);
      }
    }
  }

  isUsefull (dest) {
    if (dest) {
      const toDrag = this.read ('component-to-drag');
      const data = toDrag.read ('data');
      window.document.reducerDadaDragAndDrop (window.document.data, {
        type:        'USEFULL',
        fromId:      data.id,
        fromOwnerId: data.OwnerId,
        toId:        dest.id,
        toOwnerId:   dest.ownerId,
        toPosition:  dest.position,
      });
      return window.document.data.usefull;
    }
    return false;
  }

  reduce (id, ownerId, position) {
    const toDrag = this.read ('component-to-drag');
    const data = toDrag.read ('data');
    window.document.reducerDadaDragAndDrop (window.document.data, {
      type:        'DROP',
      fromId:      data.id,
      fromOwnerId: data.OwnerId,
      toId:        id,
      toOwnerId:   ownerId,
      toPosition:  position,
    });
    window.document.dispatch.forceUpdate ();
  }

  getComponentToDrag () {
    if (this.isDragStarted ()) {
      const toDrag = this.read ('component-to-drag');
      return toDrag.renderForDrag (true);
    } else {
      return null;
    }
  }

  render () {
    const fullScreenStyle = {
      position:        'fixed',
      zIndex:          999,
      top:             '0px',
      left:            '0px',
      width:           '100%',
      height:          '100%',
      // backgroundColor: 'rgba(255,255,0,0.1)',
    };

    const draggedStyle = {
      position:        'absolute',
      left:            this.getX (),
      top:             this.getY (),
      opacity:         0.9,
      // backgroundColor: '#f00',
    };

    const dest = this.getDest ();
    const rect = (dest && this.isDragStarted ()) ? dest.rect : {left: 0, right: 0, top: 0, bottom: 0};
    const hilitedStyle = {
      position:        'absolute',
      left:            rect.left,
      width:           rect.right - rect.left,
      top:             rect.top,
      height:          rect.bottom - rect.top,
      backgroundColor: this.props.theme.palette.dragAndDropDestination,
    };

    return (
      <div style = {fullScreenStyle}
        onMouseMove = {event => this.mouseMove (event)}
        onMouseDown = {event => this.mouseDown (event)}
        onMouseUp   = {event => this.mouseUp (event)}
        >
        <div style = {hilitedStyle} />
        <div style = {draggedStyle}>
          {this.getComponentToDrag ()}
        </div>
      </div>
    );
  }
}

/******************************************************************************/
