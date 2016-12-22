'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {
  Container,
  Button
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
    item.action ();
    this.closeCombo ();
  }

  renderItem (item, index) {
    return (
      <Button key={index} kind='menu-item'
        glyph={item.glyph} text={item.text} active={item.active} mouse-up={() => this.actionAndClose (item)}
        {...this.link ()} />
    );
  }

  renderCombo (list) {
    const result = [];
    let index = 0;
    for (let item of list) {
      result.push (this.renderItem (item, index++));
    }
    return result;
  }

  render () {
    const left   = this.read ('left');
    const right  = this.read ('right');
    const top    = this.read ('top');
    const bottom = this.read ('bottom');
    const width  = this.read ('width');
    const list   = this.read ('list');

    const fullScreenStyle = {
      visibility:      'visible',
      position:        'fixed',
      zIndex:          10,
      top:             '0px',
      left:            '0px',
      width:           '100%',
      height:          '100%',
      userSelect:      'none',
      // backgroundColor: '#f00',
      // opacity:         0.1,
    };

    const comboStyle = {
      visibility:      'visible',
      position:        'absolute',
      zIndex:          11,
      display:         'flex',
      flexDirection:   'column',
      left:            left,
      right:           right,
      top:             top,
      bottom:          bottom,
      opacity:         1.0,
      userSelect:      'none',
    };

    return (
      <div style = {fullScreenStyle} onMouseDown = {(event) => this.mouseDown (event)}>
        <div style = {comboStyle}>
          <Container
          kind              = 'flying-balloon'
          triangle-position = {top ? 'top' : 'bottom'}
          width             = {width}
          {...this.link ()}>
            {this.renderCombo (list)}
          </Container>
        </div>
      </div>
    );
  }
}

/******************************************************************************/
