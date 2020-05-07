import React from 'react';

import classes from './Logo.css';
import burgerLogo from '../../assets/images/logo.png';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
      <img src={burgerLogo} alt='burgerLogo'/>
    </div>
  );

export default logo;