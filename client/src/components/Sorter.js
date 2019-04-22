import React from 'react';
import '../App.scss';

const Sorter = (props) => {
  const { children } = props;
  return (
    <div className='sorterClass'>
      {children}
    </div>
  );
};

export default Sorter;
