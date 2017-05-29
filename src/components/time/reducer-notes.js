/******************************************************************************/

export const updateAction = (index, note) => ({
  type:  'UPDATE',
  index: index,
  note:  note,
});

export const addAction = () => ({
  type: 'ADD',
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

// Return a new random guid.
// See http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function getNewId () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace (/[xy]/g, function (c) {
    /* eslint no-bitwise: 0 */
    var r = Math.random () * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString (16);
  });
}

const newNote = {
  Content: '',
  Glyphs:  [],
};


function addNote (state) {
  const mutableState = [ ...state ];  // shallow copy of state
  const mutableNote = {...newNote};
  if (!mutableNote.id) {
    mutableNote.id = getNewId ();
  }
  mutableState.push (mutableNote);
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
      return addNote (state);
    case 'DELETE':
      return deleteNote (state, action.index);
    case 'DRAG':
      return dragNote (state, action.selectedId, action.toId);
  }
  return state;
}

/******************************************************************************/
