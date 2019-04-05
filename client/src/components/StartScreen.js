import React from 'react';
import '../App.css';

const StartScreen = (props) => {
  const {optChosen} = props;
  const handler1 = (e) => {
    optChosen('without');
  }

  const handler2 = (e) => {
    optChosen('with');
  }

  const handler3 = (e) => {
    optChosen('account');
  }

  return (
    <div>
      <button type='button' name='without' onClick={handler1}>Upload without sign in</button>
      <button type='button' name='with' onClick={handler2} >Upload with sign in</button>
      <button type='button' name='with' onClick={handler3} >View uploaded files</button>
    </div>
  );
}

export default StartScreen;
