import {React} from 'electrum';
import {DialogModal, Container, Button, Label, LabelTextField, Separator} from '../../all-components.js';
import * as Converters from './converters';
import * as TicketHelpers from './ticket-helpers.js';

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

  renderMeetingPoint (meetingPoint) {
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
        <LabelTextField
          label-glyph = 'clock-o'
          hint-text   = 'Heure début'
          value       = {Converters.getDisplayedTime (meetingPoint.StartPlanedTime)}
          width       = '100px'
          {...this.link ()} />
        <LabelTextField
          label-glyph = 'clock-o'
          hint-text   = 'Heure fin'
          value       = {Converters.getDisplayedTime (meetingPoint.EndPlanedTime)}
          width       = '100px'
          {...this.link ()} />
        <LabelTextField
          label-glyph = 'tag'
          hint-text   = 'Description courte'
          value       = {meetingPoint.ShortDescription}
          grow        = '1'
          {...this.link ()} />
        <LabelTextField
          label-glyph = 'building'
          hint-text   = 'Description complète'
          value       = {prepareLines (meetingPoint.LongDescription)}
          grow        = '1'
          rows        = {5}
          {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
      </Container>
    );
  }

  renderMeetingPoints (ticket) {
    if (ticket.MeetingPoints) {
      const result = [];
      for (var meetingPoint of ticket.MeetingPoints) {
        result.push (this.renderMeetingPoint (meetingPoint));
      }
      return result;
    } else {
      return this.renderMeetingPoint (ticket.MeetingPoint);
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
