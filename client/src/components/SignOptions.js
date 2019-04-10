import React from 'react';
import '../App.css';

const SignOptions = (props) => {
  const {children} = props;
  console.log('signoptions deployed');
  return (
    <div className='signOptions'>
      {children}
    </div>
  )
}

export default SignOptions;