import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import '../App.scss';

const TrashIcon = (props) => {
  const { deleteHandler, id } = props;
  library.add(faTrashAlt);

  const deleter = (e) => {
    e.stopPropagation();
    deleteHandler(id);
  }
  return (
    <div className='trashIcon'>
      <FontAwesomeIcon icon={ faTrashAlt } onClick={ deleter }/>
    </div>
  );
}

export default TrashIcon;