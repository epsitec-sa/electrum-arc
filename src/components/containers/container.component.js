'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Action} from 'electrum';
import Dragula from 'react-dragula';
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
    this.initDragula ();
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
        this.panelBottoms.push (c.offsetTop - first - (c.offsetHeight / 2));
      }
    });
    this.panelBottoms.push (1000000);
  }

  // Return the index of the top panel, according to  scroll position.
  getPanelIndex(scrollTop, scrollMax) {
    if (scrollTop >= scrollMax - 4) {  // 4 = chouia for mouse wheel
      // If scroller is on bottom, return the last index.
      return this.panelBottoms.length - 1;
    } else {
      for (var i = 0; i < this.panelBottoms.length; i++) {
        if (scrollTop < this.panelBottoms[i]) {
          return i;
        }
      }
      return -1;
    }
  }

  setNavigation (index) {
    const children = React.Children.map (this.props.children, (child, i) => {
      const active = {
        active: i === index ? 'true' : 'false'
      };
      return React.cloneElement (child, active);
    });
    this.setState ({managedChildren: children});
  }

  initNavigation () {
    this.setNavigation (0);
  }

  handleScroll (e) {
    const max = e.target.scrollHeight - e.target.offsetHeight;
    const index = this.getPanelIndex (e.target.scrollTop, max);
    this.setNavigation (index);
  }

  convertToNodes (result) {
    const converted = [];
    result.map (c => {
      const n = ReactDOM.findDOMNode (c);
      converted.push (n);
    });
    return converted;
  }

  initDragula () {
    const inputDragAndDrop = this.read ('drag-and-drop');
    if (inputDragAndDrop === 'root') {
      const result = [];
      this.exploreComponentsForDragula (result, this);
      console.dir (result);
      Dragula (this.convertToNodes (result));
    }
  }

  exploreComponentsForDragula (result, component) {
    // console.dir ('coucou');
    if (component.props && component.props.children) {
      const children = [].slice.call (component.props.children);
      children.map (c => {
        console.dir (c);
        if (c.props['drag-and-drop'] === 'child') {
          // const n = ReactDOM.findDOMNode (c);
          // result.push (n);
          result.push (c);
        }
        this.exploreComponentsForDragula (result, c);
      });
    }
  }

  enableDragAndDrop (ref, mode) {
    return;  // ??
    if (mode === 'true') {
      var dragNode = ReactDOM.findDOMNode (ref);
      var drake = Dragula ([dragNode], {
        moves: function (el, source, handle, sibling) {
          console.dir (el);
          console.dir (source);
          console.dir (handle);
          console.dir (sibling);
          return true;
        }
      });
    }
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputKind        = this.read ('kind');
    const inputAnchor      = this.read ('anchor');
    const inputNavName     = this.read ('navigation-name');
    const inputDragAndDrop = this.read ('drag-and-drop');

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
          disabled = {disabled}
          style    = {boxStyle}
          >
          <div style = {triangleStyle}/>
          <div>
            {this.props.children}
          </div>
        </div>
      );
    } else {
      return (
        <div
          data-navigation-name = {inputNavName}
          disabled             = {disabled}
          style                = {boxStyle}
          id                   = {inputAnchor}
          ref                  = {c => this.enableDragAndDrop (c, inputDragAndDrop)}
          >
          {useManagedChildren.includes (inputKind) ? this.state.managedChildren : this.props.children}
        </div>
      );
    }
  }
}

/******************************************************************************/
