'use strict';

import React from 'react';
import {DialogModal, Container, Button, Label, LabelTextField, Separator} from '../../all-components.js';
import {getDisplayedTime} from './converters';
import {getDirectionGlyph} from './ticket-helpers.js';

/******************************************************************************/

function prepareLines (text) {
  if (text) {
    text = text.replace (/\\n/g, '\n');  // replace all \\n by \n
  }
  return text;
}

/******************************************************************************/

export default class TripModify extends React.Component {

  constructor (props) {
    super (props);
  }

  closeModify (action) {
    const closeModify = this.read ('close-modify');
    if (closeModify) {
      closeModify (action);
    }
  }

  modifyAccept () {
    this.closeModify ('accept');
  }

  modifyCancel () {
    this.closeModify ('cancel');
  }

  renderHalf (ticket, type) {
    const directionGlyph = getDirectionGlyph (this.props.theme, type);
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
        <Label glyph={directionGlyph.glyph} glyph-color={directionGlyph.color} text={title} grow='1' kind='title' {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
        <LabelTextField label-glyph='clock-o' hint-text='Heure'
          value={getDisplayedTime (pd.PlanedTime)} width='100px' {...this.link ()} />
        <LabelTextField label-glyph='tag' hint-text='Description courte'
          value={pd.ShortDescription} grow='1' {...this.link ()} />
        <LabelTextField label-glyph='building' hint-text='Description complète'
          value={prepareLines (pd.LongDescription)} grow='1' rows={5} {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
      </Container>
    );
  }

  renderFooter () {
    return (
      <Container kind='actions' subkind='no-shadow' {...this.link ()} >
        <Button action={() => this.modifyAccept ()} glyph='check' text='Modifier' kind='action'
          grow='1' place='left' {...this.link ()} />
        <Button action={() => this.modifyCancel ()} glyph='close' text='Annuler' kind='action'
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
