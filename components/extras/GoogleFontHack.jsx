'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  render: function () {
    var ss    = document.getElementById ('googlefonthack');

    if (!ss) {
      ss      = document.createElement ('link');
      ss.id   = 'googlefonthack'
      ss.type = 'text/css';
      ss.rel  = 'stylesheet';
      ss.href = 'http://fonts.googleapis.com/css?family=';
      ss.href += E.typo.font.split (',')[0];
      document.getElementsByTagName ('head')[0].appendChild(ss);
      console.log ('@! injected googlefont');
    }

    var style = {
      display: 'hidden'
    };

    return (
      <div style={style}>
      </div>
    );
  }
}

/*****************************************************************************/
