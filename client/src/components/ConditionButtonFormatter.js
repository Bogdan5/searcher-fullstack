import React from 'react';
// import PropTypes from 'prop-types';
// import DropDownMenu from './DropDownMenu';
// import ComponentEnhancer from './ComponentEnhancer';
// import MenuOption from './MenuOption';
// import ConditionButton from './ConditionButton';
import '../App.css';

// the area where queries are dislayed as they are constructed
const ConditionButtonFormatter = (props) => {
  const { children } = props;
  const formatterConditionButton = React.createRef();
  // const handler = () => {
  //   const top = formatterConditionButton.current.offsetTop;
  //   const left = formatterConditionButton.current.offsetLeft;
  //   fromFormatter(top, left);
  //   console.log('formatter clicked');