'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Action} from 'electrum';
import {Button, TextField, Combo, Label} from 'electrum-arc';
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

  onMyBlur () {
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
    const inputWidth               = this.read ('width');
    const inputShape               = this.read ('shape');
    const inputGlyph               = this.read ('combo-glyph');
    const inputValue               = this.read ('value');
    const inputSelectedValue       = this.read ('selected-value');
    const inputHintText            = this.read ('hint-text');
    const inputComboType           = this.read ('combo-type');
    const inputFlyingBalloonAnchor = this.read ('flying-balloon-anchor');
    const inputRows                = this.read ('rows');
    const inputFilterKeys          = this.props['filter-keys'];
    const inputTabIndex            = this.props['tab-index'];

    const readonly = this.getReadonly () && inputSelectedValue && inputSelectedValue !== '';
    const displayValue = readonly ? inputSelectedValue : inputValue;
    // const displayValue = (this.getReadonly ()) ? inputSelectedValue : inputValue;

    // Get or create the internalState.
    var internalState = this.getInternalState ();
    if (!internalState.get ('isComboVisible')) {
      // At first time, initialize internalState.isComboVisible with false.
      internalState = internalState.set ('isComboVisible', 'false');
    }
    const isComboVisible = internalState.get ('isComboVisible');

    const boxStyle = this.mergeStyles ('box');

    const shape = inputShape ? inputShape : 'smooth';
    const textFieldShapes = {
      smooth:  'left-smooth',
      rounded: 'left-rounded',
    };
    const buttonShapes = {
      smooth:  'right-smooth',
      rounded: 'right-rounded',
    };
    const textFieldShape = textFieldShapes[shape];
    const buttonShape    = buttonShapes[shape];

    let htmlCalendar = null;
    //    if (isComboVisible === 'true') {
    //      var htmlCombo = null;
    //      if (inputComboType === 'calendar') {
    //        htmlCombo = (
    //          <Calendar
    //            onChange={(date) => this.dateChanged (date)}
    //            {...this.link ()}
    //          />
    //        );
    //      } else if (inputComboType === 'clock') {
    //        htmlCombo = (
    //          <Clock
    //            onChange={(date) => this.timeChanged (date)}
    //            {...this.link ()}
    //          />
    //        );
    //      } else {
    //        const emptyComboStyle = this.mergeStyles ('emptyCombo');
    //        htmlCombo = (
    //          <span style={emptyComboStyle}>{inputComboType}</span>
    //        );
    //      }
    //      const comboBoxStyle = this.mergeStyles ('comboBox');
    //      htmlCalendar = (
    //        <div style={comboBoxStyle}>
    //          {htmlCombo}
    //        </div>
    //      );
    //    }

    if (readonly) {
      return (
        <span
          style = {boxStyle}
          >
          <Label
            text = {displayValue}
            {...this.link ()}
            />
          <Button
            glyph  = 'pencil'
            action = {() => this.pencilClicked ()}
            {...this.link ()}
            />
        </span>
      );
    } else {
      return (
        <span
          disabled = {disabled}
          style    = {boxStyle}
          >
          <TextField
            id                    = {id}
            value                 = {displayValue}
            hint-text             = {inputHintText}
            filter-keys           = {inputFilterKeys}
            spacing               = 'overlap'
            shape                 = {textFieldShape}
            flying-balloon-anchor = {inputFlyingBalloonAnchor}
            tab-index             = {inputTabIndex}
            width                 = {inputWidth}
            rows                  = {inputRows}
            onBlur                = {() => this.onMyBlur ()}
            {...this.link ()}
          />
          <Button
            kind        = 'combo'
            glyph       = {inputGlyph}
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
}

/******************************************************************************/
