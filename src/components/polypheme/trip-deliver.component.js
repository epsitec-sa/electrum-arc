'use strict';

import React from 'react';
import {DialogModal, Container, Button, Label, LabelTextField, Separator} from '../../all-components.js';
import {getTime} from './converters';
import {getDirectionGlyph} from './ticket-helpers.js';

/******************************************************************************/

function prepareLines (text) {
  if (text) {
    text = text.replace (/\\n/g, '\n');  // replace all \\n by \n
  }
  return text;
}

/******************************************************************************/

export default class TripDeliver extends React.Component {

  constructor (props) {
    super (props);
  }

  closeDeliver (action) {
    const closeDeliver = this.read ('close-deliver');
    if (closeDeliver) {
      closeDeliver (action);
    }
  }

  doAccept () {
    this.closeDeliver ('accept');
  }

  doCancel () {
    this.closeDeliver ('cancel');
  }

  renderHalf (ticket, type) {
    let title, pd;
    if (type.startsWith ('pick')) {
      title = 'Pick';
      pd    = ticket.Trip.Pick;
    } else {
      title = 'Drop';
      pd    = ticket.Trip.Drop;
    }

    return (
      <Container kind='panes' {...this.link ()} >
        <Label text={`Livraison du ${title}`} grow='1' kind='title' {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
        <LabelTextField label-text='Heure planifiée' label-width='200px' hint-text='Heure'
          value={getTime (pd.PlanedTime)} grow='1' {...this.link ()} />
        <LabelTextField label-text='Heure de livraison' label-width='200px' hint-text='Heure'
          value={getTime (pd.RealisedTime)} grow='1' {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
      </Container>
    );
  }

  renderFooter () {
    return (
      <Container kind='actions' subkind='no-shadow' {...this.link ()} >
        <Button action={() => this.doAccept ()} glyph='check' text='C´est livré' kind='action'
          grow='1' place='left' {...this.link ()} />
        <Button action={() => this.doCancel ()} glyph='close' text='Annuler' kind='action'
          grow='1' place='right' {...this.link ()} />
      </Container>
    );
  }

  render () {
    const ticket = this.read ('ticket');

    if (ticket.Type === 'both') {
      return (
        <DialogModal width='500px' {...this.link ()}>
          <Container kind='views' {...this.link ()} >
            <Container kind='full-view' {...this.link ()} >
              {this.renderHalf (ticket, 'pick')}
              {this.renderHalf (ticket, 'drop')}
              {this.renderFooter ()}
            </Container>
          </Container>
        </DialogModal>
      );
    } else {
      return (
        <DialogModal width='500px' {...this.link ()}>
          <Container kind='views' {...this.link ()} >
            <Container kind='full-view' {...this.link ()} >
              {this.renderHalf (ticket, ticket.Type)}
              {this.renderFooter ()}
            </Container>
          </Container>
        </DialogModal>
      );
    }
  }
}

/******************************************************************************/
