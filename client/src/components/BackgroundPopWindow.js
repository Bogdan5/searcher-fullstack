import React from 'react';
import '../App.css';

const BackgroundPopWindow = (props) => {
  const {classInput, children} = this.props;
  return (
    <div  className={`backgroundPopWindow ${classInput ? 'visible' : 'invisible'}`}>
      {children}
    </div>
  )
}

export default BackgroundPopWindow;