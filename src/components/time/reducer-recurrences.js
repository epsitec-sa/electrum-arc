/******************************************************************************/

export const updateAction = (index, recurrence) => ({
  type:       'UPDATE',
  index:      index,
  recurrence: recurrence,
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

function updateRecurrence (state, index, recurrence) {
  const mutableState = [ ...state ];  // shallow copy of state
  mutableState.splice (index, 1);  // remove old recurrence
  mutableState.splice (index, 0, recurrence);  // insert new recurrence in same index
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

const newRecurrence = {
  Cron:   '0 0 0 * * *',
  Add:    [],
  Delete: [],
};

function addRecurrence (state) {
  const mutableState = [ ...state ];  // shallow copy of state
  const mutableRecurrence = {...newRecurrence};
  if (!mutableRecurrence.id) {
    mutableRecurrence.id = getNewId ();
  }
  mutableState.push (mutableRecurrence);
  return mutableState;
}

function deleteRecurrence (state, index) {
  const mutableState = [ ...state ];  // shallow copy of state
  mutableState.splice (index, 1);
  return mutableState;
}

function indexOf (state, recurrence) {
  let id = recurrence.id;
  if (typeof recurrence === 'string') {
    id = recurrence;
  }
  for (var i = 0; i < state.length; i++) {
    if (state[i].id === id) {
      return i;
    }
  }
  return -1;
}

function dragRecurrence (state, selectedId, toId) {
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
      return updateRecurrence (state, action.index, action.recurrence);
    case 'ADD':
      return addRecurrence (state);
    case 'DELETE':
      return deleteRecurrence (state, action.index);
    case 'DRAG':
      return dragRecurrence (state, action.selectedId, action.toId);
  }
  return state;
}

/******************************************************************************/
