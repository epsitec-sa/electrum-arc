'use strict';

import React from 'react';
import {Link} from 'electrum-arc';

/******************************************************************************/

export default class Menu extends React.Component {

  render () {
    const {children, title, zIndex} = this.props;
    const style = [...this.styles, {zIndex: zIndex || 1}];
    const items = React.Children.map (children,
      item => (typeof item.type === 'function') ?
        React.addons.cloneWithProps (item, {kind: 'menuItem'}) : item);

    return (
      <nav style={style}>
        <Link {...this.link ()} kind='menuHead'>{title}</Link>
        {items}
      </nav>
    );
  }
}

/******************************************************************************/
