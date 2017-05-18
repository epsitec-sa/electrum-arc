import {React} from 'electrum';
import {Label} from '../../all-components.js';

/******************************************************************************/

export default class DragLabel extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const isDragged = this.props.isDragged;
    const hasHeLeft = this.props.hasHeLeft;

    const opacity = (!isDragged && hasHeLeft) ? 0.1 : 1.0;

    return (
      <Label {...this.props} opacity={opacity} {...this.link ()} />
    );
  }
}

/******************************************************************************/
