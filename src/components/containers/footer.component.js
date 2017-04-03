import {React} from 'electrum';

/******************************************************************************/

export default class Footer extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      width:  this.read ('width'),
      height: this.read ('height'),
    };
  }

  render () {
    const boxStyle = this.mergeStyles ('box');

    return (
      <div style={boxStyle}>
        {this.props.children}
      </div>
    );
  }
}

/******************************************************************************/
