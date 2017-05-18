/******************************************************************************/

export const updateAction = (index, glyph) => ({
  type:  'UPDATE',
  index: index,
  glyph: glyph,
});

export const addAction = glyph => ({
  type:  'ADD',
  glyph: glyph,
});

export const deleteAction = index => ({
  type:  'DELETE',
  index: index,
});

export const toggleAction = glyph => ({
  type:  'TOGGLE',
  glyph: glyph,
});

export const flushAction = () => ({
  type: 'FLUSH',
});

export const dragAction = (selectedId, toId) => ({
  type:       'DRAG',
  selectedId: selectedId,
  toId:       toId,
});

/******************************************************************************/

function updateGlyph (state, index, glyph) {
  const mutableState = [ ...state ];  // shallow copy of state
  mutableState.splice (index, 1);  // remove old glyph
  mutableState.splice (index, 0, glyph);  // insert new glyph in same index
  return mutableState;
}

function addGlyph (state, glyph) {
  const mutableState = [ ...state ];  // shallow copy of state
  mutableState.push (glyph);
  return mutableState;
}

function deleteGlyph (state, index) {
  const mutableState = [ ...state ];  // shallow copy of state
  mutableState.splice (index, 1);
  return mutableState;
}

function indexOf (state, glyph) {
  let id = glyph.id;
  if (typeof glyph === 'string') {
    id = glyph;
  }
  for (var i = 0; i < state.length; i++) {
    if (state[i].id === id) {
      return i;
    }
  }
  return -1;
}

function toggleGlyph (state, glyph) {
  const mutableState = [ ...state ];  // shallow copy of state
  const index = indexOf (mutableState, glyph);
  if (index === -1) {
    mutableState.push (glyph);
  } else {
    mutableState.splice (index, 1);
  }
  return mutableState;
}

function flushGlyph (state) {
  const mutableState = [ ...state ];  // shallow copy of state
  mutableState.splice (0, mutableState.length);
  return mutableState;
}

function dragGlyph (state, selectedId, toId) {
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
      return updateGlyph (state, action.index, action.glyph);
    case 'ADD':
      return addGlyph (state, action.glyph);
    case 'DELETE':
      return deleteGlyph (state, action.index);
    case 'TOGGLE':
      return toggleGlyph (state, action.glyph);
    case 'FLUSH':
      return flushGlyph (state);
    case 'DRAG':
      return dragGlyph (state, action.selectedId, action.toId);
  }
  return state;
}

/******************************************************************************/
