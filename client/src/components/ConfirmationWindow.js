import React from 'react';
import '../App.js';

const ConfirmationWindow = () => {
  const confirm = (e) => {

  }

  const refuse = (e) => {

  }

  return (
    <div>
      <button type="button" onClick={confirm} name="yes">Yes</button>
      <button type="button" onClick={refuse} name="no">No</button>
    </div>
  )
};

export default ConfirmationWindow;