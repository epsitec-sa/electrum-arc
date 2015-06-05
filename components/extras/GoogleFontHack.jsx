'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  render: function () {

    var font = this.props.name || 'Roboto';
    var ss    = document.getElementById ('googlefonthack');

    if (!ss) {
      ss      = document.createElement ('link');
      ss.id   = 'googlefonthack'
      ss.type = 'text/css';
      ss.rel  = 'stylesheet';
      ss.href = 'http://fonts.googleapis.com/css?family=';
      ss.href += font;
      document.getElementsByTagName ('head')[0].appendChild(ss);
      E.typo.font = font;
      console.log ('@! injected googlefont');
    } else {
      if (E.typo.font !== font) {
        ss.href = 'http://fonts.googleapis.com/css?family=';
        ss.href += font;
        console.log ('@! rewrite googlefont');
      }
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
