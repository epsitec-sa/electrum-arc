/* global window */

import React from 'react';

import {
  Container,
  Events
} from '../../all-components.js';

export default class DispatchEvents extends React.Component {

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
        <Events data={data} {...this.link ()} />
      </Container>
    );
  }
}
