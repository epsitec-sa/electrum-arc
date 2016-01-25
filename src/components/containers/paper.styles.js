'use strict';

/******************************************************************************/

export default function (theme) {
  return {
    base: {
      backgroundColor: theme.palette.paperColor,
      transition: theme.transitions.easeOut (),
      boxSizing: 'border-box',
      fontFamily: theme.typo.font,
      color: theme.palette.textColor,
      borderRadius: theme.shapes.defaultBorderRadius,
      overflowX: 'hidden',
      border: theme.paperDebugColor
    },
    view: {
      backgroundColor: theme.palette.canvasColor,
      height: '100%'
    },
    full: {
      paddingTop: '1em',
      paddingRight: '1em',
      paddingBottom: '1em',
      paddingLeft: '1em',
      marginTop: '.5em',
      marginRight: '.5em',
      marginBottom: '.5em',
      marginLeft: '.5em'
    },
    glowitem: {
      paddingTop: '.1em',
      paddingRight: '.2em',
      paddingBottom: '.1em',
      paddingLeft: '.2em',
      ':hover': {
        backgroundColor: theme.palette.accent1Color
      }
    },
    header: {
      backgroundColor: theme.palette.primary1Color,
      paddingTop: '.5em',
      paddingRight: '.5em',
      paddingBottom: '.5em',
      paddingLeft: '.5em'
    }
  };
}

/******************************************************************************/
