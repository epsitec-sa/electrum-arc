'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Unit} from 'electrum-theme';
import reducerDragAndDrop from '../polypheme/reducer-drag-and-drop.js';
import {isSelected} from '../polypheme/ticket-helpers.js';

import {
  Container,
  Label
} from '../../all-components.js';

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
  if (rect && rect.left < rect.right && rect.top < rect.bottom) {
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

/******************************************************************************/

export default class DragCarrier extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      x:    0,
      y:    0,
      dest: null,
    };
    this.moveCount       = 0;
    this.startX          = 0;
    this.startY          = 0;
    this.offsetX         = 0;
    this.offsetY         = 0;
    this.rectOrigin      = null;
    this.lastDragStarted = false;
    this.selectedIds     = [];
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

  getOverSpacing () {
    const overSpacing = this.read ('over-spacing');
    if (overSpacing) {
      return Unit.parse (Unit.multiply (overSpacing, 1)).value;
    } else {
      return 0;
    }
  }

  findV (container, node, y, parentRect) {
    const thickness   = this.getHalfThickness ();
    const overSpacing = this.getOverSpacing () / 2;
    if (container.props['drag-mode'] === 'all') {
      const rect = getBoundingRect (node);
      return {
        id:         null,
        ownerId:    container.props['item-id'],
        ownerKind:  container.props['drag-source'],
        rect:       rect.height === 0 ? getVRect (rect, rect.top, rect.top + thickness * 2) : rect,
        opacity:    0.8,
        radius:     '2px',
        parentRect: parentRect,
        index:      -1,
      };
    }
    if (node.children.length === 0) {  // is in top of empty container ?
      const rect = getBoundingRect (node);
      return {
        id:         null,
        ownerId:    container.props['item-id'],
        ownerKind:  container.props['drag-source'],
        rect:       getVRect (rect, rect.top - thickness, rect.top + thickness),
        parentRect: parentRect,
        index:      0,
      };
    }
    for (var i = 0, len = node.children.length; i < len; i++) {
      const t = node.children[i];
      const rect = getBoundingRect (t);
      const oy = rect.top + rect.height / 2;
      if (y < oy) {  // is upper middle ?
        let py = rect.top;
        if (i > 0) {  // not top first element ?
          const lt = node.children[i - 1];
          const lr = getBoundingRect (lt);
          py = (lr.bottom + rect.top) / 2;
        }
        py -= overSpacing;
        return {
          id:         t.dataset.id,
          ownerId:    container.props['item-id'],
          ownerKind:  container.props['drag-source'],
          rect:       getVRect (rect, py - thickness, py + thickness),
          parentRect: parentRect,
          index:      i,
        };
      }
    }
    // At the end of container (after the last element).
    const last = node.children[node.children.length - 1];
    const rect = last.getBoundingClientRect ();
    return {
      id:         null,  // after last
      ownerId:    container.props['item-id'],
      ownerKind:  container.props['drag-source'],
      rect:       getVRect (rect, rect.bottom - overSpacing - thickness, rect.bottom - overSpacing + thickness),
      parentRect: parentRect,
      index:      node.children.length,
    };
  }

  findH (container, node, x, parentRect) {
    const thickness   = this.getHalfThickness ();
    const overSpacing = this.getOverSpacing () / 2;
    if (container.props['drag-mode'] === 'all') {
      const rect = getBoundingRect (node);
      return {
        id:         null,
        ownerId:    container.props['item-id'],
        ownerKind:  container.props['drag-source'],
        rect:       rect.width === 0 ? getHRect (rect, rect.left, rect.left + thickness * 2) : rect,
        opacity:    0.8,
        radius:     '2px',
        parentRect: parentRect,
        index:      -1,
      };
    }
    if (node.children.length === 0) {  // is in top of empty container ?
      const rect = getBoundingRect (node);
      return {
        id:         null,
        ownerId:    container.props['item-id'],
        ownerKind:  container.props['drag-source'],
        rect:       getHRect (rect, rect.left - thickness, rect.left + thickness),
        parentRect: parentRect,
        index:      0,
      };
    }
    for (var i = 0, len = node.children.length; i < len; i++) {
      const t = node.children[i];
      const rect = getBoundingRect (t);
      const ox = rect.left + rect.width / 2;
      if (x < ox) {  // is upper middle ?
        let px = rect.left;
        if (i > 0) {  // not top first element ?
          const lt = node.children[i - 1];
          const lr = getBoundingRect (lt);
          px = (lr.right + rect.left) / 2;
        }
        px -= overSpacing;
        return {
          id:         t.dataset.id,
          ownerId:    container.props['item-id'],
          ownerKind:  container.props['drag-source'],
          rect:       getHRect (rect, px - thickness, px + thickness),
          parentRect: parentRect,
          index:      i,
        };
      }
    }
    // At the end of container (after the last element).
    const last = node.children[node.children.length - 1];
    const rect = last.getBoundingClientRect ();
    return {
      id:         null,  // after last
      ownerId:    container.props['item-id'],
      ownerKind:  container.props['drag-source'],
      rect:       getHRect (rect, rect.right - overSpacing - thickness, rect.right - overSpacing + thickness),
      parentRect: parentRect,
      index:      node.children.length,
    };
  }

  findParentId (id) {
    if (id) {
      for (var c of window.document.dragParentControllers) {
        const parentId = c.props['drag-parent'];
        if (parentId === id) {
          return c;
        }
      }
    }
    return null;
  }

  getParentRect (container) {
    const dragParentId = container.props['item-id'];
    const parent = this.findParentId (dragParentId);
    if (parent) {
      const parentNode = ReactDOM.findDOMNode (parent);
      return parentNode.getBoundingClientRect ();
    }
    return null;
  }

  findViewId (id) {
    if (id) {
      for (var c of window.document.viewIds) {
        const viewId = c.props.viewId;
        if (viewId === id) {
          return c;
        }
      }
    }
    return null;
  }

  getViewParentRect (container) {
    const dragParentId = container.props['view-parent-id'];
    const parent = this.findViewId (dragParentId);
    if (parent) {
      const parentNode = ReactDOM.findDOMNode (parent);
      return parentNode.getBoundingClientRect ();
    }
    return null;
  }

  find (x, y) {
    const direction      = this.read ('direction');
    const dragId         = this.read ('drag-id');
    const dragCab        = this.searchDragCab (dragId);
    const dragController = dragCab.read ('drag-controller');
    for (var container of window.document.dragControllers) {
      const dc = container.props['drag-controller'];
      if (dc === dragController) {
        const n = ReactDOM.findDOMNode (container);
        const rect = n.getBoundingClientRect ();
        const vpr = this.getViewParentRect (container);
        const pr = this.getParentRect (container);
        const parentRect = clip (vpr, pr);
        if (isInside (parentRect, x, y) && isInside (rect, x, y)) {
          if (direction === 'horizontal') {
            return this.findH (container, n, x, parentRect);
          } else {
            return this.findV (container, n, y, parentRect);
          }
        }
      }
    }
    return null;
  }

  findNodeOrigin (container, node, id) {
    const direction   = this.read ('direction');
    const overSpacing = this.getOverSpacing ();
    for (var i = 0, len = node.children.length; i < len; i++) {
      const t = node.children[i];
      if (t.dataset.id === id) {
        let rect = getBoundingRect (t);
        if (direction === 'horizontal') {
          rect = getHRect (rect, rect.left, rect.right - overSpacing);
        } else {
          rect = getVRect (rect, rect.top, rect.bottom - overSpacing);
        }
        const parentRect = this.getViewParentRect (container);
        return {
          container:  container,
          ticket:     t,
          id:         t.dataset.id,
          ownerId:    container.props['item-id'],
          rect:       rect,
          parentRect: parentRect,
          index:      i,
        };
      }
    }
    return null;
  }

  // Return the description of origin, whith is the full rectangle of item origin.
  findOrigin () {
    const dragController = this.read ('drag-controller');
    const dragId         = this.read ('drag-id');
    for (var container of window.document.dragControllers) {
      const dc = container.props['drag-controller'];
      if (dc === dragController) {
        const n = ReactDOM.findDOMNode (container);
        const rect = this.findNodeOrigin (container, n, dragId);
        if (rect) {
          return rect;
        }
      }
    }
    return null;
  }

  searchDragCab (id) {
    for (let dragCab of window.document.dragCabs) {
      if (dragCab.props['item-id'] === id) {
        return dragCab;
      }
    }
    return null;
  }

  searchChildren (id) {
    const container = this.rectOrigin.container;
    for (let child of container.props.children) {
      if (child.props['item-id'] === id) {
        return child;
      }
    }
    return null;
  }

  selectOne (id, value) {
    // console.log ('DragCarrier.selectOne');
    const dragCab = this.searchDragCab (id);
    dragCab.setDragStarting (value);
    if (value) {
      this.selectedIds.push (id);
    }
  }

  selectMulti (value) {
    console.log ('DragCarrier.selectMulti');
    if (this.rectOrigin) {
      const data = this.read ('data');
      const origin = this.searchChildren (this.rectOrigin.id);
      if (origin && origin.props.ticket && isSelected (data, origin.props.ticket.id)) {
        // Drag all selected items.
        const container = this.rectOrigin.container;
        for (let child of container.props.children) {
          if (isSelected (data, child.props.ticket.id)) {
            this.selectOne (child.props.ticket.id, value);
          }
        }
      } else {
        // Drag only pointed item.
        this.selectOne (this.rectOrigin.id, value);
      }
    }
  }

  mouseMove (event) {
    let x = event.clientX;
    let y = event.clientY;
    if (!x && event.touches.length > 0) {
      x = event.touches[0].clientX;
      y = event.touches[0].clientY;
    }
    if (!x || !y) {
      return;
    }
    if (this.moveCount === 0) {  // first move ?
      this.startX = x;
      this.startY = y;
      const dragId  = this.read ('drag-id');
      const dragCab = this.searchDragCab (dragId);
      const node = ReactDOM.findDOMNode (dragCab);
      const rect = node.getBoundingClientRect ();
      this.offsetX = x - rect.left;
      this.offsetY = y - rect.top;
      this.rectOrigin = this.findOrigin ();
    }
    this.moveCount++;

    const mode = this.read ('mode');
    if (mode === 'corner-top-left') {
      this.setX (x);
      this.setY (y);
    } else {  // keep mouse at click point
      this.setX (x - this.offsetX);
      this.setY (y - this.offsetY);
    }

    const dest = this.find (x, y);
    if (dest && dest.ownerId === this.rectOrigin.ownerId &&
      (dest.index === this.rectOrigin.index || dest.index === this.rectOrigin.index + 1)) {
      this.setDest (this.rectOrigin);
    } else {
      this.setDest (dest);
    }

    if (!this.lastDragStarted && this.isDragStarted ()) {
      this.lastDragStarted = true;
      this.selectMulti (true);
    }
  }

  mouseUp (event) {
    // console.log ('DragCarrier.mouseUp');
    const dragEnding = this.read ('drag-ending');
    if (dragEnding) {
      dragEnding (event, this.isDragStarted ());
      this.selectMulti (false);
      const dest = this.getDest ();
      if (dest) {
        this.reduce (dest.id, dest.ownerId, dest.ownerKind);
      }
    }
  }

  // Modify the state according to drag & drop action.
  // fromId    -> id to item to move.
  // toId      -> id before which it is necessary to insert. If it was null, insert after the last item.
  // toOwnerId -> owner where it is necessary to insert. Useful when toId is null.
  reduce (toId, ownerId, ownerKind) {
    // console.log ('reduce >>>>>>>>>>>>>>>>>>>>');
    const data = this.read ('data');

    // inject electrum state (needed for electrumDispatch)
    data.state = this.read ('state');

    reducerDragAndDrop (data, {
      type:        'DROP',
      fromKind:    (ownerKind === 'roadbooks') ? 'roadbook' : 'ticket',
      fromIds:     this.selectedIds,
      toId:        toId,
      toOwnerId:   ownerId,
      toOwnerKind: ownerKind,
    });
    if (window.document.mock) {
      for (var c of window.document.toUpdate) {
        c.forceUpdate ();
      }
    }
  }

  renderTooMany (n, index) {
    const text = `Et encore ${n} autres...`;
    return (
      <Container key={index} kind='drag-too-many' {...this.link ()}>
        <Label text={text} {...this.link ()} />
      </Container>
    );
  }

  renderOneComponentToDrag (id, index) {
    const dragCab = this.searchDragCab (id);
    if (dragCab) {
      return dragCab.renderForDrag (true, index);
    } else {
      return null;
    }
  }

  renderComponentToDrag () {
    const result = [];
    if (this.isDragStarted ()) {
      const n = this.selectedIds.length ;
      for (let i = 0; i < n; i++) {
        const id = this.selectedIds[i];
        const r = this.renderOneComponentToDrag (id, i);
        if (r) {
          const rest = n - i;
          if (i > 5 && rest > 1) {
            result.push (this.renderTooMany (rest, i));
            break;
          }
          result.push (r);
        }
      }
    }
    return result;
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
      // backgroundColor: 'rgba(100, 0, 0, 0.2)',
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
        borderRadius:    dest.radius ? dest.radius : radius,
        transition:      'all 0.2s ease-out',
        backgroundColor: color,
        opacity:         dest.opacity ? dest.opacity : 1.0,
        userSelect:      'none',
      };
    } else {
      hilitedStyle = {
        visibility:      'hidden',
        position:        'absolute',
        borderRadius:    radius,
        transition:      'all 0.2s ease-out',
        backgroundColor: color,
        opacity:         0,
        userSelect:      'none',
      };
    }

    const draggedStyle = {
      visibility:      'visible',
      position:        'absolute',
      display:         'flex',
      flexDirection:   'column',
      height:          dragHeight,
      left:            this.getX (),
      top:             this.getY (),
      opacity:         0.9,
      userSelect:      'none',
    };

    return (
      <div style = {fullScreenStyle}
        onMouseMove = {event => this.mouseMove (event)}
        onMouseUp   = {event => this.mouseUp (event)}
        onTouchMove = {event => this.mouseMove (event)}
        onTouchEnd  = {event => this.mouseUp (event)}
        >
        <div style = {hilitedStyle} />
        <div style = {draggedStyle}>
          {this.renderComponentToDrag ()}
        </div>
      </div>
    );
  }
}

/******************************************************************************/
