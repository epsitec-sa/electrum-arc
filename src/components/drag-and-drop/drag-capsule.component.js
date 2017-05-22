import {React} from 'electrum';
import {
  Label,
  ChronoLine,
  CodispatchTicket,
  Roadbook,
  DispatchTicket,
  Note,
  Recurrence,
  Glyph,
} from '../../all-components.js';

/******************************************************************************/

export default class DragCapsule extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const component = this.props.component;
    const isDragged = this.props.isDragged;
    const hasHeLeft = this.props.hasHeLeft;

    switch (component) {
      case 'Label':
        return (
          <Label
            {...this.props}
            isDragged = {isDragged}
            hasHeLeft = {hasHeLeft}
            {...this.link ()} />
        );
      case 'ChronoLine':
        return (
          <ChronoLine
            {...this.props}
            isDragged = {isDragged}
            hasHeLeft = {hasHeLeft}
            {...this.link ()} />
        );
      case 'CodispatchTicket':
        return (
          <CodispatchTicket
            {...this.props}
            isDragged = {isDragged}
            hasHeLeft = {hasHeLeft}
            {...this.link ()} />
        );
      case 'Roadbook':
        return (
          <Roadbook
            {...this.props}
            isDragged = {isDragged}
            hasHeLeft = {hasHeLeft}
            {...this.link ()} />
        );
      case 'DispatchTicket':
        return (
          <DispatchTicket
            {...this.props}
            isDragged = {isDragged}
            hasHeLeft = {hasHeLeft}
            {...this.link ()} />
        );
      case 'Note':
        return (
          <Note
            {...this.props}
            isDragged = {isDragged}
            hasHeLeft = {hasHeLeft}
            {...this.link ()} />
        );
      case 'Recurrence':
        return (
          <Recurrence
            {...this.props}
            isDragged = {isDragged}
            hasHeLeft = {hasHeLeft}
            {...this.link ()} />
        );
      case 'Glyph':
        return (
          <Glyph
            {...this.props}
            isDragged = {isDragged}
            hasHeLeft = {hasHeLeft}
            {...this.link ()} />
        );
      default:
        throw new Error (`Unsupported component ${component}`);
    }
  }
}

/******************************************************************************/
