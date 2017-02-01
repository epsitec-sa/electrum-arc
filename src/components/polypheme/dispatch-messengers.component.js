'use strict';

import React from 'react';
import ReducerData from './reducer-data.js';
import StateManager from './state-manager.js';

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

  initialise (data) {
    // Inject electrum state (needed for electrumDispatch).
    data.state = this.props.state;
    ReducerData.reducer (data, {type: 'INITIALISE'});
  }

  render () {
    let data = this.read ('data');
    if (data) {
      data = JSON.parse (data);
    } else {
      data = window.document.data;
    }
    this.initialise (data);

    return (
      <Container kind='tickets-root' {...this.link ()} >
        <Splitter kind='horizontal' first-view-id='view-roadbook'
          default-size={StateManager.getSplitterRoadbooksHeight ()}
          onSizeChanged={size => StateManager.setSplitterRoadbooksHeight (size)}
          {...this.link ()} >
          <DispatchRoadbooks data={data} {...this.link ()} />
          <Splitter kind='vertical' first-view-id='view-backlog' last-view-id='view-desk'
            default-size={StateManager.getSplitterBacklogWidth ()} min-size='0px'
            onSizeChanged={size => StateManager.setSplitterBacklogWidth (size)}
            {...this.link ()} >
            <DispatchBacklog data={data} {...this.link ()} />
            <DispatchDesk data={data} {...this.link ()} />
          </Splitter>
        </Splitter>
      </Container>
    );
  }
}
