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
      <div>{props.name}</div>
      <div className='awesomeIcons'>
        <svg height='10' width='10' className='sortTop' onClick={clickUp}>
          <polygon className='triangle' points='5,3 2,7 8,7' />
        </svg>
        <svg height='10' width='10'onClick={clickDown}>
          <polygon className='triangle' points='5,7 2,2 8,2' />
        </svg>
      </div>
    </div>
);}

export default SortButton;
