import React from 'react';
import '../App.css';

const UploadWindow = (props) => {
  const { classInput, children } = props;
  return (
    <div className={`backgroundPopWindow ${classInput ? 'visible' : 'invisible'}`}>
      <div className='popWindow'>
        {children}
        <form action="/upload" encType="multipart/form-data" method="POST"> 
          <input type="file" name="myFile" />
          <hr/>
          <input type="submit" value="Upload a file"/>
        </form>
      </div>
    </div>
  );
}

export default UploadWindow;
