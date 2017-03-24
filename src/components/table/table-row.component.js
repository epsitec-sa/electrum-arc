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

  mouseDown () {
    const selectionChanged = this.read ('selectionChanged');
    if (selectionChanged) {
      const row = this.read ('row');
      selectionChanged (row.id);
    }
  }

  /******************************************************************************/

  renderRowColumn(description, column, index) {
    const selected = this.read ('selected');
    var styleName = (selected === 'true') ? 'selected' : (this.getHover () ? 'hover' : 'cell');
    const style = this.mergeStyles (styleName);

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
      <div
        key         = {index}
        style       = {style}
        onMouseOver = {() => this.mouseOver ()}
        onMouseOut  = {() => this.mouseOut ()}
        onMouseDown = {() => this.mouseDown ()}
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
