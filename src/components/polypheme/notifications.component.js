'use strict';

import React from 'react';

import {Container, Notification} from '../../all-components.js';

/******************************************************************************/

export default class Notifications extends React.Component {

  constructor (props) {
    super (props);
  }

  getNotification (data) {
    return (
      <Notification data={data} {...this.link ()} />
    );
  }

  getNotifications (notifications) {
    var array = [];
    notifications.slice (0).reverse ().forEach (n => {
      array.push (this.getNotification (n));
    });
    return array;
  }

  render () {
    const data = this.read ('data');

    return (
      <Container kind='notifications' width='400px' {...this.link ()} >
        {this.getNotifications (data)}
      </Container>
    );
  }
}

/******************************************************************************/
