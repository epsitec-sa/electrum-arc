/* eslint react/no-find-dom-node: 0 */
/* global setTimeout */

import {React} from 'electrum';
import {ReactDOM} from 'electrum';
import {Action} from 'electrum';
import {FlyingBalloon} from '../../../all-components.js';

/******************************************************************************/

export default class TextField extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      value:          this.read ('value'),
      grow:           this.read ('grow'),
      spacing:        this.read ('spacing'),
      width:          this.read ('width'),
      shape:          this.read ('shape'),
      messageInfo:    this.read ('message-info'),
      messageWarning: this.read ('message-warning'),
      readonly:       this.read ('readonly'),
    };
  }

  selectAll () {
    const selectAllOnFocus = this.read ('select-all-on-focus');
    if (selectAllOnFocus === 'true') {
      const node = ReactDOM.findDOMNode (this.refs.inputTag);
      // Set focus to child <input>, asynchronously.
      setTimeout (() => {
        node.focus ();
        node.select ();
      }, 0);
    }
  }

  onChange () {
    this.forceUpdate ();
  }

  onMyFocus (e) {
    this.onFocus (e);
    this.selectAll ();
    const onFocus = this.read ('onFocus');
    if (onFocus) {
      onFocus (e);
    }
  }

  onMyBlur (e) {
    this.onBlur (e);
    const onBlur = this.read ('onBlur');
    if (onBlur) {
      onBlur (e);
    }
  }

  renderInput () {
    const state    = this.props.state.find ();
    const disabled = Action.isDisabled (state);
    const id       = this.read ('id');
    const value    = this.read ('value');
    const hintText = this.read ('hint-text');
    const rows     = this.read ('rows');
    const tabIndex = this.props['tab-index'];

    if (rows) {
      const textareaStyle = this.mergeStyles ('textarea');
      return (
        <textarea
          ref         = 'inputTag'
          id          = {id}
          style       = {textareaStyle}
          onChange    = {this.onChange}
          onFocus     = {e => this.onMyFocus (e)}
          onBlur      = {e => this.onMyBlur (e)}
          onKeyDown   = {this.onKeyDown}
          onKeyUp     = {this.onKeyUp}
          onSelect    = {this.onSelect}
          disabled    = {disabled}
          rows        = {rows}
          tabIndex    = {tabIndex}
          value       = {value || ''}
          />
      );
    } else {
      const fieldStyle = this.mergeStyles ('field');
      return (
        <input
          ref         = 'inputTag'
          id          = {id}
          onChange    = {this.onChange}
          onFocus     = {e => this.onMyFocus (e)}
          onBlur      = {e => this.onMyBlur (e)}
          onKeyDown   = {this.onKeyDown}
          onKeyUp     = {this.onKeyUp}
          onSelect    = {this.onSelect}
          disabled    = {disabled}
          maxLength   = {this.props.maxLength}
          placeholder = {hintText}
          size        = {this.props.size || 'size'}
          style       = {fieldStyle}
          type        = {this.props.type || 'text'}
          key         = 'input'
          tabIndex    = {tabIndex}
          value       = {value || ''}
          />
      );
    }
  }

  renderFlyingBalloon () {
    const messageWarning      = this.read ('message-warning');
    const messageInfo         = this.read ('message-info');
    const flyingBalloonAnchor = this.read ('flying-balloon-anchor');
    // Conversion from flying-balloon-anchor to triangle-position.
    const trianglePosition = {
      bottom: 'top',
      top:    'bottom',
      left:   'right',
      right:  'left',
    } [flyingBalloonAnchor];

    if (messageWarning || messageInfo) {
      return (
        <FlyingBalloon
          primary-text      = {messageWarning}
          secondary-text    = {messageInfo}
          triangle-position = {trianglePosition}
          {...this.link ()} />
      );
    } else {
      return null;
    }
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const tooltip = this.read ('tooltip');

    const boxStyle = this.mergeStyles ('box');

    return (
     <span
       disabled = {disabled}
       style    = {boxStyle}
       title    = {tooltip}
       >
       {this.renderInput ()}
       {this.renderFlyingBalloon ()}
     </span>
    );
  }
}

/******************************************************************************/
