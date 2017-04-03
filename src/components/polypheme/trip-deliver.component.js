import {React} from 'electrum';
import {DialogModal, Container, Button, Label, LabelTextField, Separator} from '../../all-components.js';
import {Converters} from './converters';

/******************************************************************************/

export default class TripDeliver extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      realisedTime: '',
      ok:           true,
    };
  }

  getRealisedTime () {
    return this.state.realisedTime;
  }

  setRealisedTime (value) {
    this.setState ( {
      realisedTime: value
    });
  }

  getOk () {
    return this.state.ok;
  }

  setOk (value) {
    this.setState ( {
      ok: value
    });
  }

  componentWillMount () {
    // Trace.log ('TripDeliver.componentWillMount');
    const ticket = this.read ('ticket');
    const trip = this.getTrip (ticket);
    this.setRealisedTime (Converters.getDisplayedTime (trip.RealisedTime, true));
  }

  getTime () {
    return Converters.getFormatedTime (this.getRealisedTime ());
  }

  closeDeliver (action) {
    const closeDeliver = this.read ('close-deliver');
    if (closeDeliver) {
      const ticket = this.read ('ticket');
      const trip = this.getTrip (ticket);
      closeDeliver (action, trip.PlanedDate, this.getTime ());
    }
  }

  doAccept () {
    if (this.getOk ()) {
      this.closeDeliver ('accept');
    }
  }

  doCancel () {
    this.closeDeliver ('cancel');
  }

  getTrip (ticket) {
    return ticket.MeetingPoint;
  }

  onMyChange (e) {
    const value = e.target.value;
    // Trace.log ('TripDeliver.onMyChange ' + value);
    this.setRealisedTime (value);
    this.setOk (Converters.checkTime (value));
  }

  renderMain (ticket) {
    const trip = this.getTrip (ticket);

    return (
      <Container kind='panes' {...this.link ()} >
        <Label text={`Livraison du ${ticket.Type}`} grow='1' kind='title' {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
        <LabelTextField
          grow        = '1'
          readonly    = 'true'
          label-text  = 'Début heure planifiée'
          label-width = '200px'
          hint-text   = 'Heure'
          value       = {Converters.getDisplayedTime (trip.StartPlanedTime)}
          {...this.link ()} />
        <LabelTextField
          grow        = '1'
          readonly    = 'true'
          label-text  = 'Fin heure planifiée'
          label-width = '200px'
          hint-text   = 'Heure'
          value       = {Converters.getDisplayedTime (trip.EndPlanedTime)}
          {...this.link ()} />
        <LabelTextField
          grow           = '1'
          label-text     = 'Heure de livraison'
          label-width    = '200px'
          hint-text      = 'Heure'
          updateStrategy = 'every-time'
          value          = {this.getRealisedTime ()}
          onChange       = {e => this.onMyChange (e)}
          {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
      </Container>
    );
  }

  renderFooter () {
    return (
      <Container kind='actions' subkind='no-shadow' {...this.link ()} >
        <Button
          mouse-down = {() => this.doAccept ()}
          disabled   = {this.getOk () ? 'false' : 'true'}
          glyph      = 'check'
          text       = 'C´est livré'
          kind       = 'action'
          grow       = '1'
          place      = 'left'
          {...this.link ()} />
        <Button
          mouse-down = {() => this.doCancel ()}
          glyph      = 'close'
          text       = 'Annuler'
          kind       = 'action'
          grow       = '1'
          place      = 'right'
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
