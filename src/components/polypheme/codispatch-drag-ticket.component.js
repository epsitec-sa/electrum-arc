import {React} from 'electrum';
import {Ticket} from '../../all-components.js';
import * as TicketHelpers from './ticket-helpers.js';

/******************************************************************************/

export default class CodispatchDragTicket extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover:     false,
      dragHover: false,
    };
  }

  get hover () {
    return this.state.hover;
  }

  set hover (value) {
    this.setState ( {
      hover: value
    });
  }

  get dragHover () {
    return this.state.dragHover;
  }

  set dragHover (value) {
    this.setState ( {
      dragHover: value
    });
  }

  onMyMouseOver () {
    if (!this.props.isDragged) {
      this.hover = true;
    }
  }

  onMyMouseOut () {
    this.hover = false;
  }

  onDragBarMouseOver () {
    if (!this.props.isDragged) {
      this.dragHover = true;
    }
  }

  onDragBarMouseOut () {
    this.dragHover = false;
  }

  renderTicketContent (ticket, extended, delivered) {
    const directionGlyph = TicketHelpers.getDirectionGlyph (this.props.theme, ticket.Type);

    if (extended) {
      return this.renderExtendedContent (ticket, directionGlyph, delivered);
    } else {
      return this.renderCompactedContent (ticket, directionGlyph, delivered);
    }
  }

  render () {
    const children  = this.read ('children');
    const isDragged = this.props.isDragged;
    const hasHeLeft = this.props.hasHeLeft;

    const subkind = isDragged ? 'dragged' : null;

    let color = this.props.theme.palette.paneBackground;
    if (hasHeLeft && !isDragged) {
      color = this.props.theme.palette.ticketDragAndDropShadow;
    } else if (this.dragHover) {
      color = this.props.theme.palette.ticketDragAndDropHover;
    }

    const boxStyle = {
      position: 'relative',
    };

    const dragBarStyle = {
      position: 'absolute',
      left:     '0px',
      width:    this.props.theme.shapes.containerMargin,
      top:      '0px',
      height:   '100%',
      cursor:   'move',
    };

    return (
      <div
        style = {boxStyle}
        >
        <Ticket
          kind         = 'subpane'
          subkind      = {subkind}
          color        = {color}
          hide-content = {hasHeLeft && !isDragged ? 'true' : 'false'}
          mouse-over   = {this.onMyMouseOver}
          mouse-out    = {this.onMyMouseOut}
          {...this.link ()} >
          {children}
        </Ticket>
        <div
          style       = {dragBarStyle}
          onMouseOver = {this.onDragBarMouseOver}
          onMouseOut  = {this.onDragBarMouseOut}
          />
      </div>
    );
  }
}

/******************************************************************************/
