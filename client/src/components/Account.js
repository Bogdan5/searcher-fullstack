import React from 'react';
import '../App.css';
// import {Link} from 'react-router-dom';

const Account = (props) => {
  const {accData, getFile} = props;
  console.log('account rendered');
  const handler = () => {
    this.props.accountExit();
  }

  const getStoredFile = (e) => {
    getFile(e.target.name);
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
              <td name={el._id} onClick={getStoredFile}>{el.description}</td>
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
