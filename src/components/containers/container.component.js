'use strict';

import React from 'react';
import {Action} from 'electrum';

/******************************************************************************/

export default class Container extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      managedChildren: null
    };
    this.panelBottoms = [];
  }

  get styleProps () {
    return {
      width:            this.read ('width'),
      height:           this.read ('height'),
      floatingHeight:   this.read ('floating-height'),
      kind:             this.read ('kind'),
      subkind:          this.read ('subkind'),
      markColor:        this.read ('mark-color'),
      spacing:          this.read ('spacing'),
      trianglePosition: this.read ('triangle-position'),
      grow:             this.read ('grow'),
      selected:         this.read ('selected'),
      left:             this.read ('left'),
      right:            this.read ('right'),
      top:              this.read ('top'),
      bottom:           this.read ('bottom'),
      rotate:           this.read ('rotate'),
      border:           this.read ('border'),
    };
  }

  componentWillMount () {
    const navFor = this.read ('navigation-for');
    if (navFor) {
      this.initNavigation ();
    }
  }

  componentDidMount () {
    const navFor = this.read ('navigation-for');
    if (navFor) {
      const panelElem = document.querySelectorAll (
        `[data-navigation-name="${navFor}"]`
      )[0];
      if (panelElem) {
        this.computePanelBottoms (panelElem);
        panelElem.addEventListener ('scroll', this.handleScroll, true);
      }
    }
  }

  componentWillUnmount () {
    const navFor = this.read ('navigation-for');
    if (navFor) {
      const panelElem = document.querySelectorAll (
        `[data-navigation-name="${navFor}"]`
      )[0];
      if (panelElem) {
        panelElem.removeEventListener ('scroll', this.handleScroll, true);
      }
    }
  }

  // Compute all cumulative bottom positions of panels.
  computePanelBottoms(panelElem) {
    this.panelBottoms = [];
    const children = [].slice.call (panelElem.children);
    var first = -1;
    children.map (c => {
      if (first === -1) {
        first = c.offsetTop;
      } else {
        this.panelBottoms.push (c.offsetTop - first);
      }
    });
    this.panelBottoms.push (1000000);
  }

  // Return the index of the top panel, according to  scroll position.
  getPanelIndex(scrollTop) {
    for (var i = 0; i < this.panelBottoms.length; i++) {
      if (scrollTop < this.panelBottoms[i]) {
        return i;
      }
    }
    return -1;
  }

  initNavigation () {
    const children = React.Children.map (this.props.children, (child, i) => {
      const active = {
        active: i === 0 ? 'true' : 'false'
      };
      return React.cloneElement (child, active);
    });
    this.setState ({managedChildren: children});
  }

  handleScroll (e) {
    const index = this.getPanelIndex (e.target.scrollTop);
    const children = React.Children.map (this.props.children, (child, i) => {
      const active = {
        active: index === i ? 'true' : 'false'
      };
      return React.cloneElement (child, active);
    });

    this.setState ({managedChildren: children});
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputKind     = this.read ('kind');
    const inputAnchor   = this.read ('anchor');
    const inputNavName  = this.read ('navigation-name');

    const boxStyle      = this.mergeStyles ('box');
    const triangleStyle = this.mergeStyles ('triangle');

    const useManagedChildren = [
      'pane-navigator',
      'pane-vnavigator',
      'pane-hnavigator'
    ];

    if (inputKind === 'flying-balloon') {
      return (
        <div
          disabled={disabled}
          style={boxStyle}
          >
          <div style={triangleStyle}>
            {this.props.children}
          </div>
        </div>
      );
    } else {
      return (
        <div data-navigation-name={inputNavName} disabled={disabled} style={boxStyle} id={inputAnchor} ref="container">
          {useManagedChildren.includes (inputKind) ? this.state.managedChildren : this.props.children}
        </div>
      );
    }
  }
}

/******************************************************************************/
