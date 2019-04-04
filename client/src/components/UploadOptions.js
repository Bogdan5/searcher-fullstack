import React from 'react';
import '../App.css';

const UploadOptions = (props) => {
  const handler1 = (e) => {
    this.props.optionChosen('without');
  }

  const handler2 = (e) => {
    this.props.optionChosen('with');
  }

  return (
    <div>
      <input type='button' onClick={handler1}>Upload without signin in</input>
      <input type='button' onClick={handler2}>Upload with sign up</input>
    </div>
  );
}

module.exports = UploadOptions;
