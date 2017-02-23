'use strict';

function getState () {
  if (!window.document.stateManager) {
    window.document.stateManager = {};
  }
  return window.document.stateManager;
}

function getStateTicketShapes () {
  const state = getState ();
  if (!state.TicketShapes) {
    state.TicketShapes = new Map ();
  }
  return state.TicketShapes;
}

// ------------------------------------------------------------------------------------------

function getTicketShape (id) {
  const state = getStateTicketShapes ();
  if (state.has (id)) {
    return state.get (id);
  } else {
    return null;
  }
}

function setTicketShape (id, value) {
  const state = getStateTicketShapes ();
  state.set (id, value);
}

// ------------------------------------------------------------------------------------------

function getSplitterRoadbooksHeight () {
  const state = getState ();
  if (state.SplitterRoadbooksHeight) {
    return state.SplitterRoadbooksHeight;
  } else {
    return '60%';  // default value
  }
}

function setSplitterRoadbooksHeight (value) {
  const state = getState ();
  state.SplitterRoadbooksHeight = value;
}

function getSplitterBacklogWidth () {
  const state = getState ();
  if (state.SplitterBacklogWidth) {
    return state.SplitterBacklogWidth;
  } else {
    // return '750px';  // default value
    return '440px';  // default value
  }
}

function setSplitterBacklogWidth (value) {
  const state = getState ();
  state.SplitterBacklogWidth = value;
}

// ------------------------------------------------------------------------------------------

module.exports = {
  getTicketShape, setTicketShape,
  getSplitterRoadbooksHeight, setSplitterRoadbooksHeight,
  getSplitterBacklogWidth, setSplitterBacklogWidth,
};
