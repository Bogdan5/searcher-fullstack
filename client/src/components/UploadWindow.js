import React from 'react';
import '../App.css';

const UploadWindow = (props) => {
  const { classInput, children } = props;
  return (
    <div className={`popWindow ${classInput ? 'visible' : 'invisible'}`}>
      {children}
      <form action="/uploadfile" encType="multipart/form-data" method="POST"> 
        <input type="file" name="myFile" />
        <input type="submit" value="Upload a file"/>
      </form>
    </div>
  );
}

export default UploadWindow;
