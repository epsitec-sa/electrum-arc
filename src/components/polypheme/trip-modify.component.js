import {React, Store} from 'electrum';
import {DialogModal, Container, Button, Label, LabelTextField, TextFieldTyped, Separator} from '../../all-components.js';
import * as TicketHelpers from './ticket-helpers.js';

/******************************************************************************/

export default class TripModify extends React.Component {

  constructor (props) {
    super (props);
    this.internalStore = Store.create ();
    this.localBus = this;  // for access to property notify
  }

  componentWillMount () {
    const ticket = this.read ('ticket');
    if (ticket.MeetingPoints) {
      let index = 0;
      for (var meetingPoint of ticket.MeetingPoints) {
        this.initializeInternalState (index++, meetingPoint);
      }
    } else {
      this.initializeInternalState (0, ticket.MeetingPoint);
    }
  }

  initializeInternalState (index, meetingPoint) {
    this.internalStore.select (index + '.StartPlanedTime' ).set ('value', meetingPoint.StartPlanedTime);
    this.internalStore.select (index + '.EndPlanedTime'   ).set ('value', meetingPoint.EndPlanedTime);
    this.internalStore.select (index + '.ShortDescription').set ('value', meetingPoint.ShortDescription);
    this.internalStore.select (index + '.LongDescription' ).set ('value', meetingPoint.LongDescription);
  }

  // LocalBus.notify
  notify (props, source, value) {
    if (source.type === 'change') {
      this.internalStore.select (props.field).set ('value', value);
    }
  }

  linkStartPlanedTime (index) {
    return {...this.link (), state: this.internalStore.select (index + '.StartPlanedTime'), bus: this.localBus};
  }

  linkEndPlanedTime (index) {
    return {...this.link (), state: this.internalStore.select (index + '.EndPlanedTime'), bus: this.localBus};
  }

  linkShortDescription (index) {
    return {...this.link (), state: this.internalStore.select (index + '.ShortDescription'), bus: this.localBus};
  }

  linkLongDescription (index) {
    return {...this.link (), state: this.internalStore.select (index + '.LongDescription'), bus: this.localBus};
  }

  closeModify (action) {
    const x = this.read ('close-modify');
    if (x) {
      x (action);
    }
  }

  onAccept () {
    this.closeModify ('accept');
  }

  onCancel () {
    this.closeModify ('cancel');
  }

  renderMeetingPoint (index, meetingPoint) {
    const directionGlyph = TicketHelpers.getDirectionGlyph (this.props.theme, meetingPoint.Type);
    const title = meetingPoint.Type;

    return (
      <Container kind='column' {...this.link ()} >
        <Label
          glyph       = {directionGlyph.glyph}
          glyph-color = {directionGlyph.color}
          text        = {title}
          grow        = '1'
          kind        = 'title'
          {...this.link ()}
        />
        <Separator kind='space' {...this.link ()} />
        <TextFieldTyped
          type        = 'time'
          field       = {index + '.StartPlanedTime'}
          label-glyph = 'clock-o'
          hint-text   = 'Début heure planifiée'
          grow        = '1'
          {...this.linkStartPlanedTime (index)} />
        <TextFieldTyped
          type        = 'time'
          field       = {index + '.EndPlanedTime'}
          label-glyph = 'clock-o'
          hint-text   = 'Fin heure planifiée'
          grow        = '1'
          {...this.linkEndPlanedTime (index)} />
        <LabelTextField
          field       = {index + '.ShortDescription'}
          label-glyph = 'tag'
          hint-text   = 'Description courte'
          grow        = '1'
          {...this.linkShortDescription (index)} />
        <LabelTextField
          field       = {index + '.LongDescription'}
          label-glyph = 'building'
          hint-text   = 'Description complète'
          grow        = '1'
          rows        = {5}
          {...this.linkLongDescription (index)} />
        <Separator kind='space' {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
      </Container>
    );
  }

  renderMeetingPoints (ticket) {
    if (ticket.MeetingPoints) {
      const result = [];
      let index = 0;
      for (var meetingPoint of ticket.MeetingPoints) {
        result.push (this.renderMeetingPoint (index++, meetingPoint));
      }
      return result;
    } else {
      return this.renderMeetingPoint (0, ticket.MeetingPoint);
    }
  }

  renderFooter () {
    return (
      <Container kind='row' {...this.link ()} >
        <Button
          glyph           = 'check'
          text            = 'Modifier'
          kind            = 'action'
          grow            = '1'
          place           = 'left'
          custom-on-click = {this.onAccept}
          {...this.link ()} />
        <Button
          glyph           = 'close'
          text            = 'Annuler'
          kind            = 'action'
          grow            = '1'
          place           = 'right'
          custom-on-click = {this.onCancel }
          {...this.link ()} />
      </Container>
    );
  }

  render () {
    const ticket = this.read ('ticket');

    return (
      <DialogModal width='500px' {...this.link ()}>
        <Container kind='views' {...this.link ()} >
          <Container kind='full-view' {...this.link ()} >
            {this.renderMeetingPoints (ticket)}
            {this.renderFooter ()}
          </Container>
        </Container>
      </DialogModal>
    );
  }
}

/******************************************************************************/
