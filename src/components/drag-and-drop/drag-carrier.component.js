'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Unit} from 'electrum-theme';

/******************************************************************************/

function getVRect (rect, top, bottom) {
  return {
    left:   rect.left,
    right:  rect.right,
    top:    top,
    bottom: bottom,
    width:  rect.width,
    height: bottom - top,
  };
}

function getHRect (rect, left, right) {
  return {
    left:   left,
    right:  right,
    top:    rect.top,
    bottom: rect.bottom,
    width:  right - left,
    height: rect.height,
  };
}

function isInside (rect, x, y) {
  if (rect) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  } else {
    return true;
  }
}

function subBottomMargin (rect, bm) {
  return {
    left:   rect.left,
    right:  rect.right,
    top:    rect.top,
    bottom: rect.bottom - bm,
    width:  rect.width,
    height: rect.height - bm,
  };
}

function getBoundingRect (node) {
  const rect = node.getBoundingClientRect ();
  if (node.dataset.marginBottom) {
    return subBottomMargin (rect, node.dataset.marginBottom);
  } else {
    return rect;
  }
}

function clipDot (p, box) {
  p.x = Math.max (p.x, box.left);
  p.x = Math.min (p.x, box.right);
  p.y = Math.max (p.y, box.top);
  p.y = Math.min (p.y, box.bottom);
  return p;
}

function clip (rect, box) {
  if (box) {
    const tl = clipDot ({x: rect.left, y: rect.top}, box);
    const br = clipDot ({x: rect.right, y: rect.bottom}, box);
    return {
      left:   tl.x,
      right:  br.x,
      top:    tl.y,
      bottom: br.y,
      width:  br.x - tl.x,
      height: br.y - tl.y,
    };
  }
  return rect;
}

export default class DragCarrier extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      x:    0,
      y:    0,
      dest: null,
    };
    this.moveCount  = 0;
    this.startX     = 0;
    this.startY     = 0;
    this.offsetX    = 0;
    this.offsetY    = 0;
    this.rectOrigin = null;
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

  getHalfThickness () {
    const thickness = this.read ('thickness');
    return Unit.parse (Unit.multiply (thickness, 0.5)).value;
  }

  findV (component, node, y, parentRect, id) {
    const thickness = this.getHalfThickness ();
    if (node.children.length === 0) {  // is in top of empty container ?
      const rect = getBoundingRect (node);
      return {
        id:         null,
        ownerId:    component.props.id,
        position:   'null',
        rect:       getVRect (rect, rect.top - thickness, rect.top + thickness),
        parentRect: parentRect,
      };
    }
    for (var i = 0, len = node.children.length; i < len; i++) {
      const t = node.children[i];
      const rect = getBoundingRect (t);
      if (t.dataset.id === id) {
        this.rectOrigin = {
          id:         t.dataset.id,
          ownerId:    t.dataset.ownerId,
          position:   'full',
          rect:       rect,
          parentRect: parentRect,
        };
      }
      const oy = rect.top + rect.height / 2;
      if (y < oy) {  // is upper middle ?
        let py = rect.top;
        if (i > 0) {  // not top first element ?
          const lt = node.children[i - 1];
          const lr = getBoundingRect (lt);
          py = (lr.bottom + rect.top) / 2;
        }
        return {
          id:         t.dataset.id,
          ownerId:    t.dataset.ownerId,
          position:   'before',
          rect:       getVRect (rect, py - thickness, py + thickness),
          parentRect: parentRect,
        };
      }
    }
    // At the end of container (after the last element).
    const last = node.children[node.children.length - 1];
    const rect = last.getBoundingClientRect ();
    return {
      id:         last.dataset.id,
      ownerId:    last.dataset.ownerId,
      position:   'after',
      rect:       getVRect (rect, rect.bottom - thickness, rect.bottom + thickness),
      parentRect: parentRect,
    };
  }

  findH (component, node, x, parentRect, id) {
    const thickness = this.getHalfThickness ();
    if (node.children.length === 0) {  // is in top of empty container ?
      const rect = getBoundingRect (node);
      return {
        id:         null,
        ownerId:    component.props.id,
        position:   'null',
        rect:       getHRect (rect, rect.left - thickness, rect.left + thickness),
        parentRect: parentRect,
      };
    }
    for (var i = 0, len = node.children.length; i < len; i++) {
      const t = node.children[i];
      const rect = getBoundingRect (t);
      if (t.dataset.id === id) {
        this.rectOrigin = {
          id:         t.dataset.id,
          ownerId:    t.dataset.ownerId,
          position:   'full',
          rect:       rect,
          parentRect: parentRect,
        };
      }
      const ox = rect.left + rect.width / 2;
      if (x < ox) {  // is upper middle ?
        let px = rect.left;
        if (i > 0) {  // not top first element ?
          const lt = node.children[i - 1];
          const lr = getBoundingRect (lt);
          px = (lr.right + rect.left) / 2;
        }
        return {
          id:         t.dataset.id,
          ownerId:    t.dataset.ownerId,
          position:   'before',
          rect:       getHRect (rect, px - thickness, px + thickness),
          parentRect: parentRect,
        };
      }
    }
    // At the end of container (after the last element).
    const last = node.children[node.children.length - 1];
    const rect = last.getBoundingClientRect ();
    return {
      id:         last.dataset.id,
      ownerId:    last.dataset.ownerId,
      position:   'after',
      rect:       getHRect (rect, rect.right - thickness, rect.right + thickness),
      parentRect: parentRect,
    };
  }

  findViewId (id) {
    if (id) {
      for (var i = 0, len = window.document.viewIds.length; i < len; i++) {
        const c = window.document.viewIds[i];
        const viewId = c.props.viewId;
        if (viewId === id) {
          return c;
        }
      }
    }
    return null;
  }

  getParentRect (component) {
    const dragParentId = component.props['view-parent-id'];
    const parent = this.findViewId (dragParentId);
    if (parent) {
      const parentNode = ReactDOM.findDOMNode (parent);
      return parentNode.getBoundingClientRect ();
    }
    return null;
  }

  find (x, y) {
    this.rectOrigin = null;
    const direction = this.read ('direction');
    const toDrag    = this.read ('component-to-drag');
    const dragHandle = toDrag.read ('drag-handle');
    const id         = toDrag.read ('id');
    for (var i = 0, len = window.document.dragControllers.length; i < len; i++) {
      const c = window.document.dragControllers[i];
      const dragController = c.props['drag-controller'];
      if (dragController === dragHandle) {
        const n = ReactDOM.findDOMNode (c);
        const rect = n.getBoundingClientRect ();
        const parentRect = this.getParentRect (c);
        if (isInside (parentRect, x, y) && isInside (rect, x, y)) {
          if (direction === 'horizontal') {
            return this.findH (c, n, x, parentRect, id);
          } else {
            return this.findV (c, n, y, parentRect, id);
          }
        }
      }
    }
    return null;
  }

  mouseMove (event) {
    console.log ('mouseMove >>>>>>>>>>>>>>>>>>>>');
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
    const mode = this.read ('mode');
    if (mode === 'corner-top-left') {
      this.setX (event.clientX);
      this.setY (event.clientY);
    } else {  // keep mouse at click point
      this.setX (event.clientX - this.offsetX);
      this.setY (event.clientY - this.offsetY);
    }

    const dest = this.find (event.clientX, event.clientY);
    if (this.isUseful (dest)) {
      this.setDest (dest);
    } else {
      this.setDest (this.rectOrigin);
    }

    if (this.isDragStarted ()) {
      const dragStarting = this.read ('drag-starting');
      if (dragStarting) {
        dragStarting ();
      }
    }
  }

  mouseUp (event) {
    console.log ('mouseUp >>>>>>>>>>>>>>>>>>>>');
    const dragEnding = this.read ('drag-ending');
    if (dragEnding) {
      dragEnding (event, this.isDragStarted ());
      const dest = this.getDest ();
      if (dest && dest.position !== 'full') {
        this.reduce (dest.id, dest.ownerId, dest.position);
      }
    }
  }

  isUseful (dest) {
    if (dest) {
      const toDrag      = this.read ('component-to-drag');
      const fromId      = toDrag.read ('id');
      const fromOwnerId = toDrag.read ('owner-id');
      window.document.data = window.document.reducerDragAndDrop (window.document.data, {
        type:        'IS_USEFUL',
        fromId:      fromId,
        fromOwnerId: fromOwnerId,
        toId:        dest.id,
        toOwnerId:   dest.ownerId,
        toPosition:  dest.position,
      });
      return window.document.data.isUseful;
    }
    return false;
  }

  reduce (id, ownerId, position) {
    const toDrag      = this.read ('component-to-drag');
    const fromId      = toDrag.read ('id');
    const fromOwnerId = toDrag.read ('owner-id');
    window.document.data = window.document.reducerDragAndDrop (window.document.data, {
      type:        'DROP',
      fromId:      fromId,
      fromOwnerId: fromOwnerId,
      toId:        id,
      toOwnerId:   ownerId,
      toPosition:  position,
    });
    if (window.document.mock) {
      window.document.dispatch.forceUpdate ();
    }
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
    const color      = this.read ('color');
    const radius     = this.read ('radius');
    const dragHeight = this.read ('drag-height');

    const fullScreenStyle = {
      visibility:      'visible',
      position:        'fixed',
      zIndex:          10,
      top:             '0px',
      left:            '0px',
      width:           '100%',
      height:          '100%',
      userSelect:      'none',
      // backgroundColor: '#f00',
      // opacity:         0.1,
    };

    const draggedStyle = {
      visibility:      'visible',
      position:        'absolute',
      display:         'flex',
      height:          dragHeight,
      left:            this.getX (),
      top:             this.getY (),
      opacity:         0.9,
      userSelect:      'none',
    };

    const dest = this.getDest ();
    let hilitedStyle;
    if (dest && this.isDragStarted ()) {
      const rect = clip (dest.rect, dest.parentRect);
      hilitedStyle = {
        visibility:      'visible',
        position:        'absolute',
        left:            rect.left,
        width:           rect.width,
        top:             rect.top,
        height:          rect.height,
        borderRadius:    radius,
        transition:      'all 0.2s ease-out',
        backgroundColor: color,
        userSelect:      'none',
      };
    } else {
      hilitedStyle = {
        visibility:      'hidden',
        position:        'absolute',
        borderRadius:    radius,
        transition:      'all 0.2s ease-out',
        backgroundColor: color,
        userSelect:      'none',
      };
    }

    return (
      <div style = {fullScreenStyle}
        onMouseMove = {event => this.mouseMove (event)}
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
