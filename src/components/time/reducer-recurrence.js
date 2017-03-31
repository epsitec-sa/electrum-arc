'use strict';

function clone (state) {
  return JSON.parse (JSON.stringify (state));
}

function addDate (state, date) {
  state.push (date);
  return state;
}

function deleteDate (state, date) {
  const i = state.indexOf (date);
  if (i !== -1) {
    state.splice (i, 1);
  }
  return state;
}

function reducer (state = {}, action = {}) {
  switch (action.type) {
    case 'ADD_ADD':
      state.Add = addDate (state.Add, action.date);
      break;
    case 'DELETE_ADD':
      state.Add = deleteDate (state.Add, action.date);
      break;
    case 'ADD_DELETE':
      state.Delete = addDate (state.Delete, action.date);
      break;
    case 'DELETE_DELETE':
      state.Delete = deleteDate (state.Delete, action.date);
      break;
  }
  // return clone (state);
  return state;
}

// ------------------------------------------------------------------------------------------

module.exports = {reducer};
