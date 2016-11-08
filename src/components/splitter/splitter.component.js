'use strict';

import React from 'react';
import {Action} from 'electrum';
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
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputKind        = this.read ('kind');
    const inputDefaultSize = this.read ('default-size');

    if (!inputKind) {
      throw new Error (`Undefined splitter kind`);
    }

    const resizerStyle = this.mergeStyles ('resizerStyle');

    return (
      <SplitPane split={inputKind} resizerStyle={resizerStyle} defaultSize={inputDefaultSize} >
        {this.props.children}
      </SplitPane>
    );
  }
}

/******************************************************************************/
