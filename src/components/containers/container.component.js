/* global window document */

import {Action, React, Trace} from 'electrum';

/******************************************************************************/

export default class Container extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      managedChildren: null,
    };
    this.panelBottoms = [];
  }

  get styleProps () {
    return {
      width:            this.read ('width'),
      height:           this.read ('height'),
      minWidth:         this.read ('min-width'),
      minHeight:        this.read ('min-height'),
      maxWidth:         this.read ('max-width'),
      maxHeight:        this.read ('max-height'),
      marginBottom:     this.read ('margin-bottom'),
      floatingHeight:   this.read ('floating-height'),
      kind:             this.read ('kind'),
      subkind:          this.read ('subkind'),
      markColor:        this.read ('mark-color'),
      spacing:          this.read ('spacing'),
      trianglePosition: this.read ('triangle-position'),
      grow:             this.read ('grow'),
      selected:         this.read ('selected'),
      border:           this.read ('border'),
      cursor:           this.read ('cursor'),
      position:         this.read ('position'),
    };
  }

  componentWillMount () {
    const dragController = this.read ('drag-controller');
    const dragSource     = this.read ('drag-source');
    const dragOwnerId    = this.read ('drag-owner-id');
    let count = 0;
    count += dragController ? 1 : 0;
    count += dragSource     ? 1 : 0;
    count += dragOwnerId    ? 1 : 0;
    if (count !== 0 && count !== 3) {
      // These 3 properties must exist all together, or none !
      Trace.error ('Container has invalid properties:' +
        ` dragController=${dragController} dragSource=${dragSource} dragOwnerId=${dragOwnerId}`);
    }
    const navFor = this.read ('navigation-for');
    if (navFor) {
      this.initNavigation ();
    }
  }

  componentDidMount () {
    const navFor = this.read ('navigation-for');
    if (navFor) {
      const panelElem = document.querySelectorAll (`[data-navigation-name="${navFor}"]`)[0];
      if (panelElem) {
        this.computePanelBottoms (panelElem);
        panelElem.addEventListener ('scroll', this.handleScroll, true);
      }
    }
    const dragController = this.read ('drag-controller');
    if (dragController) {
      if (!window.document.dragControllers) {
        window.document.dragControllers = [];
      }
      window.document.dragControllers.push (this);
    }
    const dragParent = this.read ('drag-parent');
    if (dragParent) {
      if (!window.document.dragParentControllers) {
        window.document.dragParentControllers = [];
      }
      window.document.dragParentControllers.push (this);
    }
  }

  componentWillUnmount () {
    const navFor = this.read ('navigation-for');
    if (navFor) {
      const panelElem = document.querySelectorAll (`[data-navigation-name="${navFor}"]`)[0];
      if (panelElem) {
        panelElem.removeEventListener ('scroll', this.handleScroll, true);
      }
    }
    const dragController = this.read ('drag-controller');
    if (dragController) {
      const index = window.document.dragControllers.indexOf (this);
      if (index !== -1) {
        window.document.dragControllers.splice (index, 1);
      }
    }
    const dragParent = this.read ('drag-parent');
    if (dragParent) {
      const index = window.document.dragParentControllers.indexOf (this);
      if (index !== -1) {
        window.document.dragParentControllers.splice (index, 1);
      }
    }
  }

  // Compute all cumulative bottom positions of panels.
  computePanelBottoms (panelElem) {
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
  getPanelIndex (scrollTop, scrollMax) {
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

  applySelectedToChildren (selected) {
    return React.Children.map (this.props.children, child => {
      if (selected && React.isValidElement (child)) {
        const props = {selected: selected};
        return React.cloneElement (child, props);
      } else {
        return child;
      }
    }
    );
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const kind     = this.read ('kind');
    const anchor   = this.read ('anchor');
    const navName  = this.read ('navigation-name');
    const hidden   = this.read ('hidden');
    const show     = this.read ('show');
    const index    = this.read ('index');
    const selected = this.read ('selected');

    const boxStyle      = this.mergeStyles ('box');
    const triangleStyle = this.mergeStyles ('triangle');

    if (hidden) {
      boxStyle.display = 'none';
    }

    const useManagedChildren = [
      'pane-navigator',
      'pane-vnavigator',
      'pane-hnavigator'
    ];

    if (show === 'false') {
      return null;
    } else if (kind === 'flying-balloon') {
      return (
        <div
          key      = {index}
          disabled = {disabled}
          style    = {boxStyle}
          id       = {anchor}
          >
          <div style = {triangleStyle}/>
          <div>
            {this.applySelectedToChildren (selected)}
          </div>
        </div>
      );
    } else {
      return (
        <div
          key                  = {index}
          disabled             = {disabled}
          style                = {boxStyle}
          id                   = {anchor}
          data-navigation-name = {navName}
          >
          {useManagedChildren.includes (kind) ? this.state.managedChildren : this.applySelectedToChildren (selected)}
        </div>
      );
    }
  }
}

/******************************************************************************/
