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

  onSplitterRoadbooksChanged (data, size) {
    data.SplitterRoadbooksHeight = size;
  }

  onSplitterBacklogChanged (data, size) {
    data.SplitterBacklogWidth = size;
  }

  splitterRoadbooksHeight (data) {
    if (data.SplitterRoadbooksHeight) {
      return data.SplitterRoadbooksHeight;
    } else {
      return '60%';  // default value
    }
  }

  splitterBacklogWidth (data) {
    if (data.SplitterBacklogWidth) {
      return data.SplitterBacklogWidth;
    } else {
      return '750px';  // default value
    }
  }

  render () {
    let data = this.read ('data');
    if (!data) {
      data = window.document.data;
    }

    return (
      <Container kind='tickets-root' {...this.link ()} >
        <Splitter kind='horizontal' first-view-id='view-roadbook'
          default-size={this.splitterRoadbooksHeight (data)}
          onSizeChanged={size => this.onSplitterRoadbooksChanged (data, size)}
          {...this.link ()} >
          <DispatchRoadbooks data={data.Roadbooks} {...this.link ()} />
          <Splitter kind='vertical' first-view-id='view-backlog' last-view-id='view-desk'
            default-size={this.splitterBacklogWidth (data)} min-size='0px'
            onSizeChanged={size => this.onSplitterBacklogChanged (data, size)}
            {...this.link ()} >
            <DispatchBacklog data={data.Backlog.Tickets} {...this.link ()} />
            <DispatchDesk data={data.Desk} {...this.link ()} />
          </Splitter>
        </Splitter>
      </Container>
    );
  }
}
