import React from 'react';
import '../App.scss';

// this component includes a set of buttons
const ButtonGroup = (props) => {
  const { children } = props;
  return (
    <div className='buttonGroup'>
      {children}
    </div>
  );
};

export default ButtonGroup;
