import React from 'react';
import '../App.css';

const UploadWindow = (props) => {
  const { classInput } = props;
  return (
    <div className={ classInput }>
      <div>X</div>
      <form action="/uploadfile" enctype="multipart/form-data" method="POST"> 
        <input type="file" name="myFile" />
        <input type="submit" value="Upload a file"/>
      </form>
    </div>
  );
}

export default UploadWindow;
