/******************************************************************************/

export const updateAction = (index, note) => ({
  type:  'UPDATE',
  index: index,
  note:  note,
});

export const addAction = note => ({
  type: 'ADD',
  note: note,
});

export const deleteAction = index => ({
  type:  'DELETE',
  index: index,
});

/******************************************************************************/

function updateNote (state, index, note) {
  const mutableState = [ ...state ];  // shallow copy of state
  mutableState.splice (index, 1);  // remove old note
  mutableState.splice (index, 0, note);  // insert new note in same index
  return mutableState;
}

function addNote (state, note) {
  const mutableState = [ ...state ];  // shallow copy of state
  mutableState.push (note);
  return mutableState;
}

function deleteNote (state, index) {
  const mutableState = [ ...state ];  // shallow copy of state
  mutableState.splice (index, 1);
  return mutableState;
}

/******************************************************************************/

export function reducer (state, action) {
  switch (action.type) {
    case 'UPDATE':
      return updateNote (state, action.index, action.note);
    case 'ADD':
      return addNote (state, action.note);
    case 'DELETE':
      return deleteNote (state, action.index);
  }
  return state;
}

/******************************************************************************/
