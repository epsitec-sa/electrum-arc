'use strict';

import React from 'react';
import TransformToRoadbooks from './transform-to-roadbooks.js';

import {
  Container,
  Chronos
} from '../../all-components.js';

export default class DispatchChronos2 extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    let data = this.read ('data');
    if (data) {
      data = JSON.parse (data);
    } else {
      data = TransformToRoadbooks.transform (window.document.dataDispatch, this.props.theme);
    }

    return (
      <Container kind='tickets-root' {...this.link ()} >
        <Chronos
          data       = {data}
          lineWidth  = '250px'
          glyphWidth = '80px'
          {...this.link ()} />
      </Container>
    );
  }
}
