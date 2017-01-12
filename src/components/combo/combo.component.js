'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {mouseTrap} from 'react-mousetrap';

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
  }

  componentWillMount () {
    console.log ('Combo.componentWillMount');
    // mouseTrap.bind ('esc', this.closeCombo);
  }

  componentWillUnmount () {
    console.log ('Combo.componentWillUnmount');
    // mouseTrap.unbind ('esc');
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

  renderItem (item, index) {
    if (item.separator) {
      return (
        <Separator key={index} kind='menu-separator' {...this.link ()} />
      );
    } else {
      return (
        <Button key={index} kind='menu-item'
          glyph={item.glyph} text={item.text} shortcut={item.shortcut} active={item.active}
          mouse-up={() => this.actionAndClose (item)}
          {...this.link ()} />
      );
    }
  }

  renderCombo () {
    const list  = this.read ('list');
    const result = [];
    let index = 0;
    for (let item of list) {
      result.push (this.renderItem (item, index++));
    }
    return result;
  }

  render () {
    const top   = this.read ('top');
    const width = this.read ('width');

    const fullScreenStyle = this.mergeStyles ('fullScreen');
    const comboStyle      = this.mergeStyles ('combo');

    return (
      <div style = {fullScreenStyle} onMouseDown = {(event) => this.mouseDown (event)}>
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
