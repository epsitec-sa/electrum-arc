/******************************************************************************/

function addDate (state, date) {
  const mutableState = [ ...state ];  // shallow copy of state
  mutableState.push (date);
  return mutableState;
}

function deleteDate (state, date) {
  const mutableState = [ ...state ];  // shallow copy of state
  const i = mutableState.indexOf (date);
  if (i !== -1) {
    mutableState.splice (i, 1);
  }
  return mutableState;
}

/******************************************************************************/

export function reducer (state, action) {
  switch (action.type) {
    case 'ADD':
      return addDate (state, action.date);
    case 'DELETE':
      return deleteDate (state, action.date);
  }
  return state;
}

/******************************************************************************/
