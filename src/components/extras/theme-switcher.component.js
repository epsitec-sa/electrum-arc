import Electrum from 'electrum';
import {React} from 'electrum';
import {ThemeConfigurations} from 'electrum-theme';

/******************************************************************************/

let themeNames = Object.keys (ThemeConfigurations);
let themeIndex = 0;

function switchTheme (store) {
  if (Electrum.bus === undefined) {
    throw new Error ('No Electrum.bus is currently configured');
  }
  if (Electrum.bus.update === undefined) {
    throw new Error ('Electrum.bus does not implement update()');
  }

  const themeName = themeNames[++themeIndex % themeNames.length];
  store.root.set ('activeTheme', themeName);
  store.mutateAll ();
  Electrum.bus.update ();
}

export default class ThemeSwitcher extends React.Component {

  render () {
    const {state} = this.props;
    const label = this.props.text || 'Theme';

    return (
      <div style={this.styles} onClick={() => switchTheme (state.store)}>{label}</div>
    );
  }
}

/******************************************************************************/
