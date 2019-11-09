import React from 'react';
// import PropTypes from 'prop-types';
import '../App.scss';

// this component includes a description on the left and to the right a set of\
// buttons used to construct the query
const Keyboard = (props) => {
  const { classProp, leftSection, rightSection, cardSelected, id } = props;
  const { children } = props;
  const isSelected = (id || id === 0) && (cardSelected === id) ? ' selectedKeyboard' : '';
  const print = () => console.log('card id ', id, 'card selected ', cardSelected);
  return (
    <div className={`keyboardGeneric${classProp}`} key={id} onClick={print}>
      <div className={`leftSection${isSelected}`}>{leftSection}</div>
      <div className={`keyboardRight${isSelected}`}>{children}</div>
      <section>{rightSection}</section>
    </div>
  );
};

// Keyboard.propTypes = {
  // typeContent: PropTypes.string.isRequired,
  // id: PropTypes.number.isRequired,
  // cardSelected: PropTypes.number.isRequired,
  // leftSection: PropTypes.string.isRequired,
  // rightSection: PropTypes.element
// };

export default Keyboard;