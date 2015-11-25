'use strict';

import React from 'react';
import {E} from 'electrum';

/*****************************************************************************/

module.exports = {

  render: function () {
    return (
      <webview id='gpuinfo' src='chrome://gpu' style='display:inline-block; width:640px; height:480px'></webview>
    );
  }
};

/*****************************************************************************/
