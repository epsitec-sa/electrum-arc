import {React} from 'electrum';

/******************************************************************************/

function cloneChildren (children, state, theme) {
  return React.Children.map (children, child => cloneChild (child, state, theme, child.props));
}

function cloneChild (child, state, theme, props) {
  const {field, children, ...rest} = props;

  if (typeof child.type === 'string') {
    // This is a plain HTML element, such as <div> or <h1>. We do not want
    // to inject the state and the theme into plain HTML elementss, as they
    // don't make sense for them.
    return (
      <child.type {...props}>
        {cloneChildren (children, state, theme)}
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
    props = {state, theme, ...rest};
    return (
      <child.type {...props}>
        {cloneChildren (children, state, theme)}
      </child.type>
    );
  } else {
    props = {state, theme, ...rest};
    return (
      <child.type {...props}>
        {cloneChildren (children, state, theme)}
      </child.type>
    );
  }
}

/******************************************************************************/

function injectChildren (arity, children, state, theme) {
  return React.Children.map (children,
    child => cloneChild (child, state.find (arity), theme, {key: arity, ...child.props}));
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
