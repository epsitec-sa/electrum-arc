import {React} from 'electrum';
import SplitPane from './split-pane.js';

/******************************************************************************/

export default class Splitter extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      kind:   this.read ('kind'),
      width:  this.read ('width'),
      height: this.read ('height'),
    };
  }

  render () {
    const kind          = this.read ('kind');
    const defaultSize   = this.read ('default-size');
    const minSize       = this.read ('min-size');
    const maxSize       = this.read ('max-size');
    const firstViewId   = this.read ('first-view-id');
    const lastViewId    = this.read ('last-view-id');
    const onSizeChanged = this.read ('onSizeChanged');

    if (!kind) {
      throw new Error ('Undefined splitter kind');
    }

    const resizerStyle = this.mergeStyles ('resizerStyle');

    return (
      <SplitPane
        split         = {kind}
        resizerStyle  = {resizerStyle}
        defaultSize   = {defaultSize}
        minSize       = {minSize}
        maxSize       = {maxSize}
        firstViewId   = {firstViewId}
        lastViewId    = {lastViewId}
        onSizeChanged = {onSizeChanged}
        {...this.link ()}
        >
        {this.props.children}
      </SplitPane>
    );
  }
}

/******************************************************************************/
