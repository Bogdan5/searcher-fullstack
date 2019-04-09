import React from 'react';
import '../App.css';

const SignOptions = (props) => {
  const {children} = props;
  return (
    <div className='signOptions'>
      {children}
    </div>
  )
}

export default SignOptions;