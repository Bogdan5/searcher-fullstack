import React from 'react';
import '../App.css';

const DataDisplay = (props) => {
  const { data } = props;
  return (<div className='dataDisplay'>{data}</div>);
};

export default DataDisplay;
