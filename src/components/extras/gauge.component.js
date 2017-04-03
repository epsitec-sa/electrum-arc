import {React} from 'electrum';

/******************************************************************************/

export default class Gauge extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      value: this.read ('value'),
    };
  }

  render () {
    const boxStyle     = this.mergeStyles ('box');
    const contentStyle = this.mergeStyles ('content');

    return (
      <div style={boxStyle}>
        <div style={contentStyle}>
        </div>
      </div>
    );
  }
}

/******************************************************************************/
