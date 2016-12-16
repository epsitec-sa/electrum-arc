'use strict';

import React from 'react';

import {
  Container,
  Splitter,
  DispatchRoadbooks,
  DispatchBacklog,
  DispatchDesk
} from '../../all-components.js';

export default class DispatchMessengers extends React.Component {

  constructor (props) {
    super (props);
    this.data = null;
  }

  componentWillMount () {
    const data = this.read ('data');
    if (data) {
      this.data = data;
    } else {
      this.data = window.document.data;
    }
  }

  componentDidMount () {
    if (window.document.mock) {
      window.document.toUpdate.push (this);
    }
  }

  componentWillUnmount () {
    if (window.document.mock) {
      const index = window.document.toUpdate.indexOf (this);
      if (index !== -1) {
        window.document.toUpdate.splice (index, 1);
      }
    }
  }

  onSplitterRoadbooksChanged (size) {
    this.data.SplitterRoadbooksHeight = size;
  }

  onSplitterBacklogChanged (size) {
    this.data.SplitterBacklogWidth = size;
  }

  splitterRoadbooksHeight () {
    if (this.data.SplitterRoadbooksHeight) {
      return this.data.SplitterRoadbooksHeight;
    } else {
      return '60%';  // default value
    }
  }

  splitterBacklogWidth () {
    if (this.data.SplitterBacklogWidth) {
      return this.data.SplitterBacklogWidth;
    } else {
      return '750px';  // default value
    }
  }

  render () {
    return (
      <Container kind='tickets-root' {...this.link ()} >
        <Splitter kind='horizontal' first-view-id='view-roadbook'
          default-size={this.splitterRoadbooksHeight ()}
          onSizeChanged={size => this.onSplitterRoadbooksChanged (size)}
          {...this.link ()} >
          <DispatchRoadbooks data={this.data.Roadbooks} {...this.link ()} />
          <Splitter kind='vertical' first-view-id='view-backlog' last-view-id='view-desk'
            default-size={this.splitterBacklogWidth ()} min-size='0px'
            onSizeChanged={size => this.onSplitterBacklogChanged (size)}
            {...this.link ()} >
            <DispatchBacklog data={this.data.Backlog.Tickets} {...this.link ()} />
            <DispatchDesk data={this.data.Desk} {...this.link ()} />
          </Splitter>
        </Splitter>
      </Container>
    );
  }
}
