'use strict';

import React from 'react';
import {Button} from '../../all-components.js';

/******************************************************************************/

export default class CheckButton extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const kind    = this.read ('kind');
    const text    = this.read ('text');
    const checked = this.read ('checked');
    const spacing = this.read ('spacing');
    const action  = this.read ('action');

    let glyph;
    if (kind === 'switch') {
      glyph = (checked === 'true') ? 'toggle-on' : 'toggle-off';  // [ o] [x ]
    } else if (kind === 'radio') {
      glyph = (checked === 'true') ? 'stop-circle-o' : 'circle-o';  // o
    } else {
      glyph = (checked === 'true') ? 'check-square' : 'square-o';  // [v] [ ]
    }

    return (
      <Button action={action} glyph={glyph} text={text} border='none' spacing={spacing} {...this.link ()} />
    );
  }
}

/******************************************************************************/
