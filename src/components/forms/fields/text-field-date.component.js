/* eslint react/no-find-dom-node: 0 */

import {React, Store} from 'electrum';
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

  parseEditedValue (displayedValue) {
    const parsed = Converters.parseEditedDate (displayedValue);
    const finalValue = this.canonicalToDisplayed (parsed.value);
    return {canonicalValue: parsed.value, displayedFinalValue: finalValue, warning: parsed.error};
  }

  linkValueEdited () {
    return {...this.link (), state: this.internalStore.select ('value'), bus: this.localBus};
  }

  // Return the top line of FlyingBalloon, displayed in bold.
  // Contains the optional error message.
  getMessageWarning () {
    return this.internalStore.select ('value').get ('warning');
  }

  // Return the bottom line of FlyingBalloon.
  // Contains the final value.
  getMessageInfo () {
    const displayedValue = this.internalStore.select ('value').get ('value');
    const message        = this.internalStore.select ('value').get ('info');
    if (message !== displayedValue) {
      return message;
    } else {
      return null;
    }
  }

  // LocalBus.notify
  notify (props, source, value) {
    if (source.type === 'change') {
      const parsed = this.parseEditedValue (value);
      this.internalStore.select ('value').set (
        'value',   value,
        'info',    parsed.displayedFinalValue,
        'warning', parsed.warning
      );

      if (parsed.canonicalValue !== this.read ('value')) {
        this.props.bus.notify (this.props, source, parsed.canonicalValue);
      }

      this.forceUpdate ();  // to update message-info
    } else if (source.type === 'defocus') {
      // When defocus, complete the edited value and hide the FlyingBalloon (which
      // contains the message). By example, '12' is replaced by '12.05.2017'.
      const displayedValue = this.internalStore.select ('value').get ('value');
      const parsed         = this.parseEditedValue (displayedValue);
      this.internalStore.select ('value').set ('value', parsed.displayedFinalValue);  // no 'info' to hide
      this.forceUpdate ();  // to update message-info
    }
  }

  render () {
    const hintText         = this.read ('hint-text');
    const tooltip          = this.read ('tooltip');
    const labelGlyph       = this.read ('label-glyph');
    const labelText        = this.read ('label-text');
    const labelWidth       = this.read ('label-width');
    const grow             = this.read ('grow');
    const spacing          = this.read ('spacing');
    const readonly         = this.read ('readonly');
    const selectAllOnFocus = this.read ('select-all-on-focus');

    return (
      <LabelTextField
        hint-text           = {hintText}
        tooltip             = {tooltip}
        label-glyph         = {labelGlyph}
        label-text          = {labelText}
        label-width         = {labelWidth}
        grow                = {grow}
        spacing             = {spacing}
        readonly            = {readonly}
        select-all-on-focus = {selectAllOnFocus}
        message-warning     = {this.getMessageWarning ()}
        message-info        = {this.getMessageInfo ()}
        {...this.linkValueEdited ()} />
    );
  }
}

/******************************************************************************/
