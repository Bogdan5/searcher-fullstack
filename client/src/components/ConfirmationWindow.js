import React from 'react';
import '../App.js';

const ConfirmationWindow = (props) => {
  const confirm = (e) => {
    props.confirmationHandler(e.target.name);
  }

  return (
    <div className={`${props.classProp}`}>
      <button type="button" onClick={confirm} name="yes">Yes</button>
      <button type="button" onClick={confirm} name="no">No</button>
    </div>
  )
};

export default ConfirmationWindow;