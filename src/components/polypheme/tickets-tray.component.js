import {React, Store} from 'electrum';
import {Container, Button, TextField} from 'electrum-arc';
import * as ReducerData from '../polypheme/reducer-data.js';

/******************************************************************************/

export default class TicketsTray extends React.Component {

  constructor (props) {
    super (props);
    this.internalStore = Store.create ();
    this.localBus = this;  // for access to property notify
  }

  componentDidMount () {
    const tray = this.read ('tray');
    this.internalStore.select ('title').set ('value', tray.Name);
    this.internalStore.select ('edit').set ('value', false);
    this.forceUpdate ();
  }

  get styleProps () {
    return {
      left:   this.read ('left'),
      right:  this.read ('right'),
      top:    this.read ('top'),
      bottom: this.read ('bottom'),
      rotate: this.read ('rotate'),
    };
  }

  // LocalBus.notify
  notify (props, source, value) {
    // console.log (`TicketsTray.notify type=${source.type}`);
    if (source.type === 'change') {
      this.internalStore.select ('title').set ('value', value);
      this.forceUpdate ();
    } else if (source.type === 'defocus') {
      this.internalStore.select ('edit').set ('value', false);
      this.forceUpdate ();
      const title = this.internalStore.select ('title').get ('value');
      this.updateTitleData (title);
    }
  }

  linkTitle () {
    return {...this.link (), state: this.internalStore.select ('title'), bus: this.localBus};
  }

  onAccept () {
    // console.log ('TicketsTray.onAccept');
    this.internalStore.select ('edit').set ('value', false);
    this.forceUpdate ();
    const title = this.internalStore.select ('title').get ('value');
    this.updateTitleData (title);
  }

  onCancel () {
    // console.log ('TicketsTray.onCancel');
    this.internalStore.select ('title').set ('value', this.initialTitle);
    this.internalStore.select ('edit').set ('value', false);
    this.forceUpdate ();
  }

  // The button was clicked, replace Button by TextField (edit = true).
  onMyMouseDown () {
    // console.log ('TicketsTray.onMyMouseDown');
    this.initialTitle = this.internalStore.select ('title').get ('value');
    this.internalStore.select ('edit').set ('value', true);
    this.forceUpdate ();
  }

  updateTitleData (title) {
    const data = this.read ('data');
    const tray = this.read ('tray');
    ReducerData.reducer (data, {
      type:  'SET_TRAY_NAME',
      id:    tray.id,
      value: title,
    });
  }

  // Render the header, that contains a Button (with a look like a Label)
  // or a TextField followed by [v] [x].
  renderHeader () {
    const edit = this.internalStore.select ('edit').get ('value');
    if (edit) {
      return (
        <Container kind='row' {...this.link ()} >
          <TextField
            select-all-on-focus = 'true'
            spacing             = 'overlap'
            {...this.linkTitle ()} />
          <Button
            glyph      = 'check'
            spacing    = 'overlap'
            mouse-down = {this.onAccept}
            {...this.link ()} />
          <Button
            glyph      = 'close'
            mouse-down = {this.onCancel}
            {...this.link ()} />
        </Container>
      );
    } else {
      const title = this.internalStore.select ('title').get ('value');
      return (
        <Button
          kind       = 'tray-title'
          grow       = {1}
          text       = {title}
          mouse-down = {this.onMyMouseDown}
          {...this.link ()} />
      );
    }
  }

  render () {
    const tray = this.read ('tray');

    const boxStyle = this.mergeStyles ('box');

    return (
      <div style = {boxStyle}>
        {this.renderHeader ()}
        <Container
          kind            = 'tickets-tray'
          drag-controller = 'ticket'
          drag-source     = 'tray'
          drag-owner-id   = {tray.id}
          {...this.link ()} >
          {this.props.children}
        </Container>
      </div>
    );
  }
}

/******************************************************************************/
