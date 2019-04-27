import React from 'react';
import '../App.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

const SortButton = props => {
  library.add(faSortUp);
  library.add(faSortDown);
  const type = (e) => {
    props.sorted(e.target.value);
  }

  const clickUp = (e) => {
    props.sorter('up', props.columnNo);
  }

  const clickDown = (e) => {
    props.sorter('down', props.columnNo);
  }

  return (
    <div className='sortButton'>
      <div className='sortButtonRow-top'>
        <div className='sortButtonCell'>{props.name}</div>
        <div className='sortButtonCell awesomeClass-top'>
          <FontAwesomeIcon icon={faSortUp} onClick={clickUp} />
        </div>
      </div>
      <div className='sortButtonRow-bottom'>
        <div className='sortButtonCell'>
          <select name='Type of data' onChange={type}>
            <option value='text'>Text</option>
            <option value='number'>Number</option>
          </select>
        </div>
        <div className='sortButtonCell awesomeClass-bottom'>
          <FontAwesomeIcon icon={faSortDown} onClick={clickDown} />
        </div>
      </div>
    </div>
);}

export default SortButton;
