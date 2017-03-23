'use strict';

import React from 'react';

import {
  Container,
  Table
} from '../../all-components.js';

export default class DispatchTable2 extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    let data = this.read ('data');
    if (data) {
      data = JSON.parse (data);
    } else {
      data = window.document.dataTable2;
    }

    return (
      <Container kind='tickets-root' {...this.link ()} >
        <Table
          data = {data}
          {...this.link ()} />
      </Container>
    );
  }
}
