import React from 'react';
// import PropTypes from 'prop-types';
import '../App.css';

const DataDisplay = (props) => {
  const { data } = props;
  return (<div className='dataDisplay'>{data}</div>);
};

// DataDisplay.propTypes = {
//   data: PropTypes.object.isRequired
// };

export default DataDisplay;
