import React from 'react';
import '../App.css';

const UploadWindow = (props) => {
  const { classInput, children } = props;
  return (
    <div className={`backgroundPopWindow ${classInput ? 'visible' : 'invisible'}`}>
      <div className='popWindow'>
        {children}
        <br/>
        <form action="/upload-csv" encType="multipart/form-data" method="POST"> 
          <input type="file" name="myFile" />
          <br/>
          <br/>
          <input type="submit" value="Upload a file"/>
        </form>
      </div>
    </div>
  );
}

export default UploadWindow;
