import {React} from 'electrum';
import {Action} from 'electrum';
import {Button, TextField} from '../../../all-components.js';

/******************************************************************************/

export default class LabelTextField extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      readonly: true,
    };
    this.comboLocation = null;
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
      labelGlyph: this.read ('label-glyph'),
      labelText:  this.read ('label-text'),
      labelWidth: this.read ('label-width'),
      fieldWidth: this.read ('field-width'),
      value:      this.read ('value'),
      hintText:   this.read ('hint-text'),
      grow:       this.read ('grow'),
      spacing:    this.read ('spacing'),
    };
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
    const x = this.read ('onFocus');
    if (x) {
      x ();
    }
  }

  onMyBlur () {
    this.readonly = true;
    const x = this.read ('onBlur');
    if (x) {
      x ();
    }
  }

  onActionClicked (e) {
    this.onClick (e);
  }

  hasActionButton () {
    const actionGlyph = this.read ('action-glyph');
    if (actionGlyph) {
      return true;
    } else {
      return false;
    }
  }

  renderButton () {
    const shape      = this.read ('shape');
    const labelGlyph = this.read ('label-glyph');
    const labelText  = this.read ('label-text');
    const labelWidth = this.read ('label-width');

    const s = shape ? shape : 'smooth';
    const buttonShapes = {
      smooth:  'left-smooth',
      rounded: 'left-rounded',
    };
    const buttonShape = buttonShapes[s];

    return (
      <Button
        glyph       = {labelGlyph}
        text        = {labelText}
        width       = {labelWidth}
        shape       = {buttonShape}
        kind        = 'label'
        justify     = 'left'
        spacing     = 'overlap'
        {...this.link ()}
      />
    );
  }

  renderInput () {
    const id               = this.read ('id');
    const field            = this.read ('field');
    const type             = this.read ('type');
    const shape            = this.read ('shape');
    const fieldWidth       = this.read ('field-width');

    // @DR: Don't do this: setting the value as a `prop` rather than through
    // its state breaks React's forceUpdate() optimizations on the child
    // <input> element:
//  const value            = this.read ('value');

    // @DR: We should remove the `selected-value` property altogether and
    // use the state (based on `value`) instead; but since I am not sure
    // of all the implications, I prefer not to touch this logic for now:
    const selectedValue    = this.read ('selected-value');

    const hintText         = this.read ('hint-text');
    const tooltip          = this.read ('tooltip');
    const messageInfo      = this.read ('message-info');
    const messageWarning   = this.read ('message-warning');
    const rows             = this.read ('rows');
    const readonly         = this.read ('readonly');
    const selectAllOnFocus = this.read ('select-all-on-focus');
    const defaultFocus     = this.read ('default-focus');
    const filterKeys       = this.props['filter-keys'];
    const tabIndex         = this.props['tab-index'];

    const autoReadonly = this.readonly && selectedValue && selectedValue !== '';
    const displayValue = autoReadonly ? selectedValue : null;
    const visibleReadonly = readonly ? readonly : (autoReadonly ? 'true' : 'false');

    const s = shape ? shape : 'smooth';
    const textFieldShapes = {
      smooth:  'right-smooth',
      rounded: 'right-rounded',
    };
    const textFieldShape = textFieldShapes[s];
    const props = {
      'id':                  id,
      'field':               field,
      'type':                type,
      'width':               fieldWidth,
      'hint-text':           hintText,
      'tooltip':             tooltip,
      'message-info':        messageInfo,
      'message-warning':     messageWarning,
      'filter-keys':         filterKeys,
      'spacing':             this.hasActionButton () ? 'overlap' : null,
      'shape':               textFieldShape,
      'tab-index':           tabIndex,
      'rows':                rows,
      'readonly':            visibleReadonly,
      'select-all-on-focus': selectAllOnFocus,
      'default-focus':       defaultFocus,
    };

    if (displayValue) {
      props.value = displayValue;
    }

    return (
      <TextField
        {...props}
        onFocus = {this.onMyFocus}
        onBlur  = {this.onMyBlur}
        {...this.link ()}
      />
    );
  }

  renderAction () {
    if (this.hasActionButton ()) {
      const actionGlyph = this.read ('action-glyph');
      return (
        <Button
          kind     = 'combo'
          glyph    = {actionGlyph}
          on-click = {this.onActionClicked}
          {...this.link ()}
        />
      );
    } else {
      return null;
    }
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    const boxStyle = this.mergeStyles ('box');

    return (
      <span
        disabled = {disabled}
        style    = {boxStyle}
        >
        {this.renderButton ()}
        {this.renderInput ()}
        {this.renderAction ()}
      </span>
    );
  }
}

/******************************************************************************/
