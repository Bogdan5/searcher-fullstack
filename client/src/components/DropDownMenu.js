import React from 'react';
import '../App.css';

// this component includes a set of buttons
const DropDownMenu = (props) => {
  const { children, menuVisible, mouseOutMenu, style } = props;
  const mouseOut = () => {
    mouseOutMenu();
  };
  return (
    <div
      className={`dropDownMenu ${menuVisible ? 'z-visible' : 'z-invisible'}`}
      onMouseLeave={mouseOut} onBlur={mouseOut}
      style={style}
    >
      {children}
    </div>
  );
};

export default DropDownMenu;