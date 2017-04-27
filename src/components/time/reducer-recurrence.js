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

export function reducer (state, action) {
  switch (action.type) {
    case 'ADD':
      state.Add = addDate (state, action.date);
      break;
    case 'DELETE':
      state.Add = deleteDate (state, action.date);
      break;
  }
  return state;
}

/******************************************************************************/
