import React from 'react';
import PropTypes from 'prop-types';
import '../App.scss';

// basic button pressed to construct queries
const ConditionButton = (props) => {
  const { children, id, fromConditional, card, key, active } = props;
  const buttonRef = React.createRef();
  const handler = (event) => {
    if (active) {
      const top = event.pageY;
      const left = event.pageX;
      fromConditional(id, top, left, card);
    }
  };
  
  return (
    <div
      className='ConditionButton' onClick={handler}
      tabIndex={0} onKeyDown={handler}
      role='button' ref={buttonRef}
      key={key}
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
