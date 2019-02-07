import React from 'react';
import '../App.css';

// basic button pressed to construct queries
const ConditionButton = (props) => {
  const { children, id, fromConditional, card } = props;
  const buttonRef = React.createRef();
  const handler = (event) => {
    const top = event.pageY;
    const left = event.pageX;
    fromConditional(id, top, left, card);
  };
  return (
    <div
      className='ConditionButton' onClick={handler}
      tabIndex={0} onKeyDown={handler}
      role='button' ref={buttonRef}
    >
      {children}
    </div>
  );
};

export default ConditionButton;
