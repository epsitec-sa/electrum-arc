'use strict';

export default theme => {
  return {
    base: {
    },
    grid: {
      paddingLeft: '4px',
      paddingRight: '4px',
      paddingTop: '4px',
      paddingBottom: '4px'
    },
    field: require ('../../forms/fields/BasicField.styles.js') (theme).base
  };
};
