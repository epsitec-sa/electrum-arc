import {React} from 'electrum';
import {DialogModal, Container, Button, Label, LabelTextField, Separator} from '../../all-components.js';

/******************************************************************************/

export default class MessengerModify extends React.Component {

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

  renderFields (roadbook) {
    // Trace.log ('MessengerModify.renderFields');
    return (
      <Container kind='panes' {...this.link ()} >
        <Label glyph={roadbook.Messenger.Photo.Glyph} text={roadbook.Messenger.Name}
          grow='1' kind='title' {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
        <LabelTextField label-glyph='dollar' hint-text='Revenu'
          value={roadbook.Revenue} grow='1' {...this.link ()} />
        <LabelTextField label-glyph='rocket' hint-text='Moyen de transport'
          value={roadbook.Transport} grow='1' {...this.link ()} />
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
    const roadbook = this.read ('roadbook');

    return (
      <DialogModal width='500px' {...this.link ()}>
        <Container kind='views' {...this.link ()} >
          <Container kind='full-view' {...this.link ()} >
            {this.renderFields (roadbook)}
            {this.renderFooter ()}
          </Container>
        </Container>
      </DialogModal>
    );
  }
}

/******************************************************************************/
