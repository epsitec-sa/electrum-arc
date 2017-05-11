/******************************************************************************/

export const updateAction = (index, recurrence) => ({
  type:       'UPDATE',
  index:      index,
  recurrence: recurrence,
});

export const addAction = recurrence => ({
  type:       'ADD',
  recurrence: recurrence,
});

export const deleteAction = index => ({
  type:  'DELETE',
  index: index,
});

/******************************************************************************/

function updateRecurrence (state, index, recurrence) {
  const mutableState = [ ...state ];  // shallow copy of state
  mutableState.splice (index, 1);  // remove old recurrence
  mutableState.splice (index, 0, recurrence);  // insert new recurrence in same index
  return mutableState;
}

function addRecurrence (state, recurrence) {
  const mutableState = [ ...state ];  // shallow copy of state
  mutableState.push (recurrence);
  return mutableState;
}

function deleteRecurrence (state, index) {
  const mutableState = [ ...state ];  // shallow copy of state
  mutableState.splice (index, 1);
  return mutableState;
}

/******************************************************************************/

export function reducer (state, action) {
  switch (action.type) {
    case 'UPDATE':
      return updateRecurrence (state, action.index, action.recurrence);
    case 'ADD':
      return addRecurrence (state, action.recurrence);
    case 'DELETE':
      return deleteRecurrence (state, action.index);
  }
  return state;
}

/******************************************************************************/
