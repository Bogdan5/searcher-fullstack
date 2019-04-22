import React from 'react';
// import PropTypes from 'prop-types';
// import DropDownMenu from './DropDownMenu';
// import ComponentEnhancer from './ComponentEnhancer';
// import MenuOption from './MenuOption';
// import ConditionButton from './ConditionButton';
import '../App.scss';

// the area where queries buttons are dislayed as they are constructed
const ConditionButtonFormatter = (props) => {
  const { children } = props;
  const formatterConditionButton = React.createRef();
  // const handler = () => {
  //   const top = formatterConditionButton.current.offsetTop;
  //   const left = formatterConditionButton.current.offsetLeft;
  //   fromFormatter(top, left);
  //   console.log('formatter clicked');
    // };
    return (
      <div
        className='formatterClass' ref={formatterConditionButton}
        role='presentation'
      >
        {children}
      </div>
    );
  };
  
  // ConditionButtonFormatter.propTypes = { structure: PropTypes.shape };
  
  export default ConditionButtonFormatter;