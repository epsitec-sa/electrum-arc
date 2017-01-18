'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import MouseTrap from 'mousetrap';

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

  getFocusedIndex () {
    return this.state.focusedIndex;
  }

  setFocusedIndex (value) {
    this.setState ( {
      focusedIndex: value
    });
  }

  componentWillMount () {
    console.log ('Combo.componentWillMount');
    MouseTrap.bind ('esc',   () => this.closeCombo ());
    MouseTrap.bind ('up',    () => this.prevIndex ());
    MouseTrap.bind ('down',  () => this.nextIndex ());
    MouseTrap.bind ('enter', () => this.enterAction ());
  }

  componentWillUnmount () {
    console.log ('Combo.componentWillUnmount');
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

  nextIndex () {
    const list = this.read ('list');
    let index = this.getFocusedIndex ();
    while (index < list.length - 1) {
      index++;
      if (!list[index].separator) {
        break;
      }
    }
    this.setFocusedIndex (index);
    console.log ('Combo.nextIndex index=' + index);
  }

  prevIndex () {
    const list = this.read ('list');
    let index = this.getFocusedIndex ();
    if (index === -1) {
      index = list.length;
    }
    while (index > 0) {
      index--;
      if (!list[index].separator) {
        break;
      }
    }
    this.setFocusedIndex (index);
    console.log ('Combo.prevIndex index=' + index);
  }

  enterAction () {
    const index = this.getFocusedIndex ();
    if (index !== -1) {
      const list = this.read ('list');
      const item = list[index];
      this.actionAndClose (item);
    }
  }

  closeCombo () {
    const close = this.read ('close');
    if (close) {
      close ();
    }
  }

  mouseDown (event) {
    console.log ('Combo.mouseDown');
    const node = ReactDOM.findDOMNode (this);
    const rect = node.children[0].getBoundingClientRect ();
    if (!isInside (rect, event.clientX, event.clientY)) {
      // If the mouse is outside the menu combo, close it.
      this.closeCombo ();
    }
  }

  actionAndClose (item) {
    item.action (item);
    this.closeCombo ();
  }

  renderItem (item, focused, index) {
    if (item.separator) {
      return (
        <Separator key={index} kind='menu-separator' {...this.link ()} />
      );
    } else {
      const active = focused ? 'focused' : item.active;
      return (
        <Button
          key      = {index}
          kind     = 'menu-item'
          glyph    = {item.glyph}
          text     = {item.text}
          shortcut = {item.shortcut}
          active   = {active}
          mouse-up = {() => this.actionAndClose (item)}
          {...this.link ()} />
      );
    }
  }

  renderCombo () {
    const list = this.read ('list');
    const result = [];
    const focusedIndex = this.getFocusedIndex ();
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
        onMouseDown  = {(event) => this.mouseDown (event)}
        onTouchStart = {(event) => this.mouseDown (event)}
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
