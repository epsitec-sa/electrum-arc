'use strict';

import React from 'react';
import {E} from 'electrum';

/*****************************************************************************/

module.exports = {

  render: function () {
    var ss    = document.getElementById ('googlefonthack');

    if (!ss) {
      ss      = document.createElement ('link');
      ss.id   = 'googlefonthack';
      ss.type = 'text/css';
      ss.rel  = 'stylesheet';
      ss.href = 'http://fonts.googleapis.com/css?family=';
      ss.href += E.typo.font.split (',')[0];
      document.getElementsByTagName ('head')[0].appendChild (ss);
      console.log ('@! injected googlefont');
    }

    var style = {
      display: 'none'
    };

    return (
      <div style={style}>
      </div>
    );
  }

};

/*****************************************************************************/
