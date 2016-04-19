'use strict';

import React from 'react';
import {Action} from 'electrum';
import {DatePicker as MUIDatePicker} from 'material-ui';
// import areIntlLocalesSupported from 'intl-locales-supported';
/******************************************************************************/

export default class MuDatePicker extends React.Component {

  constructor (props) {
    super (props);
  }

  onKeyDown (e) {
    const {id, state} = this.props;
    console.log (`onKeyDown: ${id}, ${state.generation} value=${e.target.value}`);
  }

  onKeyUp (e) {
    const {id, state} = this.props;
    console.log (`onKeyUp: ${id}, ${state.generation} value=${e.target.value}`);
  }

  onChange (e) {
    const {id, state} = this.props;
    console.log (`onChange: ${id}, ${state.generation} value=${e.target.value}`);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);

    // let DateTimeFormat;
    //
    // // Use the native Intl if available
    // if (areIntlLocalesSupported ('fr')) {
    //   DateTimeFormat = global.Intl.DateTimeFormat;
    // } else {
    //   const IntlPolyfill = require ('intl');
    //   require ('intl/locale-data/jsonp/fr');
    //
    //   DateTimeFormat = IntlPolyfill.DateTimeFormat;
    // }

    return (
      <MUIDatePicker
        onChange={this.onChange}
        onFocus={this.onFocus}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onSelect={this.onSelect}
        id={this.props.id}
        autoOk={this.props.autoOk || this.read ('autoOk')}
        container={this.props.container || this.read ('container')}
        defaultDate={this.props.defaultDate || this.read ('defaultDate')}
        // DateTimeFormat={DateTimeFormat}
        disabled={disabled}
        firstDayOfWeek={1}
        hintText={this.props.hintText || this.read ('hintText')}
        locale='fr'
        maxDate={this.props.maxDate || this.read ('maxDate')}
        minDate={this.props.minDate || this.read ('minDate')}
        mode={this.props.mode || this.read ('mode')}
        value={this.props.value || this.read ('value')}
        wordings={{ok: 'OK', cancel: 'Annuler'}}
        {...this.props}
        />
    );
  }
}

/******************************************************************************/
