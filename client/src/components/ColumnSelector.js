import React from 'react';
import '../App.css';

const ColumnSelector = (props) => {
  const { fromSelector, card } = props;
  const handler = (event) => {
    fromSelector(event.target.value, card);
  };
  return (
    <select className='selector' onChange={handler}>
      <option value='colAll'>Selects fields</option>
      <option value='colAll'>All fields</option>
      <option value='col1'>Column 1</option>
      <option value='col2'>Column 2</option>
      <option value='col3'>Column 3</option>
    </select>
  );
};

export default ColumnSelector;
