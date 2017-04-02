import React from 'react';
import {Button, ButtonClose, Container} from '../../all-components.js';

/******************************************************************************/

export default class Route extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const closable = this.read ('closable');

    if (closable === 'true') {
      return (
        <Container kind='row' {...this.link ()} >
          <ButtonClose {...this.props} {...this.link ()} />
        </Container>
      );
    } else {
      return (
        <Container kind='row' {...this.link ()} >
          <Button {...this.props} {...this.link ()} />
        </Container>
      );
    }
  }
}

/******************************************************************************/
