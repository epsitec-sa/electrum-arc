import {React, Store} from 'electrum';
import {DialogModal, Container, Button, Label, LabelTextField, Separator} from '../../all-components.js';

/******************************************************************************/

export default class MessengerModify extends React.Component {

  constructor (props) {
    super (props);
    this.internalStore = Store.create ();
    this.localBus = this;  // for access to property notify
  }

  componentWillMount () {
    const roadbook = this.read ('roadbook');
    this.internalStore.select ('Revenue'  ).set ('value', roadbook.Revenue);
    this.internalStore.select ('Transport').set ('value', roadbook.Transport);
  }

  // LocalBus.notify
  notify (props, source, value) {
    if (source.type === 'change') {
      this.internalStore.select (props.field).set ('value', value);
    }
  }

  linkRevenue () {
    return {...this.link (), state: this.internalStore.select ('Revenue'), bus: this.localBus};
  }

  linkTransport () {
    return {...this.link (), state: this.internalStore.select ('Transport'), bus: this.localBus};
  }

  closeModify (action) {
    const x = this.read ('close-modify');
    if (x) {
      x (action);
    }
  }

  onModifyAccept () {
    this.closeModify ('accept');
  }

  onModifyCancel () {
    this.closeModify ('cancel');
  }

  renderFields (roadbook) {
    return (
      <Container kind='column' {...this.link ()} >
        <Label
          glyph = {roadbook.Messenger.Photo.Glyph}
          text  = {roadbook.Messenger.Name}
          grow  = '1'
          kind  = 'title'
          {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
        <LabelTextField
          field       = 'Revenue'
          label-glyph = 'dollar'
          hint-text   = 'Revenu'
          grow        = '1'
          {...this.linkRevenue ()} />
        <LabelTextField
          field       = 'Transport'
          label-glyph = 'rocket'
          hint-text   = 'Moyen de transport'
          grow        = '1'
          {...this.linkTransport ()} />
        <Separator kind='space' {...this.link ()} />
        <Separator kind='space' {...this.link ()} />
      </Container>
    );
  }

  renderFooter () {
    return (
      <Container kind='row' {...this.link ()} >
        <Button
          glyph      = 'check'
          text       = 'Modifier'
          kind       = 'action'
          grow       = '1'
          place      = 'left'
          mouse-down = {this.onModifyAccept}
          {...this.link ()} />
        <Button
          glyph      = 'close'
          text       = 'Annuler'
          kind       = 'action'
          grow       = '1'
          place      = 'right'
          mouse-down = {this.onModifyCancel}
          {...this.link ()} />
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
