'use strict';

import React from 'react';

/******************************************************************************/
export default class TableRow extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover: false,
    };
  }

  getHover () {
    return this.state.hover;
  }

  setHover (value) {
    this.setState ( {
      hover: value
    });
  }

  /******************************************************************************/

  mouseOver () {
    this.setHover (true);
  }

  mouseOut () {
    this.setHover (false);
  }

  /******************************************************************************/

  renderRowColumn(description, column, index) {
    const style = this.mergeStyles (this.getHover () ? 'hover' : 'cell');

    style.width     = column.Width;
    style.minWidth  = column.Width;
    style.maxWidth  = column.Width;
    style.textAlign = column.TextAlign;

    return (
      <div
        key         = {index}
        style       = {style}
        onMouseOver = {() => this.mouseOver ()}
        onMouseOut  = {() => this.mouseOut ()}
        >
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

  render() {
    const header = this.read ('header');
    const row    = this.read ('row');
    const index  = this.read ('index');

    const rowStyle = this.mergeStyles ('row');

    return (
      <div key={index} style={rowStyle}>
        {this.renderRowColumns (header, row)}
      </div>
    );
  }
}

/******************************************************************************/
