import React from 'react';
// import PropTypes from 'prop-types';
import '../App.scss';

const BackgroundPopWindow = (props) => {
  const { children } = props;
  return (
    <div  className='backgroundPopWindow'>
      {children}
    </div>
  )
}

export default BackgroundPopWindow;