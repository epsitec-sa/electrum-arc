'use strict';

import React from 'react';

import {Container, Notification, Button, Label} from '../../all-components.js';

/******************************************************************************/

export default class Notifications extends React.Component {

  constructor (props) {
    super (props);
  }

  getHeader () {
    return (
      <Container kind='notification-header' grow='1' {...this.link ()} >
        <Button text='Ne pas me déranger' glyph='toggle-off' glyph-position='right'
          kind='notification' {...this.link ()} />
      </Container>
    );
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
        {this.getHeader (data)}
        {this.getNotifications (data)}
      </Container>
    );
  }
}

/******************************************************************************/
