/* global window */

import {React} from 'electrum';
import * as ReducerData from './reducer-data.js';
import * as StateManager from './state-manager.js';

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
    if (!window.document.toUpdate) {
      window.document.toUpdate = [];
    }
    window.document.toUpdate.push (this);
  }

  componentWillUnmount () {
    const index = window.document.toUpdate.indexOf (this);
    if (index !== -1) {
      window.document.toUpdate.splice (index, 1);
    }
  }

  initialise (data) {
    // Inject electrum state (needed for electrumDispatch).
    data.state = this.props.state;
    ReducerData.reducer (data, ReducerData.initialiseAction ());
  }

  render () {
    let data = this.read ('data');
    if (data) {
      data = JSON.parse (data);
    } else {
      data = window.document.dataDispatch;
    }
    this.initialise (data);

    return (
      <Container kind='tickets-root' {...this.link ()} >
        <Splitter
          kind          = 'horizontal'
          first-view-id = 'view-roadbook'
          default-size  = {StateManager.getSplitterRoadbooksHeight ()}
          onSizeChanged = {StateManager.setSplitterRoadbooksHeight}
          {...this.link ()} >
          <DispatchRoadbooks data={data} {...this.link ()} />
          <Splitter
            kind          = 'vertical'
            first-view-id = 'view-backlog'
            last-view-id  = 'view-desk'
            default-size  = {StateManager.getSplitterBacklogWidth ()} min-size='0px'
            onSizeChanged = {StateManager.setSplitterBacklogWidth}
            {...this.link ()} >
            <DispatchBacklog data={data} {...this.link ()} />
            <DispatchDesk data={data} {...this.link ()} />
          </Splitter>
        </Splitter>
      </Container>
    );
  }
}
