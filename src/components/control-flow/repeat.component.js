import {React, State} from 'electrum';

/******************************************************************************/

function cloneChildren (children, state, theme, idMapper) {
  return React.Children.map (children, child => cloneChild (child, state, theme, child.props, idMapper));
}

function cloneChild (child, state, theme, props, idMapper) {
  let {field, children, id, ...rest} = props;

  if (idMapper && id) {
    id = idMapper (id);
  }

  if (typeof child.type === 'string') {
    // This is a plain HTML element, such as <div> or <h1>. We do not want
    // to inject the state and the theme into plain HTML elementss, as they
    // don't make sense for them.
    props = {id, ...rest};
    return (
      <child.type {...props}>
        {cloneChildren (children, state, theme, idMapper)}
      </child.type>
    );
  }

  // TODO: rather than manually injecting state and theme into the props,
  // we should rely on the linking middleware provided by electrum...

  if (field) {
    // This is an electrum element decorated with a field property; we need
    // to inject the matching state here; usually, this is handled by the JSX
    // generator which replaces field='x' with {...this.link ('x')}
    state = state.find (field);
    props = {id, state, theme, ...rest};
    return (
      <child.type {...props}>
        {cloneChildren (children, state, theme, idMapper)}
      </child.type>
    );
  } else {
    props = {id, state, theme, ...rest};
    return (
      <child.type {...props}>
        {cloneChildren (children, state, theme, idMapper)}
      </child.type>
    );
  }
}

/******************************************************************************/

function injectChildren (arity, children, state, theme) {
  const n = State.getArityIndex (arity);
  return React.Children.map (children,
    child => cloneChild (child, state.find (arity), theme, {key: arity, ...child.props}, id => id + '.' + n));
}

/******************************************************************************/

export default class Repeat extends React.Component {
  render () {
    const {state, theme, children} = this.props;
    const parent = state.store.find (state.parentId);
    const arities = state.arities;
    if (arities.length > 0) {
      return <div>{arities.map (arity => injectChildren (arity, children, parent, theme))}</div>;
    } else {
      return <div></div>;
    }
  }
}

/******************************************************************************/
