import React from 'react';
import '../App.css';

const UploadWindow = (props) => {
  const { classInput, children } = props;
  return (
    <div className={`popWindow ${classInput ? 'visible' : 'invisible'}`}>
      {children}
    </div>
  );
}

export default UploadWindow;
