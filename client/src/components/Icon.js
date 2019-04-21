import React from 'react';
import PropTypes from 'prop-types';
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

Icon.propTypes = {
  // fromIcon: PropTypes.func.isRequired,
  // keyboardNo: PropTypes.number.isRequired
};

export default Icon;
