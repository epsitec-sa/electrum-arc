'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

/******************************************************************************/

function length (x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt ((dx * dx) + (dy * dy));
}

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

export default class DragCarrier extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      x:    0,
      y:    0,
      dest: null,
    };
    this.moveCount = 0;
    this.startX    = 0;
    this.startY    = 0;
    this.offsetX   = 0;
    this.offsetY   = 0;
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

  isDragStarted () {
    return this.moveCount > 2;
  }

  findV (component, node, y) {
    const thickness = this.props.theme.shapes.dragAndDropThickness / 2;
    if (node.children.length === 0) {  // is in top of empty container ?
      const rect = node.getBoundingClientRect ();
      return {
        id:       null,
        ownerId:  component.props.id,
        position: 'null',
        rect:     getVRect (rect, rect.top - thickness, rect.top + thickness),
      };
    }
    for (var i = 0, len = node.children.length; i < len; i++) {
      const t = node.children[i];
      const rect = t.getBoundingClientRect ();
      const oy = rect.top + rect.height / 2;
      if (y < oy) {  // is upper middle ?
        let py = rect.top;
        if (i > 0) {  // not top first element ?
          const lt = node.children[i - 1];
          const lr = lt.getBoundingClientRect ();
          py = (lr.bottom + rect.top) / 2;
        }
        return {
          id:       t.dataset.id,
          ownerId:  t.dataset.ownerId,
          position: 'before',
          rect:     getVRect (rect, py - thickness, py + thickness),
        };
      }
    }
    // At the end of container (after the last element).
    const last = node.children[node.children.length - 1];
    const rect = last.getBoundingClientRect ();
    return {
      id:       last.dataset.id,
      ownerId:  last.dataset.ownerId,
      position: 'after',
      rect:     getVRect (rect, rect.bottom - thickness, rect.bottom + thickness),
    };
  }

  find (x, y) {
    console.log ('find...');
    const toDrag = this.read ('component-to-drag');
    const dragHandle = toDrag.read ('drag-handle');
    for (var i = 0, len = window.document.dragControllers.length; i < len; i++) {
      const c = window.document.dragControllers[i];
      const dragController = c.props['drag-controller'];
      if (dragController === dragHandle) {
        const n = ReactDOM.findDOMNode (c);
        const rect = n.getBoundingClientRect ();
        if (isInside (rect, x, y, 5)) {
          return this.findV (c, n, y);
        }
      }
    }
    return null;
  }

  mouseMove (event) {
    if (this.moveCount === 0) {  // first move ?
      this.startX = event.clientX;
      this.startY = event.clientY;
      const toDrag = this.read ('component-to-drag');
      const node = ReactDOM.findDOMNode (toDrag);
      const rect = node.getBoundingClientRect ();
      this.offsetX = event.clientX - rect.left;
      this.offsetY = event.clientY - rect.top;
    }
    this.moveCount++;
    // this.setX (event.clientX - this.offsetX);
    // this.setY (event.clientY - this.offsetY);
    this.setX (event.clientX);
    this.setY (event.clientY);

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
  }

  mouseUp (event) {
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
      const toDrag      = this.read ('component-to-drag');
      const fromId      = toDrag.read ('id');
      const fromOwnerId = toDrag.read ('owner-id');
      window.document.reducerDragAndDrop (window.document.data, {
        type:        'USEFULL',
        fromId:      fromId,
        fromOwnerId: fromOwnerId,
        toId:        dest.id,
        toOwnerId:   dest.ownerId,
        toPosition:  dest.position,
      });
      return window.document.data.usefull;
    }
    return false;
  }

  reduce (id, ownerId, position) {
    const toDrag      = this.read ('component-to-drag');
    const fromId      = toDrag.read ('id');
    const fromOwnerId = toDrag.read ('owner-id');
    window.document.reducerDragAndDrop (window.document.data, {
      type:        'DROP',
      fromId:      fromId,
      fromOwnerId: fromOwnerId,
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
      visibility:      'visible',
      position:        'fixed',
      zIndex:          10,
      top:             '0px',
      left:            '0px',
      width:           '100%',
      height:          '100%',
      // backgroundColor: 'rgba(255,255,0,0.1)',
    };

    const draggedStyle = {
      visibility:      'visible',
      position:        'absolute',
      left:            this.getX (),
      top:             this.getY (),
      opacity:         0.9,
    };

    const dest = this.getDest ();
    let hilitedStyle;
    if (dest && this.isDragStarted ()) {
      const rect = dest.rect;
      hilitedStyle = {
        visibility:      'visible',
        position:        'absolute',
        left:            rect.left,
        width:           rect.right - rect.left,
        top:             rect.top,
        height:          rect.bottom - rect.top,
        transition:      'all 0.2s ease-out',
        backgroundColor: this.props.theme.palette.dragAndDropDestination,
      };
    } else {
      hilitedStyle = {
        visibility:      'hidden',
        position:        'absolute',
        transition:      'all 0.2s ease-out',
        backgroundColor: this.props.theme.palette.dragAndDropDestination,
      };
    }

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
