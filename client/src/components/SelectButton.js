import React from 'react';
import '../App.css';

const SelectButton = (props) => {
  const { fromSelect, card } = props;
  const handler = () => {
    fromSelect(card);
  };
  return (<button type='submit' onClick={handler}>Select</button>);
};

export default SelectButton;