'use strict';

var React = require ('react');

/*****************************************************************************/

module.exports = {

  render: function () {
    return (
      <webview id="gpuinfo" src="chrome://gpu" style="display:inline-block; width:640px; height:480px"></webview>
    );
  }

};

/*****************************************************************************/
