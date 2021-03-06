/* eslint react/no-find-dom-node: 0 */
/* global window */

import {React, ReactDOM} from 'electrum';
// import {Trace} from 'electrum';
import {Unit} from 'electrum-theme';
import * as ReducerData from '../polypheme/reducer-data.js';

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
  if (node.dataset.verticalSpacing) {
    const vs = Unit.parse (node.dataset.verticalSpacing).value;
    return subBottomMargin (rect, vs);
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

  componentDidMount () {
    if (window.document.flyingDialogs && window.document.flyingDialogs.length > 0) {
      const flyingDialog = window.document.flyingDialogs[window.document.flyingDialogs.length - 1];
      const node = ReactDOM.findDOMNode (flyingDialog);
      this.flyingDialogRect = node.getBoundingClientRect ();
    }
  }

  get x () {
    return this.state.x;
  }

  set x (value) {
    this.setState ( {
      x: value
    });
  }

  get y () {
    return this.state.y;
  }

  set y (value) {
    this.setState ( {
      y: value
    });
  }

  get dest () {
    return this.state.dest;
  }

  set dest (value) {
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
        ownerId:    container.props['drag-owner-id'],
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
        ownerId:    container.props['drag-owner-id'],
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
          ownerId:    t.dataset.ownerId ? t.dataset.ownerId : container.props['drag-owner-id'],
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
      ownerId:    container.props['drag-owner-id'],
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
        ownerId:    container.props['drag-owner-id'],
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
        ownerId:    container.props['drag-owner-id'],
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
          ownerId:    t.dataset.ownerId ? t.dataset.ownerId : container.props['drag-owner-id'],
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
      ownerId:    container.props['drag-owner-id'],
      ownerKind:  container.props['drag-source'],
      rect:       getHRect (rect, rect.right - overSpacing - thickness, rect.right - overSpacing + thickness),
      parentRect: parentRect,
      index:      node.children.length,
    };
  }

  findParentId (id) {
    if (id && window.document.dragParentControllers) {
      for (var c of window.document.dragParentControllers) {
        const parentId = c.props['drag-parent-id'];
        if (parentId === id) {
          return c;
        }
      }
    }
    return null;
  }

  getParentRect (container) {
    const dragParentId = container.props['drag-owner-id'];
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
    const dragOwnerId    = this.read ('drag-owner-id');
    const dragCab        = this.searchDragCab (dragOwnerId);
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
          ownerId:    container.props['drag-owner-id'],
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
    const dragOwnerId    = this.read ('drag-owner-id');
    for (var container of window.document.dragControllers) {
      const dc = container.props['drag-controller'];
      if (dc === dragController) {
        const n = ReactDOM.findDOMNode (container);
        const rect = this.findNodeOrigin (container, n, dragOwnerId);
        if (rect) {
          return rect;
        }
      }
    }
    return null;
  }

  searchDragCab (id) {
    for (let dragCab of window.document.dragCabs) {
      if (dragCab.props['drag-owner-id'] === id) {
        return dragCab;
      }
    }
    return null;
  }

  searchChildren (id) {
    const container = this.rectOrigin.container;
    if (container.props.children.props && container.props.children.props['drag-owner-id'] === id) {
      // Manages the case where there is only one child.
      return container.props.children;
    }
    for (let child of container.props.children) {
      if (child.props['drag-owner-id'] === id) {
        return child;
      }
    }
    return null;
  }

  selectOne (id, value) {
    // Trace.log ('DragCarrier.selectOne');
    const dragCab = this.searchDragCab (id);
    dragCab.dragStarting = value;
    if (value) {
      this.selectedIds.push (id);
    }
  }

  isSelected (data, id) {
    return ReducerData.ask (data, {type: 'IS_TICKET_SELECTED', id: id});
  }

  selectMulti (value) {
    // Trace.log ('DragCarrier.selectMulti');
    if (this.rectOrigin) {
      const data = this.read ('data');
      const origin = this.searchChildren (this.rectOrigin.id);
      if (origin && origin.props.ticket && this.isSelected (data, origin.props.ticket.id)) {
        // Drag all selected items.
        const container = this.rectOrigin.container;
        for (let child of container.props.children) {
          if (this.isSelected (data, child.props.ticket.id)) {
            this.selectOne (child.props.ticket.id, value);
          }
        }
      } else {
        // Drag only pointed item.
        this.selectOne (this.rectOrigin.id, value);
      }
    }
  }

  onMyMouseMove (e) {
    let x = e.clientX;
    let y = e.clientY;
    if (!x && e.touches.length > 0) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }
    if (!x || !y) {
      return;
    }
    if (this.moveCount === 0) {  // first move ?
      this.startX = x;
      this.startY = y;
      const dragOwnerId = this.read ('drag-owner-id');
      const dragCab = this.searchDragCab (dragOwnerId);
      const node = ReactDOM.findDOMNode (dragCab);
      const rect = node.getBoundingClientRect ();
      this.offsetX = x - rect.left;
      this.offsetY = y - rect.top;
      this.rectOrigin = this.findOrigin ();
    }
    this.moveCount++;

    const mode = this.read ('mode');
    if (mode === 'corner-top-left') {
      this.x = x;
      this.y = y;
    } else {  // keep mouse at click point
      this.x = x - this.offsetX;
      this.y = y - this.offsetY;
    }

    const dest = this.find (x, y);
    if (dest && dest.ownerId === this.rectOrigin.ownerId &&
      (dest.index === this.rectOrigin.index || dest.index === this.rectOrigin.index + 1)) {
      this.dest = this.rectOrigin;
    } else {
      this.dest = dest;
    }

    if (!this.lastDragStarted && this.isDragStarted ()) {
      this.lastDragStarted = true;
      this.selectMulti (true);
    }
  }

  onMyMouseUp (e) {
    // Trace.log ('DragCarrier.mouseUp');
    const dragEnding = this.read ('drag-ending');
    if (dragEnding) {
      dragEnding (e, this.isDragStarted ());
      if (this.isDragStarted ()) {
        this.selectMulti (false);
        const dest = this.dest;
        if (dest) {
          const doDragEnding = this.read ('do-drag-ending');
          if (doDragEnding) {
            doDragEnding (this.selectedIds, dest.id, dest.ownerId, dest.ownerKind);
          }
        }
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
      visibility: 'visible',
      position:   'fixed',
      zIndex:     10,
      top:        '0px',
      left:       '0px',
      width:      '100%',
      height:     '100%',
      userSelect: 'none',
      // backgroundColor: 'rgba(100, 0, 0, 0.2)',
    };

    const ox = this.flyingDialogRect ? this.flyingDialogRect.left : 0;
    const oy = this.flyingDialogRect ? this.flyingDialogRect.top  : 0;

    const dest = this.dest;
    let hilitedStyle;
    if (dest && this.isDragStarted ()) {
      const rect = clip (dest.rect, dest.parentRect);
      hilitedStyle = {
        visibility:      'visible',
        position:        'absolute',
        left:            rect.left - ox,
        width:           rect.width,
        top:             rect.top - oy,
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
      visibility:    'visible',
      position:      'absolute',
      display:       'flex',
      flexDirection: 'column',
      height:        dragHeight,
      left:          this.x - ox,
      top:           this.y - oy,
      opacity:       0.9,
      userSelect:    'none',
    };

    return (
      <div style = {fullScreenStyle}
        onMouseMove = {this.onMyMouseMove}
        onMouseUp   = {this.onMyMouseUp}
        onTouchMove = {this.onMyMouseMove}
        onTouchEnd  = {this.onMyMouseUp}
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
