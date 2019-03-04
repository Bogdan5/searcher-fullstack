import React from 'react';
import PropTypes from 'prop-types';
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

DropDownMenu.propTypes = {
  menuVisible: PropTypes.bool.isRequired,
  mouseOutMenu: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired
};

export default DropDownMenu;