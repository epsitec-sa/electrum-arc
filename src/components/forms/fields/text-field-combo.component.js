'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Action} from 'electrum';
import {Button, TextField, Combo} from '../../../all-components.js';
import {getComboLocation} from '../../combo/combo-helpers.js';

/******************************************************************************/

export default class TextFieldCombo extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      showCombo: false,
      readonly:  true,
    };
    this.comboLocation = null;
  }

  getShowCombo () {
    return this.state.showCombo;
  }

  setShowCombo (value) {
    this.setState ( {
      showCombo: value
    });
  }

  getReadonly () {
    return this.state.readonly;
  }

  setReadonly (value) {
    this.setState ( {
      readonly: value
    });
  }

  get styleProps () {
    return {
      kind:           this.read ('kind'),
      comboGlyph:     this.read ('combo-glyph'),
      value:          this.read ('value'),
      hintText:       this.read ('hint-text'),
      grow:           this.read ('grow'),
      spacing:        this.read ('spacing'),
      comboDirection: this.read ('combo-direction'),
    };
  }

  // Return the internalState with contain the isComboVisible.
  getInternalState () {
    const {state} = this.props;
    return state.select ('combo-internal');
  }

  showCombo () {
    const node = ReactDOM.findDOMNode (this);
    this.comboLocation = getComboLocation (node, this.props.theme);
    this.setShowCombo (true);
  }

  // Called when the combo button is clicked.
  buttonClicked () {
    // const internalState = this.getInternalState ();
    // var isComboVisible = internalState.get ('isComboVisible');
    // if (isComboVisible === 'true') {
    //   isComboVisible = 'false';
    // } else {
    //   isComboVisible = 'true';
    // }
    // internalState.set ('isComboVisible', isComboVisible);

    const list = this.read ('list');
    if (list) {
      this.showCombo ();
    }
  }

  // TODO: Move to helpers, or ???
  dateToString (date) {
    const day   = date.getDate ();
    const month = date.getMonth () + 1;
    const year  = date.getFullYear ();
    return day + '.' + month + '.' + year;
  }

  // TODO: Move to helpers, or ???
  timeToString (time) {
    const hours   = time.getHours ();
    const minutes = time.getMinutes ();
    return hours + ':' + minutes;
  }

  dateChanged (date) {
    const {state} = this.props;
    state.set ('value', this.dateToString (date));
    this.showCombo ();  // close the combo
  }

  timeChanged (date) {
    const {state} = this.props;
    state.set ('value', this.timeToString (date));
  }

  alter (list) {
    for (var item of list) {
      item.action = () => {
        this.setShowCombo (false);
      };
    }
    return list;
  }

  pencilClicked () {
    this.setReadonly (false);
  }

  onMyFocus (e) {
    this.onFocus (e);
    this.setReadonly (false);
  }

  onMyBlur (e) {
    this.onBlur (e);
    this.setReadonly (true);
  }

  renderCombo () {
    const list = this.read ('list');
    if (list && this.getShowCombo ()) {
      return (
        <Combo
          center = {this.comboLocation.center}
          top    = {this.comboLocation.top}
          bottom = {this.comboLocation.bottom}
          list   = {list}
          close  = {() => this.setShowCombo (false)}
          {...this.link ()} />
      );
    } else {
      return null;
    }
  }

  render () {
    const {state}  = this.props;
    const disabled = Action.isDisabled (state);
    const id                       = this.read ('id');
    const width               = this.read ('width');
    const shape               = this.read ('shape');
    const glyph               = this.read ('combo-glyph');
    const value               = this.read ('value');
    const selectedValue       = this.read ('selected-value');
    const hintText            = this.read ('hint-text');
    const comboType           = this.read ('combo-type');
    const flyingBalloonAnchor = this.read ('flying-balloon-anchor');
    const rows                = this.read ('rows');
    const readonly            = this.read ('readonly');
    const filterKeys          = this.props['filter-keys'];
    const tabIndex            = this.props['tab-index'];

    const autoReadonly = this.getReadonly () && selectedValue && selectedValue !== '';
    const displayValue = autoReadonly ? selectedValue : value;
    const visibleReadonly = readonly ? readonly : (autoReadonly ? 'true' : 'false');

    // Get or create the internalState.
    var internalState = this.getInternalState ();
    if (!internalState.get ('isComboVisible')) {
      // At first time, initialize internalState.isComboVisible with false.
      internalState = internalState.set ('isComboVisible', 'false');
    }
    const isComboVisible = internalState.get ('isComboVisible');

    const boxStyle = this.mergeStyles ('box');

    const s = shape ? shape : 'smooth';
    const textFieldShapes = {
      smooth:  'left-smooth',
      rounded: 'left-rounded',
    };
    const buttonShapes = {
      smooth:  'right-smooth',
      rounded: 'right-rounded',
    };
    const textFieldShape = textFieldShapes[s];
    const buttonShape    = buttonShapes[s];

    let htmlCalendar = null;
    //    if (isComboVisible === 'true') {
    //      var htmlCombo = null;
    //      if (comboType === 'calendar') {
    //        htmlCombo = (
    //          <Calendar
    //            onChange={(date) => this.dateChanged (date)}
    //            {...this.link ()}
    //          />
    //        );
    //      } else if (comboType === 'clock') {
    //        htmlCombo = (
    //          <Clock
    //            onChange={(date) => this.timeChanged (date)}
    //            {...this.link ()}
    //          />
    //        );
    //      } else {
    //        const emptyComboStyle = this.mergeStyles ('emptyCombo');
    //        htmlCombo = (
    //          <span style={emptyComboStyle}>{comboType}</span>
    //        );
    //      }
    //      const comboBoxStyle = this.mergeStyles ('comboBox');
    //      htmlCalendar = (
    //        <div style={comboBoxStyle}>
    //          {htmlCombo}
    //        </div>
    //      );
    //    }

    return (
      <span
        disabled = {disabled}
        style    = {boxStyle}
        >
        <TextField
          id                    = {id}
          value                 = {displayValue}
          hint-text             = {hintText}
          filter-keys           = {filterKeys}
          spacing               = 'overlap'
          shape                 = {textFieldShape}
          flying-balloon-anchor = {flyingBalloonAnchor}
          tab-index             = {tabIndex}
          width                 = {width}
          rows                  = {rows}
          readonly              = {visibleReadonly}
          onFocus               = {e => this.onMyFocus (e)}
          onBlur                = {e => this.onMyBlur (e)}
          {...this.link ()}
          />
        <Button
          kind        = 'combo'
          glyph       = {glyph}
          shape       = {buttonShape}
          active      = {isComboVisible}
          action      = {() => this.buttonClicked ()}
          {...this.link ()}
          />
        {htmlCalendar}
        {this.renderCombo ()}
      </span>
    );
  }
}

/******************************************************************************/
