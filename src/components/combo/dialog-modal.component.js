import {React} from 'electrum';
import {ReactDOM} from 'electrum';
import {Container} from '../../all-components.js';
import MouseTrap from 'mousetrap';

/******************************************************************************/

function isInside (rect, x, y) {
  if (rect && rect.left < rect.right && rect.top < rect.bottom) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  } else {
    return true;
  }
}

/******************************************************************************/

export default class DialogModal extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      width:  this.read ('width'),
      height: this.read ('height'),
      center: this.read ('center'),
      top:    this.read ('top'),
      bottom: this.read ('bottom'),
    };
  }

  componentWillMount () {
    MouseTrap.bind ('esc',   this.onCloseCombo);
    MouseTrap.bind ('enter', this.onCloseCombo);
  }

  componentWillUnmount () {
    MouseTrap.unbind ('esc');
    MouseTrap.unbind ('enter');
  }

  onCloseCombo () {
    const close = this.read ('close');
    if (close) {
      close ();
    }
  }

  onMyMouseDown (e) {
    const node = ReactDOM.findDOMNode (this);
    const rect = node.children[0].getBoundingClientRect ();
    if (!isInside (rect, e.clientX, e.clientY)) {
      // If the mouse is outside the menu combo, close it.
      this.onCloseCombo ();
    }
  }

  render () {
    const width  = this.read ('width');
    const height = this.read ('height');
    const top    = this.read ('top');
    const bottom = this.read ('bottom');

    const fullScreenStyle = this.mergeStyles ('fullScreen');

    if (top || bottom) {
      const comboStyle = this.mergeStyles ('combo');
      return (
        <div
          style        = {fullScreenStyle}
          onMouseDown  = {this.onMyMouseDown}
          onTouchStart = {this.onMyMouseDown}
          >
          <div style = {comboStyle}>
            <Container
              kind              = 'flying-dialog'
              triangle-position = {top ? 'top' : 'bottom'}
              width             = {width}
              height            = {height}
              cursor            = 'default'
              {...this.link ()}>
              {this.props.children}
            </Container>
          </div>
        </div>
      );
    } else    {
      return (
        <div
          style       = {fullScreenStyle}
          onMouseDown = {this.onMyMouseDown}
          >
          <Container
            kind   = 'floating'
            cursor = 'default'
            width  = {width}
            height = {height}
            {...this.link ()}>
            {this.props.children}
          </Container>
        </div>
      );
    }
  }
}

/******************************************************************************/
