import React from 'react';
import '../App.scss';

const SortButton = props => {
  const { type } = props;

  const clickUp = (e) => {
    props.sorter('up', props.columnNo);
  }

  const clickDown = (e) => {
    props.sorter('down', props.columnNo);
  }

  const typeHandler = (e) => {
    if (e.target.value !== type) {
      console.log('Type changed');
      props.typeHandlerTable(e.target.value, props.columnNo);
    }
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
      <select onChange={typeHandler} value={props.type}>
        <option value='string'>String</option>
        <option value='number'>Number</option>
        <option value='boolean'>Boolean</option>
      </select>
    </div>
);}

export default SortButton;
