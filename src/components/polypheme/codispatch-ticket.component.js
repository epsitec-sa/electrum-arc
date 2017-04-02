import React from 'react';
import {DragCab, CodispatchDragTicket} from '../../all-components.js';

/******************************************************************************/

export default class CodispatchTicket extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const ticketId = this.read ('ticket-id');

    return (
      <DragCab
        key              = '1'
        drag-controller  = 'codispo-ticket'
        drag-owner-id    = {ticketId}
        direction        = 'vertical'
        mode             = 'corner-top-left'
        color            = {this.props.theme.palette.roadbookDragAndDropHover}
        thickness        = {this.props.theme.shapes.dragAndDropTicketThickness}
        over-spacing     = '0px'
        vertical-spacing = '0px'
        radius           = '0px'
        {...this.link ()}>
        <CodispatchDragTicket
          children = {this.props.children}
          {...this.link ()} />
      </DragCab>
    );
  }
}

/******************************************************************************/
