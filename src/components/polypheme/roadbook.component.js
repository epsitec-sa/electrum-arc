import {React} from 'electrum';
import ReducerData from './reducer-data.js';

/******************************************************************************/

export default class Roadbook extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      hasHeLeft: this.read ('hasHeLeft'),
      isDragged: this.read ('isDragged'),
    };
  }

  render () {
    const data      = this.read ('data');
    const roadbook  = this.read ('roadbook');
    const hasHeLeft = this.read ('hasHeLeft');
    const isDragged = this.read ('isDragged');

    const extendedBoxStyle  = this.mergeStyles ('extendedBox');
    const compactedBoxStyle = this.mergeStyles ('compactedBox');

    const compacted = ReducerData.ask (data, {type: 'IS_MESSENGER_COMPACTED', id: roadbook.id});

    // When dragging, show a source component empty.
    const children = (hasHeLeft && !isDragged) ? null : this.props.children;

    return (
      <div style = {compacted ? compactedBoxStyle : extendedBoxStyle}>
        {children}
      </div>
    );
  }
}

/******************************************************************************/
