import {React} from 'electrum';
import {Action} from 'electrum';
import {Container, Button} from '../../all-components.js';

/******************************************************************************/

export default class ButtonClose extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const kind     = this.read ('kind');
    const text     = this.read ('text');
    const active   = this.read ('active');
    const selected = this.read ('selected');

    return (
      <Container disabled={disabled} kind='row' {...this.link ()}>
        <Button text={text}   kind={kind} active={active} selected={selected} {...this.link ()} />
        <Button glyph='close' kind={kind} active={active} selected={selected} {...this.link ()} />
      </Container>
    );
  }
}

/******************************************************************************/
