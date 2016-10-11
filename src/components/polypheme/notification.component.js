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
    const data       = this.read ('data');
    const generation = this.read ('generation');

    let glyphColor = data.Color;
    if (glyphColor) {
      glyphColor = ColorHelpers.GetMarkColor (this.theme, glyphColor);
    }

    return (
      <Container kind='notification-box' subkind={data.Status} grow='1' {...this.link ()} >
        <Button glyph={data.Glyph} background-color={glyphColor} kind='round' spacing='large' {...this.link ()} />
        <Label text={data.Message} kind='notification' grow='1' {...this.link ()} />
      </Container>
    );
  }
}

/******************************************************************************/
