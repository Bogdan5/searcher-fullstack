import React from 'react';
import '../App.css';

const UploadWindow = (props) => {
  return (
    <div className='popWindow'>
      <div>X</div>
      <form>
        <button>Select file</button>
      </form>
    </div>
  );
}

export default UploadWindow;
