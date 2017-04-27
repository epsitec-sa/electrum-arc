/* eslint react/no-find-dom-node: 0 */

import {React, Store, State} from 'electrum';
import {LabelTextField} from 'electrum-arc';
import * as Converters from '../../polypheme/converters';

/******************************************************************************/

export default class TextFieldDate extends React.Component {

  constructor (props) {
    super (props);
    this.internalStore = Store.create ();
    this.localBus = this;  // for access to property notify

    const canonicalValue = this.read ('value');
    const displayedValue = this.canonicalToDisplayed (canonicalValue);
    this.internalStore.select ('value').set ('value', displayedValue);
  }

  canonicalToDisplayed (canonicalValue) {
    return Converters.getDisplayedDate (canonicalValue);
  }

  displayedToCanonical (displayedValue) {
    return Converters.getFormatedDate (displayedValue, true);
  }

  linkValueEdited () {
    return {...this.link (), state: this.internalStore.select ('value'), bus: this.localBus};
  }

  getMessage () {
    const displayedValue = this.internalStore.select ('value').get ('value');
    const message        = this.internalStore.select ('value').get ('message');
    if (message !== displayedValue) {
      return message;
    } else {
      return null;
    }
  }

  // LocalBus.notify
  notify (props, source, value) {
    const canonicalValue = this.displayedToCanonical (value);
    const message = this.canonicalToDisplayed (canonicalValue);
    this.internalStore.select ('value').set ('value', value, 'message', message);

    if (canonicalValue !== this.read ('value')) {
      const externalStore = this.props.state._store;
      const s = externalStore.select ('value').set ('value', canonicalValue);
      externalStore.setState (s);
      this.props.bus.notify (this.props, null, canonicalValue);  // TODO: devrait être implicite ?!
    }

    this.forceUpdate ();  // to update message-info
  }

  // When defocus (named 'blur' in react), complete the edited value and hide
  // the FlyingBalloon (which contains the message).
  // By example, '12' is replaced by '12..5.2017'.
  onMyBlur () {
    const displayedValue = this.internalStore.select ('value').get ('value');
    const canonicalValue = this.displayedToCanonical (displayedValue);
    const finalValue     = this.canonicalToDisplayed (canonicalValue);
    this.internalStore.select ('value').set ('value', finalValue);  // no 'message' to hide
  }

  render () {
    const hintText   = this.read ('hint-text');
    const labelGlyph = this.read ('label-glyph');
    const labelText  = this.read ('label-text');
    const labelWidth = this.read ('label-width');
    const grow       = this.read ('grow');
    const spacing    = this.read ('spacing');

    return (
      <LabelTextField
        hint-text    = {hintText}
        label-glyph  = {labelGlyph}
        label-text   = {labelText}
        label-width  = {labelWidth}
        grow         = {grow}
        spacing      = {spacing}
        message-info = {this.getMessage ()}
        onBlur       = {() => this.onMyBlur ()}
        {...this.linkValueEdited ()} />
    );
  }
}

/******************************************************************************/
