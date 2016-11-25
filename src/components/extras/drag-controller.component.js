'use strict';

import React from 'react';
import DragControllerConnected from './drag-controller.connected.js';

export default class DragController extends React.Component {

  render () {
    return (
      <DragControllerConnected {...this.link ()} {...this.props} />
    );
  }
}
