'use strict';

import React from 'react';

import {Ticket, Container, Label, Button} from '../../all-components.js';

/******************************************************************************/

export default class RunnerTicket extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const width  = this.read ('width');
    const height = this.read ('height');
    const data   = this.read ('data');

    return (
      <Ticket kind='header' width={width} height={height} {...this.link ()} >
        <Container kind='column' grow='2' {...this.link ()} >
          <Button glyph={data.photo} kind='identity' {...this.link ()} />
        </Container>
        <Container kind='column' grow='1' {...this.link ()} >
          <Label glyph={data.transportation} glyph-size='150%' {...this.link ()} />
        </Container>
        <Container kind='column' grow='3' {...this.link ()} >
          <Label text={data.name} font-weight='bold' text-color='#fff' {...this.link ()} />
          <Label text={data.total} font-weight='bold' text-color='#fff' {...this.link ()} />
        </Container>
      </Ticket>
    );
  }
}

/******************************************************************************/
