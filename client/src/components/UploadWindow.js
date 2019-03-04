import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';

const UploadWindow = (props) => {
  const { classInput, children } = props;
  return (
    <div className={`backgroundPopWindow ${classInput ? 'visible' : 'invisible'}`}>
      <div className='popWindow'>
        {children}
        
      </div>
    </div>
  );
}

UploadWindow.propTypes = {
  classInput: PropTypes.string.isRequired
};

export default UploadWindow;
