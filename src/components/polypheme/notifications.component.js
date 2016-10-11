'use strict';

import React from 'react';

import {Container, Notification} from '../../all-components.js';
import {ColorHelpers} from 'electrum-theme';

/******************************************************************************/

export default class Notifications extends React.Component {

  constructor (props) {
    super (props);

    this.notifications = [
      {
        Glyph:   'bicycle',
        Color:   'base',
        Message: 'Lundi',
      },
      {
        Glyph:   'bicycle',
        Color:   'success',
        Message: 'Mardi',
      },
      {
        Glyph:   'bicycle',
        Color:   'secondary',
        Message: 'Mercredi',
      },
      {
        Glyph:   'bicycle',
        Color:   'base',
        Message: 'Jeudi',
      },
      {
        Glyph:   'bicycle',
        Color:   'base',
        Message: 'Vendredi',
      },
      {
        Glyph:   'warning',
        Color:   'primary',
        Message: 'Ceci este une petite phrase longue et complètement débile.',
      },
    ];
  }

  getNotification (data) {
    return (
      <Notification data={data} {...this.link ()} />
    );
  }

  getNotifications () {
    var array = [];
    this.notifications.forEach (n => {
      array.push (this.getNotification (n));
    });
    return array;
  }

  render () {
    return (
      <Container kind='notifications' width='300px' {...this.link ()} >
        {this.getNotifications ()}
      </Container>
    );
  }
}

/******************************************************************************/
