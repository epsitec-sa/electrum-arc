'use strict';

function getState () {
  if (!window.document.stateManager) {
    window.document.stateManager = {};
  }
  return window.document.stateManager;
}

function getStateShapes () {
  const state = getState ();
  if (!state.Shapes) {
    state.Shapes = new Map ();
  }
  return state.Shapes;
}

// ------------------------------------------------------------------------------------------

function isTicketSelected (id) {
  const state = getState ();
  if (!state.Selections) {
    state.Selections = [];
  }
  return state.Selections.indexOf (id) !== -1;
}

function setTicketSelected (id) {
  const state = getState ();
  const i = state.Selections.indexOf (id);
  if (i === -1) {
    state.Selections.push (id);
  }
  return state;
}

function clearTicketSelected (id) {
  const state = getState ();
  const i = state.Selections.indexOf (id);
  if (i !== -1) {
    state.Selections.splice (i, 1);
  }
  return state;
}

function putTicketSelected (id, value) {
  if (value) {
    return setTicketSelected (id);
  } else {
    return clearTicketSelected (id);
  }
}

// ------------------------------------------------------------------------------------------

function isTicketExtended (id) {
  const state = getState ();
  if (!state.Extendeds) {
    state.Extendeds = [];
  }
  return state.Extendeds.indexOf (id) !== -1;
}

function setTicketExtended (id) {
  const state = getState ();
  const i = state.Extendeds.indexOf (id);
  if (i === -1) {
    state.Extendeds.push (id);
  }
  return state;
}

function clearTicketExtended (id) {
  const state = getState ();
  const i = state.Extendeds.indexOf (id);
  if (i !== -1) {
    state.Extendeds.splice (i, 1);
  }
  return state;
}

function putTicketExtended (id, value) {
  if (value) {
    return setTicketExtended (id);
  } else {
    return clearTicketExtended (id);
  }
}

// ------------------------------------------------------------------------------------------

function getTicketShape (id) {
  const shapes = getStateShapes ();
  if (shapes.has (id)) {
    return shapes.get (id);
  } else {
    return null;
  }
}

function setTicketShape (id, value) {
  const shapes = getStateShapes ();
  shapes.set (id, value);
}

// ------------------------------------------------------------------------------------------

module.exports = {
  isTicketSelected, setTicketSelected, clearTicketSelected, putTicketSelected,
  isTicketExtended, setTicketExtended, clearTicketExtended, putTicketExtended,
  getTicketShape, setTicketShape
};
