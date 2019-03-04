import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';

const BackgroundPopWindow = (props) => {
  const {classInput, children} = props;
  return (
    <div  className={`backgroundPopWindow ${classInput ? 'visible' : 'invisible'}`}>
      {children}
    </div>
  )
}

// BackgroundPopWindow.propTypes = {
//   classInput: PropTypes.string.isRequired
// };

export default BackgroundPopWindow;