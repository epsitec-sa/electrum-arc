/* eslint react/no-find-dom-node: 0 */
/* global window */

import {React} from 'electrum';
// import {Trace} from 'electrum';
import {ReactDOM} from 'electrum';
import {DragCarrier} from '../../all-components.js';
import {Unit} from 'electrum-theme';

/******************************************************************************/

function isInside (rect, x, y) {
  if (rect && rect.left < rect.right && rect.top < rect.bottom) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  } else {
    return true;
  }
}

function getBoundingRect (theme, container) {
  const node = ReactDOM.findDOMNode (container);
  return node.getBoundingClientRect ();
}

// Return the property 'drag-controller' of the rectangle targeted by the
// mouse (x, y). If there are several imbricated rectangles, it is necessary
// to take the one whose surface is the smallest !
function findDragController (theme, x, y) {
  let dc = null;
  let minSurface = Number.MAX_SAFE_INTEGER;
  for (var container of window.document.dragControllers) {
    const rect = getBoundingRect (theme, container);
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
    this.hasCombo   = false;
  }

  get dragInProcess () {
    return this.state.dragInProcess;
  }

  set dragInProcess (value) {
    this.setState ( {
      dragInProcess: value
    });
  }

  get dragStarting () {
    return this.state.dragStarting;
  }

  set dragStarting (value) {
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

  onMyMouseDown (e) {
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
    const dc = findDragController (this.props.theme, e.clientX, e.clientY);
    if (!dc || dc !== this.props['drag-controller']) {
      // When clicking in a ticket of a messenger, 2 different drags try to start.
      // The first to move the ticket (drag-controller = 'ticket') and the second
      // to move the messenger (drag-controller = 'roadbook').
      // The second one should not be started. It must start only when a click in
      // the header of the messenger !
      return;
    }
    const node = ReactDOM.findDOMNode (this);
    const dragWidthtDetect = this.read ('drag-width-detect');
    if (dragWidthtDetect) {
      const w = Unit.parse (dragWidthtDetect).value;
      const rect = node.getBoundingClientRect ();
      if (e.clientX > rect.left + w) {
        return;
      }
    }
    const dragHeightDetect = this.read ('drag-height-detect');
    if (dragHeightDetect) {
      const h = Unit.parse (dragHeightDetect).value;
      const rect = node.getBoundingClientRect ();
      if (e.clientY > rect.top + h) {
        return;
      }
    }
    this.dragHeight = node.clientHeight;
    this.dragInProcess = true;
  }

  onMyMouseUp (e) {
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

  onDragEnding (e, isDragDoing) {
    // Trace.log ('DragCab.onDragEnding');
    this.dragInProcess = false;
    this.dragStarting  = false;
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
    const doDragEnding   = this.read ('do-drag-ending');
    return (
      <DragCarrier
        direction         = {direction}
        color             = {color}
        thickness         = {thickness}
        radius            = {radius}
        over-spacing      = {overSpacing}
        mode              = {mode}
        data              = {data}
        do-drag-ending    = {doDragEnding}
        drag-ending       = {this.onDragEnding}
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
    const dragInProcess   = this.dragInProcess;
    const dragStarting    = this.dragStarting;

    const htmlDragCarrier = (dragInProcess && !isDragged) ? this.renderDragCarrier () : null;

    const boxStyle = {
      userSelect: 'none',
    };
    if (direction === 'horizontal') {
      boxStyle.display       = 'flex';
      boxStyle.flexDirection = 'column';
      boxStyle.flexGrow      = isDragged && dragStarting ? 1 : null;
    }

    return (
      <div
        key                   = {index}
        style                 = {boxStyle}
        data-id               = {dragOwnerId}
        data-vertical-spacing = {verticalSpacing}
        onMouseDown           = {this.onMyMouseDown}
        onMouseUp             = {this.onMyMouseUp}
        onTouchStart          = {this.onMyMouseDown}
        onTouchEnd            = {this.onMyMouseUp}
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
