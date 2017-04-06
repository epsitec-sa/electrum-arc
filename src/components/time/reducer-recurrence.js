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
  let startDate = state.StartDate;
  if (!startDate) {
    startDate = '2000-01-01';
  }
  let endDate = state.EndDate;
  if (!endDate) {
    endDate = '2100-12-31';
  }
  if (action.date >= startDate && action.date <= endDate) {
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
  }
  return state;
}

/******************************************************************************/
