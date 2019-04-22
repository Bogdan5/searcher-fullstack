import React from 'react';
import '../App.scss';

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