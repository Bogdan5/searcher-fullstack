import React from 'react';
import PropTypes from 'prop-types';
import '../App.scss';

// basic button pressed to construct queries
const ConditionButton = (props) => {
  const { children, id, fromConditional, card, active, condObj } = props;
  const buttonRef = React.createRef();
  console.log('conditional object', condObj);
  const handler = (event) => {
    if (condObj.active) {
      console.log(id, ' is active');
      const top = event.pageY;
      const left = event.pageX;
      fromConditional(id, top, left, card);
    } else {
      console.log(id, ' is not active');
    }
  };
  
  return (
    <div
      className='ConditionButton' onClick={handler}
      tabIndex={0} onKeyDown={handler}
      role='button' ref={buttonRef}
      key={id}
    >
      {children}
    </div>
  );
};

ConditionButton.propTypes = {
  id: PropTypes.string.isRequired,
  fromConditional: PropTypes.func.isRequired,
  card: PropTypes.number.isRequired
}

export default ConditionButton;
