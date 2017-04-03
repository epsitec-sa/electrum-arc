import {React} from 'electrum';
import {Action} from 'electrum';
import {Container, Label} from 'electrum-arc';

/******************************************************************************/

export default class FlyingBalloon extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      width:            this.read ('width'),
      trianglePosition: this.read ('triangle-position'),
      zIndex:           this.read ('z-index'),
    };
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputPrimaryText      = this.read ('primary-text');
    const inputSecondaryText    = this.read ('secondary-text');
    const inputTrianglePosition = this.read ('triangle-position');

    const boxStyle = this.mergeStyles ('box');

    let primaryBottomSpacing = null;
    if (inputPrimaryText) {
      primaryBottomSpacing = 'large';
    }

    return (
      <span
        disabled = {disabled}
        style    = {boxStyle}
        >
        <Container
          kind = 'flying-balloon'
          triangle-position = {inputTrianglePosition}
          {...this.link ()}
          >

          <Label text={inputPrimaryText}   kind='flying-balloon'
            font-weight='bold'
            bottom-spacing={primaryBottomSpacing} {...this.link ()} />

          <Label text={inputSecondaryText} kind='flying-balloon' {...this.link ()} />
        </Container>
      </span>
    );
  }
}

/******************************************************************************/
