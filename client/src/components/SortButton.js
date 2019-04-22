import React from 'react';
import '../App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

const SortButton = props => {
  library.add(faSortUp);
  library.add(faSortDown);
  const handler = (e) => {
    props.sorted(e.target.value);
  }
  return (
    <div className='sortButton'>
      <div className='sortButtonRow'>
        <div className='sortButtonCell'>{props.name}</div>
        <div className='sortButtonCell'><FontAwesomeIcon icon={faSortUp} /></div>
      </div>
      <div className='sortButtonRow'>
        <div className='sortButtonCell'>
          <select name='Type of data' onChange={handler}>
            <option value='text'>Text</option>
            <option value='number'>Number</option>
          </select>
        </div>
        <div className='sortButtonCell'><FontAwesomeIcon icon={faSortDown} /></div>
      </div>
    </div>
);}

export default SortButton;
