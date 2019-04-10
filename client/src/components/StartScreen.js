import React from 'react';
import '../App.css';
import {NavLink} from 'react-router-dom';

const StartScreen = (props) => {
  const {optChosen, authenticated, userID} = props;

  const handler1 = (e) => {
    optChosen('uploadAnon');
  }

  const handler2 = (e) => {
    optChosen('uploadSign');
  }

  return (
    <div>
      <NavLink to='/api/upload-csv' className='navLinkButton' onClick={handler1}>
        Upload without signin
      </NavLink>
      {authenticated ?
      <NavLink to='/api/upload-csv' className='navLinkButton' onClick={handler2}>
        Upload in your account
      </NavLink> :
      <NavLink to='/api/users/signin' className='navLinkButton'>
        Sign in
      </NavLink>
      }
      {authenticated ?
      <NavLink to={`/api/account/${userID}`} className='navLinkButton'>
        View account
      </NavLink> : 
      <NavLink to='/api/users/signup' className='navLinkButton'>
        Register
      </NavLink>}
    </div>
  );
}

export default StartScreen;
