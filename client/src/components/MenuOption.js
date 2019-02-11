import React from 'react';
import '../App.css';

// this component includes a set of buttons
const MenuOption = (props) => {
  const { name, fromMenu } = props;
  const handler = () => {
    fromMenu(name);
  };
  return (
    <div
      className='menuOption' role='menuitem'
      tabIndex={0} onClick={handler}
      onKeyDown={handler}
    >
      {name}
    </div>
  );
};

export default MenuOption;
