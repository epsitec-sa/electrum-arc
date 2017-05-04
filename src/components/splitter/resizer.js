import React, {Component, PropTypes} from 'react';
import Prefixer from 'inline-style-prefixer';
import stylePropType from 'react-style-proptype';

/******************************************************************************/

const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.2 (KHTML, like Gecko) Safari/537.2';

/******************************************************************************/

class Resizer extends Component {

  onMyMouseOver () {
    const x = this.props['mouse-over'];
    if (x) {
      x ();
    }
  }

  onMyMouseOut () {
    const x = this.props['mouse-out'];
    if (x) {
      x ();
    }
  }

  onMyMouseDown (e) {
    this.props.onMouseDown (e);
  }

  onMyTouchStart (e) {
    e.preventDefault ();
    this.props.onTouchStart (e);
  }

  onMyTouchEnd (e) {
    e.preventDefault ();
    this.props.onTouchEnd (e);
  }

  render () {
    const {split, className, resizerClassName} = this.props;
    const classes = [resizerClassName, split, className];
    return (
      <span
        className    = {classes.join (' ')}
        style        = {this.props.prefixer.prefix (this.props.style) || {}}
        onMouseOver  = {() => this.onMyMouseOver ()}
        onMouseOut   = {() => this.onMyMouseOut ()}
        onMouseDown  = {e => this.onMyMouseDown (e)}
        onTouchStart = {e => this.onMyTouchStart (e)}
        onTouchEnd   = {e => this.onMyTouchEnd (e)}
      />
    );
  }
}

Resizer.propTypes = {
  onMouseDown:      PropTypes.func.isRequired,
  onTouchStart:     PropTypes.func.isRequired,
  onTouchEnd:       PropTypes.func.isRequired,
  prefixer:         PropTypes.instanceOf (Prefixer).isRequired,
  split:            PropTypes.oneOf (['vertical', 'horizontal']),
  className:        PropTypes.string.isRequired,
  resizerClassName: PropTypes.string.isRequired,
  style:            stylePropType,
};

Resizer.defaultProps = {
  prefixer:         new Prefixer ({userAgent: USER_AGENT}),
  resizerClassName: 'Resizer',
};

/******************************************************************************/

export default Resizer;
