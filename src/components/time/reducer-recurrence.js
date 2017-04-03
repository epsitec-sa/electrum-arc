/******************************************************************************/

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

/******************************************************************************/

export function reducer (state = {}, action = {}) {
  switch (action.type) {
    case 'ADD_ADD':
      if (action.date >= state.StartDate && action.date <= state.EndDate) {
        state.Add = addDate (state.Add, action.date);
      }
      break;
    case 'DELETE_ADD':
      if (action.date >= state.StartDate && action.date <= state.EndDate) {
        state.Add = deleteDate (state.Add, action.date);
      }
      break;
    case 'ADD_DELETE':
      if (action.date >= state.StartDate && action.date <= state.EndDate) {
        state.Delete = addDate (state.Delete, action.date);
      }
      break;
    case 'DELETE_DELETE':
      if (action.date >= state.StartDate && action.date <= state.EndDate) {
        state.Delete = deleteDate (state.Delete, action.date);
      }
      break;
  }
  // return clone (state);
  return state;
}

/******************************************************************************/
