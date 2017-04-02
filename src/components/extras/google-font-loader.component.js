/* global document */

import React from 'react';

/******************************************************************************/

export default class GoogleFontLoader extends React.Component {

  render () {
    const {theme} = this.props;

    const font = this.props.font || theme.typo.font;
    const face = font.split (',')[0];
    const id   = 'google-font-loader:' + face;

    if (!document.getElementById (id)) {
      const link = document.createElement ('link');
      link.id   = id;
      link.type = 'text/css';
      link.rel  = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css?family=${face}`;
      document.getElementsByTagName ('head')[0].appendChild (link);
    }

    return (
      <div style={{display: 'none'}}></div>
    );
  }
}

/******************************************************************************/
