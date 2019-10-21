import React from 'react';
import '../App.scss';
import {NavLink, Link} from 'react-router-dom';

const StartScreen = (props) => {
  // console.log('start screen rendered, userID: ', props.userID);
  const {optChosen, authenticated, userID} = props;

  const handler1 = (e) => {
    optChosen('uploadAnon');
  }

  const handler2 = (e) => {
    optChosen('uploadSign');
  }

  // const handler3 = (e) => {
  //   optChosen('account');
  // }

  return (
    <div className='startScreen'>
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
      // <button type='button' onClick={handler3} className='navLinkButton'>View account</button>
      <Link to={{ pathname: userID ? `/api/account/${userID}` : '/api/users/signin'}}
        className='navLinkButton'>
        View account
      </Link>
      : <Link to='/api/users/signup' className='navLinkButton'>
        Register
      </Link>}
    </div>
  );
}

export default StartScreen;
