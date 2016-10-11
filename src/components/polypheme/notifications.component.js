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
          kind='notification' spacing='large' {...this.link ()} />
        <Button text='Tout effacer' kind='notification' {...this.link ()} />
      </Container>
    );
  }

  getNotification (data, generation) {
    return (
      <Notification data={data} generation={generation} {...this.link ()} />
    );
  }

  getNotifications (notifications, generation) {
    var array = [];
    // The most recent notification first (on top).
    notifications.slice (0).forEach (n => {
      array.push (this.getNotification (n, generation));
    });
    return array;
  }

  render () {
    const data       = this.read ('data');
    const show       = this.read ('show');
    const generation = this.read ('generation');

    const subkind = show ? 'show' : 'hidden';

    return (
      <Container kind='notifications' subkind={subkind} width='400px' {...this.link ()} >
        {this.getNotifications (data, generation)}
        {this.getHeader ()}
      </Container>
    );
  }
}

/******************************************************************************/
