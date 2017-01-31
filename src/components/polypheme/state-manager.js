'use strict';

function getState () {
  if (!window.document.stateManager) {
    window.document.stateManager = {};
  }
  return window.document.stateManager;
}

function getStateMessengerShowHiddens () {
  const state = getState ();
  if (!state.MessengerShowHiddens) {
    state.MessengerShowHiddens = [];
  }
  return state.MessengerShowHiddens;
}

function getStateMessengerCompacteds () {
  const state = getState ();
  if (!state.MessengerCompacteds) {
    state.MessengerCompacteds = [];
  }
  return state.MessengerCompacteds;
}

function getStateTicketSelecteds () {
  const state = getState ();
  if (!state.TicketSelecteds) {
    state.TicketSelecteds = [];
  }
  return state.TicketSelecteds;
}

function getStateTicketExtendeds () {
  const state = getState ();
  if (!state.TicketExtendeds) {
    state.TicketExtendeds = [];
  }
  return state.TicketExtendeds;
}

function getStateTicketShapes () {
  const state = getState ();
  if (!state.TicketShapes) {
    state.TicketShapes = new Map ();
  }
  return state.TicketShapes;
}

// ------------------------------------------------------------------------------------------

function isMessengerShowHidden (id) {
  const state = getStateMessengerShowHiddens ();
  return state.indexOf (id) !== -1;
}

function setMessengerShowHidden (id) {
  const state = getStateMessengerShowHiddens ();
  const i = state.indexOf (id);
  if (i === -1) {
    state.push (id);
  }
}

function clearMessengerShowHidden (id) {
  const state = getStateMessengerShowHiddens ();
  const i = state.indexOf (id);
  if (i !== -1) {
    state.splice (i, 1);
  }
}

function putMessengerShowHidden (id, value) {
  if (value) {
    return setMessengerShowHidden (id);
  } else {
    return clearMessengerShowHidden (id);
  }
}

// ------------------------------------------------------------------------------------------

function isMessengerCompacted (id) {
  const state = getStateMessengerCompacteds ();
  return state.indexOf (id) !== -1;
}

function setMessengerCompacted (id) {
  const state = getStateMessengerCompacteds ();
  const i = state.indexOf (id);
  if (i === -1) {
    state.push (id);
  }
  return state;
}

function clearMessengerCompacted (id) {
  const state = getStateMessengerCompacteds ();
  const i = state.indexOf (id);
  if (i !== -1) {
    state.splice (i, 1);
  }
  return state;
}

function putMessengerCompacted (id, value) {
  if (value) {
    return setMessengerCompacted (id);
  } else {
    return clearMessengerCompacted (id);
  }
}

// ------------------------------------------------------------------------------------------

function isTicketSelected (id) {
  const state = getStateTicketSelecteds ();
  return state.indexOf (id) !== -1;
}

function setTicketSelected (id) {
  const state = getStateTicketSelecteds ();
  const i = state.indexOf (id);
  if (i === -1) {
    state.push (id);
  }
}

function clearTicketSelected (id) {
  const state = getStateTicketSelecteds ();
  const i = state.indexOf (id);
  if (i !== -1) {
    state.splice (i, 1);
  }
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
  const state = getStateTicketExtendeds ();
  return state.indexOf (id) !== -1;
}

function setTicketExtended (id) {
  const state = getStateTicketExtendeds ();
  const i = state.indexOf (id);
  if (i === -1) {
    state.push (id);
  }
  return state;
}

function clearTicketExtended (id) {
  const state = getStateTicketExtendeds ();
  const i = state.indexOf (id);
  if (i !== -1) {
    state.splice (i, 1);
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

module.exports = {
  isMessengerShowHidden, setMessengerShowHidden, clearMessengerShowHidden, putMessengerShowHidden,
  isMessengerCompacted, setMessengerCompacted, clearMessengerCompacted, putMessengerCompacted,
  isTicketSelected, setTicketSelected, clearTicketSelected, putTicketSelected,
  isTicketExtended, setTicketExtended, clearTicketExtended, putTicketExtended,
  getTicketShape, setTicketShape
};
