import React from 'react';
import '../App.css';

const UploadWindow = (props) => {
  return (
    <div className='popWindow'>
      <div>X</div>
      <form action="/uploadfile" enctype="multipart/form-data" method="POST"> 
        <input type="file" name="myFile" />
        <input type="submit" value="Upload a file"/>
      </form>
    </div>
  );
}

export default UploadWindow;
