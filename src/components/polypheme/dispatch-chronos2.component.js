'use strict';

import React from 'react';
import RoadbooksToChronos from './roadbooks-to-chronos.js';

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
      data = RoadbooksToChronos.transform (window.document.dataDispatch.Roadbooks, this.props.theme);
    }

    return (
      <Container kind='tickets-root' {...this.link ()} >
        <Chronos
          events     = {data}
          lineWidth  = '250px'
          glyphWidth = '80px'
          {...this.link ()} />
      </Container>
    );
  }
}
