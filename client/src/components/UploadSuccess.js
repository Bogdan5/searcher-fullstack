import React from 'react';
import '../App.css';
import { NavLink } from 'react-router-dom';

const UploadSuccess = (props) => {
  const { children } = props;
  return (
    <div>
      <h5>Upload successful</h5>
      <hr/>
      {children}
      
    </div>
  );
}

export default UploadSuccess;