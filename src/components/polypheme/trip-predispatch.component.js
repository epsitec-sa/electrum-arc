import {React} from 'electrum';
import {DialogModal, Container, Button, Label, Separator} from '../../all-components.js';

/******************************************************************************/

export default class TripPredispatch extends React.Component {

  constructor (props) {
    super (props);
  }

  closePredispatch (action) {
    const x = this.read ('close-predispatch');
    if (x) {
      x (action);
    }
  }

  onAccept () {
    this.closePredispatch ('accept');
  }

  onCancel () {
    this.closePredispatch ('cancel');
  }

  renderMain () {
    return (
      <Container kind='column' {...this.link ()} >
        <Label text={'Revenir à l\'état \'non dispatché\' ?'} grow='1' kind='title' {...this.link ()} />
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
          text            = 'Oui'
          kind            = 'action'
          grow            = '1'
          place           = 'left'
          custom-on-click = {this.onAccept}
          {...this.link ()} />
        <Button
          glyph           = 'close'
          text            = 'Non'
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
              {this.renderMain ()}
              {this.renderFooter ()}
            </Container>
          </Container>
        </DialogModal>
      );
    }
  }
}

/******************************************************************************/
