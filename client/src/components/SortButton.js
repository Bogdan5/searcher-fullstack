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
      <div >{props.name}</div>
      <div className='awesomeIcons'>
        {/* <FontAwesomeIcon icon={faSortUp} onClick={clickUp} />
        <FontAwesomeIcon icon={faSortDown} onClick={clickDown} /> */}
        <svg height='10' width='10'>
          <polygon points='5,0 0,8 10,8'
          style={{fill:'black', stroke:'black',strokeWidth:1}} />
        </svg>
        <svg height='10' width='10'>
          <polygon points='5,10 0,2 10,2'
          style={{fill:'black', stroke:'black',strokeWidth:1}} />
        </svg>
        {/* <div className='sortButtonCell awesomeClass-top'>
          <FontAwesomeIcon icon={faSortUp} onClick={clickUp} />
        </div>
        <div className='sortButtonCell awesomeClass-bottom'>
          <FontAwesomeIcon icon={faSortDown} onClick={clickDown} />
        </div> */}
      </div>

      {/* <div className='sortButtonRow-top'>
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
      </div> */}
    </div>
);}

export default SortButton;
