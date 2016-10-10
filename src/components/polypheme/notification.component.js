'use strict';

import React from 'react';

import {Button, Container, Label} from '../../all-components.js';
import {ColorHelpers} from 'electrum-theme';

/******************************************************************************/

export default class Notification extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const data = this.read ('data');

    return (
      <Container kind='notification-box' grow='1' {...this.link ()} >
        <Button glyph={data.Glyph} kind='round' spacing='large' {...this.link ()} />
        <Label text={data.Message} grow='1' {...this.link ()} />
      </Container>
    );
  }
}

/******************************************************************************/
