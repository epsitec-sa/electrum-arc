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
        <Container kind='notification-header-row' {...this.link ()} >
          <Button glyph='toggle-off' text='Ne pas me déranger'
            kind='notification' {...this.link ()} />
        </Container>
        <Container kind='notification-header-row' {...this.link ()} >
          <Button glyph='toggle-off' text='Seulement les nouvelles'
            kind='notification' {...this.link ()} />
          <Label grow='1' {...this.link ()} />
          <Button text='Tout effacer' kind='notification' {...this.link ()} />
        </Container>
      </Container>
    );
  }

  getNotification (data, generation, keyIndex) {
    return (
      <Notification key={keyIndex} data={data} generation={generation} {...this.link ()} />
    );
  }

  getNotifications (notifications, generation) {
    var array = [];
    let keyIndex = 0;
    // The most recent notification first (on top).
    notifications.slice (0).reverse ().forEach (n => {
      array.push (this.getNotification (n, generation, keyIndex++));
    });
    return array;
  }

  render () {
    const data       = this.read ('data');
    const show       = this.read ('show');
    const generation = this.read ('generation');

    const subkind = show ? 'show' : 'hidden';

    return (
      <Container kind='notifications-panel' subkind={subkind} width='400px' {...this.link ()} >
        {this.getHeader ()}
        <Container kind='notifications' {...this.link ()} >
          {this.getNotifications (data, generation)}
        </Container>
      </Container>
    );
  }
}

/******************************************************************************/
