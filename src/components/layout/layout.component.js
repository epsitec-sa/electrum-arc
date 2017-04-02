import {React, Trace} from 'electrum';

/******************************************************************************/

export default class Layout extends React.Component {
  render () {
    const {state, workspace} = this.props;
    const layout = state.get ('layout');
    if (layout) {
      Trace.dir (layout);
      layout.init ();
    }
    return (
      <main ref={(element) => state.set (workspace, element)}>
        layout
      </main>
    );
  }
}

/******************************************************************************/
