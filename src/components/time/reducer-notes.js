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

export const dragAction = (selectedId, toId) => ({
  type:       'DRAG',
  selectedId: selectedId,
  toId:       toId,
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

function indexOf (state, note) {
  let id = note.id;
  if (typeof note === 'string') {
    id = note;
  }
  for (var i = 0; i < state.length; i++) {
    if (state[i].id === id) {
      return i;
    }
  }
  return -1;
}

function dragNote (state, selectedId, toId) {
  const mutableState = [ ...state ];  // shallow copy of state
  const si = indexOf (mutableState, selectedId);
  const x = mutableState.splice (si, 1);
  const ti = toId ? indexOf (mutableState, toId) : mutableState.length;
  mutableState.splice (ti, 0, x[0]);
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
    case 'DRAG':
      return dragNote (state, action.selectedId, action.toId);
  }
  return state;
}

/******************************************************************************/
