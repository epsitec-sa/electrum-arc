'use strict';

import React from 'react';

import {
  Container,
  Chronos
} from '../../all-components.js';

export default class DispatchChronos extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    let data = this.read ('data');
    if (data) {
      data = JSON.parse (data);
    } else {
      data = window.document.dataEvents;
    }

    return (
      <Container kind='tickets-root' {...this.link ()} >
        <Chronos
          events     = {data}
          lineWidth  = '300px'
          glyphWidth = '60px'
          {...this.link ()} />
      </Container>
    );
  }
}
