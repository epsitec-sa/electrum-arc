'use strict';

import React from 'react';
import Electrum from 'electrum';

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
    Electrum.bus.dispatch (data, 'dnd', {
      type: 'splitterRoadbooksChanged',
      value: size,
    });
  }

  onSplitterBacklogChanged (data, size) {
    data.SplitterBacklogWidth = size;
    Electrum.bus.dispatch (data, 'dnd', {
      type: 'splitterBacklogChanged',
      value: size,
    });
  }

  getSplitterRoadbooksHeight (data) {
    if (data.SplitterRoadbooksHeight) {
      return data.SplitterRoadbooksHeight;
    } else {
      return '60%';  // default value
    }
  }

  getSplitterBacklogWidth (data) {
    if (data.SplitterBacklogWidth) {
      return data.SplitterBacklogWidth;
    } else {
      return '750px';  // default value
    }
  }

  render () {
    let data = this.read ('data');
    if (data) {
      data = JSON.parse (data);
    } else {
      data = window.document.data;
    }

    return (
      <Container kind='tickets-root' {...this.link ()} >
        <Splitter kind='horizontal' first-view-id='view-roadbook'
          default-size={this.getSplitterRoadbooksHeight (data)}
          onSizeChanged={size => this.onSplitterRoadbooksChanged (data, size)}
          {...this.link ()} >
          <DispatchRoadbooks data={data} {...this.link ()} />
          <Splitter kind='vertical' first-view-id='view-backlog' last-view-id='view-desk'
            default-size={this.getSplitterBacklogWidth (data)} min-size='0px'
            onSizeChanged={size => this.onSplitterBacklogChanged (data, size)}
            {...this.link ()} >
            <DispatchBacklog data={data} {...this.link ()} />
            <DispatchDesk data={data} {...this.link ()} />
          </Splitter>
        </Splitter>
      </Container>
    );
  }
}
