import {React} from 'electrum';
import {Badge, Menu} from '../../all-components.js';
import ShortcutHelpers from './shortcut-helpers.js';

/******************************************************************************/

export default class Button extends React.Component {

  constructor (props) {
    super (props);
  }

  readActive () {
    const active   = this.read ('active');
    const selected = this.read ('selected');
    if (active === 'true' || selected === 'true') {
      return 'true';
    } else {
      return 'false';
    }
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
      dimmed:          this.read ('dimmed'),
      weekend:         this.read ('weekend'),
      place:           this.read ('place'),
      active:          this.readActive (),
      badgeValue:      this.read ('badge-value'),
      shape:           this.read ('shape'),
      menuDirection:   this.read ('menu-direction'),
      textTransform:   this.read ('text-transform'),
      backgroundColor: this.read ('background-color'),
      zIndex:          this.read ('z-index'),
      cursor:          this.read ('cursor'),
      position:        this.read ('position'),
      disabled:        this.read ('disabled'),
    };
  }

  // Return the internalState with contain the isMenuVisible.
  getInternalState () {
    const {state} = this.props;
    return state.select ('menu-internal');
  }

  clicked (e) {
    const customOnClick = this.read ('custom-on-click');
    if (customOnClick) {
      customOnClick (e);
    } else {
      this.onClick (e);
    }
  }

  // Called when the button is clicked.
  showMenu () {
    // Trace.log ('>>>> showMenu <<<<');
    const internalState = this.getInternalState ();
    let isMenuVisible = internalState.get ('isMenuVisible');
    if (isMenuVisible === 'true') {
      isMenuVisible = 'false';
    } else {
      isMenuVisible = 'true';
    }
    internalState.set ('isMenuVisible', isMenuVisible);
  }

  mouseDown (e) {
    // Trace.log ('Button.mouseDown');
    const disabled = this.read ('disabled');
    if (disabled === 'true') {
      return;
    }
    const mouseDown = this.read ('mouse-down');
    if (mouseDown) {
      mouseDown (e);
    }
  }

  mouseUp (e) {
    const disabled = this.read ('disabled');
    if (disabled === 'true') {
      return;
    }
    const mouseUp = this.read ('mouse-up');
    if (mouseUp) {
      mouseUp (e);
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
    const active = this.readActive ();
    if (kind === 'main-tab' && active === 'true') {
      const triangleStyle = this.mergeStyles ('triangle');
      return (
        <div style={triangleStyle} key='triangle' />
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
        <div style={menuBoxStyle} key='menu' >
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
          {ShortcutHelpers.getShortcut (shortcut)}
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
    const index    = this.read ('index');
    const kind     = this.read ('kind');
    const menu     = this.read ('menu');
    const toAnchor = this.read ('to-anchor');
    const show     = this.read ('show');
    const text     = this.read ('text');
    let   tooltip  = this.read ('tooltip');

    if (kind === 'pane-navigator') {
      tooltip = text;
    }

    const boxStyle = this.mergeStyles ('box');

    if (show === 'false') {
      return null;
    } else if (kind === 'container' || kind === 'box') {
      return (
        <div
          key          = {index}
          onClick      = {e => this.clicked (e)}  // voir (*)
          onMouseDown  = {e => this.mouseDown (e)}
          onMouseUp    = {e => this.mouseUp (e)}
          onTouchStart = {e => this.mouseDown (e)}
          onTouchEnd   = {e => this.mouseUp (e)}
          style        = {boxStyle}
          title        = {tooltip}
        >
          {this.props.children}
        </div>
      );
    } else if (menu) {
      return (
        <div
          key          = {index}
          onClick      = {() => this.showMenu ()}  // voir (*)
          onMouseDown  = {e => this.mouseDown (e)}
          onMouseUp    = {e => this.mouseUp (e)}
          onTouchStart = {e => this.mouseDown (e)}
          onTouchEnd   = {e => this.mouseUp (e)}
          style        = {boxStyle}
          title        = {tooltip}
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
          key          = {index}
          onClick      = {e => this.clicked (e)}  // voir (*)
          onMouseDown  = {e => this.mouseDown (e)}
          onMouseUp    = {e => this.mouseUp (e)}
          onTouchStart = {e => this.mouseDown (e)}
          onTouchEnd   = {e => this.mouseUp (e)}
          style        = {boxStyle}
          title        = {tooltip}
          href         = {'#' + toAnchor}
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
          key          = {index}
          onClick      = {e => this.clicked (e)}  // voir (*)
          onMouseDown  = {e => this.mouseDown (e)}
          onMouseUp    = {e => this.mouseUp (e)}
          onTouchStart = {e => this.mouseDown (e)}
          onTouchEnd   = {e => this.mouseUp (e)}
          style        = {boxStyle}
          title        = {tooltip}
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
