/* eslint react/no-find-dom-node: 0 */

import {React} from 'electrum';
import {ReactDOM} from 'electrum';
import MouseTrap from 'mousetrap';
import * as GlyphHelpers from '../polypheme/glyph-helpers.js';
import {ColorHelpers} from 'electrum-theme';

import {
  Container,
  Button,
  Separator
} from '../../all-components.js';

/******************************************************************************/

function isInside (rect, x, y) {
  if (rect && rect.left < rect.right && rect.top < rect.bottom) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  } else {
    return true;
  }
}

/******************************************************************************/

export default class Combo extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      focusedIndex: -1
    };
  }

  get focusedIndex () {
    return this.state.focusedIndex;
  }

  set focusedIndex (value) {
    this.setState ( {
      focusedIndex: value
    });
  }

  componentWillMount () {
    // Trace.log ('Combo.componentWillMount');
    MouseTrap.bind ('esc',   this.onCloseCombo);
    MouseTrap.bind ('up',    this.onPrevIndex);
    MouseTrap.bind ('down',  this.onNextIndex);
    MouseTrap.bind ('enter', this.onEnterAction);
  }

  componentWillUnmount () {
    // Trace.log ('Combo.componentWillUnmount');
    MouseTrap.unbind ('esc');
    MouseTrap.unbind ('up');
    MouseTrap.unbind ('down');
    MouseTrap.unbind ('enter');
  }

  get styleProps () {
    return {
      center: this.read ('center'),
      right:  this.read ('right'),
      top:    this.read ('top'),
      bottom: this.read ('bottom'),
      width:  this.read ('width'),
    };
  }

  onNextIndex () {
    const list = this.read ('list');
    let index = this.focusedIndex;
    while (index < list.length - 1) {
      index++;
      if (!list[index].separator) {
        break;
      }
    }
    this.focusedIndex = index;
  }

  onPrevIndex () {
    const list = this.read ('list');
    let index = this.focusedIndex;
    if (index === -1) {
      index = list.length;
    }
    while (index > 0) {
      index--;
      if (!list[index].separator) {
        break;
      }
    }
    this.focusedIndex = index;
  }

  onEnterAction () {
    const index = this.focusedIndex;
    if (index !== -1) {
      const list = this.read ('list');
      const item = list[index];
      this.onActionAndClose (item);
    }
  }

  onCloseCombo () {
    const close = this.read ('close');
    if (close) {
      close ();
    }
  }

  onMyMouseDown (e) {
    const node = ReactDOM.findDOMNode (this);
    const rect = node.children[0].getBoundingClientRect ();
    if (!isInside (rect, e.clientX, e.clientY)) {
      // If the mouse is outside the menu combo, close it.
      this.onCloseCombo ();
    }
  }

  onActionAndClose (item) {
    item.action (item);
    this.onCloseCombo ();
  }

  renderItem (item, focused, index) {
    if (item.separator) {
      return (
        <Separator key={index} kind='menu-separator' {...this.link ()} />
      );
    } else {
      const g = GlyphHelpers.getGlyph (item.glyph);
      const color = ColorHelpers.getMarkColor (this.props.theme, g.color);
      const active = focused ? 'focused' : item.active;
      return (
        <Button
          key         = {index}
          kind        = 'menu-item'
          glyph       = {g.glyph}
          glyph-color = {color}
          text        = {item.text}
          shortcut    = {item.shortcut}
          active      = {active}
          mouse-up    = {() => this.onActionAndClose (item)}
          {...this.link ()} />
      );
    }
  }

  renderCombo () {
    const list = this.read ('list');
    const result = [];
    const focusedIndex = this.focusedIndex;
    let index = 0;
    for (let item of list) {
      const focused = (index === focusedIndex);
      result.push (this.renderItem (item, focused, index++));
    }
    return result;
  }

  render () {
    const top   = this.read ('top');
    const width = this.read ('width');

    const fullScreenStyle = this.mergeStyles ('fullScreen');
    const comboStyle      = this.mergeStyles ('combo');

    return (
      <div
        style        = {fullScreenStyle}
        onMouseDown  = {this.onMyMouseDown}
        onTouchStart = {this.onMyMouseDown}
        >
        <div style = {comboStyle}>
          <Container
            kind              = 'flying-balloon'
            triangle-position = {top ? 'top' : 'bottom'}
            width             = {width}
            {...this.link ()}>
            {this.renderCombo ()}
          </Container>
        </div>
      </div>
    );
  }
}

/******************************************************************************/
