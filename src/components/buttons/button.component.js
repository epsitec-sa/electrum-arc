'use strict';

import React from 'react';
import {Action} from 'electrum';

import {Badge, Menu} from '../../all-components.js';

/******************************************************************************/

export default class Button extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      glyph:           this.read ('glyph'),
      text:            this.read ('text'),
      border:          this.read ('border'),
      glyphPosition:   this.read ('glyph-position'),
      spacing:         this.read ('spacing'),
      grow:            this.read ('grow'),
      width:           this.read ('width'),
      height:          this.read ('height'),
      left:            this.read ('left'),
      right:           this.read ('right'),
      top:             this.read ('top'),
      bottom:          this.read ('bottom'),
      kind:            this.read ('kind'),
      subkind:         this.read ('subkind'),
      nature:          this.read ('nature'),
      place:           this.read ('place'),
      active:          this.read ('active'),
      badgeValue:      this.read ('badge-value'),
      shape:           this.read ('shape'),
      menuDirection:   this.read ('menu-direction'),
      textTransform:   this.read ('text-transform'),
      backgroundColor: this.read ('background-color'),
      zIndex:          this.read ('z-index'),
      cursor:          this.read ('cursor'),
      position:        this.read ('position'),
    };
  }

  // Return the internalState with contain the isMenuVisible.
  getInternalState () {
    const {state} = this.props;
    return state.select ('menu-internal');
  }

  // Called when the button is clicked.
  showMenu () {
    // console.log ('>>>> showMenu <<<<');
    const internalState = this.getInternalState ();
    let isMenuVisible = internalState.get ('isMenuVisible');
    if (isMenuVisible === 'true') {
      isMenuVisible = 'false';
    } else {
      isMenuVisible = 'true';
    }
    internalState.set ('isMenuVisible', isMenuVisible);
  }

  mouseDown () {
    console.log ('Button.mouseDown');
    const mouseDown = this.read ('mouse-down');
    if (mouseDown) {
      mouseDown ();
    }
  }

  mouseUp () {
    const mouseUp = this.read ('mouse-up');
    if (mouseUp) {
      mouseUp ();
    }
  }

  isMenuVisible () {
    // Get or create the internalState.
    const menu = this.read ('menu');
    if (menu) {
      let internalState = this.getInternalState ();
      if (!internalState.get ('isMenuVisible')) {
        // At first time, initialize internalState.isMenuVisible with false.
        internalState = internalState.set ('isMenuVisible', 'false');
      }
      return internalState.get ('isMenuVisible');
    } else {
      return 'false';
    }
  }

  renderBadge () {
    const badgeValue = this.read ('badge-value');
    if (badgeValue) {
      return (
        <Badge
          value={badgeValue}
          layer='over'
          {...this.link ()}
        />
      );
    } else {
      return null;
    }
  }

  renderTriangle () {
    const kind   = this.read ('kind');
    const active = this.read ('active');
    if (kind === 'main-tab' && active === 'true') {
      const triangleStyle = this.mergeStyles ('triangle');
      return (
        <div style={triangleStyle} />
      );
    } else {
      return null;
    }
  }

  renderMenu () {
    if (this.isMenuVisible () === 'true') {
      const menu = this.read ('menu');
      const menuBoxStyle = this.mergeStyles ('menuBox');
      return (
        <div style={menuBoxStyle}>
          <Menu items={menu} {...this.link ()} />
        </div>
      );
    } else {
      return null;
    }
  }

  renderGlyph () {
    const glyph  = this.read ('glyph');
    if (glyph) {
      const rotate = this.read ('rotate');
      const flip   = this.read ('flip');
      const spin   = this.read ('spin');
      const renderSpin = spin ? 'fa-spin' : '';
      const glyphStyle = this.mergeStyles ('glyph');
      return (
        <i key='icon'
          style={glyphStyle}
          className={`fa
          fa-${glyph}
          fa-rotate-${rotate}
          fa-flip-${flip}
          ${renderSpin}`}
        />
      );
    } else {
      return null;
    }
  }

  renderText () {
    const text = this.read ('text');
    if (text) {
      const shortcut = this.read ('shortcut');
      const textStyle = this.mergeStyles ('text');
      if (shortcut) {
        textStyle.flexGrow = 1;
      }
      return (
        <label key='text' style={textStyle}>
          {text}
        </label>
      );
    } else {
      return null;
    }
  }

  renderShortcut () {
    const shortcut = this.read ('shortcut');
    if (shortcut) {
      const shortcutStyle = this.mergeStyles ('shortcut');
      return (
        <label key='shortcut' style={shortcutStyle}>
          {'[' + shortcut + ']'}
        </label>
      );
    } else {
      return null;
    }
  }

  renderLayout () {
    const result = [];
    const glyphPosition = this.read ('glyph-position');
    if (glyphPosition === 'right') {
      result.push (this.renderText ());
      result.push (this.renderShortcut ());
      result.push (this.renderGlyph ());
    } else {
      result.push (this.renderGlyph ());
      result.push (this.renderText ());
      result.push (this.renderShortcut ());
    }
    return result;
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const kind     = this.read ('kind');
    const tooltip  = this.read ('tooltip');
    const menu     = this.read ('menu');
    const toAnchor = this.read ('to-anchor');

    const boxStyle = this.mergeStyles ('box');

    if (kind === 'container' || kind === 'box') {
      return (
        <div
          onClick     = {this.onClick}  // voir (*)
          onMouseDown = {() => this.mouseDown ()}
          onMouseUp   = {() => this.mouseUp ()}
          disabled    = {disabled}
          style       = {boxStyle}
          title       = {tooltip}
        >
          {this.props.children}
        </div>
      );
    } else if (menu) {
      return (
        <div
          onClick     = {() => this.showMenu ()}  // voir (*)
          onMouseDown = {() => this.mouseDown ()}
          onMouseUp   = {() => this.mouseUp ()}
          disabled    = {disabled}
          style       = {boxStyle}
          title       = {tooltip}
        >
          {this.renderLayout ()}
          {this.renderTriangle ()}
          {this.renderBadge ()}
          {this.renderMenu ()}
          {this.props.children}
        </div>
      );
    } else if (toAnchor) {
      return (
        <a
          onClick     = {this.onClick}  // voir (*)
          onMouseDown = {() => this.mouseDown ()}
          onMouseUp   = {() => this.mouseUp ()}
          disabled    = {disabled}
          style       = {boxStyle}
          title       = {tooltip}
          href        = {'#' + toAnchor}
        >
          {this.renderLayout ()}
          {this.renderTriangle ()}
          {this.renderBadge ()}
          {this.renderMenu ()}
          {this.props.children}
        </a>
      );
    } else {
      return (
        <div
          onClick     = {this.onClick}  // voir (*)
          onMouseDown = {() => this.mouseDown ()}
          onMouseUp   = {() => this.mouseUp ()}
          disabled    = {disabled}
          style       = {boxStyle}
          title       = {tooltip}
        >
          {this.renderLayout ()}
          {this.renderTriangle ()}
          {this.renderBadge ()}
          {this.renderMenu ()}
          {this.props.children}
        </div>
      );
    }
    // (*) je n'arrive pas à généraliser cela !!!
  }
}

/******************************************************************************/
