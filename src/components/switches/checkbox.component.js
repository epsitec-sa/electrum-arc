import {React} from 'electrum';
import {Action} from 'electrum';

/******************************************************************************/

export default class Checkbox extends React.Component {
  render () {
    const {state, label, checked} = this.props;
    const disabled = Action.isDisabled (state);
    const checkprop = {
      checked: checked
    };

    const boxStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'flex-start',
      alignItems:      'center',
      backgroundColor: '#fff',
      padding:         '0px',
      margin:          '0px',
    };
    const buttonStyle = {
      padding:  '0px',
      margin:   '0px',
      color:    '#555',
      fontSize: '65%',
    };

    return (
      <span
      style={boxStyle}
      >
      <input style={buttonStyle}
        onClick={this.onClick}
        disabled={disabled}
        type='checkbox'
        {...checkprop}
      >
        {this.props.children}
      </input>
      {label}
      </span>
    );
  }
}

/******************************************************************************/
