'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Action} from 'electrum';
import {Unit} from 'electrum-theme';
import {Button, TextField, Calendar, Clock, Combo} from 'electrum-arc';

/******************************************************************************/

export default class TextFieldCombo extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      showCombo: false,
    };
    this.comboLeft   = null;
    this.comboTop    = null;
    this.comboBottom = null;
  }

  getShowCombo () {
    return this.state.showCombo;
  }

  setShowCombo (value) {
    this.setState ( {
      showCombo: value
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
    const comboRect = node.getBoundingClientRect ();

    // Compute horizontal position according to mouse.
    this.comboLeft = comboRect.left + 'px';

    // Puts the menu under the component if it is in the upper half of the window.
    const my = (comboRect.top + comboRect.bottom) / 2;
    const underside = my < window.innerHeight / 2;
    const top = Unit.add ((window.innerHeight - comboRect.top) + 'px', this.props.theme.shapes.flyingBalloonTriangleSize);
    const bottom = Unit.add (comboRect.bottom + 'px', this.props.theme.shapes.flyingBalloonTriangleSize);
    this.comboTop = underside ? bottom : null;
    this.comboBottom = underside ? null : top;

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

  renderCombo () {
    const list = this.read ('list');
    if (list && this.getShowCombo ()) {
      return (
        <Combo
          left   = {this.comboLeft}
          top    = {this.comboTop}
          bottom = {this.comboBottom}
          list   = {list}
          close  = {() => this.setShowCombo (false)}
          {...this.link ()} />
      );
    } else {
      return null;
    }
  }

  render () {
    const {state, id} = this.props;
    const disabled = Action.isDisabled (state);
    const inputWidth               = this.read ('width');
    const inputShape               = this.read ('shape');
    const inputGlyph               = this.read ('combo-glyph');
    const inputValue               = this.read ('value');
    const inputHintText            = this.read ('hint-text');
    const inputComboType           = this.read ('combo-type');
    const inputFlyingBalloonAnchor = this.read ('flying-balloon-anchor');
    const inputRows                = this.read ('rows');
    const inputFilterKeys          = this.props['filter-keys'];
    const inputTabIndex            = this.props['tab-index'];

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

    return (
      <span
        disabled = {disabled}
        style    = {boxStyle}
        >
        <TextField
          id                    = {id}
          value                 = {inputValue}
          hint-text             = {inputHintText}
          filter-keys           = {inputFilterKeys}
          spacing               = 'overlap'
          shape                 = {textFieldShape}
          flying-balloon-anchor = {inputFlyingBalloonAnchor}
          tab-index             = {inputTabIndex}
          width                 = {inputWidth}
          rows                  = {inputRows}
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

/******************************************************************************/
