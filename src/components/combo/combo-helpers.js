'use strict';

import {Unit} from 'electrum-theme';

// Set the DragCab.hasCombo parent to true or false. It will be informed that a combo is
// opening, so as not to initiate a drag and drop.xxxxxxxx
function setDragCabHasCombo (id, value) {
  for (let dragCab of window.document.dragCabs) {
    if (dragCab.props['item-id'] === id) {
      dragCab.hasCombo = value;
      return;
    }
  }
}

// Compute the location for a combo-menu.
function getComboLocation (node, x, y, hopeWidth, theme) {
  const rect = node.getBoundingClientRect ();

  // Compute horizontal position according to mouse.
  const left = (x - hopeWidth / 2) + 'px';

  // Puts the menu under the component if it's in the upper half of the window.
  const my = (rect.top + rect.bottom) / 2;
  const underside = my < window.innerHeight / 2;
  const t = theme.shapes.flyingBalloonTriangleSize;
  const topValue    = Unit.add ((window.innerHeight - y) + 'px', t);
  const bottomValue = Unit.add (y + 'px', t);
  const top    = underside ? bottomValue : null;
  const bottom = underside ? null : topValue;

  return {
    left:   left,
    top:    top,
    bottom: bottom,
  };
}

export {
  setDragCabHasCombo,
  getComboLocation
};
