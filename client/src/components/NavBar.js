import React from 'react';
import '../App.css';

const NavBar = (props) => {
  const {children} = props;
  return (
    <div className='navBar'>
      {children}
    </div>
  );
}

export default NavBar;