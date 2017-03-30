import {React, Trace} from 'electrum';
import {Container, Button, SimpleTextField} from 'electrum-arc';
import ReducerData from '../polypheme/reducer-data.js';
import MouseTrap from 'mousetrap';

/******************************************************************************/

export default class TicketsTray extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      title: null,
      edit:  false,
    };
    this.initialTitle = null;
  }

  componentDidMount () {
    // Trace.log ('TicketsTray.componentDidMount');
    const tray = this.read ('tray');
    this.setTitle (tray.Name);
  }

  componentWillMount () {
    // Trace.log ('TicketsTray.componentWillMount');
  }

  componentWillUnmount () {
    // Trace.log ('TicketsTray.componentWillUnmount');
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

  getTitle () {
    return this.state.title;
  }

  setTitle (value) {
    this.setState ( {
      title: value
    });
  }

  getEdit () {
    return this.state.edit;
  }

  setEdit (value) {
    this.setState ( {
      edit: value
    });
    if (value) {
      this.initialTitle = this.getTitle ();
      MouseTrap.bind ('enter', () => this.enterAction ());
      MouseTrap.bind ('esc',   () => this.enterAction ());
    } else {
      MouseTrap.unbind ('enter');
      MouseTrap.unbind ('esc');
    }
  }

  enterAction () {
    // Trace.log ('TicketsTray.enterAction');
    if (this.getEdit ()) {
      this.setEdit (false);
    }
  }

  acceptClicked (e) {
    this.setEdit (false);
    this.updateTitleData (this.getTitle (), true);
  }

  cancelClicked (e) {
    this.setTitle (this.initialTitle);
    this.setEdit (false);
    this.updateTitleData (this.initialTitle, false);
  }

  // The button was clicked, replace Button by SimpleTextField (edit = true).
  mouseDown (e) {
    this.setEdit (true);
  }

  // The SimpleTextField has lost focus, replace SimpleTextField by Button (edit = false).
  onMyBlur (e) {
    // Trace.log ('TicketsTray.onMyBlur');
    this.setEdit (false);
    this.updateTitleData (this.getTitle (), true);
  }

  // The title in SimpleTextField was changed, update the data.
  // This method was called only when the SimpleTextField lost focus (not at every keys pressed),
  // for minimized the interaction with Lydia (see updateStrategy = 'when-blur').
  onMyChange (e) {
    const value = e.target.value;
    // Trace.log ('TicketsTray.onMyChange ' + value);
    this.setTitle (value);
  }

  updateTitleData (title, accepted) {
    const data = this.read ('data');
    const tray = this.read ('tray');
    ReducerData.reducer (data, {
      type:     'SET_TRAY_NAME',
      id:       tray.id,
      value:    title,
      accepted: accepted,
    });
  }

  // Render the header, that contains a Button (with a look like a Label)
  // or a SimpleTextField followed by [v] [x].
  renderHeader () {
    if (this.getEdit ()) {
      return (
        <Container kind='row' {...this.link ()} >
          <SimpleTextField
            autofocus      = {true}
            updateStrategy = 'every-time'
            value          = {this.getTitle ()}
            onBlur         = {e => this.onMyBlur (e)}
            onChange       = {e => this.onMyChange (e)}
            {...this.link ()} />
          <Button
            glyph      = 'check'
            mouse-down = {e => this.acceptClicked (e)}
            {...this.link ()} />
          <Button
            glyph      = 'close'
            mouse-down = {e => this.cancelClicked (e)}
            {...this.link ()} />
        </Container>
      );
    } else {
      return (
        <Button
          kind       = 'tray-title'
          grow       = {1}
          text       = {this.getTitle ()}
          mouse-down = {e => this.mouseDown (e)}
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
