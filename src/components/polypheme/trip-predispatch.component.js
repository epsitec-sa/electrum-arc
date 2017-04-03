import {React} from 'electrum';
import {DialogModal, Container, Button, Label, Separator} from '../../all-components.js';

/******************************************************************************/

export default class TripPredispatch extends React.Component {

  constructor (props) {
    super (props);
  }

  closePredispatch (action) {
    const closePredispatch = this.read ('close-predispatch');
    if (closePredispatch) {
      closePredispatch (action);
    }
  }

  doAccept () {
    this.closePredispatch ('accept');
  }

  doCancel () {
    this.closePredispatch ('cancel');
  }

  renderMain () {
    return (
      <Container kind='panes' {...this.link ()} >
        <Label text={'Revenir à l\'état \'non dispatché\' ?'} grow='1' kind='title' {...this.link ()} />
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
          glyph      = 'check'
          text       = 'Oui'
          kind       = 'action'
          grow       = '1'
          place      = 'left'
          {...this.link ()} />
        <Button
          mouse-down = {() => this.doCancel ()}
          glyph      = 'close'
          text       = 'Non'
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
