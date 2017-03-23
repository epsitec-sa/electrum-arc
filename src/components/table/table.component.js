'use strict';

import React from 'react';

/******************************************************************************/
export default class Table extends React.Component {

  constructor (props) {
    super (props);
  }

  /******************************************************************************/

  renderHeaderColumn(column, index) {
    const style = this.mergeStyles ('title');
    style.width     = column.Width;
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

  renderRowColumn(description, column, index) {
    const style = this.mergeStyles ('cell');
    style.width     = column.Width;
    style.textAlign = column.TextAlign;

    return (
      <div key={index} style={style}>
        {description}
      </div>
    );
  }

  renderRowColumns(header, row) {
    const result = [];
    let index = 0;
    for (var column of header) {
      const description = row[column.Name];
      result.push (this.renderRowColumn (description, column, index++));
    }
    return result;
  }

  renderRow(header, row, index) {
    const style = this.mergeStyles ('row');
    return (
      <div key={index} style={style}>
        {this.renderRowColumns (header, row)}
      </div>
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
