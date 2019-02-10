import React from 'react';
import '../App.css';

const Icon = (props) => {
  const { type, fromIcon, keyboardNo } = props;
  const handler = () => fromIcon(type, keyboardNo);
  return (
    <div
      className={type ? 'icon' : ''} onClick={handler}
      onKeyDown={handler} role='button'
      tabIndex={0}
    >
      {type}
    </div>
  );
};

export default Icon;
