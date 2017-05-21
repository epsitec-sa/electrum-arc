import {React} from 'electrum';
import {DragCab, NoteDrag} from 'electrum-arc';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class Note extends React.Component {

  constructor (props) {
    super (props);
  }

  onSwapExtended () {
    const x = this.read ('do-swap-extended');
    if (x) {
      const index = this.read ('index');
      x (index);
    }
  }

  render () {
    const note = this.read ('value');
    const dhd = Unit.add (this.props.theme.shapes.lineHeight, this.props.theme.shapes.containerMargin);

    return (
      <DragCab
        drag-controller    = 'note'
        drag-height-detect = {dhd}
        direction          = 'vertical'
        color              = {this.props.theme.palette.dragAndDropHover}
        thickness          = {this.props.theme.shapes.dragAndDropTicketThickness}
        mode               = 'corner-top-left'
        drag-owner-id      = {note.id}
        do-click-action    = {this.onSwapExtended}
        do-drag-ending     = {this.onDragEnding}
        {...this.link ()} >
        <NoteDrag
          {...this.props}
          {...this.link ()} />
      </DragCab>
    );
  }
}

/******************************************************************************/
