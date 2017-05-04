import {React, Store} from 'electrum';
import {DialogModal, Container, Button, Label, TextFieldTyped, Separator} from '../../all-components.js';
import * as Converters from '../time/converters';

/******************************************************************************/

export default class TripDeliver extends React.Component {

  constructor (props) {
    super (props);
    this.internalStore = Store.create ();
    this.localBus = this;  // for access to property notify
  }

  componentWillMount () {
    const ticket = this.read ('ticket');
    const meetingPoint = ticket.MeetingPoint;
    let time = meetingPoint.RealisedTime;
    if (!time || time === Converters.getEmptyTime ()) {
      time = Converters.getNowCanonicalTime ();
    }
    this.internalStore.select ('RealisedTime'   ).set ('value', time);
    this.internalStore.select ('StartPlanedTime').set ('value', meetingPoint.StartPlanedTime);
    this.internalStore.select ('EndPlanedTime'  ).set ('value', meetingPoint.EndPlanedTime);
  }

  // LocalBus.notify
  notify (props, source, value) {
    if (source.type === 'change') {
      this.internalStore.select (props.field).set ('value', value);
    }
  }

  linkStartPlanedTime () {
    return {...this.link (), state: this.internalStore.select ('StartPlanedTime'), bus: this.localBus};
  }

  linkEndPlanedTime () {
    return {...this.link (), state: this.internalStore.select ('EndPlanedTime'), bus: this.localBus};
  }

  linkRealisedTime () {
    return {...this.link (), state: this.internalStore.select ('RealisedTime'), bus: this.localBus};
  }

  closeDeliver (action) {
    const x = this.read ('close-deliver');
    if (x) {
      const ticket = this.read ('ticket');
      const meetingPoint = ticket.MeetingPoint;
      const time = this.internalStore.select ('RealisedTime').get ('value');
      x (action, meetingPoint.PlanedDate, time);
    }
  }

  onAccept () {
    this.closeDeliver ('accept');
  }

  onCancel () {
    this.closeDeliver ('cancel');
  }

  renderMain (ticket) {
    return (
      <Container kind='column' {...this.link ()} >
        <Label
          text = {`Livraison du ${ticket.Type}`}
          grow = '1'
          kind = 'title'
          {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
        <TextFieldTyped
          type        = 'time'
          field       = 'StartPlanedTime'
          grow        = '1'
          readonly    = 'true'
          label-text  = 'Début heure planifiée'
          label-width = '200px'
          hint-text   = 'Heure'
          {...this.linkStartPlanedTime ()} />
        <TextFieldTyped
          type        = 'time'
          field       = 'EndPlanedTime'
          grow        = '1'
          readonly    = 'true'
          label-text  = 'Fin heure planifiée'
          label-width = '200px'
          hint-text   = 'Heure'
          {...this.linkEndPlanedTime ()} />
        <TextFieldTyped
          type                = 'time'
          field               = 'RealisedTime'
          grow                = '1'
          select-all-on-focus = 'true'
          label-text          = 'Heure de livraison'
          label-width         = '200px'
          hint-text           = 'Heure'
          {...this.linkRealisedTime ()} />
        <Separator kind='space' {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
      </Container>
    );
  }

  renderFooter () {
    return (
      <Container kind='row' {...this.link ()} >
        <Button
          glyph           = 'check'
          text            = 'C´est livré'
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
          custom-on-click = {this.onCancel}
          {...this.link ()} />
      </Container>
    );
  }

  render () {
    const ticket = this.read ('ticket');

    if (ticket.Type === 'both') {
      throw new Error ('Unsupported ticket.Type');
    } else {
      return (
        <DialogModal width='500px' {...this.link ()}>
          <Container kind='views' {...this.link ()} >
            <Container kind='full-view' {...this.link ()} >
              {this.renderMain (ticket)}
              {this.renderFooter ()}
            </Container>
          </Container>
        </DialogModal>
      );
    }
  }
}

/******************************************************************************/
