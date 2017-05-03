import {React} from 'electrum';
import {Container} from '../../all-components.js';

/******************************************************************************/

export default class DialogModal extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      width:  this.read ('width'),
      height: this.read ('height'),
    };
  }

  onMyMouseDown () {
  }

  render () {
    const width  = this.read ('width');
    const height = this.read ('height');

    const fullScreenStyle = this.mergeStyles ('fullScreen');
    const comboStyle      = this.mergeStyles ('combo');

    return (
      <div
        style       = {fullScreenStyle}
        onMouseDown = {this.onMyMouseDown}
        >
        <div style = {comboStyle}>
          <Container
            kind   = 'floating'
            cursor = 'default'
            width  = {width}
            height = {height}
            {...this.link ()}>
            {this.props.children}
          </Container>
        </div>
      </div>
    );
  }
}

/******************************************************************************/
