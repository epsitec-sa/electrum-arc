'use strict';

import React from 'react';
import TransformToBacklog from './transform-to-backlog.js';

import {
  Container,
  Chronos
} from '../../all-components.js';

export default class DispatchChronos1 extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    let data = this.read ('data');
    if (data) {
      data = JSON.parse (data);
    } else {
      data = TransformToBacklog.transform (window.document.dataDispatch);
    }

    return (
      <Container kind='tickets-root' {...this.link ()} >
        <Chronos
          data       = {data}
          lineWidth  = '250px'
          glyphWidth = '60px'
          {...this.link ()} />
      </Container>
    );
  }
}
