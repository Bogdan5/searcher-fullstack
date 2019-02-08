import React from 'react';
import '../App.css';

// basic button pressed to construct queries
const DumbButton = (props) => {
  const { name } = props;
  const clickHandler = () => { props.fromButton(name); };

  return (
    <button
      type='submit' className='dumbButtonClass'
      onClick={clickHandler}
    >
      {name}
    </button>
  );
};

export default DumbButton;