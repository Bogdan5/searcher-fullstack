import React from 'react';
// import PropTypes from 'prop-types';
import '../App.css';

const UploadWindow = (props) => {
  const { children } = props;
  return (
    <div className='popWindow'>
      {children}
      
    </div>
  );
}

UploadWindow.propTypes = {
  // classInput: PropTypes.bool.isRequired
};

export default UploadWindow;
