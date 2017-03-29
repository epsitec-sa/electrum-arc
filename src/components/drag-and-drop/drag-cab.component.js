import React from 'react';
import ReactDOM from 'react-dom';
import {DragCarrier} from '../../all-components.js';

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
      hasCombo:      false,
    };
    this.dragHeight = 0;
    this.hasCombo   = false;
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
    const id = this.read ('drag-owner-id');
    if (!id) {
      throw new Error ('DragCab has not drag-owner-id');
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

  mouseDown (e) {
    // Trace.log ('DragCab.mouseDown');
    if (this.hasCombo) {  // does a child have an open combo-menu ?
      return;
    }
    const mouseDown = this.read ('mouse-down');
    if (mouseDown && mouseDown (e)) {
      return;
    }
    const noDrag = this.read ('no-drag');
    if (noDrag === 'true') {
      return;  // if drag prohibited, don't initiate drag & drop ?
    }
    const dc = findDragController (e.clientX, e.clientY);
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

  mouseUp (e) {
    // Trace.log ('DragCab.mouseUp');
    if (this.hasCombo) {  // does a child have an open combo-menu ?
      return;
    }
    const mouseUp = this.read ('mouse-up');
    if (mouseUp && mouseUp (e)) {
      return;
    }
    const noDrag = this.read ('no-drag');
    if (noDrag === 'true') {  // simple click when drag prohibited ?
      this.doClickAction (e);
    }
  }

  dragEnding (e, isDragDoing) {
    // Trace.log ('DragCab.dragEnding');
    this.setDragInProcess (false);
    this.setDragStarting (false);
    if (!isDragDoing) {  // simple click done ?
      this.doClickAction (e);
    }
  }

  doClickAction (e) {
    const action = this.read ('do-click-action');
    if (action) {
      action (e);
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
    const dragOwnerId    = this.read ('drag-owner-id');
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
        drag-owner-id     = {dragOwnerId}
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
    const dragOwnerId     = this.read ('drag-owner-id');
    const direction       = this.read ('direction');
    const verticalSpacing = this.read ('vertical-spacing');
    const dragInProcess   = this.getDragInProcess ();
    const dragStarting    = this.getDragStarting ();

    const htmlDragCarrier = (dragInProcess && !isDragged) ? this.renderDragCarrier () : null;

    const boxStyle = direction === 'horizontal' ? {
      display:       'flex',
      flexDirection: 'column',
      flexGrow:      isDragged && dragStarting ? 1 : null,
      userSelect:    'none',
    } : {
      userSelect:    'none',
    };

    return (
      <div
        key                   = {index}
        style                 = {boxStyle}
        data-id               = {dragOwnerId}
        data-vertical-spacing = {verticalSpacing}
        onMouseDown           = {e => this.mouseDown (e)}
        onMouseUp             = {e => this.mouseUp (e)}
        onTouchStart          = {e => this.mouseDown (e)}
        onTouchEnd            = {e => this.mouseUp (e)}
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
