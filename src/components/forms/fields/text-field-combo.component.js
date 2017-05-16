/* eslint react/no-find-dom-node: 0 */

import {React} from 'electrum';
import {ReactDOM} from 'electrum';
import {Action} from 'electrum';
import {Button, TextField, Combo} from '../../../all-components.js';
import * as ComboHelpers from '../../combo/combo-helpers.js';

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

  get showCombo () {
    return this.state.showCombo;
  }

  set showCombo (value) {
    this.setState ( {
      showCombo: value
    });
  }

  get readonly () {
    return this.state.readonly;
  }

  set readonly (value) {
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
      width:          this.read ('width'),
      spacing:        this.read ('spacing'),
      comboDirection: this.read ('combo-direction'),
    };
  }

  doShowCombo () {
    const node = ReactDOM.findDOMNode (this);
    this.comboLocation = ComboHelpers.getComboLocation (node, this.props.theme, 'flying-balloon');
    this.showCombo = true;
  }

  onHideCombo () {
    this.showCombo = false;
  }

  // Called when the combo button is clicked.
  onButtonClicked () {
    const list = this.read ('list');
    if (list) {
      this.doShowCombo ();
    }
  }

  onMyChange (e) {
    this.onChange (e);
    const x = this.read ('onChange');
    if (x) {
      x (e);
    }
  }

  onMyFocus () {
    this.readonly = false;
  }

  onMyBlur () {
    this.readonly = true;
  }

  onMyMouseDown () {
    const readonly = this.read ('readonly');
    if (readonly === 'true') {
      this.onButtonClicked ();
    }
  }

  renderTextField () {
    const id                  = this.read ('id');
    const width               = this.read ('width');
    const shape               = this.read ('shape');

    // @DR: Don't do this: setting the value as a `prop` rather than through
    // its state breaks React's forceUpdate() optimizations on the child
    // <input> element:
//  const value          = this.read ('value');

    // @DR: We should remove the `selected-value` property altogether and
    // use the state (based on `value`) instead; but since I am not sure
    // of all the implications, I prefer not to touch this logic for now:
    const selectedValue       = this.read ('selected-value');

    const hintText            = this.read ('hint-text');
    const tooltip             = this.read ('tooltip');
    const flyingBalloonAnchor = this.read ('flying-balloon-anchor');
    const rows                = this.read ('rows');
    const readonly            = this.read ('readonly');
    const selectAllOnFocus    = this.read ('select-all-on-focus');
    const defaultFocus        = this.read ('default-focus');
    const filterKeys          = this.props['filter-keys'];
    const tabIndex            = this.props['tab-index'];

    const autoReadonly = this.readonly && selectedValue && selectedValue !== '';
    const displayValue = autoReadonly ? selectedValue : null;
    const visibleReadonly = readonly ? readonly : (autoReadonly ? 'true' : 'false');

    const s = shape ? shape : 'smooth';
    const textFieldShapes = {
      smooth:  'left-smooth',
      rounded: 'left-rounded',
    };
    const textFieldShape = textFieldShapes[s];
    const props = {
      'id':                    id,
      'hint-text':             hintText,
      'tooltip':               tooltip,
      'filter-keys':           filterKeys,
      'spacing':               'overlap',
      'shape':                 textFieldShape,
      'flying-balloon-anchor': flyingBalloonAnchor,
      'tab-index':             tabIndex,
      'width':                 width,
      'rows':                  rows,
      'readonly':              visibleReadonly,
      'select-all-on-focus':   selectAllOnFocus,
      'default-focus':         defaultFocus,
    };

    if (displayValue) {
      props.value = displayValue;
    }

    const isComboVisible = this.showCombo ? 'true' : 'false';

    return (
      <TextField
        {...props}
        active      = {isComboVisible}
        onFocus     = {this.onMyFocus}
        onBlur      = {this.onMyBlur}
        onMouseDown = {this.onMyMouseDown}
        {...this.link ()}
        />
    );
  }

  renderButton () {
    const shape = this.read ('shape');
    const glyph = this.read ('combo-glyph');

    const s = shape ? shape : 'smooth';
    const buttonShapes = {
      smooth:  'right-smooth',
      rounded: 'right-rounded',
    };
    const buttonShape = buttonShapes[s];

    const isComboVisible = this.showCombo ? 'true' : 'false';

    return (
      <Button
        kind            = 'combo'
        glyph           = {glyph}
        shape           = {buttonShape}
        active          = {isComboVisible}
        custom-on-click = {this.onButtonClicked}
        {...this.link ()}
        />
    );
  }

  renderCombo () {
    const list = this.read ('list');
    if (list && this.showCombo) {
      return (
        <Combo
          center = {this.comboLocation.center}
          top    = {this.comboLocation.top}
          bottom = {this.comboLocation.bottom}
          list   = {list}
          close  = {this.onHideCombo}
          {...this.link ()} />
      );
    } else {
      return null;
    }
  }

  render () {
    const {state}  = this.props;
    const disabled = Action.isDisabled (state);

    const boxStyle = this.mergeStyles ('box');

    return (
      <span
        disabled = {disabled}
        style    = {boxStyle}
        >
        {this.renderTextField ()}
        {this.renderButton ()}
        {this.renderCombo ()}
      </span>
    );
  }
}

/******************************************************************************/
