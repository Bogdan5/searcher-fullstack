import React from 'react';
import '../App.scss';

const NavBar = (props) => {
  const {children} = props;
  return (
    <div className='navBar'>
      {children}
    </div>
  );
}

export default NavBar;