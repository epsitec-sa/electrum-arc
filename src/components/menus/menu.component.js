'use strict';

import React from 'react';
import {Action} from 'electrum';

import {Button} from '../../all-components.js';

/******************************************************************************/

export default class Menu extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      width: this.read ('width'),
    };
  }

  buttons (items) {
    const array = [];
    for (let i = 0; i < items.length ; i++) {
      const item = items[i];
      const html = (
        <Button
          kind='menu-item'
          glyph={item.glyph}
          text={item.text}
          {...this.link ()}
        />
      );
      array.push (html);
    }
    return array;
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputItems = this.read ('items');

    const boxStyle = this.mergeStyles ('box');

    const layout = () => {
      return this.buttons (inputItems);
    };

    return (
      <div
        disabled={disabled}
        style={boxStyle}
        {...this.props}
      >
        {layout ().map ((comp) => comp)}
      </div>
    );
  }
}

/******************************************************************************/
