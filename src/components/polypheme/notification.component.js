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

    let color = data.Color;
    if (color) {
      color = ColorHelpers.GetMarkColor (this.theme, color);
    }

    return (
      <Container kind='notification-box' grow='1' {...this.link ()} >
        <Button glyph={data.Glyph} background-color={color} kind='round' spacing='large' {...this.link ()} />
        <Label text={data.Message} kind='notification' grow='1' {...this.link ()} />
      </Container>
    );
  }
}

/******************************************************************************/
