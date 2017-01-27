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

function isSelected (id) {
  const state = getState ();
  if (!state.Selections) {
    state.Selections = [];
  }
  return state.Selections.indexOf (id) !== -1;
}

function setSelected (id) {
  const state = getState ();
  const i = state.Selections.indexOf (id);
  if (i === -1) {
    state.Selections.push (id);
  }
  return state;
}

function clearSelected (id) {
  const state = getState ();
  const i = state.Selections.indexOf (id);
  if (i !== -1) {
    state.Selections.splice (i, 1);
  }
  return state;
}

function putSelected (id, value) {
  if (value) {
    return setSelected (id);
  } else {
    return clearSelected (id);
  }
}

// ------------------------------------------------------------------------------------------

function isExtended (id) {
  const state = getState ();
  if (!state.Extendeds) {
    state.Extendeds = [];
  }
  return state.Extendeds.indexOf (id) !== -1;
}

function setExtended (id) {
  const state = getState ();
  const i = state.Extendeds.indexOf (id);
  if (i === -1) {
    state.Extendeds.push (id);
  }
  return state;
}

function clearExtended (id) {
  const state = getState ();
  const i = state.Extendeds.indexOf (id);
  if (i !== -1) {
    state.Extendeds.splice (i, 1);
  }
  return state;
}

function putExtended (id, value) {
  if (value) {
    return setExtended (id);
  } else {
    return clearExtended (id);
  }
}

// ------------------------------------------------------------------------------------------

function getShape (id) {
  const shapes = getStateShapes ();
  if (shapes.has (id)) {
    return shapes.get (id);
  } else {
    return null;
  }
}

function setShape (id, value) {
  const shapes = getStateShapes ();
  shapes.set (id, value);
}

// ------------------------------------------------------------------------------------------

module.exports = {
  isSelected, setSelected, clearSelected, putSelected,
  isExtended, setExtended, clearExtended, putExtended,
  getShape, setShape
};
