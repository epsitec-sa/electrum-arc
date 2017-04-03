/* global window */

import {React} from 'electrum';
import BacklogToChronos from './backlog-to-chronos.js';

import {
  Container,
  Chronos
} from '../../all-components.js';

export default class DispatchChronos1 extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    let data = this.read ('data');
    if (data) {
      data = JSON.parse (data);
    } else {
      data = BacklogToChronos.transform (window.document.dataDispatch.Backlog);
    }

    return (
      <Container kind='tickets-root' {...this.link ()} >
        <Chronos
          events     = {data}
          lineWidth  = '250px'
          glyphWidth = '60px'
          {...this.link ()} />
      </Container>
    );
  }
}
