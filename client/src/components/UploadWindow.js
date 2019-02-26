import React from 'react';
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

export default UploadWindow;
