import React from 'react';
import '../App.css';

// basic button pressed to construct queries
const DumbButton = (props) => {
  const { name } = props;

  // the fromButton prop is added in App.js with the ComponentEnhancer HOC
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