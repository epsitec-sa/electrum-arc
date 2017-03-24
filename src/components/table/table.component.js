'use strict';

import React from 'react';
import {TableRow} from '../../all-components.js';

/******************************************************************************/
export default class Table extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      selectedRow: null,
    };
  }

  getSelectedRow () {
    return this.state.selectedRow;
  }

  setSelectedRow (value) {
    this.setState ( {
      selectedRow: value
    });
  }

  selectionChanged (id) {
    const currentId = this.getSelectedRow ();
    if (id === currentId) {
      id = null;
    }
    this.setSelectedRow (id);
  }

  /******************************************************************************/

  renderHeaderColumn(column, last, index) {
    const style = this.mergeStyles ('cell');

    if (column.Width) {
      style.minWidth = column.Width;
      style.maxWidth = column.Width;
    } else if (column.Grow) {
      style.flexGrow   = column.Grow;
      style.flexShrink = '0';
      style.flexBasis  = '0%';
      style.minWidth   = '0px';
      style.overflow   = 'hidden';
    }
    style.textAlign = column.TextAlign;

    if (!last) {
      style.marginRight = this.props.theme.shapes.tablePadding;
    }

    return (
      <div key={index} style={style}>
        {column.Description}
      </div>
    );
  }

  renderHeaderColumns(header) {
    const result = [];
    let index = 0;
    for (var column of header) {
      const last = index === header.length - 1;
      result.push (this.renderHeaderColumn (column, last, index++));
    }
    return result;
  }

  renderHeader(header) {
    const style = this.mergeStyles ('header');
    return (
      <div style={style}>
        {this.renderHeaderColumns (header)}
      </div>
    );
  }

  renderRow(header, row, index) {
    return (
      <TableRow
        header           = {header}
        row              = {row}
        index            = {index}
        selected         = {this.getSelectedRow () === row.id ? 'true' : 'false'}
        selectionChanged = {id => this.selectionChanged (id)}
        {...this.link ()} />
    );
  }

  renderRows(data) {
    const result = [];
    let index = 0;
    for (var row of data.Rows) {
      result.push (this.renderRow (data.Header, row, index++));
    }
    return result;
  }

  render () {
    const data = this.read ('data');
    const style = this.mergeStyles ('table');

    return (
      <div style={style}>
        {this.renderHeader (data.Header)}
        {this.renderRows (data)}
      </div>
    );
  }
}

/******************************************************************************/
