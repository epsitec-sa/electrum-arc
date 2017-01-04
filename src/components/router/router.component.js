'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Container} from '../../all-components.js';

/******************************************************************************/

export default class Router extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      managedChildren: null,
    };
    this.active = null;
  }

  componentWillMount () {
    this.active = this.read ('active');
    this.setNavigation ();
  }

  componentDidMount () {
    const name = this.read ('name');
    if (name) {
      if (!window.document.routers) {
        window.document.routers = new Map ();
      }
      if (window.document.routers.has (name)) {
        throw new Error (`Router name ${name} is already used`);
      } else {
        window.document.routers.set (name, this);
      }
    } else {
      throw new Error ('Router must have a name');
    }
  }

  componentWillUnmount () {
    const name = this.read ('name');
    if (name) {
      window.document.routers.delete (name);
    }
  }

  updateViews () {
    const name = this.read ('name');
    for (let view of window.document.views) {
      if (view.router === name && view.route === this.active) {
        view.setVisible (true);
      } else {
        view.setVisible (false);
      }
    }
  }

  mouseDown (name) {
    this.active = name;
    this.setNavigation ();
    this.updateViews ();
  }

  setNavigation () {
    const children = React.Children.map (this.props.children, (child, i) => {
      const name = child.props.name;
      const props = {
        active: name === this.active ? 'true' : 'false',
        ['mouse-down']: () => this.mouseDown (name),
      };
      return React.cloneElement (child, props);
    });
    this.setState ({managedChildren: children});
  }

  render () {
    const {state} = this.props;
    const kind = this.read ('kind');

    return (
      <Container kind={kind} {...this.link ()}>
        {this.state.managedChildren}
      </Container>
    );
  }
}

/******************************************************************************/
