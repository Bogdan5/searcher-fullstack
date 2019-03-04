import React from 'react';
import PropTypes from 'prop-types';
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

DumbButton.propTypes = {
  name: PropTypes.string.isRequired
};

export default DumbButton;