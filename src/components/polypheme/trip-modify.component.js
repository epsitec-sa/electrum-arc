import React from 'react';
import {DialogModal, Container, Button, Label, LabelTextField, Separator} from '../../all-components.js';
import Converters from './converters';
import TicketHelpers from './ticket-helpers.js';

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
    const directionGlyph = TicketHelpers.getDirectionGlyph (this.props.theme, type);
    let title;
    if (type.startsWith ('pick')) {
      title = 'Pick';
    } else {
      title = 'Drop';
    }
    const pd = ticket.MeetingPoint;

    return (
      <Container kind='panes' {...this.link ()} >
        <Label
          glyph={directionGlyph.glyph}
          glyph-color={directionGlyph.color}
          text={title} grow='1' kind='title'
          {...this.link ()}
        />
        <Separator kind='space' {...this.link ()} />
        <LabelTextField label-glyph='clock-o' hint-text='Heure début'
          value={Converters.getDisplayedTime (pd.StartPlanedTime)} width='100px' {...this.link ()} />
        <LabelTextField label-glyph='clock-o' hint-text='Heure fin'
          value={Converters.getDisplayedTime (pd.EndPlanedTime)} width='100px' {...this.link ()} />
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
        <Button mouse-down={() => this.modifyAccept ()} glyph='check' text='Modifier' kind='action'
          grow='1' place='left' {...this.link ()} />
        <Button mouse-down={() => this.modifyCancel ()} glyph='close' text='Annuler' kind='action'
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
