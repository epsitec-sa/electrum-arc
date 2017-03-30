'use strict';

import React from 'react';
import {Container, Calendar, Clock, CheckButton, Separator} from 'electrum-arc';

/******************************************************************************/

export default class Recurrence extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const recurrence = this.read ('recurrence');

    return (
      <Container
        kind = 'row'
        {...this.link ()}>
        <Calendar
          recurrence = {recurrence}
          {...this.link ()} />
        <Container
          kind = 'column'
          {...this.link ()}>
          <CheckButton
            text = 'Événement'
            {...this.link ()} />
          <Separator
            height = '15px'
            {...this.link ()} />
          <Clock
            {...this.link ()} />
        </Container>
      </Container>
    );
  }
}

/******************************************************************************/
