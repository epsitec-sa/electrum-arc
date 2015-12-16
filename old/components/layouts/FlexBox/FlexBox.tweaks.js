'use strict';

module.exports = theme => {
  return {
    base: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      width: '100%'
    },
    direction: {
      row: {
        flexDirection: 'row'
      },
      'row-reverse': {
        flexDirection: 'row-reverse'
      },
      column: {
        flexDirection: 'column'
      },
      'column-reverse': {
        flexDirection: 'column-reverse'
      }
    },
    wrap: {
      no: {
        flexWrap: 'nowrap'
      },
      yes: {
        flexWrap: 'wrap'
      },
      reverse: {
        flexWrap: 'wrap-reverse'
      }
    },
    'align-items': {
      baseline: {
          alignItems: 'baseline',
        },
      center: {
          alignItems: 'center',
        }
    },
    justify: {
      start: {
        justifyContent: 'flex-start'
      },
      end: {
        justifyContent: 'flex-end'
      },
      center: {
        justifyContent: 'center'
      },
      'space-b': {
        justifyContent: 'space-between'
      },
      'space-a': {
        justifyContent: 'space-around'
      }
    }
  };
};