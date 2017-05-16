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
  for (var i = 0; i < state.length; i++) {
    if (state[i].id === glyph.id) {
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
  }
  return state;
}

/******************************************************************************/
