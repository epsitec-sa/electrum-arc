'use strict';

import React from 'react';
import {Label, TextField} from 'electrum-arc';

/******************************************************************************/

export default class TicketsTray extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      title: null,
      edit:  false,
    };
  }

  get styleProps () {
    return {
      width:  this.read ('width'),
      height: this.read ('height'),
      left:   this.read ('left'),
      right:  this.read ('right'),
      top:    this.read ('top'),
      bottom: this.read ('bottom'),
      rotate: this.read ('rotate'),
    };
  }

  getTitle () {
    return this.state.title;
  }

  setTitle (value) {
    this.setState ( {
      title: value
    });
  }

  getEdit () {
    return this.state.edit;
  }

  setEdit (value) {
    this.setState ( {
      edit: value
    });
  }

  componentDidMount () {
    const inputTitle = this.read ('title');
    this.setTitle (inputTitle);
  }

  mouseDown () {
    this.setEdit (!this.getEdit ());
  }

  render () {
    const dragController = this.read ('drag-controller');
    const dragSource     = this.read ('drag-source');
    const data           = this.read ('data');

    const boxStyle       = this.mergeStyles ('box');
    const titleStyle     = this.mergeStyles ('title');
    const containerStyle = this.mergeStyles ('container');

    if (this.getEdit ()) {
      titleStyle.margin   = '0px';
      titleStyle.position = 'relative';
      titleStyle.top      = '-5px';
    }

    let htmlEdit;
    if (this.getEdit ()) {
      htmlEdit = (
        <TextField value={this.getTitle ()} {...this.link ()} />
      );
    } else {
      htmlEdit = (
        <Label kind='tickets-glue' text={this.getTitle ()} {...this.link ()} />
      );
    }

    return (
      <div style={boxStyle}>
        <div
          style       = {titleStyle}
          onMouseDown = {() => this.mouseDown ()}
          >
          {htmlEdit}
        </div>
        <div
          style                   = {containerStyle}
          data-drag-container-for = {dragController ? dragController : 'tickets'}
          data-drag-source        = {dragSource}
          data-id                 = {data.id}
          >
          {this.props.children}
        </div>
      </div>
    );
  }
}

/******************************************************************************/