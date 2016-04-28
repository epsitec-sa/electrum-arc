'use strict';

import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import * as Colors from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import Spacing from 'material-ui/styles/spacing';
import zIndex from 'material-ui/styles/zIndex';

/******************************************************************************/

const theme = {
  spacing: Spacing,
  zIndex: zIndex,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: Colors.cyan500,
    primary2Color: Colors.cyan700,
    primary3Color: Colors.lightBlack,
    accent1Color: Colors.pinkA200,
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    textColor: Colors.darkBlack,
    alternateTextColor: Colors.white,
    canvasColor: Colors.red,
    borderColor: Colors.grey300,
    disabledColor: fade (Colors.darkBlack, 0.3),
    pickerHeaderColor: Colors.cyan500,
  }
};

/******************************************************************************/

export default class MuHoc extends React.Component {

  static childContextTypes = {
    muiTheme: React.PropTypes.object
  };

  getChildContext () {
    return {
      muiTheme: getMuiTheme (theme),
    };
  }

  render () {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

/******************************************************************************/
