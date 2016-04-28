'use strict';

import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import * as Colors from 'material-ui/styles/colors';
import ColorManipulator from 'material-ui/utils/color-manipulator';
import Spacing from 'material-ui/styles/spacing';
import zIndex from 'material-ui/styles/zIndex';

/******************************************************************************/

// Note: use ColorManipulator.fade with the full name for the tests to work.
// Otherwise, the import of {fade} alone won't be able to find _decomposeColor
// while running in Wallaby.js

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
    disabledColor: ColorManipulator.fade (Colors.darkBlack, 0.3),
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
