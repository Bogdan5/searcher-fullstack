import React from 'react';
import '../App.css';
import {NavLink} from 'react-router-dom';

const Account = (props) => {
  const {accData, getFile} = props;
  console.log('account rendered');
  const handler = () => {
    props.accountExit();
  }

  const getStoredFile = (e) => {
    console.log('name of file clicked: ', e.target.id);
    getFile(e.target.id);
  }

  return (
    <div>
      <h3>Uploaded files</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>File name</th>
            <th>Upload date</th>
            <th>Delete file?</th>
          </tr>
        </thead>
        <tbody>
          {accData.map((el, index) => (
            <tr key={el._id}>
              <td>{index}</td>
              <td id={el._id} onClick={getStoredFile}>{el.description}</td>
              <td>{el.created_at}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr/>
      <button type='button' onClick={handler}>Done</button>
    </div>
  );
}

export default Account;
