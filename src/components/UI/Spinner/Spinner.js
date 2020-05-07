import React from 'react';

import classes from './Spinner.css';

const spinner = () => {
  return <div className={classes.Loader}>Processing...</div>;
};

export default spinner;