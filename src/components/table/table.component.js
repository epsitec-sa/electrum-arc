'use strict';

import React from 'react';
import {TableRow} from '../../all-components.js';

/******************************************************************************/
export default class Table extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      selectedRow: -1,
    };
  }

  getSelectedRow () {
    return this.state.selectedRow;
  }

  setSelectedRow (value) {
    console.log ('Table.setSelectedRow ' + value);
    this.setState ( {
      selectedRow: value
    });
  }

  /******************************************************************************/

  renderHeaderColumn(column, index) {
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
      result.push (this.renderHeaderColumn (column, index++));
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
        selectionChanged = {id => this.setSelectedRow (id)}
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
