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
        <svg height='10' width='10' className='sortTop' onClick={this.clickUp}>
          <polygon className='triangle' points='5,0 0,8 10,8' />
        </svg>
        <svg height='10' width='10'onClick={this.clickDown}>
          <polygon className='triangle' points='5,10 0,2 10,2' />
        </svg>
      </div>
    </div>
);}

export default SortButton;
