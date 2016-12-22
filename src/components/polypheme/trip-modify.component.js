'use strict';

import React from 'react';
import {Container, Button, Label, DialogModal} from '../../all-components.js';

/******************************************************************************/

export default class TripModify extends React.Component {

  constructor (props) {
    super (props);
  }

  closeModify () {
    const closeModify = this.read ('close-modify');
    if (closeModify) {
      closeModify ();
    }
  }

  modifyAccept () {
    this.closeModify ();
  }

  modifyCancel () {
    this.closeModify ();
  }

  render () {
    return (
      <DialogModal width='500px' height='400px' {...this.link ()}>
        <Container kind='views' {...this.link ()} >
          <Container kind='full-view' {...this.link ()} >

            <Container kind='pane-navigator' {...this.link ()} >
              <Label text='Liste des mandats' grow='1' kind='title' {...this.link ()} />
            </Container>

            <Container kind='panes' subkind='top-margin' {...this.link ()} >
            </Container>

            <Container kind='actions' subkind='no-shadow' {...this.link ()} >
              <Button action={() => this.modifyAccept ()} glyph='check' text='Modifier' kind='action'
                grow='1' place='left' {...this.link ()} />
              <Button action={() => this.modifyCancel ()} glyph='close' text='Annuler' kind='action'
                grow='1' place='right' {...this.link ()} />
            </Container>
          </Container>
        </Container>
      </DialogModal>
    );
  }
}

/******************************************************************************/
