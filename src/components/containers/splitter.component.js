'use strict';

import React from 'react';
import {Action} from 'electrum';
import SplitPane from 'react-split-pane';

/******************************************************************************/

export default class Splitter extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      managedChildren: null
    };
    this.panelBottoms = [];
  }

  get styleProps () {
    return {
      width:            this.read ('width'),
      height:           this.read ('height'),
      floatingHeight:   this.read ('floating-height'),
      kind:             this.read ('kind'),
      subkind:          this.read ('subkind'),
      markColor:        this.read ('mark-color'),
      spacing:          this.read ('spacing'),
      trianglePosition: this.read ('triangle-position'),
      grow:             this.read ('grow'),
      selected:         this.read ('selected'),
      left:             this.read ('left'),
      right:            this.read ('right'),
      top:              this.read ('top'),
      bottom:           this.read ('bottom'),
      rotate:           this.read ('rotate'),
      border:           this.read ('border'),
    };
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    const resizer = {
      boxSizing:      'border-box',
      background:     '#000',
      opacity:        0.2,
      zIndex:         1,
      backgroundClip: 'padding-box',
      height:         '11px',
      margin:         '-5px 0px',
      borderTop:      '5px solid rgba(255, 255, 255, 0)',
      borderBottom:   '5px solid rgba(255, 255, 255, 0)',
      cursor:         'row-resize',
      width:          '100%',
    };

    return (
      <SplitPane split='horizontal' resizerStyle={resizer}>
        {this.props.children}
     </SplitPane>
    );
  }
}

/******************************************************************************/
