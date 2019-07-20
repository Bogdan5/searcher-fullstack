import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import '../App.css';

const TrashIcon = (props) => {
  library.add(faTrashAlt);

  const deleteHandler = (e) => {
    
  }
  return (
    <div>
      <FontAwesomeIcon icon={ faTrashAlt } onClick={ deleteHandler }/>
    </div>
  );
}

export default TrashIcon;