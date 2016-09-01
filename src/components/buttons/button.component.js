'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Unit} from 'electrum-theme';

import {Badge, Menu} from '../../all-components.js';

/******************************************************************************/

export default class Button extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      glyph:         this.read ('glyph'),
      text:          this.read ('text'),
      border:        this.read ('border'),
      glyphPosition: this.read ('glyph-position'),
      spacing:       this.read ('spacing'),
      grow:          this.read ('grow'),
      width:         this.read ('width'),
      kind:          this.read ('kind'),
      nature:        this.read ('nature'),
      place:         this.read ('place'),
      active:        this.read ('active'),
      badgeValue:    this.read ('badge-value'),
      shape:         this.read ('shape'),
      menuDirection: this.read ('menu-direction'),
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

  render () {
    const {state, theme} = this.props;
    const disabled = Action.isDisabled (state);
    const inputKind          = this.read ('kind');
    const inputActive        = this.read ('active');
    const inputGlyph         = this.read ('glyph');
    const inputRotate        = this.read ('rotate');
    const inputFlip          = this.read ('flip');
    const inputSpin          = this.read ('spin');
    const inputText          = this.read ('text');
    const inputGlyphPosition = this.read ('glyph-position');
    const inputBadgeValue    = this.read ('badge-value');
    const inputTooltip       = this.read ('tooltip');
    const inputMenu          = this.read ('menu');

    // Get or create the internalState.
    let isMenuVisible = 'false';
    if (inputMenu) {
      let internalState = this.getInternalState ();
      if (!internalState.get ('isMenuVisible')) {
        // At first time, initialize internalState.isMenuVisible with false.
        internalState = internalState.set ('isMenuVisible', 'false');
      }
      isMenuVisible = internalState.get ('isMenuVisible');
    }

    const boxStyle   = this.mergeStyles ('box');
    const glyphStyle = this.mergeStyles ('glyph');
    const textStyle  = this.mergeStyles ('text');

    const htmlText = (
      <label key='text' style={textStyle}>
        {inputText}
      </label>
    );

    const renderSpin = inputSpin ? 'fa-spin' : '';
    const htmlGlyph = (
      <i key='icon'
        style={glyphStyle}
        className={`fa
        fa-${inputGlyph}
        fa-rotate-${inputRotate}
        fa-flip-${inputFlip}
        ${renderSpin}`}
      />
    );

    const htmlBadge = inputBadgeValue ? (
      <Badge
        value={inputBadgeValue}
        layer='over'
        {...this.link ()}
      />
    ) : null;

    let htmlTriangle = null;
    if (inputKind === 'main-tab' && inputActive === 'true') {
      const triangleStyle = this.mergeStyles ('triangle');
      htmlTriangle = (
        <div style={triangleStyle} />
      );
    }

    let htmlMenu = null;
    if (isMenuVisible === 'true') {
      const htmlCombo = (
        <Menu items={inputMenu} {...this.link ()} />
      );
      const menuBoxStyle = this.mergeStyles ('menuBox');
      htmlMenu = (
        <div style={menuBoxStyle}>
          {htmlCombo}
        </div>
      );
    }

    const layout = () => {
      if (inputGlyph) {
        if (inputText) {
          if (inputGlyphPosition === 'right') {
            return [htmlText, htmlGlyph];
          } else {
            return [htmlGlyph, htmlText];
          }
        } else {
          return [htmlGlyph];
        }
      } else {
        return [htmlText];
      }
    };

    if (inputKind === 'container') {
      return (
        <div
          disabled = {disabled}
          style    = {boxStyle}
          title    = {inputTooltip}
          {...this.props}
        />
      );
    } else if (inputMenu) {
      return (
        <div
          onClick  = {() => this.showMenu ()}  // voir (*)
          disabled = {disabled}
          style    = {boxStyle}
          title    = {inputTooltip}
          {...this.props}
        >
          {layout ().map ((comp) => comp)}
          {htmlTriangle}
          {htmlBadge}
          {htmlMenu}
        </div>
      );
    } else {
      return (
        <div
          onClick  = {this.onClick}  // voir (*)
          disabled = {disabled}
          style    = {boxStyle}
          title    = {inputTooltip}
          {...this.props}
        >
          {layout ().map ((comp) => comp)}
          {htmlTriangle}
          {htmlBadge}
          {htmlMenu}
        </div>
      );
    }
    // (*) je n'arrive pas à généraliser cela !!!
  }
}

/******************************************************************************/
